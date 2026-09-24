import { useEffect, useRef, useState } from "react";
import { Play, RotateCcw, Mic, Square, ChevronRight, Check, ArrowLeft } from "lucide-react";
import { C, F } from "../../lib/consecutiva/tokens.js";
import { claveAudio, guardarAudio } from "../../lib/consecutiva/audioStore.js";
import { useRecorder } from "./useRecorder.js";
import { Boton, Tarjeta, Titulo, destino, hablanteNombre } from "./ui.jsx";

function hablar(texto, idioma) {
  return new Promise((resolve) => {
    const synth = window.speechSynthesis;
    if (!synth) return resolve();
    synth.cancel();
    const u = new SpeechSynthesisUtterance(texto);
    u.lang = idioma === "es" ? "es-MX" : "en-US";
    const voz = synth.getVoices().find((v) => v.lang.startsWith(idioma));
    if (voz) u.voice = voz;
    u.rate = 0.95;
    u.onend = resolve;
    u.onerror = resolve;
    synth.speak(u);
  });
}

export default function Practica({ ejercicio, intento, onCambio, onTerminar, onSalir }) {
  const [idx, setIdx] = useState(() => {
    const i = ejercicio.turnos.findIndex((_, n) => !intento.grabados[n]);
    return i === -1 ? ejercicio.turnos.length - 1 : i;
  });
  const [sonando, setSonando] = useState(false);
  const audioRef = useRef(null);
  const { grabando, error, iniciar, detener } = useRecorder();

  const turno = ejercicio.turnos[idx];
  const reps = intento.repeticiones[idx] || 0; // 0 = no escuchado; 1 = primera vez
  const grabado = !!intento.grabados[idx];
  const ultimo = idx === ejercicio.turnos.length - 1;

  useEffect(() => () => window.speechSynthesis && window.speechSynthesis.cancel(), []);

  async function escuchar() {
    onCambio({ ...intento, repeticiones: { ...intento.repeticiones, [idx]: reps + 1 } });
    setSonando(true);
    if (turno.audio) {
      const a = audioRef.current || new Audio();
      audioRef.current = a;
      a.src = turno.audio;
      a.onended = () => setSonando(false);
      a.onerror = () => setSonando(false);
      a.play().catch(() => setSonando(false));
    } else {
      await hablar(turno.plano, turno.idioma);
      setSonando(false);
    }
  }

  async function alternarGrabacion() {
    if (grabando) {
      const blob = await detener();
      await guardarAudio(claveAudio(intento.id, idx), blob);
      onCambio({ ...intento, grabados: { ...intento.grabados, [idx]: true } });
    } else {
      iniciar();
    }
  }

  const totalReps = Object.values(intento.repeticiones).reduce(
    (s, n) => s + Math.max(0, n - 1),
    0
  );

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <button
          onClick={onSalir}
          style={{ background: "none", border: "none", color: C.suave, display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontFamily: F.cuerpo, fontSize: 14 }}
        >
          <ArrowLeft size={16} /> Salir (se guarda el avance)
        </button>
        <span style={{ fontSize: 14, color: C.suave }}>
          Repeticiones pedidas: <strong style={{ color: C.tinta }}>{totalReps}</strong>
        </span>
      </div>

      <div style={{ display: "flex", gap: 4 }} aria-label="Progreso de turnos">
        {ejercicio.turnos.map((_, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: 6,
              borderRadius: 3,
              background: intento.grabados[i] ? C.verde : i === idx ? C.azul : C.borde,
            }}
          />
        ))}
      </div>

      <Tarjeta style={{ display: "grid", gap: 18 }}>
        <div>
          <p style={{ margin: 0, color: C.suave, fontSize: 14 }}>
            Turno {idx + 1} de {ejercicio.turnos.length}
          </p>
          <Titulo nivel={2}>
            {hablanteNombre(turno.hablante)} · interpreta al {destino(turno.idioma)}
          </Titulo>
          <p style={{ margin: "6px 0 0", color: C.suave, fontSize: 14 }}>
            El texto queda oculto, como en el examen. Solo escuchas.
          </p>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {reps === 0 ? (
            <Boton onClick={escuchar} disabled={sonando || grabando}>
              <Play size={18} /> {sonando ? "Reproduciendo…" : "Escuchar"}
            </Boton>
          ) : (
            <Boton variante="secundario" onClick={escuchar} disabled={sonando || grabando}>
              <RotateCcw size={18} /> {sonando ? "Reproduciendo…" : "Pedir repetición"}
            </Boton>
          )}
          <Boton
            variante={grabando ? "peligro" : grabado ? "fantasma" : "primario"}
            onClick={alternarGrabacion}
            disabled={reps === 0 || sonando}
          >
            {grabando ? <Square size={18} /> : <Mic size={18} />}
            {grabando ? "Detener grabación" : grabado ? "Grabar de nuevo" : "Grabar interpretación"}
          </Boton>
        </div>

        {grabando && (
          <p role="status" style={{ margin: 0, color: C.coral, fontWeight: 600, fontSize: 14 }}>
            ● Grabando… interpreta ahora.
          </p>
        )}
        {grabado && !grabando && (
          <p style={{ margin: 0, color: C.verde, fontSize: 14, display: "flex", alignItems: "center", gap: 6 }}>
            <Check size={16} /> Interpretación grabada.
          </p>
        )}
        {error && <p style={{ margin: 0, color: C.coral, fontSize: 14 }}>{error}</p>}

        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: C.tinta }}>Tus notas</span>
          <textarea
            value={intento.notas[idx] || ""}
            onChange={(e) => onCambio({ ...intento, notas: { ...intento.notas, [idx]: e.target.value } })}
            rows={4}
            placeholder="Toma notas mientras escuchas"
            style={{
              fontFamily: F.cuerpo,
              fontSize: 15,
              padding: 12,
              borderRadius: 10,
              border: `1px solid ${C.borde}`,
              resize: "vertical",
            }}
          />
        </label>
      </Tarjeta>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        {ultimo ? (
          <Boton onClick={onTerminar} disabled={!grabado || grabando}>
            Terminar y evaluar <ChevronRight size={18} />
          </Boton>
        ) : (
          <Boton onClick={() => setIdx(idx + 1)} disabled={!grabado || grabando}>
            Siguiente turno <ChevronRight size={18} />
          </Boton>
        )}
      </div>
    </div>
  );
}
