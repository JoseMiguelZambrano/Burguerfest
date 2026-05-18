import type { Metadata } from "next";
import { LandingNavbar } from "@/components/landing/navbar";
import { HeroCarousel } from "@/components/landing/hero-carousel";
import { FeaturedRestaurants } from "@/components/landing/featured-restaurants";
import { Sponsors } from "@/components/landing/sponsors";
import { CTASection } from "@/components/landing/cta-section";
import { Footer } from "@/components/landing/footer";
import { JsonLd } from "@/components/seo/json-ld";

// SEO Metadata - Server-side rendered
export const metadata: Metadata = {
  title: "Burger Fest 2026 - 6ta Edición | Festival Gastronómico de Hamburguesas",
  description:
    "Burger Fest es el festival gastronómico más importante dedicado a la cultura de las hamburguesas. Descubre restaurantes destacados, participa como restaurante o patrocinador. 6ta Edición 2026.",
  keywords: [
    "Burger Fest",
    "festival hamburguesas",
    "festival gastronómico",
    "hamburguesas gourmet",
    "restaurantes participantes",
    "patrocinadores",
    "comida",
    "evento gastronómico",
    "2026",
  ],
  authors: [{ name: "Burger Fest Organization" }],
  creator: "Burger Fest",
  publisher: "Burger Fest",
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://burgerfest.com",
    siteName: "Burger Fest",
    title: "Burger Fest 2026 - 6ta Edición | Festival Gastronómico",
    description:
      "El festival gastronómico más importante dedicado a la cultura de las hamburguesas. Participa como restaurante o patrocinador.",
    images: [
      {
        url: "/images/hero-banner.jpeg",
        width: 1200,
        height: 630,
        alt: "Burger Fest 2026 - 6ta Edición",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Burger Fest 2026 - 6ta Edición",
    description:
      "El festival gastronómico más importante dedicado a la cultura de las hamburguesas.",
    images: ["/images/hero-banner.jpeg"],
    creator: "@burgerfest",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://burgerfest.com",
  },
};

// SSR Data fetching
async function getEvents() {
  // In production, this would fetch from a database/API
  return [
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
}

async function getFeaturedRestaurants() {
  return [
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
}

async function getSponsors() {
  return [
    { id: "1", name: "Sponsor Gold 1", logo: "/images/logo-light.jpeg", tier: "gold" as const },
    { id: "2", name: "Sponsor Gold 2", logo: "/images/logo-light.jpeg", tier: "gold" as const },
    { id: "3", name: "Sponsor Silver 1", logo: "/images/logo-light.jpeg", tier: "silver" as const },
    { id: "4", name: "Sponsor Silver 2", logo: "/images/logo-light.jpeg", tier: "silver" as const },
    { id: "5", name: "Sponsor Silver 3", logo: "/images/logo-light.jpeg", tier: "silver" as const },
    { id: "6", name: "Sponsor Bronze 1", logo: "/images/logo-light.jpeg", tier: "bronze" as const },
    { id: "7", name: "Sponsor Bronze 2", logo: "/images/logo-light.jpeg", tier: "bronze" as const },
  ];
}

// Server Component - SSR
export default async function LandingPage() {
  // Parallel data fetching for optimal performance
  const [events, restaurants, sponsors] = await Promise.all([
    getEvents(),
    getFeaturedRestaurants(),
    getSponsors(),
  ]);

  return (
    <div className="min-h-screen bg-background">
      <JsonLd />
      <LandingNavbar />
      
      <main id="main-content">
        {/* Hero Carousel - id for skip link */}
        <div id="eventos">
          <HeroCarousel events={events} />
        </div>

        {/* CTA Section */}
        <CTASection />

        {/* Featured Restaurants */}
        <FeaturedRestaurants restaurants={restaurants} />

        {/* Sponsors */}
        <Sponsors sponsors={sponsors} />
      </main>

      <Footer />
    </div>
  );
}
