import { Link } from "wouter";
import { Instagram, Facebook, Twitter, Flame, MapPin, Mail } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-maroon-deep text-brand-cream" role="contentinfo">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-14 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-5">
              <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-brand-gold/50">
                <img
                  src="https://res.cloudinary.com/ddqarpruz/image/upload/v1779351381/burger-fest/seed/logo-dark.jpg"
                  alt="Burger Fest Logo"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              <span className="font-display text-2xl text-brand-cream tracking-wide">Burger Fest</span>
            </Link>
            <p className="text-brand-cream/70 text-sm leading-relaxed">
              El festival gastronómico más importante dedicado a la cultura de las hamburguesas.
              Desde 2017 celebrando el sabor.
            </p>
            <div className="mt-5 flex items-center gap-2 text-sm text-brand-gold">
              <Flame className="w-4 h-4" />
              <span className="font-semibold">21 – 30 Junio 2026</span>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-brand-gold mb-5">
              Explorar
            </h3>
            <ul className="space-y-3">
              <li><Link href="/" className="text-brand-cream/70 hover:text-brand-gold transition-colors text-sm">Inicio</Link></li>
              <li><a href="#eventos" className="text-brand-cream/70 hover:text-brand-gold transition-colors text-sm">Eventos</a></li>
              <li><a href="#restaurantes" className="text-brand-cream/70 hover:text-brand-gold transition-colors text-sm">Restaurantes</a></li>
              <li><a href="#patrocinadores" className="text-brand-cream/70 hover:text-brand-gold transition-colors text-sm">Patrocinadores</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-brand-gold mb-5">
              Participar
            </h3>
            <ul className="space-y-3">
              <li><Link href="/registro/restaurante" className="text-brand-cream/70 hover:text-brand-gold transition-colors text-sm">Inscribir Restaurante</Link></li>
              <li><Link href="/registro/patrocinador" className="text-brand-cream/70 hover:text-brand-gold transition-colors text-sm">Ser Patrocinador</Link></li>
              <li><Link href="/contacto" className="text-brand-cream/70 hover:text-brand-gold transition-colors text-sm">Contacto</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-brand-gold mb-5">
              Conecta
            </h3>
            <div className="flex items-center gap-3 mb-5">
              <a href="https://instagram.com/burgerfestvzla" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-full bg-brand-cream/10 hover:bg-brand-gold hover:text-brand-ink transition-all" aria-label="Instagram"><Instagram className="w-4 h-4" /></a>
              <a href="https://facebook.com/burgerfest" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-full bg-brand-cream/10 hover:bg-brand-gold hover:text-brand-ink transition-all" aria-label="Facebook"><Facebook className="w-4 h-4" /></a>
              <a href="https://twitter.com/burgerfest" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-full bg-brand-cream/10 hover:bg-brand-gold hover:text-brand-ink transition-all" aria-label="Twitter"><Twitter className="w-4 h-4" /></a>
            </div>
            <div className="space-y-2 text-sm text-brand-cream/70">
              <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-brand-gold" /><span>SC Pabellones</span></div>
              <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-brand-gold" /><span>hola@burgerfest.com</span></div>
            </div>
          </div>
        </div>

        <div className="border-t border-brand-cream/10 pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-brand-cream/50">
              © {currentYear} Burger Fest. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/privacidad" className="text-sm text-brand-cream/50 hover:text-brand-gold transition-colors">Privacidad</Link>
              <Link href="/terminos" className="text-sm text-brand-cream/50 hover:text-brand-gold transition-colors">Términos</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
