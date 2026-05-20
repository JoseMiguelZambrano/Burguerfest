import { Router, type IRouter } from "express";
import { z } from "zod";
import { requireAuth, requireRole } from "../middlewares/auth";
import { supabaseAdmin } from "../lib/supabase";

const router: IRouter = Router();

const EventInput = z.object({
  title: z.string().min(1),
  description: z.string().optional().nullable(),
  event_date: z.string().optional().nullable(),
  image_url: z.string().url().optional().nullable(),
  display_order: z.number().int().optional(),
});

router.get("/events", async (_req, res) => {
  const { data, error } = await supabaseAdmin
    .from("events")
    .select("*")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json({ items: data ?? [] });
});

router.post(
  "/admin/events",
  requireAuth,
  requireRole("admin"),
  async (req, res) => {
    const parsed = EventInput.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid input" });
    const { data, error } = await supabaseAdmin
      .from("events")
      .insert(parsed.data)
      .select()
      .single();
    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json(data);
  },
);

router.patch(
  "/admin/events/:id",
  requireAuth,
  requireRole("admin"),
  async (req, res) => {
    const parsed = EventInput.partial().safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid input" });
    const { data, error } = await supabaseAdmin
      .from("events")
      .update(parsed.data)
      .eq("id", req.params.id)
      .select()
      .single();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  },
);

router.delete(
  "/admin/events/:id",
  requireAuth,
  requireRole("admin"),
  async (req, res) => {
    const { error } = await supabaseAdmin
      .from("events")
      .delete()
      .eq("id", req.params.id);
    if (error) return res.status(500).json({ error: error.message });
    res.status(204).end();
  },
);

export default router;
