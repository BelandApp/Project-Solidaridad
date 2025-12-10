"use client";
import { useState, useRef } from "react";
import { uploadChildrenCSV } from "@/lib/api";
import {
  FaUpload,
  FaFileExcel,
  FaDownload,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import * as XLSX from "xlsx";

type Props = {
  onUploadSuccess?: () => void;
};

export default function BulkUploadChildren({ onUploadSuccess }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const downloadTemplate = () => {
    // Crear plantilla de Excel
    const template = [
      { fullName: "Juan Pérez", age: 10, sex: "Niño" },
      { fullName: "María García", age: 8, sex: "Niña" },
    ];

    const worksheet = XLSX.utils.json_to_sheet(template);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Plantilla");

    // Configurar anchos de columnas
    worksheet["!cols"] = [{ wch: 30 }, { wch: 10 }, { wch: 10 }];

    XLSX.writeFile(workbook, "plantilla-niños.xlsx");
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setSuccess("");
    setUploading(true);

    try {
      // Si es Excel, convertir a CSV
      let csvFile = file;

      if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
        console.log("📊 Convirtiendo Excel a CSV...");
        const arrayBuffer = await file.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Convertir a CSV con separador punto y coma
        const csvContent = XLSX.utils.sheet_to_csv(worksheet, { FS: ";" });

        // Crear archivo CSV
        const csvBlob = new Blob([csvContent], { type: "text/csv" });
        csvFile = new File([csvBlob], file.name.replace(/\.xlsx?$/, ".csv"), {
          type: "text/csv",
        });

        console.log("✅ Conversión completada");
      }

      // Subir archivo
      const result = await uploadChildrenCSV(csvFile);

      setSuccess(`✅ ${result.length} niños registrados exitosamente`);

      // Limpiar input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Notificar éxito
      if (onUploadSuccess) {
        setTimeout(() => {
          onUploadSuccess();
        }, 1500);
      }

      // Ocultar mensaje después de 3 segundos
      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (e: any) {
      console.error("❌ Error al cargar archivo:", e);
      setError(e?.message || "Error al procesar el archivo");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-blue-500 rounded-lg">
          <FaFileExcel className="text-white" size={24} />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            Carga Masiva de Niños
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Sube un archivo Excel o CSV con los datos de múltiples niños. El
            formato debe incluir las columnas: <strong>fullName</strong>,{" "}
            <strong>age</strong>, <strong>sex</strong> (Niño/Niña).
          </p>

          {/* Botones de acción */}
          <div className="flex flex-wrap gap-3">
            {/* Botón de descarga de plantilla */}
            <button
              onClick={downloadTemplate}
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
            >
              <FaDownload size={14} />
              Descargar Plantilla
            </button>

            {/* Botón de carga */}
            <label className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors cursor-pointer">
              <FaUpload size={14} />
              {uploading ? "Subiendo..." : "Subir Archivo"}
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileChange}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>

          {/* Mensajes de estado */}
          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-lg flex items-center gap-2 text-red-800">
              <FaTimesCircle />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {success && (
            <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded-lg flex items-center gap-2 text-green-800">
              <FaCheckCircle />
              <span className="text-sm font-medium">{success}</span>
            </div>
          )}

          {/* Información adicional */}
          <div className="mt-4 p-3 bg-blue-100 rounded-lg">
            <p className="text-xs text-blue-800">
              💡 <strong>Tip:</strong> Descarga la plantilla para ver el formato
              correcto. Puedes editar el archivo Excel y subirlo directamente.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
