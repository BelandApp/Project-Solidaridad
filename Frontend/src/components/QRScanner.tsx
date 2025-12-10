"use client";
import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { registerByQr } from "@/lib/api";

type Props = {
  eventId: string;
  onClose: () => void;
};

export default function QRScanner({ eventId, onClose }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [resultMsg, setResultMsg] = useState<string>("");
  const [isScanning, setIsScanning] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);
  const lastScannedRef = useRef<string>("");
  const [successCount, setSuccessCount] = useState<number>(0);

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    readerRef.current = codeReader;
    let stopped = false;

    async function start() {
      try {
        console.log("📷 Iniciando cámara para evento:", eventId);
        setResultMsg("");
        setErrorMsg("");

        // Solicitar cámara trasera para móviles
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: "environment" },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }

        const devs = await BrowserMultiFormatReader.listVideoInputDevices();
        const backCam = devs.find((d) =>
          /back|rear|environment/i.test(d.label)
        );
        const deviceId = backCam?.deviceId || devs[0]?.deviceId;

        if (!deviceId || !videoRef.current) {
          setErrorMsg("No se encontró cámara disponible");
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        console.log("✅ Cámara iniciada, esperando códigos QR...");

        await codeReader.decodeFromVideoDevice(
          deviceId,
          videoRef.current,
          async (result, err) => {
            if (stopped || !result || !isScanning) return;

            const qrContent = result.getText();
            console.log("🔍 QR detectado:", qrContent);

            // Evitar escaneos duplicados del mismo código
            if (qrContent === lastScannedRef.current) {
              console.log("⚠️ QR duplicado, ignorando");
              return;
            }

            // Bloquear inmediatamente para evitar múltiples escaneos
            lastScannedRef.current = qrContent;
            setIsScanning(false);

            try {
              console.log("📤 Registrando asistencia...", {
                qrContent,
                eventId,
              });
              const response = await registerByQr({ qrContent, eventId });
              console.log("✅ Respuesta del servidor:", response);
              setSuccessCount((prev) => prev + 1);
              setResultMsg("✓ Registrado correctamente");

              // Reproducir sonido de éxito
              const audio = new Audio(
                "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjGJ0fPTgjMGHm7A7+OZRQ0MUqXp5rRgGAc4jNXzzn0pBSh+zPDaizYHG3C58N+SSBEKV6rm56RYFgo+mdry0X4qBSt7zvHajzkHHHG+8OGWRw0LU6Xk5rBiGAc1i9T00YAuBSl/zfDajTkHHnG/8OGVRQ4JUqXk5rFhGgc3itT00YEvBSl/zfHajTkHHnC+8OGVRQ4KUqTk5rFiGgc3itT00oEvBSl/zfHajTkHHnC+8OGVRQ4KUqTk5rFiGgc"
              );
              audio.play().catch(() => {});

              // Auto-reiniciar después de 1 segundo
              setTimeout(() => {
                console.log("🔄 Reiniciando escáner...");
                setIsScanning(true);
                setResultMsg("");
                lastScannedRef.current = "";
              }, 1000);
            } catch (e: any) {
              console.error("❌ Error al registrar:", e);

              // Detectar si es un error de participación duplicada
              const isDuplicate =
                e?.message?.toLowerCase().includes("ya participó") ||
                e?.message?.toLowerCase().includes("already participated");

              if (isDuplicate) {
                setResultMsg("⚠️ Este niño ya asistió a este evento");
              } else {
                setResultMsg("✗ " + (e?.message ?? "Error al registrar"));
              }
              setErrorMsg("");

              // Reintentar después de 2 segundos
              setTimeout(() => {
                setIsScanning(true);
                setResultMsg("");
                lastScannedRef.current = "";
              }, 2000);
            }
          }
        );
      } catch (e) {
        console.error("❌ Error al iniciar cámara:", e);
        setErrorMsg("No se pudo iniciar la cámara. Verifique los permisos.");
      }
    }

    start();

    return () => {
      console.log("🛑 Deteniendo escáner QR");
      stopped = true;
      const media = videoRef.current?.srcObject as MediaStream | null;
      media?.getTracks().forEach((t) => t.stop());
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, [eventId]);

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-black/80 z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">Escaneo Rápido QR</h2>
          <p className="text-emerald-100 text-sm">
            Escaneos realizados:{" "}
            <span className="font-semibold text-lg">{successCount}</span>
          </p>
        </div>

        {/* Video Preview */}
        <div className="relative bg-black">
          <video
            ref={videoRef}
            className="w-full h-96 object-contain"
            autoPlay
            playsInline
            muted
          />

          {/* Overlay de enfoque */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-64 h-64 border-4 border-emerald-400 rounded-2xl shadow-lg shadow-emerald-500/50">
              <div className="absolute -top-2 -left-2 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-xl"></div>
              <div className="absolute -top-2 -right-2 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-xl"></div>
              <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-xl"></div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-xl"></div>
            </div>
          </div>

          {/* Estado del escaneo */}
          {isScanning && !resultMsg && !errorMsg && (
            <div className="absolute bottom-6 left-0 right-0 flex justify-center">
              <div className="bg-emerald-500 text-white px-6 py-3 rounded-full font-semibold flex items-center gap-2 shadow-lg">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                Listo para escanear
              </div>
            </div>
          )}
        </div>

        {/* Mensajes de estado */}
        <div className="p-6 space-y-4">
          {resultMsg && (
            <div
              className={`p-4 rounded-xl font-semibold text-center text-lg ${
                resultMsg.includes("✓")
                  ? "bg-green-100 text-green-800 border-2 border-green-300"
                  : resultMsg.includes("⚠️")
                    ? "bg-yellow-100 text-yellow-800 border-2 border-yellow-300"
                    : "bg-red-100 text-red-800 border-2 border-red-300"
              }`}
            >
              {resultMsg}
            </div>
          )}

          {errorMsg && (
            <div className="p-4 rounded-xl bg-red-100 text-red-800 border-2 border-red-300 text-center">
              {errorMsg}
            </div>
          )}

          {/* Instrucciones */}
          {!resultMsg && !errorMsg && (
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
              <p className="text-blue-900 text-sm font-medium">
                💡 <strong>Instrucciones:</strong> Coloque el código QR dentro
                del marco. El escaneo es automático e instantáneo.
              </p>
            </div>
          )}

          {/* Botón cerrar */}
          <button
            onClick={onClose}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-4 rounded-xl transition-colors text-lg"
          >
            Cerrar Scanner
          </button>
        </div>
      </div>
    </div>
  );
}
