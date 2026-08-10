import { insertVisitor } from "./api";

const VISITOR_KEY = "ttshop-visitor-id";
const SESSION_KEY = "ttshop-session-id";

function uuid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now().toString(16)}-${Math.random().toString(16).slice(2, 10)}`;
}

function readId(store: Storage, key: string): string {
  const existing = store.getItem(key);
  if (existing) return existing;
  const next = uuid();
  store.setItem(key, next);
  return next;
}

/** Stable per-browser visitor id, reused by lead submissions. */
export function getVisitorId(): string | null {
  try {
    return readId(localStorage, VISITOR_KEY);
  } catch {
    return null;
  }
}

export function getSessionId(): string | null {
  try {
    return readId(sessionStorage, SESSION_KEY);
  } catch {
    return null;
  }
}

export function readUtm(): Record<string, string> {
  const out: Record<string, string> = {};
  const p = new URLSearchParams(window.location.search);
  for (const k of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "gclid", "fbclid"]) {
    const v = p.get(k);
    if (v) out[k] = v;
  }
  if (document.referrer) out["referrer"] = document.referrer;
  return out;
}

/** Logs the page view, then keeps time-on-page / scroll depth up to date. */
export function trackPageView(): () => void {
  const visitorId = getVisitorId();
  const sessionId = getSessionId();
  if (!visitorId) return () => {};

  const startedAt = Date.now();
  let scrollDepth = 0;
  const onScroll = () => {
    const height = document.documentElement.scrollHeight - window.innerHeight;
    const pct = height > 0 ? Math.round(((window.scrollY || 0) / height) * 100) : 100;
    scrollDepth = Math.min(100, Math.max(scrollDepth, pct));
  };
  window.addEventListener("scroll", onScroll, { passive: true });

  const base = () => ({
    visitorId,
    sessionId,
    page: window.location.pathname,
    pageTitle: document.title,
    lang: document.documentElement.lang || navigator.language,
    screen: `${window.screen.width}x${window.screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    timeOnPage: Math.round((Date.now() - startedAt) / 1000),
    scrollDepth,
    ...readUtm(),
  });

  void insertVisitor(base()).catch(() => {});

  const flush = () => {
    void insertVisitor(base()).catch(() => {});
  };
  const onHidden = () => document.visibilityState === "hidden" && flush();
  document.addEventListener("visibilitychange", onHidden);
  const timer = window.setInterval(flush, 30000);

  return () => {
    flush();
    window.clearInterval(timer);
    window.removeEventListener("scroll", onScroll);
    document.removeEventListener("visibilitychange", onHidden);
  };
}