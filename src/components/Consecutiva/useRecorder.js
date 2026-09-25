import { useEffect, useRef, useState } from "react";

// Grabación con el micrófono. Expone el tiempo transcurrido y el nivel de voz.
export function useRecorder() {
  const [grabando, setGrabando] = useState(false);
  const [error, setError] = useState("");
  const [segundos, setSegundos] = useState(0);
  const [nivel, setNivel] = useState(0);
  const rec = useRef(null);
  const chunks = useRef([]);
  const resolver = useRef(null);
  const recursos = useRef({});

  function limpiar() {
    const r = recursos.current;
    if (r.raf) cancelAnimationFrame(r.raf);
    if (r.reloj) clearInterval(r.reloj);
    if (r.ctx) r.ctx.close().catch(() => {});
    if (r.stream) r.stream.getTracks().forEach((t) => t.stop());
    recursos.current = {};
    setNivel(0);
  }

  useEffect(() => limpiar, []);

  async function iniciar() {
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      chunks.current = [];
      mr.ondataavailable = (e) => e.data.size && chunks.current.push(e.data);
      mr.onstop = () => {
        const blob = new Blob(chunks.current, { type: mr.mimeType || "audio/webm" });
        limpiar();
        resolver.current && resolver.current(blob);
      };

      // Medidor de nivel de voz
      const Ctx = window.AudioContext || window.webkitAudioContext;
      const r = { stream };
      if (Ctx) {
        const ctx = new Ctx();
        const analizador = ctx.createAnalyser();
        analizador.fftSize = 512;
        ctx.createMediaStreamSource(stream).connect(analizador);
        const datos = new Uint8Array(analizador.fftSize);
        const medir = () => {
          analizador.getByteTimeDomainData(datos);
          let suma = 0;
          for (const d of datos) suma += ((d - 128) / 128) ** 2;
          setNivel(Math.min(1, Math.sqrt(suma / datos.length) * 4));
          r.raf = requestAnimationFrame(medir);
        };
        r.ctx = ctx;
        medir();
      }
      const inicio = Date.now();
      setSegundos(0);
      r.reloj = setInterval(() => setSegundos(Math.floor((Date.now() - inicio) / 1000)), 250);
      recursos.current = r;

      mr.start();
      rec.current = mr;
      setGrabando(true);
    } catch (e) {
      limpiar();
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
      else resolve(null);
      setGrabando(false);
    });
  }

  return { grabando, error, segundos, nivel, iniciar, detener };
}
