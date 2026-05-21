export function JsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: "Burger Fest 2026 - 6ta Edición",
    description:
      "El festival gastronómico más importante dedicado a la cultura de las hamburguesas. Más de 50 restaurantes participantes.",
    startDate: "2026-06-21",
    endDate: "2026-06-30",
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: "Barcelona",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Barcelona",
        addressCountry: "ES",
      },
    },
    image: ["https://res.cloudinary.com/ddqarpruz/image/upload/v1779351381/burger-fest/seed/hero-banner.jpg"],
    organizer: {
      "@type": "Organization",
      name: "Burger Fest Organization",
      url: "https://burgerfest.com",
    },
    offers: {
      "@type": "Offer",
      url: "https://burgerfest.com/registro",
      price: "0",
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      validFrom: "2026-01-01",
    },
  };

  const organizationLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Burger Fest",
    url: "https://burgerfest.com",
    logo: "https://res.cloudinary.com/ddqarpruz/image/upload/v1779351381/burger-fest/seed/logo-dark.jpg",
    sameAs: [
      "https://instagram.com/burgerfest",
      "https://facebook.com/burgerfest",
      "https://twitter.com/burgerfest",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: ["Spanish", "English"],
    },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Inicio",
        item: "https://burgerfest.com",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
    </>
  );
}
