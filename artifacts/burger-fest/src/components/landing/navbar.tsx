import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Menu, X, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: "Inicio", href: "/" },
  { label: "Eventos", href: "#eventos" },
  { label: "Restaurantes", href: "#restaurantes" },
  { label: "Patrocinadores", href: "#patrocinadores" },
];

export function LandingNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { session, role } = useAuth();
  const handleLogout = () => {
    // Wipe Supabase tokens directly from storage
    try {
      Object.keys(localStorage)
        .filter((k) => k.startsWith("sb-") || k.includes("supabase"))
        .forEach((k) => localStorage.removeItem(k));
      sessionStorage.clear();
    } catch (_) {}
    // reload() works even inside sandboxed iframes; href navigate may not
    window.location.reload();
  };

  return (
    <>
      {/* Top info strip */}
      <div className="bg-brand-ink text-brand-cream text-xs sm:text-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-9 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Flame className="w-3.5 h-3.5 text-brand-gold" />
            <span className="font-medium tracking-wide">21 – 30 Junio 2026 · SC Pabellones</span>
          </div>
          <a
            href="#eventos"
            className="hidden sm:inline-flex items-center gap-1 text-brand-gold hover:text-brand-cream transition-colors font-semibold uppercase tracking-wider"
          >
            Ver programa →
          </a>
        </div>
      </div>

      <header className="sticky top-0 z-50 w-full bg-brand-maroon-deep/95 backdrop-blur-md border-b border-brand-maroon shadow-sm">
        <nav className="max-w-7xl mx-auto px-6 lg:px-8" aria-label="Navegación principal">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <Link href="/" className="flex items-center gap-3" aria-label="Burger Fest - Inicio">
              <div className="relative w-12 h-12 lg:w-14 lg:h-14 rounded-full overflow-hidden ring-2 ring-brand-gold/60 bg-brand-ink">
                <img
                  src="https://res.cloudinary.com/ddqarpruz/image/upload/v1779351381/burger-fest/seed/logo-dark.jpg"
                  alt="Burger Fest Logo"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              <div className="hidden sm:flex flex-col leading-none">
                <span className="font-display text-2xl lg:text-3xl text-brand-cream tracking-wide">
                  Burger Fest
                </span>
                <span className="text-[10px] uppercase tracking-[0.25em] text-brand-gold">
                  2026 · 6ta Edición
                </span>
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <ul className="flex items-center gap-6">
                {navItems.map((item) => (
                  <li key={item.href}>
                    {item.href.startsWith("#") ? (
                      <a
                        href={item.href}
                        className="text-sm font-semibold uppercase tracking-wider text-brand-cream/80 hover:text-brand-gold transition-colors"
                      >
                        {item.label}
                      </a>
                    ) : (
                      <Link
                        href={item.href}
                        className="text-sm font-semibold uppercase tracking-wider text-brand-cream/80 hover:text-brand-gold transition-colors"
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
              <div className="flex items-center gap-3">
                {session ? (
                  <>
                    {role === "admin" && (
                      <Button variant="outline" className="bg-transparent border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-ink" asChild>
                        <Link href="/admin">Admin</Link>
                      </Button>
                    )}
                    <Button variant="outline" className="bg-transparent border-brand-cream/40 text-brand-cream hover:bg-brand-cream/10 hover:text-brand-cream" onClick={handleLogout}>
                      Cerrar sesión
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" className="bg-transparent border-brand-cream/40 text-brand-cream hover:bg-brand-cream/10 hover:text-brand-cream" asChild>
                      <Link href="/registro">Inscríbete</Link>
                    </Button>
                    <Button className="bg-brand-gold text-brand-ink hover:bg-brand-gold/90 font-bold" asChild>
                      <Link href="/login">Login</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>

            <button
              className="md:hidden p-2 text-brand-cream"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-expanded={isMobileMenuOpen}
              aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {isMobileMenuOpen && (
            <div className="md:hidden pb-6 border-t border-brand-maroon mt-2 pt-4">
              <ul className="flex flex-col gap-4">
                {navItems.map((item) => (
                  <li key={item.href}>
                    {item.href.startsWith("#") ? (
                      <a
                        href={item.href}
                        className="block text-base font-semibold uppercase tracking-wider text-brand-cream/80 hover:text-brand-gold transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.label}
                      </a>
                    ) : (
                      <Link
                        href={item.href}
                        className="block text-base font-semibold uppercase tracking-wider text-brand-cream/80 hover:text-brand-gold transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
              <div className="flex flex-col gap-3 mt-6">
                {session ? (
                  <>
                    {role === "admin" && (
                      <Button variant="outline" className="w-full bg-transparent border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-ink" asChild>
                        <Link href="/admin">Admin</Link>
                      </Button>
                    )}
                    <Button variant="outline" className="w-full bg-transparent border-brand-cream/40 text-brand-cream hover:bg-brand-cream/10 hover:text-brand-cream" onClick={handleLogout}>
                      Cerrar sesión
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" className="w-full bg-transparent border-brand-cream/40 text-brand-cream hover:bg-brand-cream/10 hover:text-brand-cream" asChild>
                      <Link href="/registro">Inscríbete</Link>
                    </Button>
                    <Button className="w-full bg-brand-gold text-brand-ink hover:bg-brand-gold/90 font-bold" asChild>
                      <Link href="/login">Login</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </nav>
      </header>
    </>
  );
}
