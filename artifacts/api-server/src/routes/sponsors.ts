import { Router, type IRouter } from "express";
import { z } from "zod";
import { randomBytes } from "crypto";
import { requireAuth, requireRole } from "../middlewares/auth";
import { supabaseAdmin } from "../lib/supabase";

const router: IRouter = Router();

const SponsorInput = z.object({
  company_name: z.string().min(1),
  website: z.string().url().optional().nullable(),
  contact_name: z.string().optional().nullable(),
  contact_phone: z.string().optional().nullable(),
  contact_hours: z.string().optional().nullable(),
  logo_url: z.string().url().optional().nullable(),
  banner_url: z.string().url().optional().nullable(),
  tier: z.enum(["gold", "silver", "bronze"]).default("bronze"),
});

function genCode(): string {
  return `BF26-${randomBytes(4).toString("hex")}`;
}

function getScannerPin(): string {
  return (process.env.SCANNER_PIN ?? "").trim();
}

// ── Simple in-memory rate limiter for PIN attempts (per IP) ──
type Attempt = { count: number; firstAt: number; lockedUntil: number };
const pinAttempts = new Map<string, Attempt>();
const PIN_WINDOW_MS = 5 * 60_000;   // 5 minutes
const PIN_MAX = 8;                  // attempts per window
const PIN_LOCK_MS = 10 * 60_000;    // 10 minute lockout

function clientIp(req: { ip?: string; headers: Record<string, unknown> }): string {
  const fwd = req.headers["x-forwarded-for"];
  if (typeof fwd === "string" && fwd.length > 0) return fwd.split(",")[0]!.trim();
  return req.ip ?? "unknown";
}

function checkPinLock(ip: string): { locked: boolean; retryInSec?: number } {
  const a = pinAttempts.get(ip);
  if (!a) return { locked: false };
  const now = Date.now();
  if (a.lockedUntil > now) {
    return { locked: true, retryInSec: Math.ceil((a.lockedUntil - now) / 1000) };
  }
  if (now - a.firstAt > PIN_WINDOW_MS) {
    pinAttempts.delete(ip);
  }
  return { locked: false };
}

function registerPinFailure(ip: string) {
  const now = Date.now();
  const a = pinAttempts.get(ip);
  if (!a || now - a.firstAt > PIN_WINDOW_MS) {
    pinAttempts.set(ip, { count: 1, firstAt: now, lockedUntil: 0 });
    return;
  }
  a.count += 1;
  if (a.count >= PIN_MAX) a.lockedUntil = now + PIN_LOCK_MS;
}

function clearPinFailures(ip: string) {
  pinAttempts.delete(ip);
}

router.get("/sponsors", async (_req, res) => {
  const { data, error } = await supabaseAdmin
    .from("sponsors")
    .select("id, company_name, website, contact_name, logo_url, banner_url, tier, created_at")
    .eq("status", "approved")
    .order("tier", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json({ items: data ?? [] });
});

// Public lookup by accreditation code (used by /acreditar/:code page)
router.get("/sponsors/accreditation/:code", async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from("sponsors")
    .select("id, company_name, contact_name, tier, status, accreditation_used, accreditation_used_at")
    .eq("accreditation_code", req.params.code)
    .maybeSingle();
  if (error) return res.status(500).json({ error: error.message });
  if (!data) return res.status(404).json({ error: "Código no encontrado" });
  if (data.status !== "approved") {
    return res.status(403).json({ error: "Patrocinador aún no aprobado" });
  }
  res.json({
    code: req.params.code,
    company_name: data.company_name,
    contact_name: data.contact_name,
    tier: data.tier,
    used: data.accreditation_used,
    used_at: data.accreditation_used_at,
  });
});

router.post(
  "/sponsors",
  requireAuth,
  requireRole("patrocinador", "admin"),
  async (req, res) => {
    const parsed = SponsorInput.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Datos inválidos", details: parsed.error.flatten() });
    }
    const { data, error } = await supabaseAdmin
      .from("sponsors")
      .insert({ ...parsed.data, owner_id: req.user!.id, status: "pending" })
      .select()
      .single();
    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json(data);
  },
);

