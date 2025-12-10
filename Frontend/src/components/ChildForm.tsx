"use client";
import { useState } from "react";
import { createChild } from "@/lib/api";

export default function ChildForm() {
  const [fullName, setFullName] = useState("");
  const [document, setDocument] = useState("");
  const [age, setAge] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [tutorName, setTutorName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [feedback, setFeedback] = useState<string>("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await createChild({
        fullName,
        document,
        age: parseInt(age) || 0,
        birthDate,
        tutorName,
        imageUrl: imageUrl || undefined,
      });
      setFeedback("Niño creado correctamente. QR generado automáticamente.");
      setFullName("");
      setDocument("");
      setAge("");
      setBirthDate("");
      setTutorName("");
      setImageUrl("");
    } catch (e: any) {
      setFeedback(e?.message ?? "Error al crear niño");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm mb-1">Nombre Completo</label>
        <input
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full border rounded px-3 py-2"
          placeholder="Juan Pérez"
          required
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm mb-1">DNI/Documento</label>
          <input
            value={document}
            onChange={(e) => setDocument(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="12345678"
            required
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Edad</label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="8"
            required
            min="0"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm mb-1">Fecha de nacimiento</label>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Nombre del tutor</label>
          <input
            value={tutorName}
            onChange={(e) => setTutorName(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="María Pérez"
            required
          />
        </div>
      </div>
      <div>
        <label className="block text-sm mb-1">URL de imagen (opcional)</label>
        <input
          type="url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="w-full border rounded px-3 py-2"
          placeholder="https://ejemplo.com/foto.jpg"
        />
      </div>
      <button
        type="submit"
        className="rounded bg-green-600 text-white px-4 py-2"
        disabled={loading}
      >
        {loading ? "Guardando..." : "Registrar Niño"}
      </button>
      {feedback && <p className="text-sm">{feedback}</p>}
    </form>
  );
}
