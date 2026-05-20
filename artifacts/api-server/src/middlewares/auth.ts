import type { Request, Response, NextFunction } from "express";
import { supabaseAnon, supabaseAdmin, type Role } from "../lib/supabase";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string | undefined;
        role: Role;
      };
    }
  }
}

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Missing bearer token" });

  const { data, error } = await supabaseAnon.auth.getUser(token);
  if (error || !data.user) {
    return res.status(401).json({ error: "Invalid token" });
  }

  const { data: profile, error: profErr } = await supabaseAdmin
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .maybeSingle();

  if (profErr) {
    req.log?.error({ err: profErr }, "profile lookup failed");
    return res.status(500).json({ error: "Profile lookup failed" });
  }

  req.user = {
    id: data.user.id,
    email: data.user.email,
    role: (profile?.role as Role) ?? "restaurante",
  };
  next();
}

export function requireRole(...roles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden" });
    }
    next();
  };
}

export async function optionalAuth(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return next();
  const { data } = await supabaseAnon.auth.getUser(token);
  if (data.user) {
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .maybeSingle();
    req.user = {
      id: data.user.id,
      email: data.user.email,
      role: (profile?.role as Role) ?? "restaurante",
    };
  }
  next();
}
