import { Flame } from "lucide-react";

const items = [
  "50+ Restaurantes",
  "10 Días de Festival",
  "Concurso Mejor Hamburguesa",
  "Música en Vivo",
  "Food Trucks",
  "Premios para el Público",
  "Edición #6",
];

export function MarqueeStrip() {
  const loop = [...items, ...items];
  return (
    <div className="bg-brand-flame text-brand-cream overflow-hidden border-y-2 border-brand-ink/20">
      <div className="flex animate-marquee whitespace-nowrap py-3">
        {loop.map((label, i) => (
          <div key={i} className="flex items-center gap-4 px-6">
            <Flame className="w-4 h-4 text-brand-gold shrink-0" />
            <span className="font-display text-xl tracking-wider uppercase">
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
