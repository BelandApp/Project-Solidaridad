"use client";
import { useEffect, useMemo, useState } from "react";
import { deleteEvent, getEvents, type Event } from "@/lib/api";
import { FaQrcode, FaPen, FaTrash } from "react-icons/fa";

export default function EventList() {
  const [events, setEvents] = useState<Event[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    setLoading(true);
    getEvents()
      .then((data) => setEvents(data))
      .catch(() => setError("No se pudieron cargar los eventos"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return events;
    return events.filter((e) => `${e.name}`.toLowerCase().includes(q));
  }, [events, query]);

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este taller?")) return;
    try {
      await deleteEvent(id);
      setEvents((prev) => prev.filter((e) => e.id !== id));
    } catch {
      alert("Error al eliminar");
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Eventos Existentes</h3>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar evento..."
          className="border rounded px-3 py-2 text-sm w-64"
        />
      </div>
      <div className="bg-white border rounded-lg">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left">
              <th className="p-3">Evento</th>
              <th className="p-3">Descripción</th>
              <th className="p-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td className="p-3" colSpan={3}>
                  Cargando...
                </td>
              </tr>
            )}
            {!loading &&
              filtered.map((e) => (
                <tr key={e.id} className="border-t">
                  <td className="p-3">{e.name}</td>
                  <td className="p-3 text-xs text-gray-600">{e.description}</td>
                  <td className="p-3 flex items-center gap-2">
                    <button className="px-2 py-1 rounded bg-emerald-100 text-emerald-800 inline-flex items-center gap-1">
                      <FaQrcode /> QR
                    </button>
                    <button className="px-2 py-1 rounded bg-gray-100 text-gray-700 inline-flex items-center gap-1">
                      <FaPen /> Editar
                    </button>
                    <button
                      className="px-2 py-1 rounded bg-red-100 text-red-700 inline-flex items-center gap-1"
                      onClick={() => handleDelete(e.id)}
                    >
                      <FaTrash /> Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            {!loading && !filtered.length && (
              <tr>
                <td className="p-3" colSpan={3}>
                  {error || "Sin resultados"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
