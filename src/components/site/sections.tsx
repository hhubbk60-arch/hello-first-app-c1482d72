import { useEffect, useState, type ReactNode } from "react";
import { ArrowRight, Check, ChevronDown, Gauge, Headphones, MapPin, Zap } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SignupForm } from "./SignupForm";
import { TunisiaMap } from "./TunisiaMap";
import { useLang } from "./lang";
import { useCounter, useReveal } from "./reveal";
import { brand, governorates } from "@/lib/i18n";

import heroD1 from "@/assets/hero-d1.jpg";
import heroD2 from "@/assets/hero-d2.jpg";
import heroD3 from "@/assets/hero-d3.jpg";
import heroM1 from "@/assets/hero-m1.jpg";
import heroM2 from "@/assets/hero-m2.jpg";
import heroM3 from "@/assets/hero-m3.jpg";
import ctaBg from "@/assets/cta-bg.jpg";
import useWork from "@/assets/use-work.jpg";
import useGaming from "@/assets/use-gaming.jpg";
import useFamily from "@/assets/use-family.jpg";
import useStreaming from "@/assets/use-streaming.jpg";
import useStudy from "@/assets/use-study.jpg";
import useBusiness from "@/assets/use-business.jpg";
import proofCustomers from "@/assets/proof-customers-premium.jpg";
import offersBg from "@/assets/offers-bg.jpg";
import coverageBg from "@/assets/coverage-bg.jpg";

const SHELL = "mx-auto max-w-[1200px] px-5 sm:px-8";

/* ---------------------------------------------------------------- primitives */

function Section({
  id,
  children,
  tone = "default",
  className = "",
}: {
  id?: string;
  children: ReactNode;
  tone?: "default" | "surface" | "ink";
  className?: string;
}) {
  const tones = {
    default: "bg-background",
    surface: "bg-surface",
    ink: "bg-ink text-white",
  } as const;
  return (
    <section id={id} className={`py-16 md:py-24 ${tones[tone]} ${className}`}>
      {children}
    </section>
  );
}

function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const { ref, className: rc, style } = useReveal(delay);
  return (
    <div ref={ref} style={style} className={`${rc} ${className}`}>
      {children}
    </div>
  );
}

function SectionHeader({
  eyebrow,
  title,
  sub,
  invert = false,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  sub?: string;
  invert?: boolean;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow && (
        <p
          className={`text-xs font-semibold uppercase tracking-[0.14em] ${
            invert ? "text-white/60" : "text-brand-light"
          }`}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={`mt-3 text-balance text-[27px] font-semibold leading-[1.15] sm:text-[33px] md:text-[38px] ${
          invert ? "text-white" : "text-ink"
        }`}
      >
        {title}
      </h2>
      {sub && (
        <p className={`mt-3 text-[16px] leading-relaxed ${invert ? "text-white/70" : "text-muted-foreground"}`}>
          {sub}
        </p>
      )}
    </div>
  );
}

function Cta({
  children,
  variant = "primary",
  href = "#inscription",
}: {
  children: ReactNode;
  variant?: "primary" | "outline" | "light";
  href?: string;
}) {
  const styles = {
    primary: "bg-brand text-primary-foreground hover:bg-brand-mid hover:shadow-[0_12px_28px_-12px_rgba(11,53,126,0.5)]",
    outline: "border border-border bg-background text-ink hover:border-brand/50 hover:text-brand",
    light: "bg-white text-brand hover:shadow-[0_12px_28px_-12px_rgba(0,0,0,0.45)]",
  } as const;
  return (
    <a
      href={href}
      className={`inline-flex h-12 items-center gap-2 rounded-[10px] px-6 text-[15px] font-semibold transition-all duration-200 hover:-translate-y-0.5 ${styles[variant]}`}
    >
      {children}
      <ArrowRight className="h-4 w-4 rtl:rotate-180" />
    </a>
  );
}

/* ---------------------------------------------------------------------- hero */

const SLIDES = [
  { desktop: heroD1, mobile: heroM1 },
  { desktop: heroD2, mobile: heroM2 },
  { desktop: heroD3, mobile: heroM3 },
];

function useSlideshow(count: number, delay = 5000) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setI((n) => (n + 1) % count), delay);
    return () => window.clearInterval(id);
  }, [count, delay]);
  return [i, setI] as const;
}

