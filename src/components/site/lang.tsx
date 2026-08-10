import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { dict, type Lang } from "@/lib/i18n";
import { FlagFR, FlagTN } from "./flags";

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (typeof dict)["fr"]; dir: "ltr" | "rtl" };

const LangContext = createContext<Ctx | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("fr");
  const dir: "ltr" | "rtl" = lang === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    const html = document.documentElement;
    html.lang = lang;
    html.dir = dir;
  }, [lang, dir]);

  const value = useMemo(() => ({ lang, setLang, t: dict[lang], dir }), [lang, dir]);
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used inside LangProvider");
  return ctx;
}

export function LangSwitch({ tone = "light" }: { tone?: "light" | "dark" }) {
  const { lang, setLang } = useLang();
  const shell =
    tone === "light"
      ? "border-white/25 bg-white/10 backdrop-blur"
      : "border-border bg-surface";
  const options = [
    { code: "ar" as const, label: "العربية", short: "AR" },
    { code: "fr" as const, label: "Français", short: "FR" },
  ];
  return (
    <div className={`inline-flex items-center gap-1 rounded-full border p-1 ${shell}`} role="group" aria-label="Langue">
      {options.map((o) => {
        const active = lang === o.code;
        const Flag = o.code === "ar" ? FlagTN : FlagFR;
        return (
          <button
            key={o.code}
            type="button"
            onClick={() => setLang(o.code)}
            aria-pressed={active}
            title={o.label}
            className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[12px] font-semibold transition-all ${
              active
                ? tone === "light"
                  ? "bg-white text-brand shadow-sm"
                  : "bg-brand text-primary-foreground"
                : tone === "light"
                  ? "text-white/75 hover:text-white"
                  : "text-muted-foreground hover:text-ink"
            }`}
          >
            <Flag className="h-3.5 w-5 rounded-[2px] object-cover ring-1 ring-black/10" />
            {o.short}
          </button>
        );
      })}
    </div>
  );
}

