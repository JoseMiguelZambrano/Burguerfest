import { RegistroPatrocinadorForm } from "@/components/registro/patrocinador-form";
import { PageHeader } from "@/components/landing/page-header";
import { Footer } from "@/components/landing/footer";

export default function RegistroPatrocinador() {
  return (
    <div className="min-h-screen bg-background bg-grain flex flex-col">
      <PageHeader backHref="/registro" backLabel="Cambiar tipo" />

      <main className="flex-1 max-w-4xl w-full mx-auto px-6 lg:px-8 py-12 lg:py-16">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full bg-brand-gold/15 text-brand-maroon">
            <span className="text-xs font-bold uppercase tracking-[0.2em]">Patrocinador</span>
          </div>
          <h1 className="font-display text-5xl lg:text-6xl text-brand-ink leading-none mb-3">
            Sé parte del <span className="text-brand-gold">fuego</span>
          </h1>
          <div className="w-16 h-1 bg-brand-gold mx-auto mb-3" />
          <p className="text-base text-muted-foreground max-w-2xl mx-auto">
            Forma parte de Burger Fest 2026 y obtén visibilidad para tu marca.
          </p>
        </div>

        <div className="bg-card rounded-2xl border border-border shadow-xl shadow-brand-maroon/5 p-6 lg:p-8">
          <RegistroPatrocinadorForm />
        </div>
      </main>

      <Footer />
    </div>
  );
}
