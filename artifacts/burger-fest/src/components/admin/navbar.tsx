import { ChevronDown, User, LogOut, Flame } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { useAuth } from "@/contexts/auth-context";

export type AdminTab = "solicitudes" | "restaurantes" | "patrocinadores" | "participantes";

interface NavbarProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
}

export function AdminNavbar({ activeTab, onTabChange }: NavbarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { session } = useAuth();
  const email = session?.user?.email ?? "admin";

  const tabs = [
    { id: "solicitudes" as const, label: "Solicitudes" },
    { id: "restaurantes" as const, label: "Restaurantes" },
    { id: "patrocinadores" as const, label: "Patrocinadores" },
    { id: "participantes" as const, label: "Participantes" },
  ];

  const handleLogout = () => {
    try {
      localStorage.removeItem("bf-auth");
      sessionStorage.clear();
    } catch (_) {}
    window.location.assign("/");
  };

  return (
    <>
      <div className="bg-brand-ink text-brand-cream">
        <div className="w-full px-6 lg:px-8 h-9 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Flame className="w-3.5 h-3.5 text-brand-gold" />
            <span className="font-medium tracking-wide uppercase">Panel de Administración</span>
          </div>
          <span className="hidden sm:inline text-brand-cream/60">Burger Fest 2026</span>
        </div>
      </div>

      <header className="w-full bg-brand-maroon-deep shadow-lg border-b border-brand-maroon">
        <div className="w-full px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-11 h-11 rounded-full overflow-hidden ring-2 ring-brand-gold/60 bg-brand-ink">
                <img
                  src="https://res.cloudinary.com/ddqarpruz/image/upload/v1779351381/burger-fest/seed/logo-dark.jpg"
                  alt="Burger Fest Logo"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              <div className="hidden sm:flex flex-col leading-none">
                <span className="font-display text-xl text-brand-cream tracking-wide">Burger Fest</span>
                <span className="text-[10px] uppercase tracking-[0.25em] text-brand-gold">Admin</span>
              </div>
            </Link>

            <nav className="flex items-center gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`
                    px-4 lg:px-5 py-2 text-xs lg:text-sm font-semibold uppercase tracking-wider rounded-md transition-all
                    ${
                      activeTab === tab.id
                        ? "bg-brand-gold text-brand-ink shadow-md"
                        : "text-brand-cream/70 hover:text-brand-cream hover:bg-brand-cream/10"
                    }
                  `}
                >
                  {tab.label}
                </button>
              ))}
            </nav>

            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-3 text-brand-cream/90 hover:text-brand-gold transition-colors"
              >
                <span className="text-sm font-medium hidden md:block max-w-[160px] truncate">{email}</span>
                <div className="w-9 h-9 rounded-full bg-brand-cream/15 border border-brand-gold/40 flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
                <ChevronDown className="w-4 h-4" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-card rounded-lg shadow-2xl border border-border py-1 z-50">
                  <div className="px-4 py-2 text-xs text-muted-foreground border-b border-border truncate">
                    {email}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-brand-flame hover:bg-brand-flame/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
