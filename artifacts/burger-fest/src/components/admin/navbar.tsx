import { ChevronDown, User } from "lucide-react";
import { useState } from "react";

interface NavbarProps {
  activeTab: "solicitudes" | "restaurantes" | "participantes";
  onTabChange: (tab: "solicitudes" | "restaurantes" | "participantes") => void;
}

export function AdminNavbar({ activeTab, onTabChange }: NavbarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const tabs = [
    { id: "solicitudes" as const, label: "Solicitudes" },
    { id: "restaurantes" as const, label: "Restaurantes" },
    { id: "participantes" as const, label: "Participantes" },
  ];

  return (
    <header className="w-full bg-[#1e3a5f] shadow-lg">
      <div className="w-full px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <img
              src="https://res.cloudinary.com/ddqarpruz/image/upload/v1779351381/burger-fest/seed/logo-dark.jpg"
              alt="Burger Fest Logo"
              width={48}
              height={48}
              className="rounded-lg"
            />
          </div>

          <nav className="flex items-center gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`
                  px-5 py-2 text-sm font-medium rounded-md transition-all duration-200
                  ${
                    activeTab === tab.id
                      ? "bg-white/15 text-white border-b-2 border-white"
                      : "text-white/70 hover:text-white hover:bg-white/10"
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
              className="flex items-center gap-3 text-white/90 hover:text-white transition-colors"
            >
              <span className="text-sm font-medium hidden sm:block">@burgerplaza</span>
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <ChevronDown className="w-4 h-4" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-border py-1 z-50">
                <a href="#" className="block px-4 py-2 text-sm text-foreground hover:bg-muted">
                  Mi Perfil
                </a>
                <a href="#" className="block px-4 py-2 text-sm text-foreground hover:bg-muted">
                  Configuración
                </a>
                <hr className="my-1 border-border" />
                <a href="#" className="block px-4 py-2 text-sm text-destructive hover:bg-muted">
                  Cerrar Sesión
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
