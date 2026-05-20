"use client";

import { useState, useRef, type ChangeEvent } from "react";
import Image from "next/image";
import { Upload, ImageIcon, ArrowRight, Trophy, Award, Medal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface FormData {
  nombreEmpresa: string;
  sitioWeb: string;
  contacto: string;
  horarioContacto: string;
  nivel: "gold" | "silver" | "bronze";
}

const sponsorLevels = [
  {
    id: "gold",
    name: "Gold",
    icon: Trophy,
    color: "text-amber-500",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    description: "Logo en banner principal, menciones en redes, stand exclusivo",
  },
  {
    id: "silver",
    name: "Silver",
    icon: Award,
    color: "text-slate-500",
    bgColor: "bg-slate-50",
    borderColor: "border-slate-200",
    description: "Logo en materiales, menciones en redes, espacio compartido",
  },
  {
    id: "bronze",
    name: "Bronze",
    icon: Medal,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    description: "Logo en materiales, mención en web oficial",
  },
];

export function RegistroPatrocinadorForm() {
  const [formData, setFormData] = useState<FormData>({
    nombreEmpresa: "",
    sitioWeb: "",
    contacto: "",
    horarioContacto: "",
    nivel: "gold",
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const url = URL.createObjectURL(file);
      setLogoPreview(url);
    }
  };

  const handleBannerChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerFile(file);
      const url = URL.createObjectURL(file);
      setBannerPreview(url);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData, logoFile, bannerFile);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Información Corporativa */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold uppercase tracking-wide text-muted-foreground">
            Información Corporativa
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="nombreEmpresa">Nombre de la Empresa / Marca</Label>
            <Input
              id="nombreEmpresa"
              name="nombreEmpresa"
              placeholder="Nombre de tu empresa"
              value={formData.nombreEmpresa}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sitioWeb">Sitio Web Oficial (URL)</Label>
            <Input
              id="sitioWeb"
              name="sitioWeb"
              type="url"
              placeholder="https://www.tuempresa.com"
              value={formData.sitioWeb}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contacto">Nombre de Contacto</Label>
            <Input
              id="contacto"
              name="contacto"
              placeholder="Persona de contacto"
              value={formData.contacto}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="horarioContacto">Horario de Contacto</Label>
            <Input
              id="horarioContacto"
              name="horarioContacto"
              placeholder="Ej: 9:00 - 18:00"
              value={formData.horarioContacto}
              onChange={handleInputChange}
            />
          </div>
        </CardContent>
      </Card>

      {/* Material Visual */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold uppercase tracking-wide text-muted-foreground">
            Material Visual
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Logo */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              Logo Principal (Fondo Transparente)
            </Label>
            <div
              className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors aspect-square flex flex-col items-center justify-center"
              onClick={() => logoInputRef.current?.click()}
            >
              <input
                ref={logoInputRef}
                type="file"
                accept="image/png"
                onChange={handleLogoChange}
                className="hidden"
              />
              {logoPreview ? (
                <div className="relative w-full h-full">
                  <Image
                    src={logoPreview}
                    alt="Logo preview"
                    fill
                    className="object-contain"
                  />
                </div>
              ) : (
                <>
                  <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-3" />
                  <p className="text-sm text-muted-foreground">
                    Haz clic para subir
                  </p>
                </>
              )}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => logoInputRef.current?.click()}
            >
              Subir PNG
            </Button>
          </div>

          {/* Banner */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              Banner Publicitario / Visual
            </Label>
            <div
              className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors aspect-video flex flex-col items-center justify-center"
              onClick={() => bannerInputRef.current?.click()}
            >
              <input
                ref={bannerInputRef}
                type="file"
                accept="image/png,image/jpeg"
                onChange={handleBannerChange}
                className="hidden"
              />
              {bannerPreview ? (
                <div className="relative w-full h-full">
                  <Image
                    src={bannerPreview}
                    alt="Banner preview"
                    fill
                    className="object-contain"
                  />
                </div>
              ) : (
                <>
                  <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-3" />
                  <p className="text-sm text-muted-foreground">
                    Haz clic para subir
                  </p>
                </>
              )}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => bannerInputRef.current?.click()}
            >
              Subir JPG/PNG
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Nivel de Patrocinio */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold uppercase tracking-wide text-muted-foreground">
            Nivel de Patrocinio Deseado
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={formData.nivel}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, nivel: value as FormData["nivel"] }))
            }
            className="space-y-4"
          >
            {sponsorLevels.map((level) => (
              <label
                key={level.id}
                className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  formData.nivel === level.id
                    ? `${level.borderColor} ${level.bgColor}`
                    : "border-border hover:border-muted-foreground/30"
                }`}
              >
                <RadioGroupItem value={level.id} id={level.id} />
                <level.icon className={`w-8 h-8 ${level.color}`} />
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{level.name}</p>
                  <p className="text-sm text-muted-foreground">{level.description}</p>
                </div>
              </label>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button type="submit" size="lg" className="min-w-48">
          Enviar Registro
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </form>
  );
}
