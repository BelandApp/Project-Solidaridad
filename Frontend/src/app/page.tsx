"use client";
import { useState } from "react";
import EventButtons from "src/components/EventButtons";
import QRScanner from "src/components/QRScanner";

type EventKey = "merendero" | "regalos" | "tercero";
const eventLabels: Record<EventKey, string> = {
  merendero: "Taller Merendero",
  regalos: "Taller Regalería",
  tercero: "Taller 3",
};

export default function HomePage() {
  const [activeEvent, setActiveEvent] = useState<EventKey | null>(null);
  return (
    <section className="space-y-10 py-10 relative">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Selecciona un evento para comenzar a escanear
        </h1>
        <p className="text-sm text-gray-600">
          Merendero, Entrega de Regalos y un tercero.
        </p>
      </div>
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <EventButtons onSelectEvent={(key: EventKey) => setActiveEvent(key)} />
      </div>
      {activeEvent && (
        <div className="fixed inset-0 z-40 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setActiveEvent(null)}
          />
          <div className="relative z-10 w-full max-w-2xl mx-4 panel-container animate-modal-in border-emerald-200">
            <div className="panel-header">
              <h2 className="font-semibold text-sm text-gray-900">
                Escaneando: {eventLabels[activeEvent]}
              </h2>
              <button
                className="btn-neutral"
                onClick={() => setActiveEvent(null)}
              >
                Cerrar
              </button>
            </div>
            <div className="p-4">
              <QRScanner
                eventKey={activeEvent}
                onClose={() => setActiveEvent(null)}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
