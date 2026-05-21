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
      return res.status(400).json({ error: "Invalid input", details: parsed.error.flatten() });
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
    if (!parsed.success) return res.status(400).json({ error: "Invalid input" });
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
    if (!sponsor) return res.status(404).json({ error: "Sponsor not found" });
    if (sponsor.status !== "approved") {
      return res.status(400).json({ error: "El patrocinador debe estar aprobado" });
    }

    // Try a few times in case of unique collision
    let code = sponsor.accreditation_code as string | null;
    if (!code) {
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
    }
    res.json({ code });
  },
);

// Scanner endpoint — PIN-protected, no Supabase auth required
const ScanInput = z.object({
  code: z.string().min(1),
  pin: z.string().min(1),
});

router.post("/scan", async (req, res) => {
  const parsed = ScanInput.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Datos inválidos" });

  const expected = getScannerPin();
  if (!expected) {
    return res.status(503).json({ error: "Scanner no configurado (falta SCANNER_PIN)" });
  }
  if (parsed.data.pin !== expected) {
    return res.status(401).json({ error: "PIN incorrecto" });
  }

  const { data: sponsor, error } = await supabaseAdmin
    .from("sponsors")
    .select("id, company_name, contact_name, tier, status, accreditation_used, accreditation_used_at")
    .eq("accreditation_code", parsed.data.code.trim())
    .maybeSingle();

  if (error) return res.status(500).json({ error: error.message });
  if (!sponsor) {
    return res.status(404).json({ status: "invalid", error: "Código no válido" });
  }
  if (sponsor.status !== "approved") {
    return res.status(403).json({ status: "invalid", error: "Patrocinador no aprobado" });
  }

  if (sponsor.accreditation_used) {
    return res.json({
      status: "already_used",
      sponsor: {
        company_name: sponsor.company_name,
        contact_name: sponsor.contact_name,
        tier: sponsor.tier,
        used_at: sponsor.accreditation_used_at,
      },
    });
  }

  const now = new Date().toISOString();
  const { error: updErr } = await supabaseAdmin
    .from("sponsors")
    .update({ accreditation_used: true, accreditation_used_at: now })
    .eq("id", sponsor.id);
  if (updErr) return res.status(500).json({ error: updErr.message });

  res.json({
    status: "valid",
    sponsor: {
      company_name: sponsor.company_name,
      contact_name: sponsor.contact_name,
      tier: sponsor.tier,
      used_at: now,
    },
  });
});

// PIN verification only (used to unlock scanner UI without scanning)
router.post("/scan/verify-pin", (req, res) => {
  const expected = getScannerPin();
  if (!expected) return res.status(503).json({ error: "Scanner no configurado" });
  if ((req.body?.pin ?? "") !== expected) {
    return res.status(401).json({ error: "PIN incorrecto" });
  }
  res.json({ ok: true });
});

export default router;
