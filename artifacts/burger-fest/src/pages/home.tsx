import { useEffect, useState } from "react";
import { LandingNavbar } from "@/components/landing/navbar";
import { HeroCarousel } from "@/components/landing/hero-carousel";
import { FeaturedRestaurants } from "@/components/landing/featured-restaurants";
import { Sponsors } from "@/components/landing/sponsors";
import { CTASection } from "@/components/landing/cta-section";
import { MarqueeStrip } from "@/components/landing/marquee-strip";
import { Footer } from "@/components/landing/footer";
import { JsonLd } from "@/components/seo/json-ld";
import { api } from "@/lib/api";

type EventRow = { id: string; title: string; description: string | null; event_date: string | null; image_url: string | null };
type RestaurantRow = { id: string; name: string; location: string; schedule: string | null; logo_url: string | null; featured: boolean };
type SponsorRow = { id: string; company_name: string; logo_url: string | null; tier: "gold" | "silver" | "bronze" };

const fallbackEvents = [
  { id: "1", title: "Burger Fest 2026 - 6ta Edición", description: "El festival gastronómico más importante dedicado a la cultura de las hamburguesas regresa con su sexta edición. Más de 50 restaurantes participantes.", date: "21 - 30 de Junio, 2026", image: "https://res.cloudinary.com/ddqarpruz/image/upload/v1779351381/burger-fest/seed/hero-banner.jpg" },
  { id: "2", title: "Concurso de la Mejor Hamburguesa", description: "Los mejores chefs compiten por el título de la mejor hamburguesa del festival. Votación popular y jurado experto.", date: "25 de Junio, 2026", image: "https://res.cloudinary.com/ddqarpruz/image/upload/v1779351381/burger-fest/seed/hero-banner.jpg" },
  { id: "3", title: "Noche de Food Trucks", description: "Una experiencia única con los mejores food trucks de la región. Música en vivo y ambiente festivo.", date: "28 de Junio, 2026", image: "https://res.cloudinary.com/ddqarpruz/image/upload/v1779351381/burger-fest/seed/hero-banner.jpg" },
];

const fallbackRestaurants = [
  { id: "1", name: "Burger Plaza", location: "Barcelona, España", schedule: "13:00 - 00:00", image: "https://res.cloudinary.com/ddqarpruz/image/upload/v1779351381/burger-fest/seed/restaurant-1.jpg", featured: true },
  { id: "2", name: "La Parrilla Gourmet", location: "Madrid, España", schedule: "12:00 - 23:00", image: "https://res.cloudinary.com/ddqarpruz/image/upload/v1779351381/burger-fest/seed/restaurant-2.jpg", featured: true },
  { id: "3", name: "Smash & Co", location: "Valencia, España", schedule: "18:00 - 01:00", image: "https://res.cloudinary.com/ddqarpruz/image/upload/v1779351381/burger-fest/seed/restaurant-3.jpg", featured: false },
];

const fallbackSponsors = [
  { id: "1", name: "Sponsor Gold 1", logo: "https://res.cloudinary.com/ddqarpruz/image/upload/v1779351381/burger-fest/seed/logo-light.jpg", tier: "gold" as const },
  { id: "2", name: "Sponsor Gold 2", logo: "https://res.cloudinary.com/ddqarpruz/image/upload/v1779351381/burger-fest/seed/logo-light.jpg", tier: "gold" as const },
  { id: "3", name: "Sponsor Silver 1", logo: "https://res.cloudinary.com/ddqarpruz/image/upload/v1779351381/burger-fest/seed/logo-light.jpg", tier: "silver" as const },
  { id: "4", name: "Sponsor Silver 2", logo: "https://res.cloudinary.com/ddqarpruz/image/upload/v1779351381/burger-fest/seed/logo-light.jpg", tier: "silver" as const },
  { id: "5", name: "Sponsor Silver 3", logo: "https://res.cloudinary.com/ddqarpruz/image/upload/v1779351381/burger-fest/seed/logo-light.jpg", tier: "silver" as const },
  { id: "6", name: "Sponsor Bronze 1", logo: "https://res.cloudinary.com/ddqarpruz/image/upload/v1779351381/burger-fest/seed/logo-light.jpg", tier: "bronze" as const },
  { id: "7", name: "Sponsor Bronze 2", logo: "https://res.cloudinary.com/ddqarpruz/image/upload/v1779351381/burger-fest/seed/logo-light.jpg", tier: "bronze" as const },
];

export default function Home() {
  const [events, setEvents] = useState(fallbackEvents);
  const [restaurants, setRestaurants] = useState(fallbackRestaurants);
  const [sponsors, setSponsors] = useState(fallbackSponsors);

  useEffect(() => {
    (async () => {
      try {
        const [e, r, s] = await Promise.all([
          api<{ items: EventRow[] }>("/events"),
          api<{ items: RestaurantRow[] }>("/restaurants"),
          api<{ items: SponsorRow[] }>("/sponsors"),
        ]);
        if (e.items.length) {
          setEvents(e.items.map((x) => ({
            id: x.id, title: x.title, description: x.description ?? "",
            date: x.event_date ?? "", image: x.image_url ?? "https://res.cloudinary.com/ddqarpruz/image/upload/v1779351381/burger-fest/seed/hero-banner.jpg",
          })));
        }
        if (r.items.length) {
          setRestaurants(r.items.map((x) => ({
            id: x.id, name: x.name, location: x.location,
            schedule: x.schedule ?? "", image: x.logo_url ?? "https://res.cloudinary.com/ddqarpruz/image/upload/v1779351381/burger-fest/seed/restaurant-1.jpg", featured: x.featured,
          })));
        }
        if (s.items.length) {
          setSponsors(s.items.map((x) => ({
            id: x.id, name: x.company_name,
            logo: x.logo_url ?? "https://res.cloudinary.com/ddqarpruz/image/upload/v1779351381/burger-fest/seed/logo-light.jpg", tier: x.tier,
          })));
        }
      } catch {
        // keep fallbacks
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <JsonLd />
      <LandingNavbar />

      <main id="main-content">
        <div id="eventos">
          <HeroCarousel events={events} />
        </div>

        <MarqueeStrip />

        <FeaturedRestaurants restaurants={restaurants} />

        <CTASection />

        <Sponsors sponsors={sponsors} />
      </main>

      <Footer />
    </div>
  );
}
