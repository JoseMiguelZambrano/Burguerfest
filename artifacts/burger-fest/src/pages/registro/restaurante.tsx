import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { RegistroRestauranteForm } from "@/components/registro/restaurante-form";

export default function RegistroRestaurante() {
  return (
    <div className="min-h-screen bg-background">
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
            Registro de Restaurante
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Completa el formulario para inscribir tu restaurante en Burger Fest 2026
          </p>
        </div>

        <RegistroRestauranteForm />
      </main>

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
