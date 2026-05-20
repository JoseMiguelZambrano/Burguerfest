"use client";

import { useState } from "react";
import { CheckCircle, XCircle, MapPin, Clock, Star, User, Play } from "lucide-react";

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
    <div className="w-full">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          PANEL DE ADMINISTRACIÓN - GESTIÓN DE SOLICITUDES
        </h1>
      </div>

      {/* Master-Detail Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar - Solicitudes List */}
        <div className="w-full lg:w-[350px] flex-shrink-0 space-y-6">
          {/* Restaurantes Section */}
          <div className="bg-card rounded-xl border border-border p-4">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-3">
              Solicitudes de Restaurantes ({restaurantes.length})
            </h3>
            <div className="space-y-2">
              {restaurantes.map((solicitud) => (
                <button
                  key={solicitud.id}
                  onClick={() => setSelectedId(solicitud.id)}
                  className={`
                    w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200
                    ${
                      selectedId === solicitud.id
                        ? "bg-primary/10 border-2 border-primary"
                        : "bg-muted/50 hover:bg-muted border-2 border-transparent"
                    }
                  `}
                >
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                    <span className="text-lg">🍔</span>
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-foreground">{solicitud.name}</p>
                    <p className="text-xs text-muted-foreground">{solicitud.timestamp}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Patrocinadores Section */}
          <div className="bg-card rounded-xl border border-border p-4">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-3">
              Solicitudes de Patrocinadores ({patrocinadores.length})
            </h3>
            <div className="space-y-2">
              {patrocinadores.map((solicitud) => (
                <button
                  key={solicitud.id}
                  onClick={() => setSelectedId(solicitud.id)}
                  className={`
                    w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200
                    ${
                      selectedId === solicitud.id
                        ? "bg-primary/10 border-2 border-primary"
                        : "bg-muted/50 hover:bg-muted border-2 border-transparent"
                    }
                  `}
                >
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-lg">🏢</span>
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-foreground">{solicitud.name}</p>
                    <p className="text-xs text-muted-foreground">{solicitud.timestamp}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Detail Panel */}
        <div className="flex-1">
          {selected ? (
            <div className="bg-card rounded-2xl border border-border p-6">
              {/* Detail Header */}
              <div className="mb-6">
                <h2 className="text-xl font-bold text-foreground">
                  DETALLE DE SOLICITUD (TIPO: {selected.type.toUpperCase()}) - {selected.name.toUpperCase()}
                </h2>

                {/* Quick Info */}
                <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
                  {selected.location && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-red-500" />
                      {selected.location}
                    </span>
                  )}
                  {selected.schedule && (
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-blue-500" />
                      {selected.schedule}
                    </span>
                  )}
                  {selected.starDish && (
                    <span className="flex items-center gap-1.5">
                      <Star className="w-4 h-4 text-amber-500" />
                      {selected.starDish}
                    </span>
                  )}
                  {selected.socialHandle && (
                    <span className="flex items-center gap-1.5">
                      <User className="w-4 h-4 text-emerald-500" />
                      {selected.socialHandle}
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              {selected.description && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-2">
                    Descripción
                  </h3>
                  <div className="bg-muted/50 rounded-xl p-4 border border-border">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {selected.description}
                    </p>
                  </div>
                </div>
              )}

              {/* Video Preview */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-3">
                  Video de Presentación
                </h3>
                <div className="aspect-video bg-slate-900 rounded-xl overflow-hidden relative group">
                  <img
                    src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=450&fit=crop"
                    alt="Video preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                    <button className="w-16 h-16 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-all shadow-lg group-hover:scale-110">
                      <Play className="w-7 h-7 text-slate-900 ml-1" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => onAprobar(selected.id)}
                  className="
                    flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl
                    bg-emerald-600 hover:bg-emerald-700 text-white font-semibold
                    transition-all duration-200 shadow-lg hover:shadow-xl
                    active:scale-[0.98]
                  "
                >
                  <CheckCircle className="w-5 h-5" />
                  APROBAR REGISTRO
                </button>

                <button
                  onClick={() => onRechazar(selected.id)}
                  className="
                    flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl
                    bg-red-600 hover:bg-red-700 text-white font-semibold
                    transition-all duration-200 shadow-lg hover:shadow-xl
                    active:scale-[0.98]
                  "
                >
                  <XCircle className="w-5 h-5" />
                  RECHAZAR REGISTRO
                </button>
              </div>

              {/* Skip Link */}
              <div className="mt-4 text-center">
                <button className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors">
                  Ver Siguiente Solicitud
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-card rounded-2xl border border-border p-12 text-center">
              <p className="text-muted-foreground">Selecciona una solicitud para ver los detalles</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
