import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Download, Loader2, Search } from "lucide-react";
import { fetchLeads, type LeadRow, type LeadsResponse } from "@/lib/api";
import { PanelGate } from "@/components/panel/PanelGate";
import { Panel, PanelShell, StatCard } from "@/components/panel/PanelShell";

const title = "Leads collectés | Back-office TTshop Pro";
const description = "Liste des leads collectés depuis la landing page TTshop Pro, avec statistiques et export CSV.";

export const Route = createFileRoute("/leads")({
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
  component: () => <PanelGate title="Leads — accès protégé">{(key) => <LeadsPage panelKey={key} />}</PanelGate>,
});

const COLUMNS: { key: string; label: string }[] = [
  { key: "leads_created_at", label: "Date" },
  { key: "leads_name", label: "Nom" },
  { key: "leads_first_name", label: "Prénom" },
  { key: "leads_phone", label: "Téléphone" },
  { key: "leads_cin", label: "CIN" },
  { key: "leads_governorate", label: "Gouvernorat" },
  { key: "leads_need", label: "Besoin" },
  { key: "leads_source", label: "Source" },
  { key: "leads_status", label: "Statut" },
];

function LeadsPage({ panelKey }: { panelKey: string }) {
  const [data, setData] = useState<LeadsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const load = useCallback(
    (q = search) => {
      setLoading(true);
      fetchLeads(panelKey, q)
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

  const rows = data?.rows ?? [];
  const maxGov = Math.max(1, ...(data?.byGovernorate ?? []).map((g) => g.c));

  const csv = useMemo(() => () => exportCsv(rows), [rows]);

  return (
    <PanelShell
      title="Leads collectés"
      subtitle={`${rows.length} enregistrement${rows.length > 1 ? "s" : ""} affiché${rows.length > 1 ? "s" : ""}`}
      onRefresh={() => load()}
      refreshing={loading}
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total" value={data?.stats?.["total"] ?? "—"} />
        <StatCard label="Aujourd'hui" value={data?.stats?.["today"] ?? "—"} />
        <StatCard label="7 derniers jours" value={data?.stats?.["week"] ?? "—"} />
        <StatCard label="Anciens clients" value={data?.stats?.["existing"] ?? "—"} />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_320px]">
        <Panel title="Liste des leads">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher nom, téléphone, CIN…"
                className="h-11 w-full rounded-xl border border-white/15 bg-ink/40 pl-9 pr-3 text-[14px] outline-none placeholder:text-white/35 focus-visible:border-white/40"
              />
            </div>
            <button
              type="button"
              onClick={csv}
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/15 bg-white/8 px-3.5 text-[14px] transition-colors hover:bg-white/14"
            >
              <Download className="h-4 w-4" />
              CSV
            </button>
          </div>

          {error ? (
            <p className="py-8 text-center text-[14px] text-destructive">{error}</p>
          ) : loading && !data ? (
            <p className="flex items-center justify-center gap-2 py-10 text-white/60">
              <Loader2 className="h-4 w-4 animate-spin" /> Chargement…
            </p>
          ) : rows.length === 0 ? (
            <p className="py-10 text-center text-[14px] text-white/50">Aucun lead pour le moment.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px] border-collapse text-[13px]">
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
                      key={String(r["leads_id"] ?? i)}
                      className="border-t border-white/8 transition-colors hover:bg-white/6"
                    >
                      {COLUMNS.map((c) => (
                        <td key={c.key} className="whitespace-nowrap px-3 py-2.5 text-white/85">
                          {c.key === "leads_status" ? (
                            <span className="rounded-full bg-white/10 px-2 py-0.5 text-[12px]">
                              {String(r[c.key] ?? "new")}
                            </span>
                          ) : (
                            (r[c.key] ?? "—")
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Panel>

        <Panel title="Top gouvernorats">
          <ul className="grid gap-2.5">
            {(data?.byGovernorate ?? []).map((g) => (
              <li key={g.gov}>
                <div className="flex items-center justify-between text-[13px]">
                  <span className="text-white/80">{g.gov}</span>
                  <span className="text-white/55">{g.c}</span>
                </div>
                <div className="mt-1 h-1.5 rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-white/70 transition-all duration-700"
                    style={{ width: `${(g.c / maxGov) * 100}%` }}
                  />
                </div>
              </li>
            ))}
            {(data?.byGovernorate ?? []).length === 0 && (
              <li className="text-[13px] text-white/45">Pas encore de données.</li>
            )}
          </ul>
        </Panel>
      </div>
    </PanelShell>
  );
}

function exportCsv(rows: LeadRow[]) {
  if (rows.length === 0) return;
  const headers = Object.keys(rows[0]!);
  const escape = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const csv = [headers.join(","), ...rows.map((r) => headers.map((h) => escape(r[h])).join(","))].join("\n");
  const url = URL.createObjectURL(new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}