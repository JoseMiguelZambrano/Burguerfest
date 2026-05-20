import { Router, type IRouter } from "express";
import { requireAuth } from "../middlewares/auth";
import { supabaseAdmin } from "../lib/supabase";

const router: IRouter = Router();

router.get("/me", requireAuth, async (req, res) => {
  const { data: profile, error } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .eq("id", req.user!.id)
    .maybeSingle();
  if (error) return res.status(500).json({ error: error.message });
  res.json({
    id: req.user!.id,
    email: req.user!.email,
    role: req.user!.role,
    profile,
  });
});

export default router;
