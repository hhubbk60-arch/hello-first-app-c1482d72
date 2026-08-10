import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Globe2, Home, RefreshCw, Users } from "lucide-react";

export function PanelShell({
  title,
  subtitle,
  onRefresh,
  refreshing,
  children,
}: {
  title: string;
  subtitle: string;
  onRefresh: () => void;
  refreshing?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-ink text-white">
      <div className="pointer-events-none fixed inset-0 opacity-70 [background:radial-gradient(70%_50%_at_15%_0%,rgba(0,95,234,0.28),transparent_60%),radial-gradient(60%_50%_at_90%_10%,rgba(11,53,126,0.5),transparent_65%)]" />
      <header className="relative z-10 border-b border-white/10 bg-ink/60 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-3 px-4 py-4 sm:px-6">
          <div className="mr-auto">
            <h1 className="text-[20px] font-semibold sm:text-[24px]">{title}</h1>
            <p className="text-[13px] text-white/55">{subtitle}</p>
          </div>
          <nav className="flex items-center gap-1.5 text-[14px]">
            <PanelLink to="/" icon={<Home className="h-4 w-4" />} label="Site" />
            <PanelLink to="/leads" icon={<Users className="h-4 w-4" />} label="Leads" />
            <PanelLink to="/visitors" icon={<Globe2 className="h-4 w-4" />} label="Visiteurs" />
          </nav>
          <button
            type="button"
            onClick={onRefresh}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/15 bg-white/8 px-3.5 text-[14px] font-medium transition-colors hover:bg-white/14"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            Actualiser
          </button>
        </div>
      </header>
      <main className="relative z-10 mx-auto max-w-[1400px] px-4 py-6 sm:px-6">{children}</main>
    </div>
  );
}

function PanelLink({ to, icon, label }: { to: string; icon: ReactNode; label: string }) {
  return (
    <Link
      to={to}
      className="inline-flex h-10 items-center gap-2 rounded-xl border border-transparent px-3 text-white/70 transition-colors hover:border-white/15 hover:bg-white/8 hover:text-white"
      activeProps={{ className: "border-white/20 bg-white/12 text-white" }}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </Link>
  );
}

export function StatCard({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="rounded-2xl border border-white/12 bg-white/6 p-4 backdrop-blur-xl transition-transform duration-300 hover:-translate-y-1">
      <p className="text-[12px] uppercase tracking-[0.12em] text-white/50">{label}</p>
      <p className="mt-1.5 text-[28px] font-semibold leading-none">{value}</p>
      {hint && <p className="mt-1.5 text-[12px] text-white/45">{hint}</p>}
    </div>
  );
}

export function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-white/12 bg-white/6 p-4 backdrop-blur-xl">
      <h2 className="mb-3 text-[14px] font-semibold uppercase tracking-[0.1em] text-white/60">{title}</h2>
      {children}
    </section>
  );
}