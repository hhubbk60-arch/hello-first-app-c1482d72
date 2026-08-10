import { useEffect, useState } from "react";
import { Menu, Phone, ShieldCheck, X } from "lucide-react";
import { brand } from "@/lib/i18n";
import { LangSwitch, useLang } from "./lang";
import { useScrollProgress } from "./reveal";
import logo from "@/assets/ttshop-pro-logo.png";

export function Header() {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const progress = useScrollProgress();

  const navLinks = [
    { href: "#offres", label: t.nav.offers },
    { href: "#usages", label: t.nav.usages },
    { href: "#couverture", label: t.nav.coverage },
    { href: "#etapes", label: t.nav.steps },
    { href: "#faq", label: t.nav.faq },
  ];

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 shadow-[0_1px_0_0_var(--border)]">
      <div className="bg-brand text-white">
        <div className="mx-auto flex h-9 max-w-[1200px] items-center justify-between px-5 text-[13px] sm:px-8">
          <p className="flex items-center gap-2 text-white/85">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span className="truncate">{t.hero.badge}</span>
          </p>
          <a href={brand.phoneHref} dir="ltr" className="hidden items-center gap-2 font-medium sm:flex">
            <Phone className="h-3.5 w-3.5" />
            {brand.phone}
          </a>
        </div>
      </div>

      <div className="border-b border-border/80 bg-background/85 backdrop-blur-xl">
        <div
          aria-hidden
          className="h-[3px] origin-left bg-brand-light transition-transform duration-150 ease-out"
          style={{ transform: `scaleX(${progress})` }}
        />
        <div className="mx-auto flex h-[72px] max-w-[1200px] items-center gap-8 px-5 sm:px-8">
          <a href="#top" className="shrink-0" aria-label={brand.name}>
            <img src={logo} alt={brand.name} width={1536} height={512} className="h-8 w-auto object-contain sm:h-9" />
          </a>

          <nav aria-label="Navigation" className="hidden flex-1 items-center gap-1 lg:flex">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="rounded-[8px] px-3 py-2 text-[15px] font-medium text-ink-soft/85 transition-colors hover:bg-secondary hover:text-brand"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="ms-auto flex items-center gap-3">
            <LangSwitch tone="dark" />
            <a
              href="#inscription"
              className="hidden h-11 items-center rounded-[10px] bg-brand px-5 text-[15px] font-semibold text-primary-foreground transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-mid hover:shadow-[0_10px_24px_-10px_rgba(11,53,126,0.55)] sm:inline-flex"
            >
              {t.cta.main}
            </a>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? t.cta.close : t.cta.menu}
            aria-expanded={open}
            className="grid h-10 w-10 place-items-center rounded-[10px] border border-border text-ink-soft lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          </div>
        </div>
      </div>

      {open && (
        <nav aria-label="Navigation" className="border-t border-border bg-background lg:hidden">
          <ul className="mx-auto max-w-[1200px] px-5 py-3 sm:px-8">
            {navLinks.map((l) => (
              <li key={l.href} className="border-b border-border/70 last:border-0">
                <a href={l.href} onClick={() => setOpen(false)} className="block py-3.5 text-[16px] text-ink-soft">
                  {l.label}
                </a>
              </li>
            ))}
            <li className="pb-2 pt-4">
              <a
                href="#inscription"
                onClick={() => setOpen(false)}
                className="flex h-12 items-center justify-center rounded-[10px] bg-brand text-[16px] font-semibold text-primary-foreground"
              >
                {t.cta.main}
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
