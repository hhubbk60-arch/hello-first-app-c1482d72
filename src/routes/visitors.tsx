import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2, Radio, Search } from "lucide-react";
import { fetchVisitors, type VisitorsResponse } from "@/lib/api";
import { PanelGate } from "@/components/panel/PanelGate";
import { Globe3D } from "@/components/panel/Globe3D";
import { Panel, PanelShell, StatCard } from "@/components/panel/PanelShell";

const title = "Visiteurs en direct | Back-office TTshop Pro";
const description = "Suivi des visiteurs : IP, pays, régions, pages vues, appareils et temps passé sur le site.";

export const Route = createFileRoute("/visitors")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <PanelGate title="Visiteurs — accès protégé">{(key) => <VisitorsPage panelKey={key} />}</PanelGate>
  ),
});

const COLUMNS: { key: string; label: string }[] = [
  { key: "visitors_last_seen_at", label: "Vu à" },
  { key: "visitors_ip", label: "IP" },
  { key: "visitors_country_name", label: "Pays" },
  { key: "visitors_region", label: "Région" },
  { key: "visitors_city", label: "Ville" },
  { key: "visitors_page", label: "Page" },
  { key: "visitors_device", label: "Appareil" },
  { key: "visitors_browser", label: "Navigateur" },
  { key: "visitors_time_on_page", label: "Temps (s)" },
  { key: "visitors_scroll_depth", label: "Scroll %" },
  { key: "visitors_isp", label: "FAI" },
];

