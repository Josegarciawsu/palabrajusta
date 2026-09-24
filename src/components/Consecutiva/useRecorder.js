import { useRef, useState } from "react";

// Grabación con el micrófono del navegador (MediaRecorder).
export function useRecorder() {
  const [grabando, setGrabando] = useState(false);
  const [error, setError] = useState("");
  const rec = useRef(null);
  const chunks = useRef([]);
  const resolver = useRef(null);

  async function iniciar() {
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      chunks.current = [];
      mr.ondataavailable = (e) => e.data.size && chunks.current.push(e.data);
      mr.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunks.current, { type: mr.mimeType || "audio/webm" });
        resolver.current && resolver.current(blob);
      };
      mr.start();
      rec.current = mr;
      setGrabando(true);
    } catch (e) {
      setError(
        e && e.name === "NotAllowedError"
          ? "El navegador bloqueó el micrófono. Permite el acceso en la barra de direcciones y vuelve a intentarlo."
          : "No se pudo acceder al micrófono. Revisa que esté conectado."
      );
    }
  }

  function detener() {
    return new Promise((resolve) => {
      resolver.current = resolve;
      if (rec.current && rec.current.state !== "inactive") rec.current.stop();
      setGrabando(false);
    });
  }

  return { grabando, error, iniciar, detener };
}
