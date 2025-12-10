"use client";
import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { registerByQr } from "@/lib/api";

type Props = {
  eventId: string;
  onClose: () => void;
};

type VideoDevice = {
  deviceId: string;
  label: string;
};

export default function QRScanner({ eventId, onClose }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [resultMsg, setResultMsg] = useState<string>("");
  const [isScanning, setIsScanning] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);
  const lastScannedRef = useRef<string>("");
  const [successCount, setSuccessCount] = useState<number>(0);
  const [cameras, setCameras] = useState<VideoDevice[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>("");
  const [showCameraSelector, setShowCameraSelector] = useState<boolean>(false);

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    readerRef.current = codeReader;

    async function loadCameras() {
      try {
        // Primero pedir permisos de cámara
        await navigator.mediaDevices
          .getUserMedia({
            video: true,
            audio: false,
          })
          .then((stream) => {
            // Detener el stream inmediatamente, solo necesitábamos los permisos
            stream.getTracks().forEach((track) => track.stop());
          });

        // Ahora listar las cámaras disponibles
        const devices = await BrowserMultiFormatReader.listVideoInputDevices();
        console.log("Cámaras detectadas:", devices);
        setCameras(devices);

        // Seleccionar cámara trasera por defecto
        const backCam = devices.find((d) =>
          /back|rear|environment/i.test(d.label)
        );
        const defaultDeviceId = backCam?.deviceId || devices[0]?.deviceId || "";
        console.log("Cámara seleccionada:", defaultDeviceId);
        setSelectedCamera(defaultDeviceId);
      } catch (e) {
        console.error("Error al cargar cámaras:", e);
        setErrorMsg(
          "No se pudo acceder a las cámaras. Por favor, otorgue permisos de cámara."
        );
      }
    }

    loadCameras();
  }, []);

  useEffect(() => {
    if (!selectedCamera) return;

    const codeReader = readerRef.current;
    if (!codeReader) return;

    let stopped = false;

    async function start() {
      try {
        setResultMsg("");
        setErrorMsg("");

        // Solicitar cámara seleccionada
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            deviceId: selectedCamera,
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }

        if (!videoRef.current) {
          setErrorMsg("No se pudo acceder al video");
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        if (!codeReader) {
          setErrorMsg("Error al inicializar el lector QR");
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        await codeReader.decodeFromVideoDevice(
          selectedCamera,
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
              const response = await registerByQr({ qrContent, eventId });

              setSuccessCount((prev) => prev + 1);
              setResultMsg("✓ Registrado correctamente");

              // Reproducir sonido de éxito
              const audio = new Audio(
                "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjGJ0fPTgjMGHm7A7+OZRQ0MUqXp5rRgGAc4jNXzzn0pBSh+zPDaizYHG3C58N+SSBEKV6rm56RYFgo+mdry0X4qBSt7zvHajzkHHHG+8OGWRw0LU6Xk5rBiGAc1i9T00YAuBSl/zfDajTkHHnG/8OGVRQ4JUqXk5rFhGgc3itT00YEvBSl/zfHajTkHHnC+8OGVRQ4KUqTk5rFiGgc3itT00oEvBSl/zfHajTkHHnC+8OGVRQ4KUqTk5rFiGgc"
              );
              audio.play().catch(() => {});

              // Auto-reiniciar después de 1 segundo
              setTimeout(() => {
                setIsScanning(true);
                setResultMsg("");
                lastScannedRef.current = "";
              }, 1000);
            } catch (e: any) {
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
        setErrorMsg("No se pudo iniciar la cámara. Verifique los permisos.");
      }
    }

    start();

    return () => {
      stopped = true;
      const media = videoRef.current?.srcObject as MediaStream | null;
      media?.getTracks().forEach((t) => t.stop());
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, [eventId, selectedCamera]);

  function handleCameraChange(deviceId: string) {
    // Detener stream actual
    const media = videoRef.current?.srcObject as MediaStream | null;
    media?.getTracks().forEach((t) => t.stop());

    // Cambiar cámara
    setSelectedCamera(deviceId);
    setShowCameraSelector(false);
  }

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-black/80 z-[9999] flex items-center justify-center p-4 ">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden my-auto max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-4 sm:p-6 text-white flex-shrink-0">
          <div className="flex items-center justify-between gap-2 mb-2">
            <h2 className="text-xl sm:text-2xl font-bold">Escaneo Rápido QR</h2>
            {cameras.length > 1 && (
              <button
                onClick={() => setShowCameraSelector(!showCameraSelector)}
                className="bg-white/20 hover:bg-white/30 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap"
              >
                Cambiar Cámara
              </button>
            )}
          </div>
          <p className="text-emerald-100 text-xs sm:text-sm">
            Escaneos realizados:{" "}
            <span className="font-semibold text-base sm:text-lg">
              {successCount}
            </span>
          </p>
        </div>

        {/* Selector de cámara */}
        {showCameraSelector && (
          <div className="bg-gray-50 border-b border-gray-200 p-4 max-h-48 overflow-y-auto flex-shrink-0">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Seleccionar cámara:
            </label>
            <div className="space-y-2">
              {cameras.map((camera) => (
                <button
                  key={camera.deviceId}
                  onClick={() => handleCameraChange(camera.deviceId)}
                  className={`w-full text-left px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm ${
                    selectedCamera === camera.deviceId
                      ? "bg-emerald-100 text-emerald-800 font-semibold border-2 border-emerald-500"
                      : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                  }`}
                >
                  <span className="truncate block">
                    {camera.label ||
                      `Cámara ${camera.deviceId.substring(0, 8)}`}
                  </span>
                  {selectedCamera === camera.deviceId && (
                    <span className="ml-2">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Video Preview */}
        <div className="relative bg-black flex-shrink-0">
          <video
            ref={videoRef}
            className="w-full h-64 sm:h-80 md:h-96 object-contain"
            autoPlay
            playsInline
            muted
          />

          {/* Overlay de enfoque */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-48 h-48 sm:w-64 sm:h-64 border-4 border-emerald-400 rounded-2xl shadow-lg shadow-emerald-500/50">
              <div className="absolute -top-2 -left-2 w-6 h-6 sm:w-8 sm:h-8 border-t-4 border-l-4 border-white rounded-tl-xl"></div>
              <div className="absolute -top-2 -right-2 w-6 h-6 sm:w-8 sm:h-8 border-t-4 border-r-4 border-white rounded-tr-xl"></div>
              <div className="absolute -bottom-2 -left-2 w-6 h-6 sm:w-8 sm:h-8 border-b-4 border-l-4 border-white rounded-bl-xl"></div>
              <div className="absolute -bottom-2 -right-2 w-6 h-6 sm:w-8 sm:h-8 border-b-4 border-r-4 border-white rounded-br-xl"></div>
            </div>
          </div>

          {/* Estado del escaneo */}
          {isScanning && !resultMsg && !errorMsg && (
            <div className="absolute bottom-4 sm:bottom-6 left-0 right-0 flex justify-center px-4">
              <div className="bg-emerald-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full font-semibold flex items-center gap-2 shadow-lg text-sm sm:text-base">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full animate-pulse"></div>
                Listo para escanear
              </div>
            </div>
          )}
        </div>

        {/* Mensajes de estado */}
        <div className="p-4 sm:p-6 space-y-3 sm:space-y-4 overflow-y-auto flex-shrink min-h-0">
          {resultMsg && (
            <div
              className={`p-3 sm:p-4 rounded-xl font-semibold text-center text-base sm:text-lg ${
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
            <div className="p-3 sm:p-4 rounded-xl bg-red-100 text-red-800 border-2 border-red-300 text-center text-sm sm:text-base">
              {errorMsg}
            </div>
          )}

          {/* Instrucciones */}
          {!resultMsg && !errorMsg && (
            <div className="bg-blue-50 p-3 sm:p-4 rounded-xl border border-blue-200">
              <p className="text-blue-900 text-xs sm:text-sm font-medium">
                💡 <strong>Instrucciones:</strong> Coloque el código QR dentro
                del marco. El escaneo es automático e instantáneo.
              </p>
            </div>
          )}

          {/* Botón cerrar */}
          <button
            onClick={onClose}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 sm:py-4 rounded-xl transition-colors text-base sm:text-lg"
          >
            Cerrar Scanner
          </button>
        </div>
      </div>
    </div>
  );
}
