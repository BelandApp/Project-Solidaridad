"use client";
import EventButtons from "@/components/EventButtons";
import { FaQrcode, FaUsers, FaCalendarAlt, FaChartLine } from "react-icons/fa";

export default function HomePage() {
  return (
    <div className="space-y-8 py-4">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-12 text-white shadow-xl">
        <div className="max-w-3xl">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 leading-tight">
            Bienvenido al Sistema de Gestión
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-emerald-50 mb-4 sm:mb-6">
            Registra asistencia de forma rápida y eficiente escaneando códigos
            QR. Selecciona un evento para comenzar.
          </p>
          <div className="flex items-center gap-2 sm:gap-3 text-emerald-100">
            <FaQrcode size={20} className="sm:w-6 sm:h-6 flex-shrink-0" />
            <span className="text-xs sm:text-sm font-medium">
              Escaneo instantáneo · Control en tiempo real · Reportes
              automáticos
            </span>
          </div>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <a
          href="/admin/events"
          className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 shadow-sm hover:shadow-lg hover:border-blue-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-2 sm:p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors flex-shrink-0">
              <FaCalendarAlt className="text-blue-600" size={20} />
            </div>
            <div className="min-w-0">
              <p className="text-xl sm:text-2xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                Eventos
              </p>
              <p className="text-xs sm:text-sm text-gray-500">
                Gestión de talleres
              </p>
            </div>
          </div>
        </a>

        <a
          href="/admin/children"
          className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 shadow-sm hover:shadow-lg hover:border-emerald-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-2 sm:p-3 bg-emerald-100 rounded-lg group-hover:bg-emerald-200 transition-colors flex-shrink-0">
              <FaUsers className="text-emerald-600" size={20} />
            </div>
            <div className="min-w-0">
              <p className="text-xl sm:text-2xl font-bold text-gray-800 group-hover:text-emerald-600 transition-colors">
                Participantes
              </p>
              <p className="text-xs sm:text-sm text-gray-500">
                Control de asistencia
              </p>
            </div>
          </div>
        </a>

        <a
          href="/admin/attendance"
          className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 shadow-sm hover:shadow-lg hover:border-purple-300 transition-all cursor-pointer group sm:col-span-2 lg:col-span-1"
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-2 sm:p-3 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors flex-shrink-0">
              <FaChartLine className="text-purple-600" size={20} />
            </div>
            <div className="min-w-0">
              <p className="text-xl sm:text-2xl font-bold text-gray-800 group-hover:text-purple-600 transition-colors">
                Reportes
              </p>
              <p className="text-xs sm:text-sm text-gray-500">
                Análisis y exportación
              </p>
            </div>
          </div>
        </a>
      </div>

      {/* Sección de eventos */}
      <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 sm:px-6 md:px-8 py-4 sm:py-6 border-b border-gray-200">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-1 sm:mb-2">
            Eventos Disponibles para Escaneo
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            Selecciona un evento para abrir el escáner QR y registrar la
            asistencia de los participantes.
          </p>
        </div>
        <div className="p-4 sm:p-6 md:p-8">
          <EventButtons />
        </div>
      </div>

      {/* Instrucciones */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 sm:p-6 border border-blue-200">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
            <span className="text-white font-bold text-lg sm:text-xl">1</span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2">
            Selecciona un Evento
          </h3>
          <p className="text-xs sm:text-sm text-gray-600">
            Haz clic en uno de los eventos disponibles para abrir el escáner de
            códigos QR.
          </p>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-4 sm:p-6 border border-emerald-200">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-500 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
            <span className="text-white font-bold text-lg sm:text-xl">2</span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2">
            Escanea el QR
          </h3>
          <p className="text-xs sm:text-sm text-gray-600">
            Coloca el código QR del participante dentro del marco. El registro
            es automático e instantáneo.
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 sm:p-6 border border-purple-200 sm:col-span-2 lg:col-span-1">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
            <span className="text-white font-bold text-lg sm:text-xl">3</span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2">
            Confirmación Inmediata
          </h3>
          <p className="text-xs sm:text-sm text-gray-600">
            Recibirás una confirmación visual y sonora. El escáner se reinicia
            automáticamente para el siguiente participante.
          </p>
        </div>
      </div>
    </div>
  );
}
