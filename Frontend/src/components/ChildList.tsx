"use client";
import { useEffect, useMemo, useState } from "react";
import { deleteChild, getChildren } from "@/lib/api";
import { FaQrcode, FaPen, FaTrash } from "react-icons/fa";

export default function ChildList() {
  const [children, setChildren] = useState<
    Array<{
      id: string;
      firstName: string;
      lastName: string;
      birthDate?: string;
      tutorName?: string;
      contactPhone?: string;
      qr: string;
    }>
  >([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    setLoading(true);
    getChildren()
      .then((data) => setChildren(data))
      .catch(() => setError("No se pudieron cargar los participantes"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return children;
    return children.filter((c) =>
      `${c.firstName} ${c.lastName}`.toLowerCase().includes(q)
    );
  }, [children, query]);

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este niño?")) return;
    try {
      await deleteChild(id);
      setChildren((prev) => prev.filter((c) => c.id !== id));
    } catch {
      alert("Error al eliminar");
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Lista de Participantes</h3>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por nombre..."
          className="border rounded px-3 py-2 text-sm w-64"
        />
      </div>
      <div className="bg-white border rounded-lg">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left">
              <th className="p-3">Nombre Completo</th>
              <th className="p-3">Tutor</th>
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
              filtered.map((c) => (
                <tr key={c.id} className="border-t">
                  <td className="p-3">
                    {c.firstName} {c.lastName}
                  </td>
                  <td className="p-3">{c.tutorName || "-"}</td>
                  <td className="p-3 flex items-center gap-2">
                    <button className="px-2 py-1 rounded bg-emerald-100 text-emerald-800 inline-flex items-center gap-1">
                      <FaQrcode /> QR
                    </button>
                    <button className="px-2 py-1 rounded bg-gray-100 text-gray-700 inline-flex items-center gap-1">
                      <FaPen /> Editar
                    </button>
                    <button
                      className="px-2 py-1 rounded bg-red-100 text-red-700 inline-flex items-center gap-1"
                      onClick={() => handleDelete(c.id)}
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
