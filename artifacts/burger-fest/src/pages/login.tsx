import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth, type Role } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function Login() {
  const { signIn, signUp } = useAuth();
  const [, navigate] = useLocation();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [role, setRole] = useState<Role>("restaurante");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === "signin") {
        await signIn(email, password);
        navigate("/");
      } else {
        await signUp(email, password, role, displayName);
        // After signup the user may need to confirm email; try immediate sign-in
        try {
          await signIn(email, password);
          navigate(role === "restaurante" ? "/registro/restaurante" : role === "patrocinador" ? "/registro/patrocinador" : "/admin");
        } catch {
          setError("Cuenta creada. Revisa tu correo para confirmarla y luego inicia sesión.");
          setMode("signin");
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            {mode === "signin" ? "Iniciar sesión" : "Crear cuenta"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="displayName">Nombre</Label>
                <Input id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
            </div>

            {mode === "signup" && (
              <div className="space-y-2">
                <Label>Tipo de cuenta</Label>
                <RadioGroup value={role} onValueChange={(v) => setRole(v as Role)} className="grid grid-cols-1 gap-2">
                  <label className="flex items-center gap-3 p-3 rounded-md border cursor-pointer">
                    <RadioGroupItem value="restaurante" id="role-r" />
                    <span>Restaurante</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 rounded-md border cursor-pointer">
                    <RadioGroupItem value="patrocinador" id="role-p" />
                    <span>Patrocinador</span>
                  </label>
                </RadioGroup>
              </div>
            )}

            {error && <p className="text-sm text-red-600">{error}</p>}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "..." : mode === "signin" ? "Iniciar sesión" : "Crear cuenta"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              {mode === "signin" ? (
                <>¿No tienes cuenta?{" "}
                  <button type="button" className="text-primary underline" onClick={() => setMode("signup")}>Regístrate</button>
                </>
              ) : (
                <>¿Ya tienes cuenta?{" "}
                  <button type="button" className="text-primary underline" onClick={() => setMode("signin")}>Inicia sesión</button>
                </>
              )}
            </p>

            <p className="text-center text-sm">
              <Link href="/" className="text-muted-foreground hover:text-foreground">← Volver al inicio</Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
