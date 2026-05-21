import { useState, useRef, type ChangeEvent } from "react";
import { useLocation } from "wouter";
import { Upload, Trash2, Play, Instagram, Facebook, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/auth-context";
import { api, uploadFile } from "@/lib/api";

interface FormData {
  nombreComercial: string;
  platoEstrella: string;
  ubicacion: string;
  horario: string;
  instagram: string;
  facebook: string;
  descripcion: string;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span className="w-1.5 h-7 bg-brand-flame rounded-sm" />
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

export function RegistroRestauranteForm() {
  const { session, loading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  const [formData, setFormData] = useState<FormData>({
    nombreComercial: "", platoEstrella: "", ubicacion: "", horario: "",
    instagram: "", facebook: "", descripcion: "",
  });

  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleVideoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  const removeVideo = () => {
    setVideoFile(null);
    if (videoPreview) URL.revokeObjectURL(videoPreview);
    setVideoPreview(null);
    if (videoInputRef.current) videoInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) { navigate("/login"); return; }
    setSubmitting(true);
    setMessage(null);
    try {
      let video_url: string | null = null;
      if (videoFile) video_url = (await uploadFile(videoFile)).url;
      await api("/restaurants", {
        method: "POST",
        json: {
          name: formData.nombreComercial,
          location: formData.ubicacion,
          schedule: formData.horario,
          signature_dish: formData.platoEstrella,
          description: formData.descripcion,
          instagram: formData.instagram || null,
          facebook: formData.facebook || null,
          video_url,
        },
      });
      setMessage({ kind: "ok", text: "¡Solicitud enviada! Recibirás una respuesta tras la revisión." });
      setFormData({ nombreComercial: "", platoEstrella: "", ubicacion: "", horario: "", instagram: "", facebook: "", descripcion: "" });
      removeVideo();
    } catch (err) {
      setMessage({ kind: "err", text: err instanceof Error ? err.message : "Error desconocido" });
    } finally {
      setSubmitting(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  if (!authLoading && !session) {
    return (
      <div className="p-8 text-center space-y-4">
        <p className="text-foreground">Necesitas una cuenta para inscribir tu restaurante.</p>
        <Button
          onClick={() => navigate("/login")}
          className="bg-brand-flame hover:bg-brand-flame/90 text-brand-cream font-bold uppercase tracking-wider"
        >
          Iniciar sesión / Crear cuenta
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <section>
        <SectionTitle>Datos generales</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <FieldLabel htmlFor="nombreComercial">Nombre comercial</FieldLabel>
            <Input id="nombreComercial" name="nombreComercial" placeholder="Nombre de tu restaurante" value={formData.nombreComercial} onChange={handleInputChange} required />
          </div>
          <div className="space-y-2">
            <FieldLabel htmlFor="platoEstrella">Plato estrella</FieldLabel>
            <Input id="platoEstrella" name="platoEstrella" placeholder="Tu mejor hamburguesa" value={formData.platoEstrella} onChange={handleInputChange} required />
          </div>
          <div className="space-y-2">
            <FieldLabel htmlFor="ubicacion">Ubicación</FieldLabel>
            <Input id="ubicacion" name="ubicacion" placeholder="Ciudad, País" value={formData.ubicacion} onChange={handleInputChange} required />
          </div>
          <div className="space-y-2">
            <FieldLabel htmlFor="horario">Horario de trabajo</FieldLabel>
            <Input id="horario" name="horario" placeholder="Ej: 12:00 - 23:00" value={formData.horario} onChange={handleInputChange} required />
          </div>
        </div>
      </section>

      <section>
        <SectionTitle>Redes sociales</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <FieldLabel htmlFor="instagram">
              <span className="inline-flex items-center gap-1.5"><Instagram className="w-3.5 h-3.5" />Instagram</span>
            </FieldLabel>
            <Input id="instagram" name="instagram" placeholder="@tu_restaurante" value={formData.instagram} onChange={handleInputChange} />
          </div>
          <div className="space-y-2">
            <FieldLabel htmlFor="facebook">
              <span className="inline-flex items-center gap-1.5"><Facebook className="w-3.5 h-3.5" />Facebook</span>
            </FieldLabel>
            <Input id="facebook" name="facebook" placeholder="/tu_restaurante" value={formData.facebook} onChange={handleInputChange} />
          </div>
        </div>
      </section>

      <section>
        <SectionTitle>Descripción del local</SectionTitle>
        <div className="space-y-2">
          <FieldLabel htmlFor="descripcion">Cuéntanos sobre tu restaurante</FieldLabel>
          <Textarea id="descripcion" name="descripcion" placeholder="Tu especialidad y por qué deberías participar en Burger Fest..." value={formData.descripcion} onChange={handleInputChange} rows={4} required />
        </div>
      </section>

      <section>
        <SectionTitle>Presentación en video</SectionTitle>
        <div className="space-y-4">
          <div
            className="border-2 border-dashed border-brand-maroon/30 bg-brand-cream/30 rounded-xl p-8 text-center cursor-pointer hover:border-brand-flame hover:bg-brand-flame/5 transition-all"
            onClick={() => videoInputRef.current?.click()}
          >
            <input ref={videoInputRef} type="file" accept="video/*" onChange={handleVideoChange} className="hidden" />
            <Upload className="w-10 h-10 mx-auto text-brand-maroon mb-3" />
            <p className="text-foreground font-semibold mb-1">Arrastra tu video aquí o selecciona archivo</p>
            <p className="text-sm text-muted-foreground">MP4, MOV, AVI (máx. 100MB)</p>
          </div>
          {videoPreview && videoFile && (
            <div className="flex flex-col md:flex-row gap-4 p-4 bg-muted/40 rounded-xl border border-border">
              <div className="relative w-full md:w-64 aspect-video bg-brand-ink rounded-lg overflow-hidden">
                <video src={videoPreview} className="w-full h-full object-cover" controls />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-12 h-12 bg-brand-cream/80 rounded-full flex items-center justify-center">
                    <Play className="w-6 h-6 text-brand-ink fill-current" />
                  </div>
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <p className="font-semibold text-foreground">{videoFile.name}</p>
                  <p className="text-sm text-muted-foreground">Tamaño: {formatFileSize(videoFile.size)}</p>
                </div>
                <Button type="button" size="sm" onClick={removeVideo} className="w-fit bg-brand-flame hover:bg-brand-flame/90 text-brand-cream">
                  <Trash2 className="w-4 h-4 mr-2" />Borrar y cambiar
                </Button>
              </div>
            </div>
          )}
        </div>
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
          className="min-w-56 h-12 bg-brand-flame hover:bg-brand-flame/90 text-brand-cream font-bold uppercase tracking-wider shadow-lg shadow-brand-flame/20"
          disabled={submitting}
        >
          {submitting ? "Enviando..." : "Enviar registro"}
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </form>
  );
}
