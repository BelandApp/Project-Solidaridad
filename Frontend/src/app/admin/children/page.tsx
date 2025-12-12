"use client";
import { useRef, useState } from "react";
import ChildForm from "src/components/ChildForm";
import ChildList, { type ChildListRef } from "src/components/ChildList";
import BulkUploadChildren from "src/components/BulkUploadChildren";
import { FaUserFriends, FaDownload } from "react-icons/fa";
import Link from "next/link";
import { downloadAllQrs } from "src/lib/api";

export default function AdminChildrenPage() {
  const childListRef = useRef<ChildListRef>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleUploadSuccess = () => {
    // Recargar la lista después de una carga exitosa
    if (childListRef.current) {
      window.location.reload();
    }
  };

  return (
    <section className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
          Administración de Niños
        </h1>
        <div className="flex items-center gap-3 w-full sm:w-auto justify-center sm:justify-end">
          <button
            aria-label="Descargar QRs"
            onClick={async () => {
              try {
                setIsDownloading(true);
                const blob = await downloadAllQrs();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `qr-codes.zip`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
              } catch (e) {
                console.error("Error descargando QRs:", e);
              } finally {
                setIsDownloading(false);
              }
            }}
            className="inline-flex items-center gap-2 rounded-md bg-emerald-600 text-white px-2 py-2 text-xs sm:px-3 sm:py-2 sm:text-sm hover:bg-emerald-700 shadow-sm max-w-[180px]"
          >
            <FaDownload />
            <span className="truncate">
              {isDownloading ? "Descargando..." : "Descargar QRs"}
            </span>
          </button>

          <Link
            href="/admin/events"
            className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 whitespace-nowrap"
          >
            <FaUserFriends className="opacity-70" /> Ir a Talleres
          </Link>
        </div>
      </div>

      {/* Componente de carga masiva */}
      <BulkUploadChildren onUploadSuccess={handleUploadSuccess} />

      <div className="bg-white border-2 border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-xl p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 text-gray-800">
              Registrar Nuevo Niño
            </h2>
            <ChildForm
              onChildCreated={(child) => childListRef.current?.addChild(child)}
            />
          </div>
          <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-4 sm:p-6">
            <ChildList ref={childListRef} />
          </div>
        </div>
      </div>
    </section>
  );
}
