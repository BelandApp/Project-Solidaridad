import "./globals.css";
import type { ReactNode } from "react";
import { APP_TITLE } from "@/lib/config";
import { FaHandsHelping } from "react-icons/fa";

export const metadata = {
  title: "Beland Solidaridad",
  description: "Sistema de gestión de eventos y asistencia",
};

function AppHeader() {
  return (
    <header className="sticky top-0 z-20 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 shadow-lg">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-2">
          {/* Logo y título clickeable */}
          <a
            href="/"
            className="flex items-center gap-2 sm:gap-3 group transition-transform hover:scale-105 min-w-0 flex-shrink"
          >
            <div className="inline-flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm text-white shadow-md group-hover:bg-white/30 transition-colors flex-shrink-0">
              <FaHandsHelping size={16} className="sm:w-5 sm:h-5" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-sm sm:text-xl text-white tracking-tight truncate">
                Beland Solidaridad
              </span>
              <span className="text-[10px] sm:text-xs text-emerald-50 font-medium hidden sm:block">
                Sistema de Gestión
              </span>
            </div>
          </a>

          {/* Navegación */}
          <nav className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <a
              href="/"
              className="px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-white text-xs sm:text-sm font-medium hover:bg-white/20 transition-colors backdrop-blur-sm whitespace-nowrap"
            >
              Eventos
            </a>
            <a
              href="/admin/children"
              className="px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-white text-xs sm:text-sm font-medium hover:bg-white/20 transition-colors backdrop-blur-sm whitespace-nowrap"
            >
              Niños
            </a>
            <a
              href="/admin/events"
              className="px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-white text-xs sm:text-sm font-medium hover:bg-white/20 transition-colors backdrop-blur-sm whitespace-nowrap"
            >
              Talleres
            </a>
            <a
              href="/admin/attendance"
              className="px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-white text-xs sm:text-sm font-medium hover:bg-white/20 transition-colors backdrop-blur-sm whitespace-nowrap"
            >
              Asistencia
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50/30 to-teal-50/20 text-gray-900 flex flex-col">
        <AppHeader />
        <main className="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-6 py-4 sm:py-6">
          {children}
        </main>

        {/* Footer rediseñado */}
        <footer className="mt-auto bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 text-white">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="inline-flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-emerald-500 text-white flex-shrink-0">
                  <FaHandsHelping size={14} className="sm:w-4 sm:h-4" />
                </div>
                <div className="text-center sm:text-left">
                  <p className="font-bold text-base sm:text-lg">
                    Beland Solidaridad
                  </p>
                  <p className="text-[10px] sm:text-xs text-gray-400">
                    Transformando vidas juntos
                  </p>
                </div>
              </div>

              <div className="text-center sm:text-right">
                <p className="text-xs sm:text-sm text-gray-300">
                  © {new Date().getFullYear()} Beland Solidaridad
                </p>
                <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
                  Todos los derechos reservados
                </p>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
