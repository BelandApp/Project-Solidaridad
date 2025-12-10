"use client";
import {
  useEffect,
  useMemo,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";
import { deleteEvent, getEvents, type Event } from "@/lib/api";
import { FaQrcode, FaPen, FaTrash } from "react-icons/fa";

type Props = {
  onEventAdded?: (event: Event) => void;
};

export type EventListRef = {
  addEvent: (event: Event) => void;
};

const EventList = forwardRef<EventListRef, Props>(
  function EventList(props, ref) {
    const [events, setEvents] = useState<Event[]>([]);
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>("");
    const [page, setPage] = useState(1);
    const limit = 12;
    const [deleteModal, setDeleteModal] = useState<{
      show: boolean;
      id: string;
      name: string;
    }>({ show: false, id: "", name: "" });
    const [successModal, setSuccessModal] = useState<{
      show: boolean;
      message: string;
    }>({ show: false, message: "" });

    useImperativeHandle(ref, () => ({
      addEvent: (event: Event) => {
        setEvents((prev) => (Array.isArray(prev) ? [event, ...prev] : [event]));
        setPage(1); // Volver a la primera página al agregar
      },
    }));

    useEffect(() => {
      setLoading(true);
      getEvents(page, limit)
        .then((data) => setEvents(data))
        .catch(() => setError("No se pudieron cargar los eventos"))
        .finally(() => setLoading(false));
    }, [page]);

    const filtered = useMemo(() => {
      if (!Array.isArray(events)) return [];
      const q = query.trim().toLowerCase();
      if (!q) return events;
      return events.filter((e) => e.name.toLowerCase().includes(q));
    }, [events, query]);

    async function handleDelete(id: string) {
      try {
        console.log("🗑️ Eliminando evento:", id);
        setError("");
        await deleteEvent(id);
        console.log("✅ Evento eliminado exitosamente");

        // Actualizar lista localmente
        setEvents((prev) => prev.filter((e) => e.id !== id));

        // Cerrar modal de confirmación
        setDeleteModal({ show: false, id: "", name: "" });

        // Mostrar modal de éxito
        console.log("✅ Mostrando modal de éxito");
        setSuccessModal({
          show: true,
          message: "Evento eliminado exitosamente",
        });

        // Recargar datos desde el servidor
        setTimeout(async () => {
          try {
            const data = await getEvents(page, limit);
            setEvents(data);
          } catch (e) {
            console.error("Error recargando datos:", e);
          }
        }, 100);

        // Ocultar modal de éxito después de 2 segundos
        setTimeout(() => {
          console.log("🔄 Ocultando modal de éxito");
          setSuccessModal({ show: false, message: "" });
        }, 2000);
      } catch (e: any) {
        console.error("❌ Error al eliminar:", e);
        setError(e?.message || "Error al eliminar el evento");
        setDeleteModal({ show: false, id: "", name: "" });
      }
    }

    return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h3 className="text-lg font-semibold">Eventos Existentes</h3>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder=" Buscar evento..."
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm w-full sm:w-64 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {error && (
          <div className="bg-red-100 text-red-800 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {loading && (
            <div className="col-span-full text-center py-8 text-gray-500">
              Cargando...
            </div>
          )}
          {!loading && filtered.length === 0 && (
            <div className="col-span-full text-center py-8 text-gray-500">
              No se encontraron eventos
            </div>
          )}
          {!loading &&
            filtered.map((e) => (
              <div
                key={e.id}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all hover:scale-[1.02]"
              >
                {/* Imagen del evento o placeholder */}
                <div className="relative h-40 bg-gradient-to-br from-emerald-500 to-teal-500">
                  {e.imageUrl ? (
                    <img
                      src={e.imageUrl}
                      alt={e.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center text-white">
                        <FaQrcode
                          size={48}
                          className="mx-auto mb-2 opacity-80"
                        />
                        <p className="text-sm font-medium opacity-90">
                          Sin imagen
                        </p>
                      </div>
                    </div>
                  )}
                  {/* Overlay con gradiente */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                </div>

                {/* Contenido */}
                <div className="p-5">
                  <h4 className="font-bold text-xl text-gray-800 mb-2 line-clamp-1">
                    {e.name}
                  </h4>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2 min-h-[40px]">
                    {e.description || "Sin descripción"}
                  </p>

                  {/* Botón de acción */}
                  <button
                    onClick={() =>
                      setDeleteModal({ show: true, id: e.id, name: e.name })
                    }
                    className="w-full px-4 py-2.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 inline-flex items-center justify-center gap-2 transition-colors font-semibold border border-red-200"
                  >
                    <FaTrash size={14} /> Eliminar Evento
                  </button>
                </div>
              </div>
            ))}
        </div>

        {!loading && events.length > 0 && (
          <div className="flex justify-between items-center pt-3 border-t mt-3">
            <p className="text-sm text-gray-600">
              Mostrando {events.length} eventos
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
              >
                ← Anterior
              </button>
              <span className="px-3 py-1.5 text-sm font-medium">
                Página {page}
              </span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={events.length < limit}
                className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
              >
                Siguiente →
              </button>
            </div>
          </div>
        )}

        {/* Modal de confirmación de eliminación */}
        {deleteModal.show && (
          <div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setDeleteModal({ show: false, id: "", name: "" })}
          >
            <div
              className="bg-white rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-2 text-red-600">
                ¿Eliminar evento?
              </h3>
              <p className="text-gray-600 mb-6">
                Estás a punto de eliminar <strong>{deleteModal.name}</strong>.
                Esta acción no se puede deshacer.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() =>
                    setDeleteModal({ show: false, id: "", name: "" })
                  }
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleDelete(deleteModal.id)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de éxito */}
        {successModal.show && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-green-600">¡Éxito!</h3>
              <p className="text-gray-600">{successModal.message}</p>
            </div>
          </div>
        )}
      </div>
    );
  }
);

export default EventList;
