"use client";
import { useState } from "react";
import { createEvent } from "@/lib/api";

export default function EventForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [feedback, setFeedback] = useState<string>("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setLoading(true);
      await createEvent({
        name,
        description,
        imageUrl: imageUrl || undefined,
      });
      setFeedback("Evento creado correctamente");
      setName("");
      setDescription("");
      setImageUrl("");
    } catch (e: any) {
      setFeedback(e?.message ?? "Error al crear evento");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
      <div>
        <label className="block text-sm mb-1">Descripción</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border rounded px-3 py-2"
          placeholder="Descripción del evento"
          rows={3}
          required
        />
      </div>
      <div>
        <label className="block text-sm mb-1">URL de imagen (opcional)</label>
        <input
          type="url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="w-full border rounded px-3 py-2"
          placeholder="https://ejemplo.com/evento.jpg"
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
