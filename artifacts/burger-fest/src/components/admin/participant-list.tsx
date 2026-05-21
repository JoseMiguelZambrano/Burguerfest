"use client";

import { Search, Filter, Trash2, Link as LinkIcon, Mail, MapPin, User } from "lucide-react";

export interface Participant {
  id: string;
  name: string;
  email: string;
  participantId: string;
  region: string;
  status: "activo" | "revision" | "inactivo";
  avatarUrl?: string;
}

interface ParticipantRowProps {
  participant: Participant;
  onDelete: (id: string) => void;
  onViewProfile: (id: string) => void;
  onEmail: (id: string) => void;
}

function StatusBadge({ status }: { status: Participant["status"] }) {
  const config = {
    activo:   { label: "Activo",      className: "bg-emerald-600 text-white badge-active" },
    revision: { label: "En revisión", className: "bg-brand-gold text-brand-ink badge-review" },
    inactivo: { label: "Inactivo",    className: "bg-muted text-muted-foreground" },
  };
  const { label, className } = config[status];
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${className}`}>
      {label}
    </span>
  );
}

function ParticipantRow({ participant, onDelete, onViewProfile, onEmail }: ParticipantRowProps) {
  return (
    <div className="w-full bg-card rounded-xl border border-border p-5 flex flex-col lg:flex-row items-start lg:items-center gap-5 hover:border-brand-gold/60 hover:shadow-md transition-all">
      <div className="flex-shrink-0">
        <div className="w-14 h-14 rounded-full bg-brand-maroon/10 flex items-center justify-center overflow-hidden border-2 border-brand-gold/30">
          {participant.avatarUrl ? (
            <img src={participant.avatarUrl} alt={participant.name} className="w-full h-full object-cover" />
          ) : (
            <User className="w-7 h-7 text-brand-maroon" />
          )}
        </div>
      </div>

      <div className="flex-1 min-w-0 space-y-1.5">
        <h3 className="font-display text-xl text-brand-ink tracking-wide truncate">{participant.name}</h3>
        <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5"><Mail className="w-4 h-4 text-brand-flame" />{participant.email}</span>
          <span className="flex items-center gap-1.5"><span className="text-xs font-bold text-brand-maroon">ROL:</span>{participant.participantId}</span>
          <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-brand-flame" />{participant.region}</span>
        </div>
      </div>

      <StatusBadge status={participant.status} />

      <div className="flex items-center gap-2 flex-shrink-0 w-full lg:w-auto justify-end">
        <button onClick={() => onDelete(participant.id)} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-brand-flame/10 hover:bg-brand-flame hover:text-brand-cream text-brand-flame text-xs font-bold uppercase tracking-wider transition-all">
          <Trash2 className="w-4 h-4" />
          <span className="hidden sm:inline">Eliminar</span>
        </button>
        <button onClick={() => onViewProfile(participant.id)} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-brand-maroon/10 hover:bg-brand-maroon hover:text-brand-cream text-brand-maroon text-xs font-bold uppercase tracking-wider transition-all">
          <LinkIcon className="w-4 h-4" />
          <span className="hidden sm:inline">Perfil</span>
        </button>
        <button onClick={() => onEmail(participant.id)} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-600/10 hover:bg-emerald-600 hover:text-white text-emerald-700 text-xs font-bold uppercase tracking-wider transition-all">
          <Mail className="w-4 h-4" />
          <span className="hidden sm:inline">Email</span>
        </button>
      </div>
    </div>
  );
}

interface ParticipantListProps {
  participants: Participant[];
  onDelete: (id: string) => void;
  onViewProfile: (id: string) => void;
  onEmail: (id: string) => void;
}

export function ParticipantList({ participants, onDelete, onViewProfile, onEmail }: ParticipantListProps) {
  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="mb-7">
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 rounded-full bg-brand-maroon/10 text-brand-maroon">
          <span className="text-xs font-bold uppercase tracking-[0.2em]">Comunidad</span>
        </div>
        <h1 className="font-display text-4xl lg:text-5xl text-brand-ink leading-none">
          Participantes <span className="text-brand-flame">registrados</span>
        </h1>
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar por nombre, email o rol..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-muted/40 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-flame/30 focus:border-brand-flame transition-all"
            />
          </div>
          <button className="p-3 rounded-xl border border-border bg-muted/40 hover:bg-muted transition-colors flex items-center justify-center">
            <Filter className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <div className="space-y-3">
          {participants.length === 0 ? (
            <p className="text-center text-muted-foreground py-10">Aún no hay participantes.</p>
          ) : (
            participants.map((p) => (
              <ParticipantRow
                key={p.id}
                participant={p}
                onDelete={onDelete}
                onViewProfile={onViewProfile}
                onEmail={onEmail}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
