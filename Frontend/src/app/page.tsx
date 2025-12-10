"use client";
import EventButtons from "@/components/EventButtons";

export default function HomePage() {
  return (
    <section className="space-y-10 py-10 relative">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Selecciona un evento para comenzar a escanear
        </h1>
        <p className="text-sm text-gray-600">
          Selecciona uno de los eventos disponibles para registrar la
          asistencia.
        </p>
      </div>
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <EventButtons />
      </div>
    </section>
  );
}
