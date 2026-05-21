"use client";

import { useState } from "react";
import { CheckCircle, XCircle, MapPin, Clock, Star, User, Play, Inbox } from "lucide-react";

export interface SolicitudRestaurante {
  id: string;
  name: string;
  type: "restaurante" | "patrocinador";
  timestamp: string;
  location?: string;
  schedule?: string;
  starDish?: string;
  socialHandle?: string;
  description?: string;
  videoUrl?: string;
  avatarUrl?: string;
}

interface SolicitudListProps {
  solicitudes: SolicitudRestaurante[];
  onAprobar: (id: string) => void;
  onRechazar: (id: string) => void;
}

export function SolicitudesList({ solicitudes, onAprobar, onRechazar }: SolicitudListProps) {
  const [selectedId, setSelectedId] = useState<string | null>(
    solicitudes.length > 0 ? solicitudes[0].id : null
  );

  const restaurantes = solicitudes.filter((s) => s.type === "restaurante");
  const patrocinadores = solicitudes.filter((s) => s.type === "patrocinador");
  const selected = solicitudes.find((s) => s.id === selectedId);

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="mb-7">
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 rounded-full bg-brand-flame/10 text-brand-flame">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-flame animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-[0.2em]">Bandeja</span>
        </div>
        <h1 className="font-display text-4xl lg:text-5xl text-brand-ink leading-none">
          Solicitudes <span className="text-brand-flame">pendientes</span>
        </h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <aside className="w-full lg:w-[340px] flex-shrink-0 space-y-5">
          <SidebarGroup
            title={`Restaurantes (${restaurantes.length})`}
            accent="flame"
            emoji="🍔"
            items={restaurantes}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
          <SidebarGroup
            title={`Patrocinadores (${patrocinadores.length})`}
            accent="gold"
            emoji="🏢"
            items={patrocinadores}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </aside>

        <div className="flex-1">
          {selected ? (
            <div className="bg-card rounded-2xl border border-border shadow-xl shadow-brand-maroon/5 overflow-hidden">
              <div className="bg-maroon-gradient px-6 py-5 text-brand-cream">
                <div className="text-xs uppercase tracking-[0.25em] text-brand-gold mb-1">
                  {selected.type === "restaurante" ? "Restaurante" : "Patrocinador"} · {selected.timestamp}
                </div>
                <h2 className="font-display text-3xl lg:text-4xl tracking-wide">
                  {selected.name}
                </h2>
              </div>

              <div className="p-6">
                <div className="flex flex-wrap gap-4 mb-6 text-sm text-foreground">
                  {selected.location && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-brand-flame" />
                      {selected.location}
                    </span>
                  )}
                  {selected.schedule && (
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-brand-flame" />
                      {selected.schedule}
                    </span>
                  )}
                  {selected.starDish && (
                    <span className="flex items-center gap-1.5">
                      <Star className="w-4 h-4 text-brand-gold" />
                      {selected.starDish}
                    </span>
                  )}
                  {selected.socialHandle && (
                    <span className="flex items-center gap-1.5">
                      <User className="w-4 h-4 text-brand-maroon" />
                      {selected.socialHandle}
                    </span>
                  )}
                </div>

                {selected.description && (
                  <div className="mb-6">
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-brand-maroon mb-2">
                      Descripción
                    </h3>
                    <div className="bg-muted/40 rounded-xl p-4 border border-border">
                      <p className="text-sm text-foreground/80 leading-relaxed">
                        {selected.description}
                      </p>
                    </div>
                  </div>
                )}

                {selected.videoUrl && (
                  <div className="mb-7">
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-brand-maroon mb-3">
                      Video de presentación
                    </h3>
                    <div className="aspect-video bg-brand-ink rounded-xl overflow-hidden relative group">
                      <video
                        src={selected.videoUrl}
                        controls
                        className="w-full h-full object-cover"
                        poster={selected.avatarUrl}
                      />
                    </div>
                  </div>
                )}

                {!selected.videoUrl && selected.type === "restaurante" && (
                  <div className="mb-7">
                    <div className="aspect-video bg-brand-ink/90 rounded-xl flex flex-col items-center justify-center text-brand-cream/60 border border-border">
                      <Play className="w-10 h-10 mb-2" />
                      <span className="text-sm">Sin video</span>
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => onAprobar(selected.id)}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase tracking-wider transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Aprobar
                  </button>
                  <button
                    onClick={() => onRechazar(selected.id)}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-brand-flame hover:bg-brand-flame/90 text-brand-cream font-bold uppercase tracking-wider transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
                  >
                    <XCircle className="w-5 h-5" />
                    Rechazar
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-card rounded-2xl border border-border p-16 text-center">
              <Inbox className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">No hay solicitudes pendientes.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SidebarGroup({
  title, accent, emoji, items, selectedId, onSelect,
}: {
  title: string;
  accent: "flame" | "gold";
  emoji: string;
  items: SolicitudRestaurante[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const accentBg = accent === "flame" ? "bg-brand-flame/15" : "bg-brand-gold/15";
  const accentBorder = accent === "flame" ? "border-brand-flame" : "border-brand-gold";
  const accentText = accent === "flame" ? "text-brand-flame" : "text-brand-maroon";

  return (
    <div className="bg-card rounded-2xl border border-border p-4 shadow-sm">
      <h3 className={`text-xs font-bold uppercase tracking-[0.2em] ${accentText} mb-3`}>
        {title}
      </h3>
      <div className="space-y-1.5">
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground px-2 py-3 text-center">Sin solicitudes</p>
        ) : (
          items.map((s) => (
            <button
              key={s.id}
              onClick={() => onSelect(s.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                selectedId === s.id
                  ? `${accentBg} ${accentBorder}`
                  : "bg-transparent border-transparent hover:bg-muted/60"
              }`}
            >
              <div className={`w-10 h-10 rounded-full ${accentBg} flex items-center justify-center text-lg`}>
                {emoji}
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{s.name}</p>
                <p className="text-xs text-muted-foreground">{s.timestamp}</p>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
