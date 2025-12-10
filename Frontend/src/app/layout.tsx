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
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo y título clickeable */}
          <a
            href="/"
            className="flex items-center gap-3 group transition-transform hover:scale-105"
          >
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm text-white shadow-md group-hover:bg-white/30 transition-colors">
              <FaHandsHelping size={20} />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl text-white tracking-tight">
                Beland Solidaridad
              </span>
              <span className="text-xs text-emerald-50 font-medium">
                Sistema de Gestión
              </span>
            </div>
          </a>

          {/* Navegación */}
          <nav className="flex items-center gap-2">
            <a
              href="/"
              className="px-4 py-2 rounded-lg text-white font-medium hover:bg-white/20 transition-colors backdrop-blur-sm"
            >
              Eventos
            </a>
            <a
              href="/admin/children"
              className="px-4 py-2 rounded-lg text-white font-medium hover:bg-white/20 transition-colors backdrop-blur-sm"
            >
              Niños
            </a>
            <a
              href="/admin/events"
              className="px-4 py-2 rounded-lg text-white font-medium hover:bg-white/20 transition-colors backdrop-blur-sm"
            >
              Talleres
            </a>
            <a
              href="/admin/attendance"
              className="px-4 py-2 rounded-lg text-white font-medium hover:bg-white/20 transition-colors backdrop-blur-sm"
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
        <main className="flex-1 max-w-7xl mx-auto w-full p-6">{children}</main>

        {/* Footer rediseñado */}
        <footer className="mt-auto bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 text-white">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-white">
                  <FaHandsHelping size={16} />
                </div>
                <div>
                  <p className="font-bold text-lg">Beland Solidaridad</p>
                  <p className="text-xs text-gray-400">
                    Transformando vidas juntos
                  </p>
                </div>
              </div>

              <div className="text-center md:text-right">
                <p className="text-sm text-gray-300">
                  © {new Date().getFullYear()} Beland Solidaridad
                </p>
                <p className="text-xs text-gray-500 mt-1">
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
