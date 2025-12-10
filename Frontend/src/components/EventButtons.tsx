"use client";
import { useState } from "react";
import {
  FaUtensils,
  FaGift,
  FaBullhorn,
  FaQrcode,
  FaTimes,
} from "react-icons/fa";
import QRScanner from "src/components/QRScanner";

type EventKey = "merendero" | "regalos" | "tercero";

type Props = {
  onSelectEvent?: (key: EventKey) => void;
};

const eventLabels: Record<EventKey, string> = {
  merendero: "Taller Merendero",
  regalos: "Taller Regalería",
  tercero: "Taller 3",
};

export default function EventButtons({ onSelectEvent }: Props) {
  const [activeEvent, setActiveEvent] = useState<EventKey | null>(null);
  return (
    <div className="space-y-6 relative">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {(Object.keys(eventLabels) as EventKey[]).map((key) => {
          const Icon =
            key === "merendero"
              ? FaUtensils
              : key === "regalos"
                ? FaGift
                : FaBullhorn;
          return (
            <button
              key={key}
              className="rounded-xl border bg-white px-6 py-8 text-gray-900 hover:shadow-md transition-shadow"
              onClick={() =>
                onSelectEvent ? onSelectEvent(key) : setActiveEvent(key)
              }
            >
              <div className="flex flex-col items-center gap-3">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <Icon />
                </span>
                <span className="font-medium">{eventLabels[key]}</span>
              </div>
            </button>
          );
        })}
      </div>
      {!onSelectEvent && activeEvent && (
        <div className="pointer-events-none absolute inset-x-0 top-0 z-40 flex justify-end">
          {/* sutil blur del contenedor detrás para enfoque */}
          <div className="absolute inset-0 -z-10 backdrop-blur-sm" />
          <div className="pointer-events-auto w-full sm:w-[440px] md:w-[500px]">
            <div className="translate-x-0 animate-[slideIn_180ms_ease-out] rounded-l-2xl border border-gray-200 bg-white shadow-xl ring-1 ring-black/5">
              <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
                <div className="flex items-center gap-2 text-emerald-700">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100">
                    <FaQrcode />
                  </span>
                  <h2 className="font-semibold text-sm">
                    Escaneando: {eventLabels[activeEvent]}
                  </h2>
                </div>
                <button
                  aria-label="Cerrar"
                  className="inline-flex items-center gap-1 rounded px-2 py-1 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setActiveEvent(null)}
                >
                  <FaTimes />
                </button>
              </div>
              <div className="p-4">
                <QRScanner
                  eventKey={activeEvent}
                  onClose={() => setActiveEvent(null)}
                />
                <div className="mt-3 text-xs text-gray-600">
                  Consejo: usá la cámara trasera y buena iluminación.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
