import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { RegistroPatrocinadorForm } from "@/components/registro/patrocinador-form";

export const metadata: Metadata = {
  title: "Registro de Patrocinador",
  description:
    "Conviértete en patrocinador de Burger Fest 2026. Elige tu nivel de patrocinio y forma parte del festival gastronómico más importante.",
  openGraph: {
    title: "Registro de Patrocinador | Burger Fest 2026",
    description:
      "Conviértete en patrocinador de Burger Fest 2026 y obtén visibilidad en el festival gastronómico más importante.",
  },
};

export default function RegistroPatrocinadorPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-sm border-b border-border">
        <nav className="max-w-4xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Volver al Inicio</span>
          </Link>
        </nav>
      </header>

      <main className="max-w-4xl mx-auto px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Registro de Patrocinador
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Forma parte de Burger Fest 2026 como patrocinador y obtén visibilidad para tu marca
          </p>
        </div>

        <RegistroPatrocinadorForm />
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 py-6">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Burger Fest. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
