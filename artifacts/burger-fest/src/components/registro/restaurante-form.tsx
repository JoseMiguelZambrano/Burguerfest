import { useState, useRef, type ChangeEvent } from "react";
import { useLocation } from "wouter";
import { Upload, Trash2, Play, Instagram, Facebook, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

export function RegistroRestauranteForm() {
  const { session, loading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  const [formData, setFormData] = useState<FormData>({
    nombreComercial: "",
    platoEstrella: "",
    ubicacion: "",
    horario: "",
    instagram: "",
    facebook: "",
    descripcion: "",
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
    if (!session) {
      navigate("/login");
      return;
    }
    setSubmitting(true);
    setMessage(null);
    try {
      let video_url: string | null = null;
      if (videoFile) {
        const r = await uploadFile(videoFile);
        video_url = r.url;
      }
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
      <Card>
        <CardContent className="p-8 text-center space-y-4">
          <p className="text-foreground">Necesitas una cuenta para inscribir tu restaurante.</p>
          <Button onClick={() => navigate("/login")}>Iniciar sesión / Crear cuenta</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold uppercase tracking-wide text-muted-foreground">Datos Generales</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="nombreComercial">Nombre Comercial</Label>
            <Input id="nombreComercial" name="nombreComercial" placeholder="Nombre de tu restaurante" value={formData.nombreComercial} onChange={handleInputChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="platoEstrella">Plato Estrella</Label>
            <Input id="platoEstrella" name="platoEstrella" placeholder="Tu mejor hamburguesa" value={formData.platoEstrella} onChange={handleInputChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ubicacion">Ubicación</Label>
            <Input id="ubicacion" name="ubicacion" placeholder="Ciudad, País" value={formData.ubicacion} onChange={handleInputChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="horario">Horario de Trabajo</Label>
            <Input id="horario" name="horario" placeholder="Ej: 12:00 - 23:00" value={formData.horario} onChange={handleInputChange} required />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold uppercase tracking-wide text-muted-foreground">Redes Sociales</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="instagram" className="flex items-center gap-2"><Instagram className="w-4 h-4" />Instagram</Label>
            <Input id="instagram" name="instagram" placeholder="@tu_restaurante" value={formData.instagram} onChange={handleInputChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="facebook" className="flex items-center gap-2"><Facebook className="w-4 h-4" />Facebook</Label>
            <Input id="facebook" name="facebook" placeholder="/tu_restaurante" value={formData.facebook} onChange={handleInputChange} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold uppercase tracking-wide text-muted-foreground">Descripción del Local</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea id="descripcion" name="descripcion" placeholder="Cuéntanos sobre tu restaurante, tu especialidad y por qué deberías participar en Burger Fest..." value={formData.descripcion} onChange={handleInputChange} rows={4} required />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold uppercase tracking-wide text-muted-foreground">Presentación en Video</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors" onClick={() => videoInputRef.current?.click()}>
              <input ref={videoInputRef} type="file" accept="video/*" onChange={handleVideoChange} className="hidden" />
              <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-4" />
              <p className="text-foreground font-medium mb-1">Arrastra tu video aquí o Selecciona Archivo</p>
              <p className="text-sm text-muted-foreground">Formatos: MP4, MOV, AVI (máx. 100MB)</p>
            </div>
            {videoPreview && videoFile && (
              <div className="flex flex-col md:flex-row gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="relative w-full md:w-64 aspect-video bg-black rounded-lg overflow-hidden">
                  <video src={videoPreview} className="w-full h-full object-cover" controls />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-12 h-12 bg-white/80 rounded-full flex items-center justify-center">
                      <Play className="w-6 h-6 text-foreground fill-current" />
                    </div>
                  </div>
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <p className="font-medium text-foreground">{videoFile.name}</p>
                    <p className="text-sm text-muted-foreground">Tamaño: {formatFileSize(videoFile.size)}</p>
                  </div>
                  <Button type="button" variant="destructive" size="sm" onClick={removeVideo} className="w-fit">
                    <Trash2 className="w-4 h-4 mr-2" />Borrar y cambiar video
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {message && (
        <div className={`p-4 rounded-md text-sm ${message.kind === "ok" ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-800"}`}>
          {message.text}
        </div>
      )}

      <div className="flex justify-end">
        <Button type="submit" size="lg" className="min-w-48" disabled={submitting}>
          {submitting ? "Enviando..." : "Enviar Registro"}
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </form>
  );
}
