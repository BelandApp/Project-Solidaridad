"use client";
import { useEffect, useState } from "react";
import { FaUsers, FaClock, FaDownload } from "react-icons/fa";
import * as XLSX from "xlsx";

interface Child {
  id: string;
  fullName: string;
  age: number;
  sex: "Niño" | "Niña";
}

interface Participation {
  id: string;
  childId: string;
  eventId: string;
  timestamp: string;
  child: Child;
}

interface Props {
  eventId: string;
  eventName: string;
}

export default function AttendanceList({ eventId, eventName }: Props) {
  const [participations, setParticipations] = useState<Participation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const limit = 50;

  useEffect(() => {
    loadParticipations();
  }, [eventId, page]);

  async function loadParticipations() {
    try {
      setLoading(true);
      const response = await fetch(
        `https://project-solidaridad-production.up.railway.app/participations/by-event/${eventId}?page=${page}&limit=${limit}`
      );
      const data = await response.json();
      setParticipations(data.data || []);
      setError("");
    } catch (e) {
      setError("Error al cargar la lista de asistencia");
    } finally {
      setLoading(false);
    }
  }

  function formatDate(timestamp: string) {
    const date = new Date(timestamp);
    return date.toLocaleString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function downloadExcel() {
    // Crear datos para Excel
    const data = participations.map((p, index) => ({
      "#": index + 1,
      Nombre: p.child.fullName,
      Edad: p.child.age,
      Sexo: p.child.sex,
      "Fecha y Hora": formatDate(p.timestamp),
    }));

    // Crear libro de Excel
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Asistencia");

    // Ajustar ancho de columnas
    worksheet["!cols"] = [
      { wch: 5 }, // #
      { wch: 30 }, // Nombre
      { wch: 8 }, // Edad
      { wch: 10 }, // Sexo
      { wch: 20 }, // Fecha y Hora
    ];

    // Descargar archivo
    const fileName = `asistencia-${eventName.replace(/\s+/g, "-")}-${new Date().toISOString().split("T")[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
            <FaUsers className="text-emerald-600" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Lista de Asistencia</h3>
            <p className="text-sm text-gray-600">{eventName}</p>
          </div>
        </div>
        <button
          onClick={downloadExcel}
          disabled={participations.length === 0}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white rounded-lg font-medium inline-flex items-center gap-2 transition-colors"
        >
          <FaDownload size={14} />
          Descargar Excel
        </button>
      </div>

      {error && (
        <div className="bg-red-100 text-red-800 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Cargando...</div>
        ) : participations.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Aún no hay asistentes registrados en este evento
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4 font-semibold text-gray-700">
                    #
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-700">
                    Nombre Completo
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-700">
                    Edad
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-700">
                    Sexo
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-700">
                    Hora de Registro
                  </th>
                </tr>
              </thead>
              <tbody>
                {participations.map((p, index) => (
                  <tr key={p.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 text-gray-600">
                      {(page - 1) * limit + index + 1}
                    </td>
                    <td className="p-4 font-medium">{p.child.fullName}</td>
                    <td className="p-4">{p.child.age} años</td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-md text-xs font-medium ${
                          p.child.sex === "Niño"
                            ? "bg-cyan-100 text-cyan-800"
                            : "bg-pink-100 text-pink-800"
                        }`}
                      >
                        {p.child.sex}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600 flex items-center gap-2">
                      <FaClock size={12} />
                      {formatDate(p.timestamp)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {participations.length > 0 && (
        <div className="flex justify-between items-center text-sm">
          <p className="text-gray-600">
            Total de asistentes: <strong>{participations.length}</strong>
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
            >
              ← Anterior
            </button>
            <span className="px-3 py-1.5 font-medium">Página {page}</span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={participations.length < limit}
              className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
            >
              Siguiente →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
