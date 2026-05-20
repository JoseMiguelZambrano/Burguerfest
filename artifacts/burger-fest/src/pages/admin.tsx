import { useState } from "react";
import { AdminNavbar } from "@/components/admin/navbar";
import { RestaurantList, type Restaurant } from "@/components/admin/restaurant-list";
import { ParticipantList, type Participant } from "@/components/admin/participant-list";
import { SolicitudesList, type SolicitudRestaurante } from "@/components/admin/solicitudes-list";

const sampleRestaurants: Restaurant[] = [
  { id: "1", name: "Burger Plaza", address: "Av. Barcelona 123, Barcelona", schedule: "13:00 - 00:00", socialHandle: "@burgerplaza", status: "activo" },
  { id: "2", name: "La Pizzería", address: "C/ Roma 45, Madrid", schedule: "12:00 - 23:00", socialHandle: "@lapizzeriacntr", status: "revision" },
  { id: "3", name: "Tacos El Güero", address: "Pl. Mexico s/n, Valencia", schedule: "18:00 - 01:00", socialHandle: "@tacostguero", status: "inactivo" },
  { id: "4", name: "Sushi Master", address: "C/ Tokio 78, Sevilla", schedule: "12:30 - 23:30", socialHandle: "@sushimaster_es", status: "activo" },
  { id: "5", name: "El Asador", address: "Av. Carnes 321, Bilbao", schedule: "13:00 - 16:00, 20:00 - 00:00", socialHandle: "@elasadorbilbao", status: "revision" },
];

const sampleParticipants: Participant[] = [
  { id: "1", name: "Carlos Martínez", email: "c.martinez@email.com", participantId: "PM10301", region: "Barcelona", status: "activo" },
  { id: "2", name: "Elena García", email: "e.garcia@email.com", participantId: "PM10302", region: "Madrid", status: "revision" },
  { id: "3", name: "Miguel Ruiz", email: "m.ruiz@email.com", participantId: "PM10303", region: "Valencia", status: "inactivo" },
  { id: "4", name: "Ana López", email: "a.lopez@email.com", participantId: "PM10304", region: "Sevilla", status: "activo" },
  { id: "5", name: "Pedro Sánchez", email: "p.sanchez@email.com", participantId: "PM10305", region: "Bilbao", status: "activo" },
];

const sampleSolicitudes: SolicitudRestaurante[] = [
  { id: "1", name: "Burger Plaza", type: "restaurante", timestamp: "Hace 10 min", location: "Barcelona", schedule: "13:00-00:00", starDish: "Burger Trufada", socialHandle: "@burgerplaza", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris." },
  { id: "2", name: "Tacos El Güero", type: "restaurante", timestamp: "Ayer", location: "Valencia", schedule: "18:00-01:00", starDish: "Tacos al Pastor", socialHandle: "@tacostguero", description: "Auténtica comida mexicana con los mejores ingredientes. Nuestros tacos son preparados al momento con recetas tradicionales." },
  { id: "3", name: "Logística Express", type: "patrocinador", timestamp: "Hace 2 horas", description: "Empresa líder en logística y distribución de alimentos. Más de 15 años de experiencia en el sector gastronómico." },
  { id: "4", name: "TecnoFood", type: "patrocinador", timestamp: "Hace 1 día", description: "Soluciones tecnológicas para restaurantes. Software de gestión, TPV y sistemas de pedidos online." },
  { id: "5", name: "La Pizzería", type: "restaurante", timestamp: "Hace 3 días", location: "Madrid", schedule: "12:00-23:00", starDish: "Pizza Napolitana", socialHandle: "@lapizzeria_mad", description: "La mejor pizza artesanal de Madrid. Horno de leña tradicional y masa madre fermentada 48 horas." },
  { id: "6", name: "NUEVO PATROCINANTE", type: "patrocinador", timestamp: "Reciente", description: "Nueva solicitud de patrocinio pendiente de revisión." },
];

export default function Admin() {
  const [activeTab, setActiveTab] = useState<"solicitudes" | "restaurantes" | "participantes">("restaurantes");

  const noop = (id: string) => console.log(id);

  return (
    <div className="min-h-screen bg-background">
      <AdminNavbar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="w-full px-6 lg:px-8 py-8">
        {activeTab === "restaurantes" && (
          <RestaurantList
            restaurants={sampleRestaurants}
            onDelete={noop}
            onViewDetails={noop}
            onWhatsApp={noop}
          />
        )}

        {activeTab === "participantes" && (
          <ParticipantList
            participants={sampleParticipants}
            onDelete={noop}
            onViewProfile={noop}
            onEmail={noop}
          />
        )}

        {activeTab === "solicitudes" && (
          <SolicitudesList
            solicitudes={sampleSolicitudes}
            onAprobar={noop}
            onRechazar={noop}
          />
        )}
      </main>

      <footer className="w-full border-t border-border bg-card py-6">
        <div className="px-6 lg:px-8 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Burger Fest. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
