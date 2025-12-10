"use client";
import { useState } from "react";
import { createEvent } from "@/lib/api";

export default function EventForm() {
  const [key, setKey] = useState("");
  const [name, setName] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [feedback, setFeedback] = useState<string>("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await createEvent({ key, name });
      setFeedback(res.message ?? "Evento creado correctamente");
      setKey("");
      setName("");
      setDateTime("");
      setLocation("");
      setDescription("");
    } catch (e: any) {
      setFeedback(e?.message ?? "Error al crear evento");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm mb-1">Clave del evento</label>
        <input
          value={key}
          onChange={(e) => setKey(e.target.value)}
          className="w-full border rounded px-3 py-2"
          placeholder="merendero"
          required
        />
      </div>
      <div>
        <label className="block text-sm mb-1">Nombre del evento</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border rounded px-3 py-2"
          placeholder="Merendero"
          required
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm mb-1">Fecha y hora</label>
          <input
            type="datetime-local"
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Ubicación</label>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="Ej: Salón Principal"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm mb-1">Descripción</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border rounded px-3 py-2"
          placeholder="Detalles del evento"
        />
      </div>
      <button
        type="submit"
        className="rounded bg-green-600 text-white px-4 py-2"
        disabled={loading}
      >
        {loading ? "Guardando..." : "Crear Evento"}
      </button>
      {feedback && <p className="text-sm">{feedback}</p>}
    </form>
  );
}
