import { Router, type IRouter } from "express";
import { requireAuth, requireRole } from "../middlewares/auth";
import { supabaseAdmin } from "../lib/supabase";

const router: IRouter = Router();

// Admin: unified pending submissions feed (restaurantes + patrocinadores)
router.get(
  "/admin/submissions",
  requireAuth,
  requireRole("admin"),
  async (_req, res) => {
    const [restaurants, sponsors] = await Promise.all([
      supabaseAdmin
        .from("restaurants")
        .select("*, profiles(email, display_name)")
        .eq("status", "pending")
        .order("created_at", { ascending: false }),
      supabaseAdmin
        .from("sponsors")
        .select("*, profiles(email, display_name)")
        .eq("status", "pending")
        .order("created_at", { ascending: false }),
    ]);
    if (restaurants.error) return res.status(500).json({ error: restaurants.error.message });
    if (sponsors.error)    return res.status(500).json({ error: sponsors.error.message });
    res.json({
      restaurants: restaurants.data ?? [],
      sponsors: sponsors.data ?? [],
    });
  },
);

// Admin: list all participants (all profiles with their role)
router.get(
  "/admin/participants",
  requireAuth,
  requireRole("admin"),
  async (_req, res) => {
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    res.json({ items: data ?? [] });
  },
);

router.delete(
  "/admin/participants/:id",
  requireAuth,
  requireRole("admin"),
  async (req, res) => {
    const { error } = await supabaseAdmin.auth.admin.deleteUser(req.params.id);
    if (error) return res.status(500).json({ error: error.message });
    res.status(204).end();
  },
);

export default router;
