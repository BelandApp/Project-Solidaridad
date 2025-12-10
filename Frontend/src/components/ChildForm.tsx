"use client";
import { useState } from "react";
import { createChild, type Child } from "@/lib/api";

type Props = {
  onChildCreated?: (child: Child) => void;
};

export default function ChildForm({ onChildCreated }: Props) {
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [sex, setSex] = useState<"Niño" | "Niña">("Niño");
  const [feedback, setFeedback] = useState<string>("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const newChild = await createChild({
        fullName,
        age: parseInt(age) || 0,
        sex,
      });
      setFeedback("Niño creado correctamente. QR generado automáticamente.");
      setFullName("");
      setAge("");
      setSex("Niño");
      onChildCreated?.(newChild);
    } catch (e: any) {
      setFeedback(e?.message ?? "Error al crear niño");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">
          Nombre Completo
        </label>
        <input
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Juan Pérez"
          required
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Edad</label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="8"
            required
            min="0"
            max="18"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Sexo</label>
          <select
            value={sex}
            onChange={(e) => setSex(e.target.value as "Niño" | "Niña")}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="Niño">Niño</option>
            <option value="Niña">Niña</option>
          </select>
        </div>
      </div>
      <button
        type="submit"
        className="w-full rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        disabled={loading}
      >
        {loading ? "Guardando..." : "Registrar Niño"}
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
