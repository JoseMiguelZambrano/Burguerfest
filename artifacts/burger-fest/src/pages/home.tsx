import { LandingNavbar } from "@/components/landing/navbar";
import { HeroCarousel } from "@/components/landing/hero-carousel";
import { FeaturedRestaurants } from "@/components/landing/featured-restaurants";
import { Sponsors } from "@/components/landing/sponsors";
import { CTASection } from "@/components/landing/cta-section";
import { Footer } from "@/components/landing/footer";
import { JsonLd } from "@/components/seo/json-ld";

const events = [
  {
    id: "1",
    title: "Burger Fest 2026 - 6ta Edición",
    description:
      "El festival gastronómico más importante dedicado a la cultura de las hamburguesas regresa con su sexta edición. Más de 50 restaurantes participantes.",
    date: "21 - 30 de Junio, 2026",
    image: "/images/hero-banner.jpeg",
  },
  {
    id: "2",
    title: "Concurso de la Mejor Hamburguesa",
    description:
      "Los mejores chefs compiten por el título de la mejor hamburguesa del festival. Votación popular y jurado experto.",
    date: "25 de Junio, 2026",
    image: "/images/hero-banner.jpeg",
  },
  {
    id: "3",
    title: "Noche de Food Trucks",
    description:
      "Una experiencia única con los mejores food trucks de la región. Música en vivo y ambiente festivo.",
    date: "28 de Junio, 2026",
    image: "/images/hero-banner.jpeg",
  },
];

const restaurants = [
  {
    id: "1",
    name: "Burger Plaza",
    location: "Barcelona, España",
    schedule: "13:00 - 00:00",
    image: "/images/restaurant-1.jpg",
    featured: true,
  },
  {
    id: "2",
    name: "La Parrilla Gourmet",
    location: "Madrid, España",
    schedule: "12:00 - 23:00",
    image: "/images/restaurant-2.jpg",
    featured: true,
  },
  {
    id: "3",
    name: "Smash & Co",
    location: "Valencia, España",
    schedule: "18:00 - 01:00",
    image: "/images/restaurant-3.jpg",
    featured: false,
  },
];

const sponsors = [
  { id: "1", name: "Sponsor Gold 1", logo: "/images/logo-light.jpeg", tier: "gold" as const },
  { id: "2", name: "Sponsor Gold 2", logo: "/images/logo-light.jpeg", tier: "gold" as const },
  { id: "3", name: "Sponsor Silver 1", logo: "/images/logo-light.jpeg", tier: "silver" as const },
  { id: "4", name: "Sponsor Silver 2", logo: "/images/logo-light.jpeg", tier: "silver" as const },
  { id: "5", name: "Sponsor Silver 3", logo: "/images/logo-light.jpeg", tier: "silver" as const },
  { id: "6", name: "Sponsor Bronze 1", logo: "/images/logo-light.jpeg", tier: "bronze" as const },
  { id: "7", name: "Sponsor Bronze 2", logo: "/images/logo-light.jpeg", tier: "bronze" as const },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <JsonLd />
      <LandingNavbar />

      <main id="main-content">
        <div id="eventos">
          <HeroCarousel events={events} />
        </div>

        <CTASection />

        <FeaturedRestaurants restaurants={restaurants} />

        <Sponsors sponsors={sponsors} />
      </main>

      <Footer />
    </div>
  );
}
