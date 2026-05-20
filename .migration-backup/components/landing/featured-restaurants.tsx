import Image from "next/image";
import { MapPin, Clock, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

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
      className="py-16 lg:py-24 bg-muted/30"
      aria-labelledby="restaurantes-heading"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 
            id="restaurantes-heading" 
            className="text-3xl lg:text-4xl font-bold text-foreground mb-4"
          >
            Restaurantes Destacados
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Descubre los mejores restaurantes participantes en Burger Fest 2026
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {restaurants.map((restaurant) => (
            <Card 
              key={restaurant.id} 
              className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={restaurant.image}
                  alt={`${restaurant.name} - Vista del restaurante`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {restaurant.featured && (
                  <div className="absolute top-4 left-4 flex items-center gap-1 px-3 py-1 bg-amber-500 text-white text-sm font-medium rounded-full">
                    <Star className="w-4 h-4 fill-current" />
                    <span>Destacado</span>
                  </div>
                )}
              </div>
              <CardContent className="p-5">
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {restaurant.name}
                </h3>
                <div className="flex flex-col gap-2 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-sm">{restaurant.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-sm">{restaurant.schedule}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
