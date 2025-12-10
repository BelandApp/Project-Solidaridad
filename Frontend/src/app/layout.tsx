import "./globals.css";
import type { ReactNode } from "react";
import { APP_TITLE } from "@/lib/config";
import { FaHandsHelping } from "react-icons/fa";

export const metadata = {
  title: "Solidaridad Eventos",
  description: "Control de asistencia y entregas",
};

function AppHeader() {
  return (
    <header className="sticky top-0 z-20 border-b bg-white/80 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded bg-emerald-500 text-white">
            <FaHandsHelping />
          </span>
          <span className="font-semibold text-gray-900">{APP_TITLE}</span>
        </div>
        <nav className="flex items-center gap-1 text-sm">
          <a href="/" className="px-3 py-2 rounded hover:bg-gray-100">
            Eventos
          </a>
          <a
            href="/admin/children"
            className="px-3 py-2 rounded hover:bg-gray-100"
          >
            Niños
          </a>
          <a
            href="/admin/events"
            className="px-3 py-2 rounded hover:bg-gray-100"
          >
            Talleres
          </a>
        </nav>
      </div>
    </header>
  );
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <AppHeader />
        <main className="max-w-6xl mx-auto p-4">{children}</main>
        <footer className="mt-8 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} {APP_TITLE}
        </footer>
      </body>
    </html>
  );
}
