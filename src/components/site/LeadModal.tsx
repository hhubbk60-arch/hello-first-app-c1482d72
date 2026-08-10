import { useEffect, useState } from "react";
import { X, PhoneCall } from "lucide-react";
import { SignupForm } from "./SignupForm";
import { useLang } from "./lang";
import modalDesktop from "@/assets/modal-desktop.jpg";
import modalMobile from "@/assets/modal-mobile.jpg";

const STORAGE_KEY = "ttshop-lead-modal-seen";

/** Lead-capture modal: opens 4s after arrival, once per browser session. */
export function LeadModal() {
  const { t } = useLang();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY)) return;
    const id = window.setTimeout(() => {
      setOpen(true);
      sessionStorage.setItem(STORAGE_KEY, "1");
    }, 4000);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t.hero.formTitle}
      className="fixed inset-0 z-[100] flex items-end justify-center overflow-y-auto bg-ink/70 p-0 backdrop-blur-sm animate-fade-in sm:items-center sm:p-6"
      onClick={() => setOpen(false)}
    >
      <div
        className="relative w-full max-w-[960px] overflow-hidden rounded-t-[20px] bg-card shadow-[0_40px_90px_-40px_rgba(0,22,69,0.75)] animate-scale-in sm:rounded-[20px]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Fermer"
          className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-ink/45 text-white backdrop-blur transition-colors hover:bg-ink/70"
        >
          <X className="h-4.5 w-4.5" />
        </button>

        <div className="grid md:grid-cols-2">
          {/* Visual side — mobile banner / desktop portrait */}
          <div className="relative min-h-[150px] md:min-h-full">
            <img
              src={modalMobile}
              alt=""
              width={1088}
              height={608}
              className="h-[150px] w-full object-cover object-center md:hidden"
            />
            <img
              src={modalDesktop}
              alt=""
              width={1024}
              height={1280}
              className="hidden h-full w-full object-cover md:block"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 md:p-7">
              <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-white/70">
                {t.hero.badge}
              </p>
              <p className="mt-2 text-[20px] font-semibold leading-snug text-white md:text-[26px]">
                {t.hero.title}
              </p>
              <p className="mt-2 hidden items-center gap-2 text-[14px] text-white/80 md:flex">
                <PhoneCall className="h-4 w-4" />
                {t.hero.formSub}
              </p>
            </div>
          </div>

          {/* Two-step form */}
          <div className="p-5 sm:p-7">
            <h2 className="text-[20px] font-semibold text-ink sm:text-[22px]">{t.hero.formTitle}</h2>
            <p className="mt-1 text-[14px] leading-relaxed text-muted-foreground">{t.hero.formSub}</p>
            <div className="mt-4">
              <SignupForm id="modal-signup" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}