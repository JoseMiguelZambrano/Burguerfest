import Link from "next/link";
import Image from "next/image";
import { Instagram, Facebook, Twitter } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-foreground text-background py-12 lg:py-16" role="contentinfo">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                <Image
                  src="/images/logo-dark.jpeg"
                  alt="Burger Fest Logo"
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-xl font-bold">Burger Fest</span>
            </Link>
            <p className="text-background/70 text-sm">
              El festival gastronómico más importante dedicado a la cultura de las hamburguesas. 
              Desde 2017 celebrando el sabor.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
              Enlaces Rápidos
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-background/70 hover:text-background transition-colors text-sm">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="#eventos" className="text-background/70 hover:text-background transition-colors text-sm">
                  Eventos
                </Link>
              </li>
              <li>
                <Link href="#restaurantes" className="text-background/70 hover:text-background transition-colors text-sm">
                  Restaurantes
                </Link>
              </li>
              <li>
                <Link href="#patrocinadores" className="text-background/70 hover:text-background transition-colors text-sm">
                  Patrocinadores
                </Link>
              </li>
            </ul>
          </div>

          {/* Participate */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
              Participar
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/registro/restaurante" className="text-background/70 hover:text-background transition-colors text-sm">
                  Inscribir Restaurante
                </Link>
              </li>
              <li>
                <Link href="/registro/patrocinador" className="text-background/70 hover:text-background transition-colors text-sm">
                  Ser Patrocinador
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="text-background/70 hover:text-background transition-colors text-sm">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
              Síguenos
            </h3>
            <div className="flex items-center gap-4">
              <a 
                href="https://instagram.com/burgerfest" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-background/10 hover:bg-background/20 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://facebook.com/burgerfest" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-background/10 hover:bg-background/20 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="https://twitter.com/burgerfest" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-background/10 hover:bg-background/20 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-background/10 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-background/60">
              © {currentYear} Burger Fest. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/privacidad" className="text-sm text-background/60 hover:text-background transition-colors">
                Privacidad
              </Link>
              <Link href="/terminos" className="text-sm text-background/60 hover:text-background transition-colors">
                Términos
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
