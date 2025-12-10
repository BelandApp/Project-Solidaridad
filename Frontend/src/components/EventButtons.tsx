"use client";
import { useState, useEffect } from "react";
import {
  FaUtensils,
  FaGift,
  FaBullhorn,
  FaQrcode,
  FaTimes,
} from "react-icons/fa";
import QRScanner from "@/components/QRScanner";
import { getEvents, type Event } from "@/lib/api";

type Props = {
  onSelectEvent?: (eventId: string) => void;
};

export default function EventButtons({ onSelectEvent }: Props) {
  const [activeEventId, setActiveEventId] = useState<string | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getEvents()
      .then((data) => setEvents(data.slice(0, 3))) // Mostrar solo los primeros 3 eventos
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-center py-8">Cargando eventos...</div>;
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-8 text-gray-600">
        No hay eventos disponibles. Crea uno en la sección de Talleres.
      </div>
    );
  }
  return (
    <div className="space-y-6 relative">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event, index) => {
          const Icon =
            index === 0 ? FaUtensils : index === 1 ? FaGift : FaBullhorn;
          return (
            <button
              key={event.id}
              className="group relative rounded-2xl border-2 border-gray-200 bg-white overflow-hidden hover:border-emerald-400 hover:shadow-xl transition-all hover:scale-105"
              onClick={() =>
                onSelectEvent
                  ? onSelectEvent(event.id)
                  : setActiveEventId(event.id)
              }
            >
              {/* Imagen o gradiente de fondo */}
              <div className="relative h-48 bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-500">
                {event.imageUrl ? (
                  <img
                    src={event.imageUrl}
                    alt={event.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                      <Icon className="text-white" size={48} />
                    </div>
                  </div>
                )}
                {/* Overlay con gradiente */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

                {/* Badge de QR */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
                  <FaQrcode className="text-emerald-600" size={20} />
                </div>
              </div>

              {/* Contenido */}
              <div className="p-6 text-left">
                <h3 className="font-bold text-xl text-gray-800 mb-2 group-hover:text-emerald-600 transition-colors">
                  {event.name}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                  {event.description || "Sin descripción"}
                </p>

                {/* Botón de acción */}
                <div className="flex items-center justify-between text-emerald-600 font-semibold text-sm">
                  <span>Iniciar escaneo</span>
                  <svg
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </button>
          );
        })}
      </div>
      {!onSelectEvent && activeEventId && (
        <QRScanner
          eventId={activeEventId}
          onClose={() => setActiveEventId(null)}
        />
      )}
    </div>
  );
}
