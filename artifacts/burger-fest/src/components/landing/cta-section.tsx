import { Link } from "wouter";
import { ArrowRight, Utensils, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section
      className="relative py-20 lg:py-28 bg-flame-gradient overflow-hidden"
      aria-labelledby="cta-heading"
    >
      <div className="absolute inset-0 opacity-20 bg-grain" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-brand-gold/10 blur-3xl" />

      <div className="relative max-w-5xl mx-auto px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-5 rounded-full bg-brand-gold/20 text-brand-gold border border-brand-gold/40">
          <span className="text-xs font-bold uppercase tracking-[0.25em]">Convocatoria abierta</span>
        </div>
        <h2
          id="cta-heading"
          className="font-display text-4xl sm:text-5xl lg:text-7xl text-brand-cream mb-5 leading-[0.95]"
        >
          ¿Listo para <span className="text-brand-gold">prender la parrilla</span>?
        </h2>
        <p className="text-lg text-brand-cream/85 mb-10 max-w-2xl mx-auto leading-relaxed">
          Si tienes un restaurante o quieres ser patrocinador, inscríbete ahora y forma parte
          del festival gastronómico más importante del año.
        </p>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4">
          <Button
            size="lg"
            className="bg-brand-gold hover:bg-brand-gold/90 text-brand-ink font-bold uppercase tracking-wider shadow-xl shadow-black/30 h-12 px-6"
            asChild
          >
            <Link href="/registro/restaurante">
              <Utensils className="w-5 h-5 mr-2" />
              Inscribir Restaurante
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="bg-transparent border-2 border-brand-cream/50 text-brand-cream hover:bg-brand-cream/10 font-bold uppercase tracking-wider h-12 px-6"
            asChild
          >
            <Link href="/registro/patrocinador">
              <Award className="w-5 h-5 mr-2" />
              Ser Patrocinador
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
