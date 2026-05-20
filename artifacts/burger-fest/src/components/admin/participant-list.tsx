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

function ParticipantRow({ participant, onDelete, onViewProfile, onEmail }: ParticipantRowProps) {
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
          {participant.avatarUrl ? (
            <img
              src={participant.avatarUrl}
              alt={participant.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-10 h-10 text-muted-foreground" />
          )}
        </div>
      </div>

      {/* Info Section */}
      <div className="flex-1 min-w-0 space-y-2">
        <h3 className="text-lg font-semibold text-foreground truncate">
          {participant.name}
        </h3>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Mail className="w-4 h-4" />
            {participant.email}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-xs font-semibold">ID:</span>
            {participant.participantId}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4" />
            {participant.region}
          </span>
        </div>
      </div>

      {/* Status Badge */}
      <div className="flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground hidden md:inline">Estado:</span>
          <StatusBadge status={participant.status} />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 flex-shrink-0 w-full lg:w-auto justify-end">
        <button
          onClick={() => onDelete(participant.id)}
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
          onClick={() => onViewProfile(participant.id)}
          className="
            inline-flex items-center gap-2 px-4 py-2.5 rounded-lg
            bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium
            transition-all duration-200 shadow-sm hover:shadow-md
            active:scale-95
          "
        >
          <LinkIcon className="w-4 h-4" />
          <span>VER PERFIL</span>
        </button>

        <button
          onClick={() => onEmail(participant.id)}
          className="
            inline-flex items-center gap-2 px-4 py-2.5 rounded-lg
            bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium
            transition-all duration-200 shadow-sm hover:shadow-md
            active:scale-95
          "
        >
          <Mail className="w-4 h-4" />
          <span className="hidden sm:inline">CONTACTAR EMAIL</span>
          <span className="sm:hidden">EMAIL</span>
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

export function ParticipantList({
  participants,
  onDelete,
  onViewProfile,
  onEmail,
}: ParticipantListProps) {
  return (
    <div className="w-full">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          PANEL DE ADMINISTRACIÓN - GESTIÓN DE PARTICIPANTES
        </h1>
      </div>

      {/* Content Card */}
      <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
        {/* Section Header */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-foreground">
            ESTADO DE PARTICIPANTES{" "}
            <span className="text-muted-foreground font-normal">(TIPO: PARTICIPANTE)</span>
          </h2>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar por nombre, email o ID..."
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

        {/* Participant Rows */}
        <div className="space-y-4">
          {participants.map((participant) => (
            <ParticipantRow
              key={participant.id}
              participant={participant}
              onDelete={onDelete}
              onViewProfile={onViewProfile}
              onEmail={onEmail}
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
