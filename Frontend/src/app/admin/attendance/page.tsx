"use client";
import { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import AttendanceList from "@/components/AttendanceList";
import { getEvents, type Event } from "@/lib/api";

export default function AttendancePage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  async function loadEvents() {
    try {
      setLoading(true);
      const data = await getEvents(1, 100);
      setEvents(data);
    } catch (e) {
      console.error("Error cargando eventos:", e);
    } finally {
      setLoading(false);
    }
  }

  if (selectedEvent) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => setSelectedEvent(null)}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium"
        >
          <FaArrowLeft />
          Volver a eventos
        </button>
        <AttendanceList
          eventId={selectedEvent.id}
          eventName={selectedEvent.name}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Lista de Asistencia</h1>
        <p className="text-gray-600">
          Selecciona un evento para ver quiénes asistieron
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">
          Cargando eventos...
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No hay eventos disponibles
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((event) => (
            <button
              key={event.id}
              onClick={() => setSelectedEvent(event)}
              className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow text-left"
            >
              <div className="flex items-start gap-4">
                {event.imageUrl ? (
                  <img
                    src={event.imageUrl}
                    alt={event.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-xl">
                    {event.name.charAt(0)}
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{event.name}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {event.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
