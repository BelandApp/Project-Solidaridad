"use client";
import { useState } from "react";
import { createChild } from "@/lib/api";

export default function ChildForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [tutorName, setTutorName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [qr, setQr] = useState("");
  const [feedback, setFeedback] = useState<string>("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await createChild({
        firstName,
        lastName,
        birthDate,
        tutorName,
        contactPhone,
        notes,
        qr,
      });
      setFeedback(res.message ?? "Niño creado correctamente");
      setFirstName("");
      setLastName("");
      setBirthDate("");
      setTutorName("");
      setContactPhone("");
      setNotes("");
      setQr("");
    } catch (e: any) {
      setFeedback(e?.message ?? "Error al crear niño");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm mb-1">Nombre</label>
          <input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="Introduce el nombre"
            required
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Apellido</label>
          <input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="Introduce el apellido"
            required
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
          />
        </div>
        <div>
          <label className="block text-sm mb-1">QR (texto/código)</label>
          <input
            value={qr}
            onChange={(e) => setQr(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="Código asignado"
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm mb-1">Nombre del tutor</label>
          <input
            value={tutorName}
            onChange={(e) => setTutorName(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Teléfono de contacto</label>
          <input
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm mb-1">Notas (opcional)</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full border rounded px-3 py-2"
          placeholder="Alergias, consideraciones especiales, etc."
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
