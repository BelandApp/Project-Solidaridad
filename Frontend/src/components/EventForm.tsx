"use client";
import { useState } from "react";
import { createEvent, type Event } from "@/lib/api";

type Props = {
  onEventCreated?: (event: Event) => void;
};

export default function EventForm({ onEventCreated }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [feedback, setFeedback] = useState<string>("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setLoading(true);
      const newEvent = await createEvent({
        name,
        description,
        imageUrl: imageUrl || undefined,
      });
      setFeedback("Evento creado correctamente");
      setName("");
      setDescription("");
      setImageUrl("");
      onEventCreated?.(newEvent);
    } catch (e: any) {
      setFeedback(e?.message ?? "Error al crear evento");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">
          Nombre del evento
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Merendero, Juegos, etc."
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Descripción</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Descripción del evento"
          rows={3}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">
          URL de imagen (opcional)
        </label>
        <input
          type="url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="https://ejemplo.com/evento.jpg"
        />
      </div>
      <button
        type="submit"
        className="w-full rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        disabled={loading}
      >
        {loading ? "Guardando..." : "Crear Evento"}
      </button>
      {feedback && (
        <div
          className={`text-sm p-3 rounded-lg ${feedback.includes("Error") ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}
        >
          {feedback}
        </div>
      )}
    </form>
  );
}
