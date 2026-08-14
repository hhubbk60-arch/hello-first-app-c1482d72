/** Base URL of the PHP back-office APIs. */
export const API_BASE = "https://ttshop.pro/backend";

async function post<T>(file: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}/${file}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = (await res.json().catch(() => ({}))) as T & { success?: boolean; message?: string };
  if (!res.ok || json.success === false) throw new Error(json.message ?? "Request failed");
  return json;
}

export type LeadPayload = Record<string, unknown>;

export function insertLead(payload: LeadPayload) {
  return post<{ id: number; uuid: string; duplicate: boolean }>("leads_insert.php", payload);
}

export function insertVisitor(payload: Record<string, unknown>) {
  return post<{ id: number }>("visitors_insert.php", payload);
}

/** ---- Back-office panel (shared key) ---- */
async function getJson<T>(file: string, params: Record<string, string>): Promise<T> {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/${file}?${qs}`);
  const json = (await res.json().catch(() => ({}))) as T & { success?: boolean; message?: string };
  if (!res.ok || json.success === false) throw new Error(json.message ?? "Request failed");
  return json;
}

export type LeadRow = Record<string, string | number | null>;
export type VisitorRow = Record<string, string | number | null>;

export type LeadsResponse = {
  rows: LeadRow[];
  stats: Record<string, number | null>;
  byGovernorate: { gov: string; c: number }[];
};

export type VisitorsResponse = {
  rows: VisitorRow[];
  stats: Record<string, number | null>;
  byCountry: { code: string | null; name: string | null; c: number; u: number }[];
  byDevice: { device: string | null; c: number }[];
  byPage: { page: string | null; c: number }[];
  timeline: { d: string; c: number }[];
};

export function fetchLeads(key: string, search = "") {
  return getJson<LeadsResponse>("leads_list.php", { key, search, limit: "500" });
}

export function fetchVisitors(key: string, search = "") {
  return getJson<VisitorsResponse>("visitors_list.php", { key, search, limit: "500" });
}