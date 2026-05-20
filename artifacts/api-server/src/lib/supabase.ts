import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const strip = (v: string | undefined, name: string): string => {
  const raw = (v ?? "").trim();
  return raw.startsWith(`${name}=`) ? raw.slice(name.length + 1) : raw;
};
const url = strip(process.env.SUPABASE_URL, "SUPABASE_URL");
const serviceKey = strip(process.env.SUPABASE_SERVICE_ROLE_KEY, "SUPABASE_SERVICE_ROLE_KEY");
const anonKey = strip(process.env.SUPABASE_ANON_KEY, "SUPABASE_ANON_KEY");

if (!url || !serviceKey || !anonKey) {
  throw new Error(
    "SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY and SUPABASE_ANON_KEY are required",
  );
}

export const supabaseAdmin: SupabaseClient = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

export const supabaseAnon: SupabaseClient = createClient(url, anonKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

export type Role = "admin" | "restaurante" | "patrocinador";
export type SubmissionStatus = "pending" | "approved" | "rejected";
export type SponsorTier = "gold" | "silver" | "bronze";
