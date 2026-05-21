import { RegistroRestauranteForm } from "@/components/registro/restaurante-form";
import { PageHeader } from "@/components/landing/page-header";
import { Footer } from "@/components/landing/footer";

export default function RegistroRestaurante() {
  return (
    <div className="min-h-screen bg-background bg-grain flex flex-col">
      <PageHeader backHref="/registro" backLabel="Cambiar tipo" />

      <main className="flex-1 max-w-4xl w-full mx-auto px-6 lg:px-8 py-12 lg:py-16">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full bg-brand-flame/10 text-brand-flame">
            <span className="text-xs font-bold uppercase tracking-[0.2em]">Restaurante</span>
          </div>
          <h1 className="font-display text-5xl lg:text-6xl text-brand-ink leading-none mb-3">
            Inscribe tu <span className="text-brand-flame">restaurante</span>
          </h1>
          <div className="w-16 h-1 bg-brand-flame mx-auto mb-3" />
          <p className="text-base text-muted-foreground max-w-2xl mx-auto">
            Completa el formulario para participar en Burger Fest 2026.
          </p>
        </div>

        <div className="bg-card rounded-2xl border border-border shadow-xl shadow-brand-maroon/5 p-6 lg:p-8">
          <RegistroRestauranteForm />
        </div>
      </main>

      <Footer />
    </div>
  );
}
