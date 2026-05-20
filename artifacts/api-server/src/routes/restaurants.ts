import { Router, type IRouter } from "express";
import { z } from "zod";
import { requireAuth, requireRole } from "../middlewares/auth";
import { supabaseAdmin } from "../lib/supabase";

const router: IRouter = Router();

const RestaurantInput = z.object({
  name: z.string().min(1),
  location: z.string().min(1),
  schedule: z.string().optional().nullable(),
  signature_dish: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  instagram: z.string().optional().nullable(),
  facebook: z.string().optional().nullable(),
  logo_url: z.string().url().optional().nullable(),
  video_url: z.string().url().optional().nullable(),
});

// Public: featured/approved restaurants for the landing page
router.get("/restaurants", async (_req, res) => {
  const { data, error } = await supabaseAdmin
    .from("restaurants")
    .select("*")
    .eq("status", "approved")
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json({ items: data ?? [] });
});

// Authenticated restaurant owners submit their registration
router.post(
  "/restaurants",
  requireAuth,
  requireRole("restaurante", "admin"),
  async (req, res) => {
    const parsed = RestaurantInput.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid input", details: parsed.error.flatten() });
    }
    const { data, error } = await supabaseAdmin
      .from("restaurants")
      .insert({ ...parsed.data, owner_id: req.user!.id, status: "pending" })
      .select()
      .single();
    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json(data);
  },
);

// Admin: list all (any status)
router.get(
  "/admin/restaurants",
  requireAuth,
  requireRole("admin"),
  async (_req, res) => {
    const { data, error } = await supabaseAdmin
      .from("restaurants")
      .select("*, profiles(email, display_name)")
      .order("created_at", { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    res.json({ items: data ?? [] });
  },
);

// Admin: update status / featured
router.patch(
  "/admin/restaurants/:id",
  requireAuth,
  requireRole("admin"),
  async (req, res) => {
    const schema = z.object({
      status: z.enum(["pending", "approved", "rejected"]).optional(),
      featured: z.boolean().optional(),
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid input" });
    const { data, error } = await supabaseAdmin
      .from("restaurants")
      .update(parsed.data)
      .eq("id", req.params.id)
      .select()
      .single();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  },
);

router.delete(
  "/admin/restaurants/:id",
  requireAuth,
  requireRole("admin"),
  async (req, res) => {
    const { error } = await supabaseAdmin
      .from("restaurants")
      .delete()
      .eq("id", req.params.id);
    if (error) return res.status(500).json({ error: error.message });
    res.status(204).end();
  },
);

export default router;
