import { MapPin, Clock, Star, ArrowUpRight } from "lucide-react";

interface Restaurant {
  id: string;
  name: string;
  location: string;
  schedule: string;
  image: string;
  featured?: boolean;
}

interface FeaturedRestaurantsProps {
  restaurants: Restaurant[];
}

export function FeaturedRestaurants({ restaurants }: FeaturedRestaurantsProps) {
  return (
    <section
      id="restaurantes"
      className="relative py-20 lg:py-28 bg-background bg-grain"
      aria-labelledby="restaurantes-heading"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-14">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full bg-brand-maroon/10 text-brand-maroon">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-flame animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-[0.2em]">Participantes</span>
            </div>
            <h2
              id="restaurantes-heading"
              className="font-display text-5xl lg:text-6xl text-brand-ink leading-none"
            >
              Los reyes <span className="text-brand-flame">de la parrilla</span>
            </h2>
          </div>
          <p className="text-base text-muted-foreground max-w-md">
            Más de 50 restaurantes traen sus mejores creaciones. Estos son algunos de los destacados de la edición 2026.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {restaurants.map((restaurant) => (
            <article
              key={restaurant.id}
              className="group relative bg-card rounded-2xl overflow-hidden border border-border hover:border-brand-gold/60 shadow-sm hover:shadow-2xl hover:shadow-brand-maroon/10 transition-all duration-300"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={restaurant.image}
                  alt={`${restaurant.name}`}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-ink/80 via-transparent to-transparent" />
                {restaurant.featured && (
                  <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 bg-brand-gold text-brand-ink text-xs font-bold uppercase tracking-wider rounded-full shadow-lg">
                    <Star className="w-3 h-3 fill-current" />
                    Destacado
                  </div>
                )}
                <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-brand-cream/95 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight className="w-4 h-4 text-brand-ink" />
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="font-display text-3xl text-brand-cream leading-tight tracking-wide">
                    {restaurant.name}
                  </h3>
                </div>
              </div>
              <div className="p-5 flex flex-col gap-2.5">
                <div className="flex items-center gap-2 text-foreground">
                  <MapPin className="w-4 h-4 text-brand-flame shrink-0" />
                  <span className="text-sm font-medium">{restaurant.location}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4 text-brand-flame shrink-0" />
                  <span className="text-sm">{restaurant.schedule}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