export function Hero() {
  const { t } = useLang();
  const [active, setActive] = useSlideshow(SLIDES.length);

  return (
    <section id="top" className="relative isolate overflow-hidden bg-ink">
      {/* auto-scrolling background: 3 desktop shots, 3 mobile shots */}
      <div className="absolute inset-0 -z-10">
        {SLIDES.map((s, i) => (
          <div
            key={i}
            aria-hidden={i !== active}
            className={`absolute inset-0 transition-opacity duration-[1400ms] ease-out ${
              i === active ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={s.mobile}
              alt=""
              width={1008}
              height={1600}
              loading={i === 0 ? "eager" : "lazy"}
              className="h-full w-full object-cover object-center md:hidden"
            />
            <img
              src={s.desktop}
              alt=""
              width={1920}
              height={1088}
              loading={i === 0 ? "eager" : "lazy"}
              className="hidden h-full w-full object-cover object-center md:block"
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/45 to-ink/75 md:bg-gradient-to-r md:from-ink/80 md:via-ink/40 md:to-ink/10" />
      </div>

      <div className={`${SHELL} grid gap-8 py-9 md:py-14 lg:grid-cols-[1fr_420px] lg:items-center lg:gap-14`}>
        <div className="min-w-0">
          <h1 className="text-balance text-[32px] font-semibold leading-[1.07] tracking-[-0.03em] text-white [text-shadow:0_2px_18px_rgba(6,10,25,0.55)] sm:text-[44px] lg:text-[52px]">
            {t.hero.title}
          </h1>
          <p className="mt-4 max-w-lg text-[16px] leading-relaxed text-white/85 [text-shadow:0_1px_12px_rgba(6,10,25,0.6)]">
            {t.hero.sub}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Cta variant="light">{t.cta.main}</Cta>
            <a
              href={brand.phoneHref}
              dir="ltr"
              className="inline-flex h-12 items-center gap-2 rounded-[10px] border border-white/25 px-5 text-[15px] font-semibold text-white transition-colors hover:bg-white/10"
            >
              {brand.phone}
            </a>
          </div>

          <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
            {t.reassurance.map((r) => (
              <li key={r} className="flex items-center gap-2 text-[14px] text-white/75">
                <Check className="h-4 w-4 shrink-0" />
                {r}
              </li>
            ))}
          </ul>

          <div className="mt-7 flex items-center gap-2" role="tablist" aria-label={t.nav.usages}>
            {SLIDES.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === active}
                aria-label={t.hero.slides[i]}
                onClick={() => setActive(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === active ? "w-10 bg-white" : "w-4 bg-white/35 hover:bg-white/60"
                }`}
              />
            ))}
            <span className="ms-3 text-[13px] text-white/65">{t.hero.slides[active]}</span>
          </div>
        </div>

        <div id="inscription" className="min-w-0 scroll-mt-24">
          <div className="rounded-[16px] border border-white/15 bg-card p-4 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.7)] sm:p-6">
            <h2 className="text-[19px] font-semibold text-ink">{t.hero.formTitle}</h2>
            <p className="mb-4 mt-1 text-[14px] text-muted-foreground">{t.hero.formSub}</p>
            <SignupForm id="signup-hero" />
          </div>
        </div>
      </div>

      <a
        href="#offres"
        className="absolute bottom-6 right-6 z-10 hidden rounded-full border border-white/25 bg-white/10 p-2.5 text-white backdrop-blur-sm transition-colors hover:bg-white/20 md:flex"
        aria-label="Voir les offres"
      >
        <ChevronDown className="h-5 w-5 animate-scroll-bounce" />
      </a>
    </section>
  );
}

/* --------------------------------------------------------------------- stats */

const STAT_VALUES = [
  { value: 180000, suffix: "+" },
  { value: 24, suffix: "" },
  { value: 4.8, suffix: "/5" },
];

