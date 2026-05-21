import { Link } from "wouter";
import { ArrowLeft, Flame } from "lucide-react";

interface PageHeaderProps {
  backHref?: string;
  backLabel?: string;
}

export function PageHeader({ backHref = "/", backLabel = "Volver al inicio" }: PageHeaderProps) {
  return (
    <>
      <div className="bg-brand-ink text-brand-cream">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-9 flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <Flame className="w-3.5 h-3.5 text-brand-gold" />
            <span className="font-medium tracking-wide">21 – 30 Junio 2026 · SC Pabellones</span>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-50 w-full bg-brand-maroon-deep/95 backdrop-blur-md border-b border-brand-maroon shadow-sm">
        <nav className="max-w-5xl mx-auto px-6 lg:px-8 h-16 lg:h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3" aria-label="Burger Fest">
            <div className="relative w-11 h-11 rounded-full overflow-hidden ring-2 ring-brand-gold/60 bg-brand-ink">
              <img
                src="https://res.cloudinary.com/ddqarpruz/image/upload/v1779351381/burger-fest/seed/logo-dark.jpg"
                alt="Burger Fest"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div className="hidden sm:flex flex-col leading-none">
              <span className="font-display text-2xl text-brand-cream tracking-wide">Burger Fest</span>
              <span className="text-[10px] uppercase tracking-[0.25em] text-brand-gold">2026</span>
            </div>
          </Link>
          <Link
            href={backHref}
            className="flex items-center gap-2 text-brand-cream/80 hover:text-brand-gold transition-colors text-sm font-semibold uppercase tracking-wider"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">{backLabel}</span>
          </Link>
        </nav>
      </header>
    </>
  );
}
