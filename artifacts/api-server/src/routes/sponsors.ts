import { Router, type IRouter } from "express";
import { z } from "zod";
import { requireAuth, requireRole } from "../middlewares/auth";
import { supabaseAdmin } from "../lib/supabase";

const router: IRouter = Router();

const SponsorInput = z.object({
  company_name: z.string().min(1),
  website: z.string().url().optional().nullable(),
  contact_name: z.string().optional().nullable(),
  contact_hours: z.string().optional().nullable(),
  logo_url: z.string().url().optional().nullable(),
  banner_url: z.string().url().optional().nullable(),
  tier: z.enum(["gold", "silver", "bronze"]).default("bronze"),
});

router.get("/sponsors", async (_req, res) => {
  const { data, error } = await supabaseAdmin
    .from("sponsors")
    .select("*")
    .eq("status", "approved")
    .order("tier", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json({ items: data ?? [] });
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
      .select("*, profiles(email, display_name)")
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

export default router;
