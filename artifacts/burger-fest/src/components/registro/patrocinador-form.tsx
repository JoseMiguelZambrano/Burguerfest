import { useState, useRef, type ChangeEvent } from "react";
import { useLocation } from "wouter";
import { Upload, ImageIcon, ArrowRight, Trophy, Award, Medal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuth } from "@/contexts/auth-context";
import { api, uploadFile } from "@/lib/api";

interface FormData {
  nombreEmpresa: string;
  sitioWeb: string;
  contacto: string;
  telefono: string;
  horarioContacto: string;
  nivel: "gold" | "silver" | "bronze";
}

const sponsorLevels = [
  { id: "gold",   name: "Gold",   icon: Trophy, accent: "text-brand-gold",   ring: "border-brand-gold bg-brand-gold/10",  description: "Logo en banner principal, menciones en redes, stand exclusivo" },
  { id: "silver", name: "Silver", icon: Award,  accent: "text-slate-500",    ring: "border-slate-400 bg-slate-50",        description: "Logo en materiales, menciones en redes, espacio compartido" },
  { id: "bronze", name: "Bronze", icon: Medal,  accent: "text-orange-600",   ring: "border-orange-400 bg-orange-50",      description: "Logo en materiales, mención en web oficial" },
] as const;

function SectionTitle({ children, accent = "gold" }: { children: React.ReactNode; accent?: "gold" | "flame" }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span className={`w-1.5 h-7 rounded-sm ${accent === "gold" ? "bg-brand-gold" : "bg-brand-flame"}`} />
      <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-brand-maroon">
        {children}
      </h2>
    </div>
  );
}

function FieldLabel({ htmlFor, children }: { htmlFor?: string; children: React.ReactNode }) {
  return (
    <Label htmlFor={htmlFor} className="text-xs font-bold uppercase tracking-wider text-brand-ink/70">
      {children}
    </Label>
  );
}