function VisitorsPage({ panelKey }: { panelKey: string }) {
  const [data, setData] = useState<VisitorsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const load = useCallback(
    (q = search) => {
      setLoading(true);
      fetchVisitors(panelKey, q)
        .then((d) => {
          setData(d);
          setError(null);
        })
        .catch((e: Error) => setError(e.message))
        .finally(() => setLoading(false));
    },
    [panelKey, search],
  );

  useEffect(() => {
    const id = window.setTimeout(() => load(search), 300);
    return () => window.clearTimeout(id);
  }, [search, load]);

  // Auto-refresh every 30s for the live feel.
  useEffect(() => {
    const id = window.setInterval(() => load(), 30000);
    return () => window.clearInterval(id);
  }, [load]);

  const rows = data?.rows ?? [];

  const markers = useMemo(() => {
    const acc = new Map<string, { lat: number; lon: number; weight: number; label: string }>();
    for (const r of rows) {
      const lat = Number(r["visitors_latitude"]);
      const lon = Number(r["visitors_longitude"]);
      if (!Number.isFinite(lat) || !Number.isFinite(lon) || (lat === 0 && lon === 0)) continue;
      const label = String(r["visitors_city"] ?? r["visitors_country_name"] ?? "—");
      const k = `${lat.toFixed(2)},${lon.toFixed(2)}`;
      const cur = acc.get(k);
      if (cur) cur.weight += 1;
      else acc.set(k, { lat, lon, weight: 1, label });
    }
    // Fallback marker on Tunis so the globe never looks empty.
    if (acc.size === 0) acc.set("tn", { lat: 36.8, lon: 10.18, weight: 1, label: "Tunis" });
    return [...acc.values()];
  }, [rows]);

  const maxTimeline = Math.max(1, ...(data?.timeline ?? []).map((t) => t.c));
  const maxCountry = Math.max(1, ...(data?.byCountry ?? []).map((c) => c.c));

  return (
    <PanelShell
      title="Visiteurs"
      subtitle="Suivi en direct — IP, géolocalisation, pages et engagement"
      onRefresh={() => load()}
      refreshing={loading}
    >
      <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard label="En ligne" value={data?.stats?.["online"] ?? "—"} hint="5 dernières minutes" />
        <StatCard label="Vues" value={data?.stats?.["views"] ?? "—"} />
        <StatCard label="Visiteurs" value={data?.stats?.["uniques"] ?? "—"} />
        <StatCard label="Sessions" value={data?.stats?.["sessions"] ?? "—"} />
        <StatCard label="Temps moyen" value={`${data?.stats?.["avg_time"] ?? 0}s`} />
        <StatCard label="Scroll moyen" value={`${data?.stats?.["avg_scroll"] ?? 0}%`} />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.2fr_1fr]">
        <section className="relative overflow-hidden rounded-2xl border border-white/12 bg-white/6 backdrop-blur-xl">
          <div className="flex items-center gap-2 px-4 pt-4 text-[14px] font-semibold uppercase tracking-[0.1em] text-white/60">
            <Radio className="h-4 w-4 text-emerald-400" />
            Carte monde 3D
          </div>
          <Globe3D markers={markers} height={400} />
        </section>

        <div className="grid gap-5">
          <Panel title="Top pays">
            <ul className="grid gap-2.5">
              {(data?.byCountry ?? []).map((c, i) => (
                <li key={`${c.code ?? "x"}-${i}`}>
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="text-white/80">{c.name ?? c.code ?? "Inconnu"}</span>
                    <span className="text-white/55">
                      {c.c} vues · {c.u} visiteurs
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-emerald-400/80 transition-all duration-700"
                      style={{ width: `${(c.c / maxCountry) * 100}%` }}
                    />
                  </div>
                </li>
              ))}
              {(data?.byCountry ?? []).length === 0 && (
                <li className="text-[13px] text-white/45">Pas encore de données.</li>
              )}
            </ul>
          </Panel>

          <Panel title="14 derniers jours">
            <div className="flex h-28 items-end gap-1.5">
              {(data?.timeline ?? []).map((t) => (
                <div key={t.d} className="group relative flex-1">
                  <div
                    className="rounded-t bg-white/70 transition-all duration-700"
                    style={{ height: `${Math.max(4, (t.c / maxTimeline) * 100)}px` }}
                    title={`${t.d}: ${t.c}`}
                  />
                </div>
              ))}
              {(data?.timeline ?? []).length === 0 && (
                <p className="text-[13px] text-white/45">Pas encore de données.</p>
              )}
            </div>
          </Panel>

          <Panel title="Appareils & pages">
            <div className="grid gap-2 text-[13px] sm:grid-cols-2">
              <ul className="grid gap-1.5">
                {(data?.byDevice ?? []).map((d, i) => (
                  <li key={i} className="flex justify-between text-white/75">
                    <span>{d.device ?? "—"}</span>
                    <span className="text-white/50">{d.c}</span>
                  </li>
                ))}
              </ul>
              <ul className="grid gap-1.5">
                {(data?.byPage ?? []).map((p, i) => (
                  <li key={i} className="flex justify-between gap-2 text-white/75">
                    <span className="truncate">{p.page ?? "—"}</span>
                    <span className="text-white/50">{p.c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Panel>
        </div>
      </div>

      <div className="mt-5">
        <Panel title="Journal des visites">
          <div className="relative mb-3 max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher IP, ville, pays, page…"
              className="h-11 w-full rounded-xl border border-white/15 bg-ink/40 pl-9 pr-3 text-[14px] outline-none placeholder:text-white/35 focus-visible:border-white/40"
            />
          </div>
          {error ? (
            <p className="py-8 text-center text-[14px] text-destructive">{error}</p>
          ) : loading && !data ? (
            <p className="flex items-center justify-center gap-2 py-10 text-white/60">
              <Loader2 className="h-4 w-4 animate-spin" /> Chargement…
            </p>
          ) : rows.length === 0 ? (
            <p className="py-10 text-center text-[14px] text-white/50">Aucune visite enregistrée.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px] border-collapse text-[13px]">
                <thead>
                  <tr className="text-left text-white/50">
                    {COLUMNS.map((c) => (
                      <th key={c.key} className="whitespace-nowrap px-3 py-2 font-medium">
                        {c.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr
                      key={String(r["visitors_id"] ?? i)}
                      className="border-t border-white/8 transition-colors hover:bg-white/6"
                    >
                      {COLUMNS.map((c) => (
                        <td key={c.key} className="whitespace-nowrap px-3 py-2.5 text-white/85">
                          {r[c.key] ?? "—"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Panel>
      </div>
    </PanelShell>
  );
}