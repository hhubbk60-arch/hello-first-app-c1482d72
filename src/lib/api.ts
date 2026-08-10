/** Base URL of the PHP back-office APIs. */
export const API_BASE = "https://erp.ttshop.pro/code_source/backend/php";

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