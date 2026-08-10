import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { KeyRound, Loader2, ShieldCheck } from "lucide-react";

const PANEL_PASSWORD = "Ttshop2026";
const STORE_KEY = "ttshop-panel-key";

/** Simple shared-password gate for the internal dashboards (no user accounts). */
export function PanelGate({ title, children }: { title: string; children: (key: string) => ReactNode }) {
  const [key, setKey] = useState<string | null>(null);
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(STORE_KEY) === PANEL_PASSWORD) setKey(PANEL_PASSWORD);
    } catch {
      /* storage unavailable */
    }
    setReady(true);
  }, []);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (value !== PANEL_PASSWORD) {
      setError(true);
      return;
    }
    try {
      sessionStorage.setItem(STORE_KEY, value);
    } catch {
      /* storage unavailable */
    }
    setKey(value);
  }

  if (!ready) {
    return (
      <div className="grid min-h-screen place-items-center bg-ink text-white/70">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (key) return <>{children(key)}</>;

  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden bg-ink px-4">
      <div className="pointer-events-none absolute inset-0 opacity-60 [background:radial-gradient(60%_60%_at_50%_0%,rgba(0,95,234,0.35),transparent_70%)]" />
      <form
        onSubmit={onSubmit}
        className="relative w-full max-w-sm rounded-2xl border border-white/12 bg-white/6 p-7 text-white backdrop-blur-xl animate-scale-in"
      >
        <span className="grid h-12 w-12 place-items-center rounded-xl bg-white/10">
          <ShieldCheck className="h-6 w-6" />
        </span>
        <h1 className="mt-4 text-[22px] font-semibold">{title}</h1>
        <p className="mt-1 text-[14px] text-white/60">Accès réservé — saisissez le mot de passe.</p>
        <div className="relative mt-5">
          <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
          <input
            type="password"
            autoFocus
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setError(false);
            }}
            placeholder="Mot de passe"
            className="h-12 w-full rounded-xl border border-white/15 bg-ink/40 pl-9 pr-3 text-[15px] text-white outline-none transition-colors placeholder:text-white/35 focus-visible:border-white/45"
          />
        </div>
        {error && <p className="mt-2 text-[13px] text-destructive">Mot de passe incorrect.</p>}
        <button
          type="submit"
          className="mt-5 h-12 w-full rounded-xl bg-white text-[15px] font-semibold text-ink transition-transform hover:-translate-y-0.5"
        >
          Entrer
        </button>
      </form>
    </div>
  );
}