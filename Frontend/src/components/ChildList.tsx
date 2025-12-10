"use client";
import {
  useEffect,
  useMemo,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";
import { deleteChild, getChildren, type Child } from "@/lib/api";
import { FaQrcode, FaPen, FaTrash } from "react-icons/fa";

type Props = {
  onChildAdded?: (child: Child) => void;
};

export type ChildListRef = {
  addChild: (child: Child) => void;
};

const ChildList = forwardRef<ChildListRef, Props>(
  function ChildList(props, ref) {
    const [children, setChildren] = useState<Child[]>([]);
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
    const [qrModal, setQrModal] = useState<{
      show: boolean;
      child: Child | null;
    }>({ show: false, child: null });
    const [successModal, setSuccessModal] = useState<{
      show: boolean;
      message: string;
    }>({ show: false, message: "" });

    useImperativeHandle(ref, () => ({
      addChild: (child: Child) => {
        setChildren((prev) =>
          Array.isArray(prev) ? [child, ...prev] : [child]
        );
        setPage(1); // Volver a la primera página al agregar
      },
    }));

    useEffect(() => {
      setLoading(true);
      getChildren(page, limit)
        .then((data) => setChildren(data))
        .catch(() => setError("No se pudieron cargar los participantes"))
        .finally(() => setLoading(false));
    }, [page]);

    const filtered = useMemo(() => {
      if (!Array.isArray(children)) return [];
      const q = query.trim().toLowerCase();
      if (!q) return children;
      return children.filter((c) => c.fullName.toLowerCase().includes(q));
    }, [children, query]);

    async function handleDelete(id: string) {
      try {
        console.log("🗑️ Eliminando participante:", id);
        setError("");
        await deleteChild(id);
        console.log("✅ Participante eliminado exitosamente");

        // Actualizar lista localmente
        setChildren((prev) => prev.filter((c) => c.id !== id));

        // Cerrar modal de confirmación
        setDeleteModal({ show: false, id: "", name: "" });

        // Mostrar modal de éxito
        console.log("✅ Mostrando modal de éxito");
        setSuccessModal({
          show: true,
          message: "Participante eliminado exitosamente",
        });

        // Recargar datos desde el servidor
        setTimeout(async () => {
          try {
            const data = await getChildren(page, limit);
            setChildren(data);
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
        setError(e?.message || "Error al eliminar el participante");
        setDeleteModal({ show: false, id: "", name: "" });
      }
    }

    return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h3 className="text-lg font-semibold">Lista de Participantes</h3>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nombre..."
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm w-full sm:w-64 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {error && (
          <div className="bg-red-100 text-red-800 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading && (
            <div className="col-span-full text-center py-8 text-gray-500">
              Cargando...
            </div>
          )}
          {!loading && filtered.length === 0 && (
            <div className="col-span-full text-center py-8 text-gray-500">
              No se encontraron participantes
            </div>
          )}
          {!loading &&
            filtered.map((c) => (
              <div
                key={c.id}
                className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-center mb-3">
                  <h4 className="font-semibold text-lg text-center text-gray-800">
                    {c.fullName}
                  </h4>
                </div>
                <div className="flex gap-2 mb-4 justify-center">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-md text-sm text-center font-medium">
                    {c.age} años
                  </span>
                  <span
                    className={`px-1 py-1 rounded-md text-sm font-medium ${c.sex === "Niño" ? "bg-cyan-100 text-cyan-800" : "bg-pink-100 text-pink-800"}`}
                  >
                    {c.sex}
                  </span>
                </div>
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => setQrModal({ show: true, child: c })}
                    className="px-3 py-2 rounded-lg bg-emerald-100 text-emerald-800 hover:bg-emerald-200 inline-flex items-center gap-1 transition-colors font-medium"
                  >
                    <FaQrcode size={16} /> QR
                  </button>
                  <button
                    onClick={() =>
                      setDeleteModal({ show: true, id: c.id, name: c.fullName })
                    }
                    className="px-3 py-2 rounded-lg bg-red-100 text-red-800 hover:bg-red-200 inline-flex items-center gap-1 transition-colors font-medium"
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
              </div>
            ))}
        </div>

        {!loading && children.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-3 border-t mt-3">
            <p className="text-xs sm:text-sm text-gray-600">
              Mostrando {children.length} participantes
            </p>
            <div className="flex gap-2 items-center">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-2 sm:px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm font-medium transition-colors whitespace-nowrap"
              >
                ← Anterior
              </button>
              <span className="px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium whitespace-nowrap">
                Pág. {page}
              </span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={children.length < limit}
                className="px-2 sm:px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm font-medium transition-colors whitespace-nowrap"
              >
                Siguiente →
              </button>
            </div>
          </div>
        )}

        {/* Modal de QR */}
        {qrModal.show && qrModal.child && (
          <div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setQrModal({ show: false, child: null })}
          >
            <div
              className="bg-white rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-4 text-center">
                {qrModal.child.fullName}
              </h3>
              {qrModal.child.qrCode ? (
                <div className="flex flex-col items-center">
                  <img
                    src={qrModal.child.qrCode}
                    alt="QR Code"
                    className="w-64 h-64 border-4 border-gray-200 rounded-lg"
                  />
                  <p className="mt-4 text-sm text-gray-600 text-center">
                    Muestra este código QR para registrar asistencia
                  </p>
                </div>
              ) : (
                <p className="text-center text-gray-500">
                  No hay código QR disponible
                </p>
              )}
              <div className="flex gap-3 mt-6">
                {qrModal.child.qrCode && (
                  <a
                    href={qrModal.child.qrCode}
                    download={`QR-${qrModal.child.fullName.replace(/\s+/g, "-")}.png`}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg transition-colors text-center"
                  >
                    Descargar QR
                  </a>
                )}
                <button
                  onClick={() => setQrModal({ show: false, child: null })}
                  className={`${qrModal.child.qrCode ? "flex-1" : "w-full"} bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 rounded-lg transition-colors`}
                >
                  Cerrar
                </button>
              </div>
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
                ¿Eliminar participante?
              </h3>
              <p className="text-gray-600 mb-6">
                Estás a punto de eliminar a <strong>{deleteModal.name}</strong>.
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

export default ChildList;
