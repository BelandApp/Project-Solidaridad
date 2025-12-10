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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {events.map((event, index) => {
          const Icon =
            index === 0 ? FaUtensils : index === 1 ? FaGift : FaBullhorn;
          return (
            <button
              key={event.id}
              className="rounded-xl border bg-white px-6 py-8 text-gray-900 hover:shadow-md transition-shadow"
              onClick={() =>
                onSelectEvent
                  ? onSelectEvent(event.id)
                  : setActiveEventId(event.id)
              }
            >
              <div className="flex flex-col items-center gap-3">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <Icon />
                </span>
                <span className="font-medium">{event.name}</span>
                <span className="text-xs text-gray-500 text-center line-clamp-2">
                  {event.description}
                </span>
              </div>
            </button>
          );
        })}
      </div>
      {!onSelectEvent && activeEventId && (
        <div className="pointer-events-none absolute inset-x-0 top-0 z-40 flex justify-end">
          {/* sutil blur del contenedor detrás para enfoque */}
          <div className="absolute inset-0 -z-10 backdrop-blur-sm" />
          <div className="pointer-events-auto w-full sm:w-[440px] md:w-[500px]">
            <div className="translate-x-0 animate-[slideIn_180ms_ease-out] rounded-l-2xl border border-gray-200 bg-white shadow-xl ring-1 ring-black/5">
              <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
                <div className="flex items-center gap-2 text-emerald-700">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100">
                    <FaQrcode />
                  </span>
                  <h2 className="font-semibold text-sm">
                    Escaneando:{" "}
                    {events.find((e) => e.id === activeEventId)?.name}
                  </h2>
                </div>
                <button
                  aria-label="Cerrar"
                  className="inline-flex items-center gap-1 rounded px-2 py-1 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setActiveEventId(null)}
                >
                  <FaTimes />
                </button>
              </div>
              <div className="p-4">
                <QRScanner
                  eventId={activeEventId}
                  onClose={() => setActiveEventId(null)}
                />
                <div className="mt-3 text-xs text-gray-600">
                  Consejo: usá la cámara trasera y buena iluminación.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
