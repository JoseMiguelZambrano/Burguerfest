import { Link } from "wouter";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

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

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-sm border-b border-border">
      <nav className="max-w-7xl mx-auto px-6 lg:px-8" aria-label="Navegación principal">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link href="/" className="flex items-center gap-3" aria-label="Burger Fest - Inicio">
            <div className="relative w-12 h-12 lg:w-14 lg:h-14 rounded-lg overflow-hidden bg-foreground">
              <img
                src="/images/logo-dark.jpeg"
                alt="Burger Fest Logo"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <span className="hidden sm:block text-xl lg:text-2xl font-bold text-foreground">
              Burger Fest
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <ul className="flex items-center gap-6">
              {navItems.map((item) => (
                <li key={item.href}>
                  {item.href.startsWith("#") ? (
                    <a
                      href={item.href}
                      className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      href={item.href}
                      className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-3">
              <Button variant="outline" asChild>
                <Link href="/registro">Registro</Link>
              </Button>
              <Button asChild>
                <Link href="/admin">Login</Link>
              </Button>
            </div>
          </div>

          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden pb-6 border-t border-border mt-2 pt-4">
            <ul className="flex flex-col gap-4">
              {navItems.map((item) => (
                <li key={item.href}>
                  {item.href.startsWith("#") ? (
                    <a
                      href={item.href}
                      className="block text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      href={item.href}
                      className="block text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
            <div className="flex flex-col gap-3 mt-6">
              <Button variant="outline" className="w-full" asChild>
                <Link href="/registro">Registro</Link>
              </Button>
              <Button className="w-full" asChild>
                <Link href="/admin">Login</Link>
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
