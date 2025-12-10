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
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Nombre Completo */}
      <div className="group">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Nombre Completo <span className="text-red-500">*</span>
        </label>
        <input
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none hover:border-gray-400"
          placeholder="Ej: Juan Pérez González"
          required
        />
      </div>

      {/* Edad y Sexo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Edad <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={age}
            onChange={(e) => {
              const value = e.target.value;
              // Permitir solo números positivos y vacío
              if (
                value === "" ||
                (parseInt(value) >= 0 && parseInt(value) <= 18)
              ) {
                setAge(value);
              }
            }}
            onKeyDown={(e) => {
              // Bloquear signos negativos, 'e', '+', '-', '.'
              if (
                e.key === "-" ||
                e.key === "+" ||
                e.key === "e" ||
                e.key === "E" ||
                e.key === "."
              ) {
                e.preventDefault();
              }
            }}
            className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none hover:border-gray-400"
            placeholder="8"
            required
            min="0"
            max="18"
          />
        </div>

        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Sexo <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setSex("Niño")}
              className={`relative border-2 rounded-xl px-4 py-3 font-medium transition-all ${
                sex === "Niño"
                  ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                  : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
              }`}
            >
              <span className="text-sm">Niño</span>
              {sex === "Niño" && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              )}
            </button>

            <button
              type="button"
              onClick={() => setSex("Niña")}
              className={`relative border-2 rounded-xl px-4 py-3 font-medium transition-all ${
                sex === "Niña"
                  ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                  : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
              }`}
            >
              <span className="text-sm">Niña</span>
              {sex === "Niña" && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Botón de registro */}
      <button
        type="submit"
        className="w-full rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold px-6 py-4 transition-all shadow-lg hover:shadow-xl disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed disabled:shadow-none transform hover:scale-[1.02] active:scale-[0.98]"
        disabled={loading}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Guardando...
          </span>
        ) : (
          "Registrar Niño"
        )}
      </button>

      {/* Mensaje de feedback */}
      {feedback && (
        <div
          className={`text-sm p-4 rounded-xl font-medium border-2 ${
            feedback.includes("Error")
              ? "bg-red-50 text-red-800 border-red-200"
              : "bg-emerald-50 text-emerald-800 border-emerald-200"
          }`}
        >
          <div className="flex items-start gap-2">
            <span className="text-lg">
              {feedback.includes("Error") ? "❌" : ""}
            </span>
            <span>{feedback}</span>
          </div>
        </div>
      )}
    </form>
  );
}
