import Image from "next/image";

interface Sponsor {
  id: string;
  name: string;
  logo: string;
  tier: "gold" | "silver" | "bronze";
}

interface SponsorsProps {
  sponsors: Sponsor[];
}

export function Sponsors({ sponsors }: SponsorsProps) {
  const goldSponsors = sponsors.filter((s) => s.tier === "gold");
  const silverSponsors = sponsors.filter((s) => s.tier === "silver");
  const bronzeSponsors = sponsors.filter((s) => s.tier === "bronze");

  return (
    <section 
      id="patrocinadores" 
      className="py-16 lg:py-24 bg-background"
      aria-labelledby="patrocinadores-heading"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 
            id="patrocinadores-heading" 
            className="text-3xl lg:text-4xl font-bold text-foreground mb-4"
          >
            Nuestros Patrocinadores
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Gracias a nuestros patrocinadores por hacer posible Burger Fest
          </p>
        </div>

        {/* Gold Sponsors */}
        {goldSponsors.length > 0 && (
          <div className="mb-12">
            <h3 className="text-center text-sm font-semibold text-amber-600 uppercase tracking-wider mb-6">
              Patrocinadores Gold
            </h3>
            <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-12">
              {goldSponsors.map((sponsor) => (
                <div 
                  key={sponsor.id} 
                  className="relative w-40 h-20 lg:w-48 lg:h-24 grayscale hover:grayscale-0 transition-all duration-300"
                >
                  <Image
                    src={sponsor.logo}
                    alt={`${sponsor.name} - Patrocinador Gold`}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 160px, 192px"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Silver Sponsors */}
        {silverSponsors.length > 0 && (
          <div className="mb-12">
            <h3 className="text-center text-sm font-semibold text-slate-500 uppercase tracking-wider mb-6">
              Patrocinadores Silver
            </h3>
            <div className="flex flex-wrap justify-center items-center gap-6 lg:gap-10">
              {silverSponsors.map((sponsor) => (
                <div 
                  key={sponsor.id} 
                  className="relative w-32 h-16 lg:w-40 lg:h-20 grayscale hover:grayscale-0 transition-all duration-300"
                >
                  <Image
                    src={sponsor.logo}
                    alt={`${sponsor.name} - Patrocinador Silver`}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 128px, 160px"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bronze Sponsors */}
        {bronzeSponsors.length > 0 && (
          <div>
            <h3 className="text-center text-sm font-semibold text-orange-700 uppercase tracking-wider mb-6">
              Patrocinadores Bronze
            </h3>
            <div className="flex flex-wrap justify-center items-center gap-4 lg:gap-8">
              {bronzeSponsors.map((sponsor) => (
                <div 
                  key={sponsor.id} 
                  className="relative w-24 h-12 lg:w-32 lg:h-16 grayscale hover:grayscale-0 transition-all duration-300"
                >
                  <Image
                    src={sponsor.logo}
                    alt={`${sponsor.name} - Patrocinador Bronze`}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 96px, 128px"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
