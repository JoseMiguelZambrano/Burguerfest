import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { AdminNavbar, type AdminTab } from "@/components/admin/navbar";
import { RestaurantList, type Restaurant } from "@/components/admin/restaurant-list";
import { ParticipantList, type Participant } from "@/components/admin/participant-list";
import { SolicitudesList, type SolicitudRestaurante } from "@/components/admin/solicitudes-list";
import { SponsorList, type AdminSponsor } from "@/components/admin/sponsor-list";
import { useAuth } from "@/contexts/auth-context";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";

type RestaurantRow = {
  id: string;
  name: string;
  location: string;
  schedule: string | null;
  status: "pending" | "approved" | "rejected";
  signature_dish: string | null;
  description: string | null;
  instagram: string | null;
  video_url: string | null;
  logo_url: string | null;
  created_at: string;
  profiles?: { email?: string | null; display_name?: string | null } | null;
};

type SponsorRow = {
  id: string;
  company_name: string;
  contact_name: string | null;
  contact_phone: string | null;
  status: "pending" | "approved" | "rejected";
  tier: "gold" | "silver" | "bronze";
  created_at: string;
  logo_url: string | null;
  accreditation_code: string | null;
  accreditation_used: boolean;
  accreditation_used_at: string | null;
  profiles?: { email?: string | null; display_name?: string | null } | null;
};

type ProfileRow = {
  id: string;
  email: string | null;
  display_name: string | null;
  role: "admin" | "restaurante" | "patrocinador";
  created_at: string;
};

