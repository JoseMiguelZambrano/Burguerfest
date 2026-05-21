import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowLeft, Flame } from "lucide-react";
import { useAuth, type Role } from "@/contexts/auth-context";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function Login() {
  const { signIn, signUp, session, role: currentRole } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!session) return;
    if (currentRole === "admin") navigate("/admin");
    else if (currentRole === "restaurante") navigate("/registro/restaurante");
    else if (currentRole === "patrocinador") navigate("/registro/patrocinador");
    else navigate("/");
  }, [session, currentRole, navigate]);

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [signupRole, setSignupRole] = useState<Role>("restaurante");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === "signin") {
        await signIn(email, password);
      } else {
        await signUp(email, password, signupRole, displayName);
        try {
          await signIn(email, password);
        } catch {
          setError("Cuenta creada. Revisa tu correo para confirmarla y luego inicia sesión.");
          setMode("signin");
        }
      }
      void supabase;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background bg-grain">
      {/* Branded top strip */}
      <div className="bg-brand-ink text-brand-cream">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-9 flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <Flame className="w-3.5 h-3.5 text-brand-gold" />
            <span className="font-medium tracking-wide">21 – 30 Junio 2026 · SC Pabellones</span>
          </div>
          <Link href="/" className="hidden sm:flex items-center gap-1 text-brand-cream/70 hover:text-brand-gold transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            Volver al inicio
          </Link>
        </div>
      </div>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Brand block */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-3 mb-5">
              <div className="relative w-14 h-14 rounded-full overflow-hidden ring-2 ring-brand-gold/60 bg-brand-ink">
                <img
                  src="https://res.cloudinary.com/ddqarpruz/image/upload/v1779351381/burger-fest/seed/logo-dark.jpg"
                  alt="Burger Fest"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </Link>
            <h1 className="font-display text-5xl text-brand-ink leading-none mb-2">
              {mode === "signin" ? "Bienvenido" : "Únete al fuego"}
            </h1>
            <div className="w-14 h-1 bg-brand-flame mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              {mode === "signin"
                ? "Accede a tu cuenta de Burger Fest"
                : "Crea tu cuenta para participar en la edición 2026"}
            </p>
          </div>

          <div className="bg-card rounded-2xl border border-border shadow-xl shadow-brand-maroon/5 p-7">
            <form onSubmit={handleSubmit} className="space-y-5">
              {mode === "signup" && (
                <div className="space-y-2">
                  <Label htmlFor="displayName" className="text-xs font-bold uppercase tracking-wider text-brand-ink/70">
                    Nombre
                  </Label>
                  <Input id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-brand-ink/70">
                  Email
                </Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-brand-ink/70">
                  Contraseña
                </Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
              </div>

              {mode === "signup" && (
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-brand-ink/70">
                    Tipo de cuenta
                  </Label>
                  <RadioGroup value={signupRole} onValueChange={(v) => setSignupRole(v as Role)} className="grid grid-cols-1 gap-2">
                    <label className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-brand-flame hover:bg-brand-flame/5 cursor-pointer transition-colors">
                      <RadioGroupItem value="restaurante" id="role-r" />
                      <span className="font-medium">Restaurante</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-brand-gold hover:bg-brand-gold/5 cursor-pointer transition-colors">
                      <RadioGroupItem value="patrocinador" id="role-p" />
                      <span className="font-medium">Patrocinador</span>
                    </label>
                  </RadioGroup>
                </div>
              )}

              {error && (
                <p className="text-sm text-brand-flame bg-brand-flame/10 border border-brand-flame/30 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                className="w-full h-11 bg-brand-flame hover:bg-brand-flame/90 text-brand-cream font-bold uppercase tracking-wider shadow-lg shadow-brand-flame/20"
                disabled={loading}
              >
                {loading ? "..." : mode === "signin" ? "Iniciar sesión" : "Crear cuenta"}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                {mode === "signin" ? (
                  <>¿No tienes cuenta?{" "}
                    <button type="button" className="text-brand-maroon font-semibold hover:text-brand-flame underline-offset-4 hover:underline" onClick={() => setMode("signup")}>
                      Regístrate
                    </button>
                  </>
                ) : (
                  <>¿Ya tienes cuenta?{" "}
                    <button type="button" className="text-brand-maroon font-semibold hover:text-brand-flame underline-offset-4 hover:underline" onClick={() => setMode("signin")}>
                      Inicia sesión
                    </button>
                  </>
                )}
              </p>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