router.get(
  "/admin/sponsors",
  requireAuth,
  requireRole("admin"),
  async (_req, res) => {
    const { data, error } = await supabaseAdmin
      .from("sponsors")
      .select("*, profiles(email, display_name, phone)")
      .order("created_at", { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    res.json({ items: data ?? [] });
  },
);

router.patch(
  "/admin/sponsors/:id",
  requireAuth,
  requireRole("admin"),
  async (req, res) => {
    const schema = z.object({
      status: z.enum(["pending", "approved", "rejected"]).optional(),
      tier: z.enum(["gold", "silver", "bronze"]).optional(),
      contact_phone: z.string().optional().nullable(),
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Datos inválidos" });
    const { data, error } = await supabaseAdmin
      .from("sponsors")
      .update(parsed.data)
      .eq("id", req.params.id)
      .select()
      .single();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  },
);

router.delete(
  "/admin/sponsors/:id",
  requireAuth,
  requireRole("admin"),
  async (req, res) => {
    const { error } = await supabaseAdmin
      .from("sponsors")
      .delete()
      .eq("id", req.params.id);
    if (error) return res.status(500).json({ error: error.message });
    res.status(204).end();
  },
);

// Admin: generate (or rotate) accreditation code for a sponsor
router.post(
  "/admin/sponsors/:id/accreditation-code",
  requireAuth,
  requireRole("admin"),
  async (req, res) => {
    const { data: sponsor, error: e1 } = await supabaseAdmin
      .from("sponsors")
      .select("id, status, accreditation_code")
      .eq("id", req.params.id)
      .maybeSingle();
    if (e1) return res.status(500).json({ error: e1.message });
    if (!sponsor) return res.status(404).json({ error: "Patrocinador no encontrado" });
    if (sponsor.status !== "approved") {
      return res.status(400).json({ error: "El patrocinador debe estar aprobado" });
    }

    // Always (re)generate when this endpoint is called — UI contract is rotation.
    // Retry a few times in case of unique collision.
    let code: string | null = null;
    for (let i = 0; i < 5; i++) {
      const candidate = genCode();
      const { data: upd, error: e2 } = await supabaseAdmin
        .from("sponsors")
        .update({
          accreditation_code: candidate,
          accreditation_used: false,
          accreditation_used_at: null,
        })
        .eq("id", req.params.id)
        .select("accreditation_code")
        .single();
      if (!e2 && upd?.accreditation_code) {
        code = upd.accreditation_code;
        break;
      }
    }
    if (!code) return res.status(500).json({ error: "No se pudo generar código" });
    res.json({ code });
  },
);

// Scanner endpoint — PIN-protected, no Supabase auth required
const ScanInput = z.object({
  code: z.string().min(1),
  pin: z.string().min(1),
});

router.post("/scan", async (req, res) => {
  const ip = clientIp(req);
  const lock = checkPinLock(ip);
  if (lock.locked) {
    return res.status(429).json({ error: `Demasiados intentos. Vuelve a intentar en ${lock.retryInSec}s` });
  }

  const parsed = ScanInput.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Datos inválidos" });

  const expected = getScannerPin();
  if (!expected) {
    return res.status(503).json({ error: "Scanner no configurado (falta SCANNER_PIN)" });
  }
  if (parsed.data.pin !== expected) {
    registerPinFailure(ip);
    return res.status(401).json({ error: "PIN incorrecto" });
  }
  clearPinFailures(ip);

  const code = parsed.data.code.trim();
  const now = new Date().toISOString();

  // Atomic claim: only succeeds if approved AND not yet used.
  const { data: claimed, error: claimErr } = await supabaseAdmin
    .from("sponsors")
    .update({ accreditation_used: true, accreditation_used_at: now })
    .eq("accreditation_code", code)
    .eq("status", "approved")
    .eq("accreditation_used", false)
    .select("company_name, contact_name, tier")
    .maybeSingle();

  if (claimErr) return res.status(500).json({ error: claimErr.message });

  if (claimed) {
    return res.json({
      status: "valid",
      sponsor: {
        company_name: claimed.company_name,
        contact_name: claimed.contact_name,
        tier: claimed.tier,
        used_at: now,
      },
    });
  }

  // Claim failed — figure out why for a helpful message.
  const { data: existing, error: lookupErr } = await supabaseAdmin
    .from("sponsors")
    .select("company_name, contact_name, tier, status, accreditation_used, accreditation_used_at")
    .eq("accreditation_code", code)
    .maybeSingle();

  if (lookupErr) return res.status(500).json({ error: lookupErr.message });
  if (!existing) return res.status(404).json({ status: "invalid", error: "Código no válido" });
  if (existing.status !== "approved") {
    return res.status(403).json({ status: "invalid", error: "Patrocinador no aprobado" });
  }
  return res.json({
    status: "already_used",
    sponsor: {
      company_name: existing.company_name,
      contact_name: existing.contact_name,
      tier: existing.tier,
      used_at: existing.accreditation_used_at,
    },
  });
});

// PIN verification only (used to unlock scanner UI without scanning)
router.post("/scan/verify-pin", (req, res) => {
  const ip = clientIp(req);
  const lock = checkPinLock(ip);
  if (lock.locked) {
    return res.status(429).json({ error: `Demasiados intentos. Vuelve a intentar en ${lock.retryInSec}s` });
  }
  const expected = getScannerPin();
  if (!expected) return res.status(503).json({ error: "Scanner no configurado" });
  if ((req.body?.pin ?? "") !== expected) {
    registerPinFailure(ip);
    return res.status(401).json({ error: "PIN incorrecto" });
  }
  clearPinFailures(ip);
  res.json({ ok: true });
});

export default router;