function Stat({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const { ref, formatted } = useCounter(value, Number.isInteger(value) ? 0 : 1);
  return (
    <div>
      <p className="text-[34px] font-semibold leading-none tracking-[-0.03em] text-brand sm:text-[42px]" dir="ltr">
        <span ref={ref}>{formatted}</span>
        {suffix}
      </p>
      <p className="mt-2 text-[15px] text-muted-foreground">{label}</p>
    </div>
  );
}

export function Stats() {
  const { t } = useLang();
  return (
    <section className="border-b border-border bg-background py-10">
      <div className={`${SHELL} grid grid-cols-3 gap-6 text-center sm:gap-10`}>
        {STAT_VALUES.map((s, i) => (
          <Stat key={i} {...s} label={t.stats[i]?.label ?? ""} />
        ))}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------- offers */

export function Offers() {
  const { t } = useLang();
  const icons = [Zap, Headphones, Gauge];
  return (
    <section
      id="offres"
      className="relative isolate overflow-hidden bg-ink py-16 md:py-24"
    >
      <img
        src={offersBg}
        alt="Famille tunisienne connectée à internet à la maison"
        width={1920}
        height={1200}
        loading="lazy"
        className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
      />
      <div className="absolute inset-0 -z-10 bg-ink/75 md:bg-ink/65" />
      <div className={`${SHELL} relative`}>
        <Reveal>
          <SectionHeader eyebrow={t.offers.eyebrow} title={t.offers.title} invert align="center" />
        </Reveal>
        <Reveal className="mt-10">
          <div className="grid gap-5 md:grid-cols-3">
            {t.offers.items.map((o, i) => {
              const Icon = icons[i] ?? Zap;
              const featured = i === 1;
              return (
                <a
                  key={o.name}
                  href="#inscription"
                  className={`group rounded-[14px] border p-6 transition-all duration-200 hover:-translate-y-1 ${
                    featured
                      ? "border-white/45 bg-white shadow-[0_20px_50px_-30px_rgba(0,0,0,0.7)]"
                      : "border-white/20 bg-white/90 hover:border-white/50"
                  }`}
                >
                  <Icon className="h-5 w-5 text-brand" strokeWidth={1.75} />
                  <h3 className="mt-4 text-[20px] font-semibold text-ink">{o.name}</h3>
                  <p className="mt-1 text-[14px] text-muted-foreground">{o.who}</p>
                  <p className="mt-5 text-[26px] font-semibold tracking-tight text-brand" dir="ltr">
                    {o.speed}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 text-[15px] font-semibold text-ink transition-colors group-hover:text-brand">
                    {t.offers.link}
                    <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                  </span>
                </a>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------- usages */

export function Usages() {
  const { t } = useLang();
  const images = [useFamily, useWork, useGaming, useStreaming, useStudy, useBusiness];
  const items = t.usages.items;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [perView, setPerView] = useState(3);

  useEffect(() => {
    const set = () => setPerView(window.innerWidth < 640 ? 1 : window.innerWidth < 1024 ? 2 : 3);
    set();
    window.addEventListener("resize", set);
    return () => window.removeEventListener("resize", set);
  }, []);

  const pages = Math.max(1, Math.ceil(items.length / perView));
  const page = Math.min(index, pages - 1);

  useEffect(() => {
    if (paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setIndex((p) => (p + 1) % pages), 4500);
    return () => window.clearInterval(id);
  }, [pages, paused]);

  return (
    <Section id="usages">
      <div className={SHELL}>
        <Reveal>
          <SectionHeader eyebrow={t.usages.eyebrow} title={t.usages.title} sub={t.usages.sub} align="center" />
        </Reveal>

        <Reveal className="mt-10">
          <div
            className="relative"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            aria-roledescription="carousel"
          >
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-700 ease-out rtl:flex-row-reverse"
                style={{ transform: `translateX(-${page * 100}%)` }}
              >
                {Array.from({ length: pages }).map((_, p) => (
                  <div
                    key={p}
                    className="grid w-full shrink-0 gap-5 px-0.5 sm:grid-cols-2 lg:grid-cols-3"
                    aria-hidden={p !== page}
                  >
                    {items.slice(p * perView, p * perView + perView).map((u, i) => {
                      const img = images[p * perView + i] ?? images[0];
                      return (
                        <a
                          key={u.title}
                          href="#inscription"
                          className="group relative flex flex-col overflow-hidden rounded-[16px] border border-border bg-card shadow-[0_18px_44px_-36px_rgba(11,16,32,0.7)] transition-all duration-300 hover:-translate-y-1.5 hover:border-brand/35 hover:shadow-[0_28px_60px_-34px_rgba(11,53,126,0.45)]"
                        >
                          <div className="relative h-52 overflow-hidden">
                            <img
                              src={img}
                              alt={u.title}
                              width={1200}
                              height={900}
                              loading="lazy"
                              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-transparent" />
                            <span className="absolute start-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[12px] font-semibold text-brand backdrop-blur-sm">
                              {u.tag}
                            </span>
                            <h3 className="absolute inset-x-4 bottom-3 text-[20px] font-semibold text-white">
                              {u.title}
                            </h3>
                          </div>
                          <div className="flex flex-1 flex-col p-5">
                            <p className="text-[15px] leading-relaxed text-muted-foreground">{u.text}</p>
                            <span className="mt-4 inline-flex items-center gap-2 text-[15px] font-semibold text-ink transition-colors group-hover:text-brand">
                              {t.usages.cta}
                              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                            </span>
                          </div>
                        </a>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {pages > 1 && (
              <div className="mt-7 flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => setIndex((p) => (p - 1 + pages) % pages)}
                  aria-label={t.usages.prev}
                  className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card text-ink transition-colors hover:border-brand/40 hover:text-brand"
                >
                  <ArrowRight className="h-4 w-4 rotate-180 rtl:rotate-0" />
                </button>
                <div className="flex items-center gap-2">
                  {Array.from({ length: pages }).map((_, p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setIndex(p)}
                      aria-label={`${t.usages.eyebrow} ${p + 1}`}
                      aria-current={p === page}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        p === page ? "w-8 bg-brand" : "w-3 bg-border hover:bg-brand/40"
                      }`}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setIndex((p) => (p + 1) % pages)}
                  aria-label={t.usages.next}
                  className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card text-ink transition-colors hover:border-brand/40 hover:text-brand"
                >
                  <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                </button>
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ coverage */

export function Coverage() {
  const { t } = useLang();
  return (
    <section id="couverture" className="relative isolate overflow-hidden bg-ink py-8 md:py-12">
      <img
        src={coverageBg}
        alt="Vue de la Tunisie et de sa côte méditerranéenne"
        width={1920}
        height={1200}
        loading="lazy"
        className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
      />
      <div className="absolute inset-0 -z-10 bg-ink/70" />
      <div className={`${SHELL} relative`}>
        <Reveal>
          <div className="grid gap-7 lg:grid-cols-[1fr_0.8fr] lg:items-center lg:gap-10">
            <div>
              <SectionHeader
                eyebrow={t.coverage.eyebrow}
                title={t.coverage.title}
                sub={t.coverage.sub}
                invert
              />
              <div className="mt-5 flex flex-wrap gap-x-4 gap-y-1.5 text-[13px] text-white/80">
                {governorates.map((g) => (
                  <span key={g} className="inline-flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-white/65" />
                    {g}
                  </span>
                ))}
              </div>
              <div className="mt-6">
                <Cta variant="light">{t.coverage.cta}</Cta>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="rounded-[18px] border border-white/25 bg-white/10 p-2 backdrop-blur-sm">
                <TunisiaMap className="h-[310px] w-auto sm:h-[390px]" />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------------- steps */

export function Steps() {
  const { t } = useLang();
  return (
    <Section id="etapes" tone="default">
      <div className={SHELL}>
        <Reveal>
          <SectionHeader eyebrow={t.steps.eyebrow} title={t.steps.title} align="center" />
        </Reveal>
        <Reveal className="mt-10">
          <ol className="relative grid gap-px overflow-hidden rounded-[18px] border border-border bg-muted md:grid-cols-3">
            {t.steps.items.map((s, i) => (
              <li
                key={s.title}
                className="group relative flex flex-col bg-card p-7 transition-colors duration-300 hover:bg-muted/80 md:p-8"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-semibold tabular-nums text-[34px] leading-none text-muted-foreground/25 transition-colors duration-300 group-hover:text-muted-foreground/60">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="rounded-full border border-border px-3 py-1 text-[12px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
                    {s.meta}
                  </span>
                </div>
                <span
                  aria-hidden
                  className="mt-5 block h-px w-10 bg-border transition-all duration-300 group-hover:w-16 group-hover:bg-muted-foreground/60"
                />
                <h3 className="mt-5 text-[19px] font-semibold text-foreground">{s.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{s.text}</p>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </Section>
  );
}

/* ---------------------------------------------------------------------- proof */

function Stars() {
  return (
    <div className="flex gap-0.5 text-brand" aria-label="5/5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden>
          <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9z" />
        </svg>
      ))}
    </div>
  );
}

export function Proof() {
  const { t } = useLang();
  const items = t.proof.items;
  const perView = 3;
  const pages = Math.ceil(items.length / perView);
  const [page, setPage] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setPage((p) => (p + 1) % pages), 4000);
    return () => window.clearInterval(id);
  }, [pages, paused]);

  return (
    <Section tone="ink" className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <img
          src={proofCustomers}
          alt="Famille tunisienne connectée à la maison"
          width={1536}
          height={960}
          loading="lazy"
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-ink/75 md:bg-gradient-to-r md:from-ink/85 md:via-ink/70 md:to-ink/35" />
      </div>

      <div className={SHELL}>
        <Reveal>
          <SectionHeader eyebrow={t.proof.eyebrow} title={t.proof.title} invert align="center" />
        </Reveal>
        <Reveal className="mt-10">
          <div
            className="overflow-hidden"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            aria-roledescription="carousel"
          >
            <div
              className="flex transition-transform duration-700 ease-out"
              style={{ transform: `translateX(-${page * 100}%)` }}
            >
              {Array.from({ length: pages }).map((_, p) => (
                <div key={p} className="grid w-full shrink-0 gap-5 px-0.5 md:grid-cols-3">
                  {Array.from({ length: perView }).map((_, i) => {
                    const r = items[(p * perView + i) % items.length];
                    return (
                      <figure
                        key={`${p}-${r.name}`}
                        className="rounded-[14px] border border-white/35 bg-card/95 p-6 shadow-[0_24px_55px_-34px_rgba(0,0,0,0.75)] backdrop-blur-sm"
                      >
                        <Stars />
                        <blockquote className="mt-4 text-[16px] leading-relaxed text-ink-soft">“{r.quote}”</blockquote>
                        <figcaption className="mt-4 flex items-center gap-3 text-[14px] text-muted-foreground">
                          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-secondary text-[13px] font-semibold text-brand">
                            {r.name.slice(0, 1)}
                          </span>
                          <span>
                            <span className="block font-semibold text-ink">{r.name}</span>
                            {r.city}
                          </span>
                        </figcaption>
                      </figure>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-7 flex items-center justify-center gap-2">
            {Array.from({ length: pages }).map((_, p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPage(p)}
                aria-label={`${t.proof.eyebrow} ${p + 1}`}
                aria-current={p === page}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  p === page ? "w-8 bg-white" : "w-3 bg-white/35 hover:bg-white/65"
                }`}
              />
            ))}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------------ faq */

export function Faq() {
  const { t } = useLang();
  return (
    <Section id="faq" tone="surface">
      <div className={SHELL}>
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <Reveal>
            <SectionHeader eyebrow={t.faq.eyebrow} title={t.faq.title} />
          </Reveal>
          <Reveal>
            <Accordion type="single" collapsible className="border-t border-border">
              {t.faq.items.map((f) => (
                <AccordionItem key={f.q} value={f.q} className="border-b border-border">
                  <AccordionTrigger className="py-5 text-start text-[16px] font-medium text-ink hover:no-underline">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 text-[15px] leading-relaxed text-muted-foreground">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ final cta */

export function FinalCta() {
  const { t } = useLang();
  return (
    <section id="contact" className="relative isolate overflow-hidden py-16 md:py-24">
      <img
        src={ctaBg}
        alt=""
        width={1920}
        height={1080}
        loading="lazy"
        className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink/90 via-ink/75 to-ink/55" />

      <div className={`${SHELL} grid gap-10 lg:grid-cols-[1fr_430px] lg:items-center lg:gap-16`}>
        <div className="relative">
          <h2 className="text-balance text-[30px] font-semibold leading-[1.12] text-white sm:text-[38px]">
            {t.final.title}
          </h2>
          <p className="mt-4 max-w-md text-[17px] leading-relaxed text-white/80">{t.final.sub}</p>
          <ul className="mt-7 flex flex-wrap gap-x-6 gap-y-2">
            {t.reassurance.map((r) => (
              <li key={r} className="flex items-center gap-2 text-[15px] text-white/85">
                <Check className="h-4 w-4 shrink-0" />
                {r}
              </li>
            ))}
          </ul>
          <p className="mt-7 text-[15px] text-white/70">
            {t.final.or}{" "}
            <a href={brand.phoneHref} dir="ltr" className="font-semibold text-white underline underline-offset-4">
              {brand.phone}
            </a>
          </p>
        </div>

        <div className="rounded-[16px] bg-card p-4 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.55)] sm:p-7">
          <h3 className="text-[20px] font-semibold text-ink">{t.hero.formTitle}</h3>
          <p className="mb-5 mt-1 text-[14px] text-muted-foreground">{t.hero.formSub}</p>
          <SignupForm id="signup-bas" />
        </div>
      </div>
    </section>
  );
}