function statusToBadge(s: string): Restaurant["status"] {
  if (s === "approved") return "activo";
  if (s === "pending") return "revision";
  return "inactivo";
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `Hace ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `Hace ${h} h`;
  const d = Math.floor(h / 24);
  return `Hace ${d} d`;
}

export default function Admin() {
  const { session, role, loading: authLoading, signOut } = useAuth();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<AdminTab>("solicitudes");

  const [restaurants, setRestaurants] = useState<RestaurantRow[]>([]);
  const [sponsors, setSponsors] = useState<SponsorRow[]>([]);
  const [pendingR, setPendingR] = useState<RestaurantRow[]>([]);
  const [pendingS, setPendingS] = useState<SponsorRow[]>([]);
  const [participants, setParticipants] = useState<ProfileRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadAll() {
    setLoading(true);
    setError(null);
    try {
      const [r, s, sub, p] = await Promise.all([
        api<{ items: RestaurantRow[] }>("/admin/restaurants"),
        api<{ items: SponsorRow[] }>("/admin/sponsors"),
        api<{ restaurants: RestaurantRow[]; sponsors: SponsorRow[] }>("/admin/submissions"),
        api<{ items: ProfileRow[] }>("/admin/participants"),
      ]);
      setRestaurants(r.items);
      setSponsors(s.items);
      setPendingR(sub.restaurants);
      setPendingS(sub.sponsors);
      setParticipants(p.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error cargando datos");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!authLoading && session && role === "admin") loadAll();
  }, [authLoading, session, role]);

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  }

  if (!session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background bg-grain">
        <p className="font-display text-3xl text-brand-ink">Acceso restringido</p>
        <p className="text-muted-foreground">Necesitas iniciar sesión como administrador.</p>
        <Button onClick={() => navigate("/login")} className="bg-brand-flame hover:bg-brand-flame/90 text-brand-cream font-bold uppercase tracking-wider">
          Iniciar sesión
        </Button>
      </div>
    );
  }

  if (role !== "admin") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6 text-center bg-background bg-grain">
        <p className="font-display text-3xl text-brand-ink">Permisos insuficientes</p>
        <p className="text-muted-foreground">Tu cuenta no tiene permisos de administrador.</p>
        <p className="text-sm text-muted-foreground max-w-md">Pídele a un administrador que ejecute en Supabase:<br/>
          <code className="bg-muted px-2 py-1 rounded mt-2 inline-block text-xs">update profiles set role='admin' where email='tu@correo.com';</code>
        </p>
        <Button variant="outline" onClick={async () => { await signOut(); navigate("/login"); }} className="border-brand-maroon text-brand-maroon hover:bg-brand-maroon hover:text-brand-cream">
          Cerrar sesión
        </Button>
      </div>
    );
  }

  const restaurantRows: Restaurant[] = restaurants.map((r) => ({
    id: r.id,
    name: r.name,
    address: r.location,
    schedule: r.schedule ?? "",
    socialHandle: r.instagram ?? r.profiles?.email ?? "",
    status: statusToBadge(r.status),
    avatarUrl: r.logo_url ?? undefined,
  }));

  const participantRows: Participant[] = participants.map((p) => ({
    id: p.id,
    name: p.display_name ?? p.email ?? "Sin nombre",
    email: p.email ?? "",
    participantId: p.role.toUpperCase(),
    region: "—",
    status: "activo",
  }));

  const solicitudes: SolicitudRestaurante[] = [
    ...pendingR.map<SolicitudRestaurante>((r) => ({
      id: `r-${r.id}`,
      name: r.name,
      type: "restaurante",
      timestamp: timeAgo(r.created_at),
      location: r.location,
      schedule: r.schedule ?? undefined,
      starDish: r.signature_dish ?? undefined,
      socialHandle: r.instagram ?? undefined,
      description: r.description ?? undefined,
      videoUrl: r.video_url ?? undefined,
      avatarUrl: r.logo_url ?? undefined,
    })),
    ...pendingS.map<SolicitudRestaurante>((s) => ({
      id: `s-${s.id}`,
      name: s.company_name,
      type: "patrocinador",
      timestamp: timeAgo(s.created_at),
      description: s.contact_name ? `Contacto: ${s.contact_name}` : undefined,
      avatarUrl: s.logo_url ?? undefined,
    })),
  ];

  async function approveRestaurant(id: string) {
    await api(`/admin/restaurants/${id}`, { method: "PATCH", json: { status: "approved" } });
    await loadAll();
  }
  async function rejectRestaurant(id: string) {
    await api(`/admin/restaurants/${id}`, { method: "PATCH", json: { status: "rejected" } });
    await loadAll();
  }
  async function approveSponsor(id: string) {
    await api(`/admin/sponsors/${id}`, { method: "PATCH", json: { status: "approved" } });
    await loadAll();
  }
  async function rejectSponsor(id: string) {
    await api(`/admin/sponsors/${id}`, { method: "PATCH", json: { status: "rejected" } });
    await loadAll();
  }

  async function onAprobar(prefixedId: string) {
    if (prefixedId.startsWith("r-")) await approveRestaurant(prefixedId.slice(2));
    else if (prefixedId.startsWith("s-")) await approveSponsor(prefixedId.slice(2));
  }
  async function onRechazar(prefixedId: string) {
    if (prefixedId.startsWith("r-")) await rejectRestaurant(prefixedId.slice(2));
    else if (prefixedId.startsWith("s-")) await rejectSponsor(prefixedId.slice(2));
  }

  async function deleteRestaurant(id: string) {
    if (!confirm("¿Eliminar este restaurante?")) return;
    await api(`/admin/restaurants/${id}`, { method: "DELETE" });
    await loadAll();
  }
  async function deleteSponsor(id: string) {
    if (!confirm("¿Eliminar este patrocinador?")) return;
    await api(`/admin/sponsors/${id}`, { method: "DELETE" });
    await loadAll();
  }
  async function generateSponsorCode(id: string): Promise<string> {
    const res = await api<{ code: string }>(`/admin/sponsors/${id}/accreditation-code`, { method: "POST" });
    await loadAll();
    return res.code;
  }
  async function updateSponsorPhone(id: string, phone: string) {
    await api(`/admin/sponsors/${id}`, { method: "PATCH", json: { contact_phone: phone || null } });
    await loadAll();
  }

  const sponsorRows: AdminSponsor[] = sponsors.map((s) => ({
    id: s.id,
    company_name: s.company_name,
    contact_name: s.contact_name,
    contact_phone: s.contact_phone,
    tier: s.tier,
    status: s.status,
    logo_url: s.logo_url,
    accreditation_code: s.accreditation_code,
    accreditation_used: s.accreditation_used,
    accreditation_used_at: s.accreditation_used_at,
    profile_email: s.profiles?.email ?? null,
  }));

  async function deleteParticipant(id: string) {
    if (!confirm("¿Eliminar este usuario? Esta acción es permanente.")) return;
    await api(`/admin/participants/${id}`, { method: "DELETE" });
    await loadAll();
  }

  return (
    <div className="min-h-screen bg-background bg-grain">
      <AdminNavbar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {error && (
          <div className="max-w-7xl mx-auto mb-4 p-4 rounded-xl bg-brand-flame/10 border border-brand-flame/30 text-brand-flame text-sm">
            {error}
          </div>
        )}
        {loading && (
          <p className="max-w-7xl mx-auto text-muted-foreground">Cargando...</p>
        )}

        {!loading && activeTab === "restaurantes" && (
          <RestaurantList
            restaurants={restaurantRows}
            onDelete={deleteRestaurant}
            onViewDetails={(id) => console.log("view", id)}
            onWhatsApp={(id) => console.log("whatsapp", id)}
          />
        )}

        {!loading && activeTab === "participantes" && (
          <ParticipantList
            participants={participantRows}
            onDelete={deleteParticipant}
            onViewProfile={(id) => console.log("profile", id)}
            onEmail={(id) => {
              const p = participants.find((x) => x.id === id);
              if (p?.email) window.location.href = `mailto:${p.email}`;
            }}
          />
        )}

        {!loading && activeTab === "solicitudes" && (
          <SolicitudesList
            solicitudes={solicitudes}
            onAprobar={onAprobar}
            onRechazar={onRechazar}
          />
        )}

        {!loading && activeTab === "patrocinadores" && (
          <SponsorList
            sponsors={sponsorRows}
            onGenerateCode={generateSponsorCode}
            onUpdatePhone={updateSponsorPhone}
            onDelete={deleteSponsor}
          />
        )}
      </main>

      <footer className="w-full border-t border-border bg-brand-maroon-deep text-brand-cream py-6 mt-10">
        <div className="px-6 lg:px-8 text-center">
          <p className="text-sm text-brand-cream/60">
            © {new Date().getFullYear()} Burger Fest · Panel de administración
          </p>
        </div>
      </footer>
    </div>
  );
}