export function RegistroPatrocinadorForm() {
  const { session, loading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  const [formData, setFormData] = useState<FormData>({
    nombreEmpresa: "", sitioWeb: "", contacto: "", telefono: "", horarioContacto: "", nivel: "gold",
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { setLogoFile(file); setLogoPreview(URL.createObjectURL(file)); }
  };

  const handleBannerChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { setBannerFile(file); setBannerPreview(URL.createObjectURL(file)); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) { navigate("/login"); return; }
    setSubmitting(true);
    setMessage(null);
    try {
      let logo_url: string | null = null;
      let banner_url: string | null = null;
      if (logoFile) logo_url = (await uploadFile(logoFile)).url;
      if (bannerFile) banner_url = (await uploadFile(bannerFile)).url;
      await api("/sponsors", {
        method: "POST",
        json: {
          company_name: formData.nombreEmpresa,
          website: formData.sitioWeb || null,
          contact_name: formData.contacto || null,
          contact_phone: formData.telefono || null,
          contact_hours: formData.horarioContacto || null,
          logo_url, banner_url,
          tier: formData.nivel,
        },
      });
      setMessage({ kind: "ok", text: "¡Solicitud enviada! Te contactaremos tras la revisión." });
      setFormData({ nombreEmpresa: "", sitioWeb: "", contacto: "", telefono: "", horarioContacto: "", nivel: "gold" });
      setLogoFile(null); setBannerFile(null);
      if (logoPreview) URL.revokeObjectURL(logoPreview);
      if (bannerPreview) URL.revokeObjectURL(bannerPreview);
      setLogoPreview(null); setBannerPreview(null);
    } catch (err) {
      setMessage({ kind: "err", text: err instanceof Error ? err.message : "Error desconocido" });
    } finally {
      setSubmitting(false);
    }
  };

  if (!authLoading && !session) {
    return (
      <div className="p-8 text-center space-y-4">
        <p className="text-foreground">Necesitas una cuenta de patrocinador para enviar tu solicitud.</p>
        <Button
          onClick={() => navigate("/login")}
          className="bg-brand-gold hover:bg-brand-gold/90 text-brand-ink font-bold uppercase tracking-wider"
        >
          Iniciar sesión / Crear cuenta
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <section>
        <SectionTitle>Información corporativa</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <FieldLabel htmlFor="nombreEmpresa">Nombre de la empresa / marca</FieldLabel>
            <Input id="nombreEmpresa" name="nombreEmpresa" placeholder="Nombre de tu empresa" value={formData.nombreEmpresa} onChange={handleInputChange} required />
          </div>
          <div className="space-y-2">
            <FieldLabel htmlFor="sitioWeb">Sitio web oficial</FieldLabel>
            <Input id="sitioWeb" name="sitioWeb" type="url" placeholder="https://www.tuempresa.com" value={formData.sitioWeb} onChange={handleInputChange} />
          </div>
          <div className="space-y-2">
            <FieldLabel htmlFor="contacto">Nombre de contacto</FieldLabel>
            <Input id="contacto" name="contacto" placeholder="Persona de contacto" value={formData.contacto} onChange={handleInputChange} required />
          </div>
          <div className="space-y-2">
            <FieldLabel htmlFor="telefono">Teléfono (WhatsApp)</FieldLabel>
            <Input id="telefono" name="telefono" type="tel" placeholder="+58 412 1234567" value={formData.telefono} onChange={handleInputChange} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <FieldLabel htmlFor="horarioContacto">Horario de contacto</FieldLabel>
            <Input id="horarioContacto" name="horarioContacto" placeholder="Ej: 9:00 - 18:00" value={formData.horarioContacto} onChange={handleInputChange} />
          </div>
        </div>
      </section>

      <section>
        <SectionTitle>Material visual</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <FieldLabel>
              <span className="inline-flex items-center gap-1.5"><ImageIcon className="w-3.5 h-3.5" />Logo principal (PNG transparente)</span>
            </FieldLabel>
            <div
              className="border-2 border-dashed border-brand-maroon/30 bg-brand-cream/30 rounded-xl p-6 text-center cursor-pointer hover:border-brand-gold hover:bg-brand-gold/5 transition-all aspect-square flex flex-col items-center justify-center"
              onClick={() => logoInputRef.current?.click()}
            >
              <input ref={logoInputRef} type="file" accept="image/png" onChange={handleLogoChange} className="hidden" />
              {logoPreview ? (
                <img src={logoPreview} alt="Logo preview" className="w-full h-full object-contain" />
              ) : (
                <>
                  <Upload className="w-8 h-8 mx-auto text-brand-maroon mb-2" />
                  <p className="text-sm text-muted-foreground">Haz clic para subir</p>
                </>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <FieldLabel>
              <span className="inline-flex items-center gap-1.5"><ImageIcon className="w-3.5 h-3.5" />Banner publicitario</span>
            </FieldLabel>
            <div
              className="border-2 border-dashed border-brand-maroon/30 bg-brand-cream/30 rounded-xl p-6 text-center cursor-pointer hover:border-brand-gold hover:bg-brand-gold/5 transition-all aspect-video flex flex-col items-center justify-center"
              onClick={() => bannerInputRef.current?.click()}
            >
              <input ref={bannerInputRef} type="file" accept="image/png,image/jpeg" onChange={handleBannerChange} className="hidden" />
              {bannerPreview ? (
                <img src={bannerPreview} alt="Banner preview" className="w-full h-full object-contain" />
              ) : (
                <>
                  <Upload className="w-8 h-8 mx-auto text-brand-maroon mb-2" />
                  <p className="text-sm text-muted-foreground">Haz clic para subir</p>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <section>
        <SectionTitle>Nivel de patrocinio</SectionTitle>
        <RadioGroup
          value={formData.nivel}
          onValueChange={(v) => setFormData((p) => ({ ...p, nivel: v as FormData["nivel"] }))}
          className="space-y-3"
        >
          {sponsorLevels.map((level) => (
            <label
              key={level.id}
              className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                formData.nivel === level.id
                  ? level.ring
                  : "border-border hover:border-brand-maroon/40"
              }`}
            >
              <RadioGroupItem value={level.id} id={level.id} />
              <level.icon className={`w-8 h-8 ${level.accent}`} />
              <div className="flex-1">
                <p className="font-display text-xl tracking-wide text-brand-ink">{level.name}</p>
                <p className="text-sm text-muted-foreground">{level.description}</p>
              </div>
            </label>
          ))}
        </RadioGroup>
      </section>

      {message && (
        <div className={`p-4 rounded-xl text-sm border ${
          message.kind === "ok"
            ? "bg-emerald-50 text-emerald-800 border-emerald-200"
            : "bg-brand-flame/10 text-brand-flame border-brand-flame/30"
        }`}>
          {message.text}
        </div>
      )}

      <div className="flex justify-end pt-2">
        <Button
          type="submit"
          size="lg"
          className="min-w-56 h-12 bg-brand-gold hover:bg-brand-gold/90 text-brand-ink font-bold uppercase tracking-wider shadow-lg shadow-brand-gold/20"
          disabled={submitting}
        >
          {submitting ? "Enviando..." : "Enviar registro"}
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </form>
  );
}
