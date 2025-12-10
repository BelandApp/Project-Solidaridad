"use client";
import { useRef } from "react";
import EventForm from "src/components/EventForm";
import EventList, { type EventListRef } from "src/components/EventList";
import { FaChild } from "react-icons/fa";
import Link from "next/link";

export default function AdminEventsPage() {
  const eventListRef = useRef<EventListRef>(null);

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Administración de Talleres</h1>
        <Link
          href="/admin/children"
          className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          <FaChild className="opacity-70" /> Ir a Niños
        </Link>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border rounded-lg p-4">
          <h2 className="font-medium mb-3">Añadir Nuevo Evento</h2>
          <EventForm
            onEventCreated={(event) => eventListRef.current?.addEvent(event)}
          />
        </div>
        <div className="bg-white border rounded-lg p-4">
          <EventList ref={eventListRef} />
        </div>
      </div>
    </section>
  );
}
