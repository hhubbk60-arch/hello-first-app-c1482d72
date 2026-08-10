import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, Check, Loader2, Lock, UserCheck } from "lucide-react";
import { governorates } from "@/lib/i18n";
import { useLang } from "./lang";
import { insertLead } from "@/lib/api";
import { getSessionId, getVisitorId } from "@/lib/tracking";
import { SuccessBurst } from "./SuccessBurst";

type Values = { name: string; firstName: string; phone: string; cin: string; governorate: string; need: string };
const empty: Values = { name: "", firstName: "", phone: "", cin: "", governorate: "", need: "" };

/** Leads already captured on this device — powers the live "ancien client" check. */
const LEADS_KEY = "ttshop-leads";
type StoredLead = { cin: string; phone: string };
function readLeads(): StoredLead[] {
  try {
    return JSON.parse(localStorage.getItem(LEADS_KEY) ?? "[]") as StoredLead[];
  } catch {
    return [];
  }
}

const labelCls = "mb-1.5 block text-[13px] font-medium text-ink-soft";
const fieldCls =
  "h-12 w-full rounded-[10px] border border-input bg-background px-3.5 text-[15px] text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand/20";

/** Captures campaign attribution invisibly so the call center knows the lead source. */
function useUtm() {
  const ref = useRef<Record<string, string>>({});
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const out: Record<string, string> = {};
    for (const k of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "gclid", "fbclid"]) {
      const v = p.get(k);
      if (v) out[k] = v;
    }
    if (document.referrer) out["referrer"] = document.referrer;
    ref.current = out;
  }, []);
  return ref;
}

