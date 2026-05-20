import { supabase } from "./supabase";

const BASE = "/api";

async function authHeaders(): Promise<Record<string, string>> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function api<T = unknown>(
  path: string,
  init: RequestInit & { json?: unknown } = {},
): Promise<T> {
  const headers: Record<string, string> = {
    ...(init.json ? { "Content-Type": "application/json" } : {}),
    ...(await authHeaders()),
    ...((init.headers as Record<string, string>) ?? {}),
  };
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers,
    body: init.json !== undefined ? JSON.stringify(init.json) : init.body,
  });
  if (!res.ok) {
    let detail = "";
    try {
      const data = await res.json();
      detail = data.error ?? JSON.stringify(data);
    } catch {
      detail = await res.text();
    }
    throw new Error(`HTTP ${res.status}: ${detail}`);
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export async function uploadFile(file: File): Promise<{ url: string; publicId: string }> {
  const fd = new FormData();
  fd.append("file", file);
  const headers = await authHeaders();
  const res = await fetch(`${BASE}/uploads`, { method: "POST", body: fd, headers });
  if (!res.ok) throw new Error(`Upload failed: ${await res.text()}`);
  return await res.json();
}
