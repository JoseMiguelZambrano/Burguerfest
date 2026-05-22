import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  image: string;
}

interface HeroCarouselProps {
  events: Event[];
}

export function HeroCarousel({ events }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % events.length);
  }, [events.length]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + events.length) % events.length);
  };

  const goToSlide = (index: number) => setCurrentIndex(index);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(nextSlide, 5500);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  return (
    <section
      className="relative w-full h-[560px] lg:h-[680px] overflow-hidden bg-brand-ink"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
      aria-label="Carousel de eventos del festival"
    >
      <div
        className="flex h-full transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {events.map((event, index) => (
          <div
            key={event.id}
            className="relative min-w-full h-full"
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} de ${events.length}: ${event.title}`}
          >
            <img
              src={event.image}
              alt={event.title}
              className="absolute inset-0 w-full h-full object-cover scale-105"
            />
            {/* Dark cinematic overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-brand-ink/95 via-brand-ink/70 to-brand-ink/30" />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-maroon-deep/80 via-transparent to-transparent" />

            <div className="relative h-full flex items-center">
              <div className="w-full max-w-7xl mx-auto px-6 lg:px-8">
                <div className="max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-5 bg-brand-gold text-brand-ink rounded-full text-xs font-bold uppercase tracking-[0.2em] shadow-lg shadow-brand-gold/20">
                    <Flame className="w-3.5 h-3.5" />
                    {event.date}
                  </div>
                  <h2 className="font-display text-4xl sm:text-5xl lg:text-8xl text-brand-cream mb-4 leading-[0.95] tracking-tight">
                    {event.title}
                  </h2>
                  <div className="w-20 h-1 bg-brand-flame mb-5" />
                  <p className="text-base lg:text-lg text-brand-cream/85 mb-8 max-w-xl leading-relaxed">
                    {event.description}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      size="lg"
                      className="bg-brand-flame hover:bg-brand-flame/90 text-brand-cream font-bold uppercase tracking-wider shadow-xl shadow-brand-flame/30"
                    >
                      Ver Programa
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="bg-transparent border-2 border-brand-cream/40 text-brand-cream hover:bg-brand-cream/10 font-bold uppercase tracking-wider"
                    >
                      Inscríbete
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative side meta */}
            <div className="hidden lg:flex absolute right-8 top-1/2 -translate-y-1/2 flex-col items-center gap-3 text-brand-cream/60">
              <div className="w-px h-16 bg-brand-cream/20" />
              <span className="text-xs uppercase tracking-[0.3em] [writing-mode:vertical-rl] rotate-180">
                Edición {2026 - 2017 + 1} · #BurgerFest
              </span>
              <div className="w-px h-16 bg-brand-cream/20" />
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center bg-brand-ink/40 hover:bg-brand-gold hover:text-brand-ink text-brand-cream backdrop-blur-sm rounded-full transition-all"
        aria-label="Anterior slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center bg-brand-ink/40 hover:bg-brand-gold hover:text-brand-ink text-brand-cream backdrop-blur-sm rounded-full transition-all"
        aria-label="Siguiente slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2" role="tablist">
        {events.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-1.5 rounded-full transition-all ${
              index === currentIndex
                ? "bg-brand-gold w-10"
                : "bg-brand-cream/40 hover:bg-brand-cream/70 w-4"
            }`}
            role="tab"
            aria-selected={index === currentIndex}
            aria-label={`Ir al slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
