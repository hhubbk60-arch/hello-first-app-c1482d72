import { Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";

export function LegalPage({
  eyebrow,
  title,
  updated,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  updated: string;
  intro: string;
  children: ReactNode;
}) {
  return (
    <>
      <section className="bg-brand-gradient text-primary-foreground">
        <div className="mx-auto max-w-[860px] px-5 py-16 sm:px-8 sm:py-20">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-[14px] font-medium text-primary-foreground/70 transition-colors hover:text-primary-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
            Retour à l'accueil
          </Link>
          <p className="mt-6 text-[12px] font-semibold uppercase tracking-[0.16em] text-primary-foreground/55">
            {eyebrow}
          </p>
          <h1 className="mt-2 text-[32px] font-semibold leading-tight sm:text-[42px]">{title}</h1>
          <p className="mt-3 text-[14px] text-primary-foreground/60">{updated}</p>
        </div>
      </section>

      <section className="bg-background">
        <div className="mx-auto max-w-[860px] px-5 py-14 sm:px-8">
          <p className="text-[17px] leading-relaxed text-ink-soft">{intro}</p>
          <div className="mt-10 space-y-10">{children}</div>
        </div>
      </section>
    </>
  );
}

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-border pt-8 first:border-0 first:pt-0">
      <h2 className="text-[20px] font-semibold text-ink">{title}</h2>
      <div className="mt-3 space-y-3 text-[16px] leading-relaxed text-muted-foreground [&_a]:break-words [&_li]:leading-relaxed [&_strong]:text-ink [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:ps-5">
        {children}
      </div>
    </section>
  );
}
