import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section
      className="py-16 lg:py-24 bg-primary"
      aria-labelledby="cta-heading"
    >
      <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
        <h2
          id="cta-heading"
          className="text-3xl lg:text-4xl font-bold text-primary-foreground mb-6 text-balance"
        >
          ¿Quieres participar en Burger Fest 2026?
        </h2>
        <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto text-pretty">
          Si tienes un restaurante o quieres ser patrocinador, inscríbete ahora y forma parte del
          festival gastronómico más importante del año.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            size="lg"
            variant="secondary"
            className="w-full sm:w-auto text-base font-semibold"
            asChild
          >
            <Link href="/registro/restaurante">
              Inscribir Restaurante
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="w-full sm:w-auto text-base font-semibold bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
            asChild
          >
            <Link href="/registro/patrocinador">
              Ser Patrocinador
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
