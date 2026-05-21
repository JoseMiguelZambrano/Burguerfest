"use client";

import { Search, Filter, Trash2, Link as LinkIcon, MessageCircle, MapPin, Clock } from "lucide-react";

export interface Restaurant {
  id: string;
  name: string;
  address: string;
  schedule: string;
  socialHandle: string;
  status: "activo" | "revision" | "inactivo";
  avatarUrl?: string;
}

interface RestaurantRowProps {
  restaurant: Restaurant;
  onDelete: (id: string) => void;
  onViewDetails: (id: string) => void;
  onWhatsApp: (id: string) => void;
}

function StatusBadge({ status }: { status: Restaurant["status"] }) {
  const config = {
    activo:    { label: "Activo",      className: "bg-emerald-600 text-white badge-active" },
    revision:  { label: "En revisión", className: "bg-brand-gold text-brand-ink badge-review" },
    inactivo:  { label: "Inactivo",    className: "bg-muted text-muted-foreground" },
  };
  const { label, className } = config[status];
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${className}`}>
      {label}
    </span>
  );
}

function RestaurantRow({ restaurant, onDelete, onViewDetails, onWhatsApp }: RestaurantRowProps) {
  return (
    <div className="w-full bg-card rounded-xl border border-border p-5 flex flex-col lg:flex-row items-start lg:items-center gap-5 hover:border-brand-gold/60 hover:shadow-md transition-all">
      <div className="flex-shrink-0">
        <div className="w-14 h-14 rounded-full bg-brand-maroon/10 flex items-center justify-center overflow-hidden border-2 border-brand-gold/30">
          {restaurant.avatarUrl ? (
            <img src={restaurant.avatarUrl} alt={restaurant.name} className="w-full h-full object-cover" />
          ) : (
            <svg className="w-8 h-8 text-brand-maroon" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          )}
        </div>
      </div>

      <div className="flex-1 min-w-0 space-y-1.5">
        <h3 className="font-display text-xl text-brand-ink tracking-wide truncate">{restaurant.name}</h3>
        <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-brand-flame" />{restaurant.address}</span>
          <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-brand-flame" />{restaurant.schedule}</span>
          {restaurant.socialHandle && (
            <span className="flex items-center gap-1.5"><span className="text-brand-maroon font-bold">@</span>{restaurant.socialHandle}</span>
          )}
        </div>
      </div>

      <StatusBadge status={restaurant.status} />

      <div className="flex items-center gap-2 flex-shrink-0 w-full lg:w-auto justify-end">
        <button onClick={() => onDelete(restaurant.id)} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-brand-flame/10 hover:bg-brand-flame hover:text-brand-cream text-brand-flame text-xs font-bold uppercase tracking-wider transition-all">
          <Trash2 className="w-4 h-4" />
          <span className="hidden sm:inline">Eliminar</span>
        </button>
        <button onClick={() => onViewDetails(restaurant.id)} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-brand-maroon/10 hover:bg-brand-maroon hover:text-brand-cream text-brand-maroon text-xs font-bold uppercase tracking-wider transition-all">
          <LinkIcon className="w-4 h-4" />
          <span className="hidden sm:inline">Ficha</span>
        </button>
        <button onClick={() => onWhatsApp(restaurant.id)} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-600/10 hover:bg-emerald-600 hover:text-white text-emerald-700 text-xs font-bold uppercase tracking-wider transition-all">
          <MessageCircle className="w-4 h-4" />
          <span className="hidden sm:inline">WhatsApp</span>
        </button>
      </div>
    </div>
  );
}

interface RestaurantListProps {
  restaurants: Restaurant[];
  onDelete: (id: string) => void;
  onViewDetails: (id: string) => void;
  onWhatsApp: (id: string) => void;
}

export function RestaurantList({ restaurants, onDelete, onViewDetails, onWhatsApp }: RestaurantListProps) {
  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="mb-7">
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 rounded-full bg-brand-maroon/10 text-brand-maroon">
          <span className="text-xs font-bold uppercase tracking-[0.2em]">Directorio</span>
        </div>
        <h1 className="font-display text-4xl lg:text-5xl text-brand-ink leading-none">
          Restaurantes <span className="text-brand-flame">activos</span>
        </h1>
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar por nombre o ubicación..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-muted/40 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-flame/30 focus:border-brand-flame transition-all"
            />
          </div>
          <button className="p-3 rounded-xl border border-border bg-muted/40 hover:bg-muted transition-colors flex items-center justify-center">
            <Filter className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <div className="space-y-3">
          {restaurants.length === 0 ? (
            <p className="text-center text-muted-foreground py-10">Aún no hay restaurantes aprobados.</p>
          ) : (
            restaurants.map((r) => (
              <RestaurantRow
                key={r.id}
                restaurant={r}
                onDelete={onDelete}
                onViewDetails={onViewDetails}
                onWhatsApp={onWhatsApp}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
