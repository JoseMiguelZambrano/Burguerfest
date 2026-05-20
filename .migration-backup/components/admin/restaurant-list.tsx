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
    activo: {
      label: "Activo",
      className: "bg-emerald-500 text-white badge-active",
    },
    revision: {
      label: "En Revisión",
      className: "bg-amber-500 text-white badge-review",
    },
    inactivo: {
      label: "Inactivo",
      className: "bg-slate-400 text-white",
    },
  };

  const { label, className } = config[status];

  return (
    <span
      className={`
        inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold
        transition-all duration-300 ${className}
      `}
    >
      {label}
    </span>
  );
}

function RestaurantRow({ restaurant, onDelete, onViewDetails, onWhatsApp }: RestaurantRowProps) {
  return (
    <div
      className="
        w-full bg-card rounded-xl border border-border
        p-5 flex flex-col lg:flex-row items-start lg:items-center gap-5
        hover:shadow-md hover:border-primary/20 transition-all duration-300
      "
    >
      {/* Avatar */}
      <div className="flex-shrink-0">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center overflow-hidden border-2 border-border">
          {restaurant.avatarUrl ? (
            <img
              src={restaurant.avatarUrl}
              alt={restaurant.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <svg
              className="w-10 h-10 text-muted-foreground"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          )}
        </div>
      </div>

      {/* Info Section */}
      <div className="flex-1 min-w-0 space-y-2">
        <h3 className="text-lg font-semibold text-foreground truncate">
          {restaurant.name}
        </h3>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4" />
            {restaurant.address}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            {restaurant.schedule}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-4 h-4 flex items-center justify-center text-xs font-bold">@</span>
            {restaurant.socialHandle}
          </span>
        </div>
      </div>

      {/* Status Badge */}
      <div className="flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground hidden md:inline">Estado:</span>
          <StatusBadge status={restaurant.status} />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 flex-shrink-0 w-full lg:w-auto justify-end">
        <button
          onClick={() => onDelete(restaurant.id)}
          className="
            inline-flex items-center gap-2 px-4 py-2.5 rounded-lg
            bg-red-600 hover:bg-red-700 text-white text-sm font-medium
            transition-all duration-200 shadow-sm hover:shadow-md
            active:scale-95
          "
        >
          <Trash2 className="w-4 h-4" />
          <span>ELIMINAR</span>
        </button>

        <button
          onClick={() => onViewDetails(restaurant.id)}
          className="
            inline-flex items-center gap-2 px-4 py-2.5 rounded-lg
            bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium
            transition-all duration-200 shadow-sm hover:shadow-md
            active:scale-95
          "
        >
          <LinkIcon className="w-4 h-4" />
          <span>VER FICHA</span>
        </button>

        <button
          onClick={() => onWhatsApp(restaurant.id)}
          className="
            inline-flex items-center gap-2 px-4 py-2.5 rounded-lg
            bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium
            transition-all duration-200 shadow-sm hover:shadow-md
            active:scale-95
          "
        >
          <MessageCircle className="w-4 h-4" />
          <span className="hidden sm:inline">CONTACTAR WHATSAPP</span>
          <span className="sm:hidden">WHATSAPP</span>
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

export function RestaurantList({
  restaurants,
  onDelete,
  onViewDetails,
  onWhatsApp,
}: RestaurantListProps) {
  return (
    <div className="w-full">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          PANEL DE ADMINISTRACIÓN - GESTIÓN DE RESTAURANTES
        </h1>
      </div>

      {/* Content Card */}
      <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
        {/* Section Header */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-foreground">
            ESTADO DE RESTAURANTES{" "}
            <span className="text-muted-foreground font-normal">(TIPO: RESTAURANTE)</span>
          </h2>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar por nombre o ubicación..."
              className="
                w-full pl-12 pr-4 py-3 rounded-xl border border-border
                bg-muted/50 text-foreground placeholder:text-muted-foreground
                focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
                transition-all duration-200
              "
            />
          </div>
          <button className="
            p-3 rounded-xl border border-border bg-muted/50
            hover:bg-muted transition-colors duration-200
            flex items-center justify-center
          ">
            <Filter className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Restaurant Rows */}
        <div className="space-y-4">
          {restaurants.map((restaurant) => (
            <RestaurantRow
              key={restaurant.id}
              restaurant={restaurant}
              onDelete={onDelete}
              onViewDetails={onViewDetails}
              onWhatsApp={onWhatsApp}
            />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-2 mt-8">
          <button className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            {"‹"} Anterior
          </button>
          <button className="w-9 h-9 rounded-lg bg-primary text-primary-foreground text-sm font-medium">
            1
          </button>
          <button className="w-9 h-9 rounded-lg hover:bg-muted text-muted-foreground text-sm font-medium transition-colors">
            2
          </button>
          <button className="w-9 h-9 rounded-lg hover:bg-muted text-muted-foreground text-sm font-medium transition-colors">
            3
          </button>
          <button className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            Siguiente {">"}
          </button>
        </div>
      </div>
    </div>
  );
}
