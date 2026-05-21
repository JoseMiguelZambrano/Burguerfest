import { Link } from "wouter";
import { Utensils, Briefcase, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/landing/page-header";
import { Footer } from "@/components/landing/footer";

export default function Registro() {
  return (
    <div className="min-h-screen bg-background bg-grain flex flex-col">
      <PageHeader />

      <main className="flex-1 max-w-5xl w-full mx-auto px-6 lg:px-8 py-16 lg:py-20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full bg-brand-maroon/10 text-brand-maroon">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-flame animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-[0.2em]">Convocatoria 2026</span>
          </div>
          <h1 className="font-display text-5xl lg:text-6xl text-brand-ink leading-none mb-3">
            Únete a <span className="text-brand-flame">Burger Fest</span>
          </h1>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto">
            Elige cómo quieres participar en el festival gastronómico más importante dedicado a la cultura de las hamburguesas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          <article className="group relative bg-card rounded-2xl border border-border hover:border-brand-flame/60 shadow-sm hover:shadow-2xl hover:shadow-brand-maroon/10 transition-all overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-brand-flame" />
            <div className="p-7">
              <div className="w-14 h-14 rounded-xl bg-brand-flame/10 flex items-center justify-center mb-5 group-hover:bg-brand-flame group-hover:text-brand-cream text-brand-flame transition-all">
                <Utensils className="w-7 h-7" />
              </div>
              <h2 className="font-display text-3xl text-brand-ink tracking-wide mb-2">Soy Restaurante</h2>
              <p className="text-sm text-muted-foreground mb-5">
                Inscribe tu restaurante y participa con tu mejor hamburguesa en el festival.
              </p>
              <ul className="text-sm text-foreground/80 space-y-2.5 mb-7">
                <li className="flex items-start gap-2.5">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-flame shrink-0" />
                  Exposición a miles de visitantes
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-flame shrink-0" />
                  Participa en el concurso de hamburguesas
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-flame shrink-0" />
                  Promoción en redes y materiales
                </li>
              </ul>
              <Button className="w-full h-11 bg-brand-flame hover:bg-brand-flame/90 text-brand-cream font-bold uppercase tracking-wider shadow-lg shadow-brand-flame/20" asChild>
                <Link href="/registro/restaurante">
                  Inscribir Restaurante
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </article>

          <article className="group relative bg-card rounded-2xl border border-border hover:border-brand-gold/80 shadow-sm hover:shadow-2xl hover:shadow-brand-maroon/10 transition-all overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-brand-gold" />
            <div className="p-7">
              <div className="w-14 h-14 rounded-xl bg-brand-gold/15 flex items-center justify-center mb-5 group-hover:bg-brand-gold group-hover:text-brand-ink text-brand-gold transition-all">
                <Briefcase className="w-7 h-7" />
              </div>
              <h2 className="font-display text-3xl text-brand-ink tracking-wide mb-2">Soy Patrocinador</h2>
              <p className="text-sm text-muted-foreground mb-5">
                Apoya el festival y obtén visibilidad para tu marca frente a nuestra audiencia.
              </p>
              <ul className="text-sm text-foreground/80 space-y-2.5 mb-7">
                <li className="flex items-start gap-2.5">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-gold shrink-0" />
                  Logo en materiales oficiales
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-gold shrink-0" />
                  Menciones en redes sociales
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-gold shrink-0" />
                  Diferentes niveles de patrocinio
                </li>
              </ul>
              <Button className="w-full h-11 bg-brand-gold hover:bg-brand-gold/90 text-brand-ink font-bold uppercase tracking-wider shadow-lg shadow-brand-gold/20" asChild>
                <Link href="/registro/patrocinador">
                  Ser Patrocinador
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}
