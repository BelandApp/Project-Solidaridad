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
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    readerRef.current = codeReader;
    let stopped = false;

    async function start() {
      try {
        setResultMsg("");
        setErrorMsg("");
        // Solicitar permiso explícito primero para que los dispositivos se enumeren correctamente (especialmente en móviles)
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" } },
          audio: false,
        });
        // Adjuntar stream al elemento de video para mostrar la vista previa
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }

        const devs = await BrowserMultiFormatReader.listVideoInputDevices();
        // Preferir cámara trasera si está disponible
        const backCam = devs.find((d) =>
          /back|rear|environment/i.test(d.label)
        );
        setDevices(devs);
        const deviceId =
          selectedDeviceId || backCam?.deviceId || devs[0]?.deviceId;
        if (!deviceId) {
          setErrorMsg("No se encontró cámara disponible");
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        if (!videoRef.current) {
          setErrorMsg("El elemento de video no está listo");
          return;
        }
        await codeReader.decodeFromVideoDevice(
          deviceId,
          videoRef.current,
          async (result, err) => {
            if (stopped) return;
            if (result) {
              setIsScanning(false);
              const qrContent = result.getText();
              try {
                await registerByQr({
                  qrContent,
                  eventId,
                });
                setResultMsg("Participación registrada correctamente");
              } catch (e: any) {
                setResultMsg(e?.message ?? "Error al registrar");
              }
            }
          }
        );
      } catch (e) {
        setErrorMsg("No se pudo iniciar la cámara");
      }
    }

    start();
    return () => {
      stopped = true;
      const media = videoRef.current?.srcObject as MediaStream | null;
      media?.getTracks().forEach((t) => t.stop());
    };
  }, [eventId]);

  function handleRescan() {
    setIsScanning(true);
    setResultMsg("");
    setErrorMsg("");
    const reader = readerRef.current;
    const video = videoRef.current;
    if (reader && video) {
      // Reiniciar lectura en el mismo dispositivo por defecto
      BrowserMultiFormatReader.listVideoInputDevices()
        .then((devices) => {
          const deviceId = devices[0]?.deviceId;
          if (!deviceId) {
            setErrorMsg("No se encontró cámara disponible");
            setIsScanning(false);
            return;
          }
          reader.decodeFromVideoDevice(deviceId, video, async (result) => {
            if (result) {
              setIsScanning(false);
              const qrContent = result.getText();
              try {
                await registerByQr({
                  qrContent,
                  eventId,
                });
                setResultMsg("Participación registrada correctamente");
              } catch (e: any) {
                setResultMsg(e?.message ?? "Error al registrar");
              }
            }
          });
        })
        .catch(() => {
          setErrorMsg("Error al reiniciar el escaneo");
          setIsScanning(false);
        });
    }
  }

  return (
    <div className="space-y-3">
      {devices.length > 0 && (
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-700">Cámara:</label>
          <select
            className="border border-gray-300 bg-white rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
            value={selectedDeviceId ?? ""}
            onChange={(e) => setSelectedDeviceId(e.target.value || undefined)}
          >
            <option value="">Automática</option>
            {devices.map((d) => (
              <option key={d.deviceId} value={d.deviceId}>
                {d.label || d.deviceId}
              </option>
            ))}
          </select>
        </div>
      )}
      <video
        ref={videoRef}
        className="w-full rounded-lg bg-black/5 ring-1 ring-gray-200"
      />
      <div className="flex gap-2">
        <button className="btn-neutral" onClick={onClose}>
          Cerrar
        </button>
        <button
          className="inline-flex items-center justify-center rounded px-3 py-2 text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
          onClick={handleRescan}
          disabled={isScanning}
        >
          Escanear otro
        </button>
      </div>
      {resultMsg && <p className="text-sm text-gray-700">{resultMsg}</p>}
      {errorMsg && <p className="text-sm text-red-600">{errorMsg}</p>}
    </div>
  );
}
