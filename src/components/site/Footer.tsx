import { Link } from "@tanstack/react-router";
import { brand } from "@/lib/i18n";
import { useLang } from "./lang";
import logo from "@/assets/ttshop-pro-logo.png";
import { Phone, Mail, MapPin, Clock, ShieldCheck, ArrowUpRight } from "lucide-react";

export function Footer() {
  const { t } = useLang();

  const navLinks = [
    { href: "#offres", label: t.nav.offers },
    { href: "#usages", label: t.nav.usages },
    { href: "#couverture", label: t.nav.coverage },
    { href: "#etapes", label: t.nav.steps },
    { href: "#faq", label: t.nav.faq },
  ];

  const legalLinks = [
    { to: "/confidentialite" as const, label: t.footer.privacy },
    { to: "/conditions" as const, label: t.footer.terms },
  ];

  return (
    <footer className="bg-brand-gradient text-primary-foreground">
      {/* CTA band */}
      <div className="border-b border-primary-foreground/12">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-5 px-5 py-10 sm:px-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[22px] font-semibold leading-tight sm:text-[26px]">{t.final.title}</p>
            <p className="mt-1.5 text-[15px] text-primary-foreground/70">{t.final.sub}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="#inscription"
              className="inline-flex h-12 items-center gap-2 rounded-[10px] bg-primary-foreground px-6 text-[15px] font-semibold text-brand transition-transform duration-200 hover:-translate-y-0.5"
            >
              {t.cta.main}
              <ArrowUpRight className="h-4 w-4" />
            </a>
            <a
              href={brand.phoneHref}
              dir="ltr"
              className="inline-flex h-12 items-center gap-2 rounded-[10px] border border-primary-foreground/30 px-5 text-[15px] font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground/10"
            >
              <Phone className="h-4 w-4" />
              {brand.phone}
            </a>
          </div>
        </div>
      </div>

      {/* Columns */}
      <div className="mx-auto max-w-[1200px] px-5 py-14 sm:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.7fr_1fr_1.2fr_0.9fr]">
          <div className="space-y-5">
            <a href="#top" aria-label={brand.name} className="inline-block">
              <img
                src={logo}
                alt={brand.name}
                width={1536}
                height={512}
                loading="lazy"
                className="h-9 w-auto object-contain brightness-0 invert"
              />
            </a>
            <p className="max-w-sm text-[15px] leading-relaxed text-primary-foreground/70">{t.footer.tagline}</p>
            <div className="flex items-center gap-2 rounded-[10px] border border-primary-foreground/15 bg-primary-foreground/5 px-3 py-2 text-[13px] text-primary-foreground/80">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              Société tunisienne · Données traitées en Tunisie
            </div>
          </div>

          <nav aria-label={t.footer.links}>
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-primary-foreground/55">{t.footer.links}</p>
            <ul className="mt-4 space-y-2.5">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="text-[15px] text-primary-foreground/75 transition-colors hover:text-primary-foreground"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-primary-foreground/55">{t.footer.contact}</p>
            <ul className="mt-4 space-y-3 text-[15px] text-primary-foreground/75">
              <li>
                <a
                  href={`mailto:${brand.email}`}
                  dir="ltr"
                  className="flex items-center gap-2.5 transition-colors hover:text-primary-foreground"
                >
                  <Mail className="h-4 w-4 shrink-0 text-primary-foreground/55" />
                  {brand.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary-foreground/55" />
                <span>Tunisie — 24 gouvernorats</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary-foreground/55" />
                <span className="leading-relaxed">Lun – Sam, 8h – 20h · Conseillers en arabe et français</span>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-primary-foreground/55">{t.footer.legal}</p>
            <ul className="mt-4 space-y-2.5">
              {legalLinks.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.to}
                    className="text-[15px] text-primary-foreground/75 transition-colors hover:text-primary-foreground"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-primary-foreground/12">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-2 px-5 py-5 text-[13px] text-primary-foreground/60 sm:flex-row sm:px-8">
          <p>
            © {new Date().getFullYear()} {brand.name}. {t.footer.rights}
          </p>
          <div className="flex items-center gap-4">
            {legalLinks.map((l) => (
              <Link key={l.label} to={l.to} className="transition-colors hover:text-primary-foreground">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