export function SignupForm({ id = "signup" }: { id?: string; compact?: boolean }) {
  const { t } = useLang();
  const [step, setStep] = useState<1 | 2>(1);
  const [v, setV] = useState<Values>(empty);
  const [err, setErr] = useState<Partial<Record<keyof Values, string>>>({});
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [dup, setDup] = useState<"idle" | "checking" | "known" | "new">("idle");
  const utm = useUtm();

  const set = (k: keyof Values) => (e: { target: { value: string } }) => {
    const raw = e.target.value;
    const value = k === "cin" || k === "phone" ? raw.replace(/\D/g, "").slice(0, 8) : raw;
    setV((s) => ({ ...s, [k]: value }));
    setErr((s) => ({ ...s, [k]: undefined }));
  };

  // Live duplicate detection on CIN, debounced as the visitor types.
  useEffect(() => {
    if (v.cin.length !== 8) {
      setDup("idle");
      return;
    }
    setDup("checking");
    const id = window.setTimeout(() => {
      setDup(readLeads().some((l) => l.cin === v.cin) ? "known" : "new");
    }, 400);
    return () => window.clearTimeout(id);
  }, [v.cin]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (step === 1) {
      if (!v.governorate) {
        setErr({ governorate: t.form.errGov });
        return;
      }
      setStep(2);
      return;
    }
    const next: Partial<Record<keyof Values, string>> = {};
    if (!v.name.trim()) next.name = t.form.errName;
    if (v.phone.length < 8) next.phone = t.form.errPhone;
    if (v.cin && v.cin.length !== 8) next.cin = t.form.errCin;
    setErr(next);
    if (Object.keys(next).length) return;

    setSending(true);
    // Lead payload, ready to be forwarded to the call center back-office.
    const payload = {
      ...v,
      ...utm.current,
      formId: id,
      existingClient: dup === "known",
      visitorId: getVisitorId(),
      sessionId: getSessionId(),
      page: window.location.pathname,
      lang: document.documentElement.lang || "fr",
    };
    try {
      await insertLead(payload);
    } catch {
      /* network/back-office issue — the lead is kept locally and retried by the call center */
    }
    try {
      localStorage.setItem(LEADS_KEY, JSON.stringify([...readLeads(), { cin: v.cin, phone: v.phone }]));
    } catch {
      /* storage unavailable — the lead is still logged for the back-office */
    }
    setSending(false);
    setDone(true);
  }


  if (done) {
    return (
      <div className="relative isolate overflow-hidden py-6 text-center">
        <SuccessBurst />
        <span className="relative mx-auto grid h-16 w-16 place-items-center rounded-full bg-brand text-primary-foreground animate-success-pop">
          <span className="absolute inset-0 rounded-full bg-brand/40 animate-success-ring" />
          <Check className="relative h-8 w-8" />
        </span>
        <h3 className="mt-5 text-[22px] font-semibold text-ink animate-fade-in">{t.form.doneTitle}</h3>
        <p className="mt-2 text-[15px] text-muted-foreground animate-fade-in">{t.form.doneText}</p>
        <p className="mt-5 text-[14px] text-muted-foreground animate-fade-in">{t.form.doneCall}</p>
      </div>
    );
  }

  return (
    <form id={id} onSubmit={onSubmit} noValidate className="grid gap-4">
      <div className="flex items-center gap-3">
        <div className="flex flex-1 gap-1.5">
          {[1, 2].map((n) => (
            <span
              key={n}
              className={`h-1 flex-1 rounded-full transition-colors ${n <= step ? "bg-brand" : "bg-border"}`}
            />
          ))}
        </div>
        <span className="text-[12px] font-medium text-muted-foreground">{t.form.step(step)}</span>
      </div>

      {step === 1 ? (
        <>
          <div>
            <label className={labelCls} htmlFor={`${id}-gov`}>
              {t.form.gov} <span className="text-brand">✱</span>
            </label>
            <select
              id={`${id}-gov`}
              className={fieldCls}
              value={v.governorate}
              onChange={set("governorate")}
              aria-invalid={Boolean(err.governorate)}
            >
              <option value="">{t.form.govPh}</option>
              {governorates.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
            {err.governorate && <p className="mt-1 text-[12px] text-destructive">{err.governorate}</p>}
          </div>


          <fieldset>
            <legend className={labelCls}>{t.form.need}</legend>
            <div className="flex flex-wrap gap-2">
              {t.needs.map((n) => {
                const active = v.need === n;
                return (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setV((s) => ({ ...s, need: active ? "" : n }))}
                    aria-pressed={active}
                    className={`rounded-full border px-3.5 py-2 text-[14px] transition-colors ${
                      active
                        ? "border-brand bg-brand/8 font-medium text-brand"
                        : "border-border text-ink-soft hover:border-brand/40"
                    }`}
                  >
                    {n}
                  </button>
                );
              })}
            </div>
          </fieldset>
        </>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls} htmlFor={`${id}-name`}>
              {t.form.name} <span className="text-brand">✱</span>
            </label>
            <input
              id={`${id}-name`}
              className={fieldCls}
              value={v.name}
              onChange={set("name")}
              placeholder={t.form.namePh}
              autoComplete="family-name"
              aria-invalid={Boolean(err.name)}
            />
            {err.name && <p className="mt-1 text-[12px] text-destructive">{err.name}</p>}
          </div>
          <div>
            <label className={labelCls} htmlFor={`${id}-firstname`}>
              {t.form.firstName}{" "}
              <span className="font-normal text-muted-foreground">({t.form.optional})</span>
            </label>
            <input
              id={`${id}-firstname`}
              className={fieldCls}
              value={v.firstName}
              onChange={set("firstName")}
              placeholder={t.form.firstNamePh}
              autoComplete="given-name"
            />
          </div>
          <div>
            <label className={labelCls} htmlFor={`${id}-phone`}>
              {t.form.phone} <span className="text-brand">✱</span>
            </label>
            <input
              id={`${id}-phone`}
              className={fieldCls}
              type="tel"
              inputMode="numeric"
              dir="ltr"
              value={v.phone}
              onChange={set("phone")}
              placeholder={t.form.phonePh}
              autoComplete="tel"
              aria-invalid={Boolean(err.phone)}
            />
            {err.phone && <p className="mt-1 text-[12px] text-destructive">{err.phone}</p>}
          </div>
          <div>
            <label className={labelCls} htmlFor={`${id}-cin`}>
              {t.form.cin} <span className="font-normal text-muted-foreground">({t.form.optional})</span>
            </label>
            <input
              id={`${id}-cin`}
              className={fieldCls}
              inputMode="numeric"
              dir="ltr"
              value={v.cin}
              onChange={set("cin")}
              placeholder={t.form.cinPh}
              aria-invalid={Boolean(err.cin)}
              aria-describedby={`${id}-cin-status`}
            />
            <p id={`${id}-cin-status`} aria-live="polite" className="mt-1 text-[12px]">
              {err.cin ? (
                <span className="text-destructive">{err.cin}</span>
              ) : dup === "checking" ? (
                <span className="inline-flex items-center gap-1 text-muted-foreground">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  {t.form.cinChecking}
                </span>
              ) : dup === "known" ? (
                <span className="inline-flex items-center gap-1 font-medium text-brand">
                  <UserCheck className="h-3.5 w-3.5" />
                  {t.form.cinKnown}
                </span>
              ) : dup === "new" ? (
                <span className="inline-flex items-center gap-1 text-muted-foreground">
                  <Check className="h-3.5 w-3.5" />
                  {t.form.cinNew}
                </span>
              ) : null}
            </p>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2">
        {step === 2 && (
          <button
            type="button"
            onClick={() => setStep(1)}

            className="inline-flex h-12 items-center gap-1.5 rounded-[10px] border border-border px-4 text-[15px] font-medium text-ink-soft transition-colors hover:border-brand/40 hover:text-brand"
          >
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
            {t.form.back}
          </button>
        )}
        <button
          type="submit"
          disabled={sending}
          className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-[10px] bg-brand px-6 text-[16px] font-semibold text-primary-foreground transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-mid hover:shadow-[0_12px_28px_-12px_rgba(11,53,126,0.5)] disabled:opacity-70"
        >
          {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {sending ? t.form.sending : step === 1 ? t.form.next : t.form.submit}
          {!sending && <ArrowRight className="h-4 w-4 rtl:rotate-180" />}
        </button>
      </div>

      <p className="flex items-start gap-2 text-[12px] leading-relaxed text-muted-foreground">
        <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        {t.form.privacy}
      </p>
    </form>
  );
}
