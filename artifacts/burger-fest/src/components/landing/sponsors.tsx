interface Sponsor {
  id: string;
  name: string;
  logo: string;
  tier: "gold" | "silver" | "bronze";
}

interface SponsorsProps {
  sponsors: Sponsor[];
}

const tierMeta = {
  gold:   { label: "Patrocinadores Gold",   color: "text-brand-gold",   size: "w-44 h-24 lg:w-52 lg:h-28" },
  silver: { label: "Patrocinadores Silver", color: "text-brand-cream/70", size: "w-36 h-20 lg:w-44 lg:h-24" },
  bronze: { label: "Patrocinadores Bronze", color: "text-brand-flame/80", size: "w-28 h-16 lg:w-36 lg:h-20" },
};

export function Sponsors({ sponsors }: SponsorsProps) {
  const groups = (["gold", "silver", "bronze"] as const).map((t) => ({
    tier: t, items: sponsors.filter((s) => s.tier === t),
  }));

  return (
    <section
      id="patrocinadores"
      className="relative py-20 lg:py-28 bg-brand-ink overflow-hidden"
      aria-labelledby="patrocinadores-heading"
    >
      <div className="absolute inset-0 opacity-[0.06] bg-grain" />
      <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-brand-maroon blur-3xl opacity-40" />
      <div className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full bg-brand-flame blur-3xl opacity-20" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full bg-brand-gold/15 text-brand-gold">
            <span className="text-xs font-bold uppercase tracking-[0.2em]">Aliados</span>
          </div>
          <h2
            id="patrocinadores-heading"
            className="font-display text-5xl lg:text-6xl text-brand-cream leading-none mb-3"
          >
            Quienes hacen posible <span className="text-brand-gold">el fuego</span>
          </h2>
          <p className="text-base text-brand-cream/70 max-w-2xl mx-auto">
            Marcas que apoyan la cultura de la hamburguesa en cada edición.
          </p>
        </div>

        {groups.map(({ tier, items }) =>
          items.length === 0 ? null : (
            <div key={tier} className="mb-12 last:mb-0">
              <h3 className={`text-center text-xs font-bold uppercase tracking-[0.3em] mb-6 ${tierMeta[tier].color}`}>
                {tierMeta[tier].label}
              </h3>
              <div className="flex flex-wrap justify-center items-center gap-6 lg:gap-10">
                {items.map((sponsor) => (
                  <div
                    key={sponsor.id}
                    className={`relative ${tierMeta[tier].size} bg-brand-cream/5 hover:bg-brand-cream rounded-xl p-3 grayscale brightness-200 contrast-50 hover:grayscale-0 hover:brightness-100 hover:contrast-100 transition-all duration-300 border border-brand-cream/10 hover:border-brand-gold`}
                  >
                    <img
                      src={sponsor.logo}
                      alt={`${sponsor.name}`}
                      className="absolute inset-3 w-[calc(100%-1.5rem)] h-[calc(100%-1.5rem)] object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
}
