import { useEffect, useRef, useState } from "react";
import { Play, RotateCcw, Mic, Square, ChevronRight, Check, ArrowLeft } from "./icons.jsx";
import { C, F } from "../../lib/consecutiva/tokens.js";
import { claveAudio, guardarAudio } from "../../lib/consecutiva/audioStore.js";
import {
  cargarVoces,
  vocesPara,
  vozElegida,
  leerPreferencias,
  guardarPreferencias,
  hablar,
  detener as detenerVoz,
} from "../../lib/consecutiva/voz.js";
import { useRecorder } from "./useRecorder.js";
import { Boton, Tarjeta, Titulo, destino, hablanteNombre } from "./ui.jsx";

const reloj = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

function IndicadorGrabacion({ segundos, nivel }) {
  const barras = 16;
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        flexWrap: "wrap",
        background: C.coralSuave,
        border: `2px solid ${C.coral}`,
        borderRadius: 12,
        padding: "12px 16px",
      }}
    >
      <span className="pj-grabando-punto" aria-hidden="true" />
      <strong style={{ color: C.coral, fontSize: 16 }}>Grabando</strong>
      <span style={{ fontVariantNumeric: "tabular-nums", fontSize: 18, fontWeight: 700, color: C.tinta }}>
        {reloj(segundos)}
      </span>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 26, flex: "1 1 120px" }} aria-label="Nivel de tu voz">
        {Array.from({ length: barras }, (_, i) => {
          const activa = nivel * barras > i;
          return (
            <div
              key={i}
              style={{
                flex: 1,
                maxWidth: 10,
                height: `${30 + (i / barras) * 70}%`,
                borderRadius: 2,
                background: activa ? C.coral : "rgba(192,57,43,0.18)",
                transition: "background .08s",
              }}
            />
          );
        })}
      </div>
      <span style={{ fontSize: 13, color: C.suave, flexBasis: "100%" }}>
        Si las barras no se mueven al hablar, el micrófono no te está captando.
      </span>
    </div>
  );
}

function SelectorVoz({ idioma, voces, prefs, onPrefs, texto }) {
  const lista = vocesPara(voces, idioma);
  const actual = vozElegida(voces, idioma, prefs);
  if (!lista.length) {
    return (
      <p style={{ margin: 0, fontSize: 14, color: C.suave }}>
        Este navegador no tiene voces en {idioma === "es" ? "español" : "inglés"}. Prueba con Chrome o Edge.
      </p>
    );
  }
  const control = {
    fontFamily: F.cuerpo,
    fontSize: 14,
    padding: "8px 10px",
    borderRadius: 8,
    border: `1px solid ${C.borde}`,
    background: C.superficie,
    color: C.tinta,
  };
  return (
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "end" }}>
      <label style={{ display: "grid", gap: 4, flex: "1 1 220px" }}>
        <span style={{ fontSize: 13, color: C.suave }}>Voz ({idioma === "es" ? "español" : "inglés"})</span>
        <select
          value={actual ? actual.name : ""}
          onChange={(e) => onPrefs({ ...prefs, [idioma]: e.target.value })}
          style={control}
        >
          {lista.map(({ voz }, i) => (
            <option key={voz.name} value={voz.name}>
              {voz.name} ({voz.lang}){i === 0 ? " · recomendada" : ""}
            </option>
          ))}
        </select>
      </label>
      <label style={{ display: "grid", gap: 4 }}>
        <span style={{ fontSize: 13, color: C.suave }}>Velocidad</span>
        <select
          value={prefs.velocidad}
          onChange={(e) => onPrefs({ ...prefs, velocidad: Number(e.target.value) })}
          style={control}
        >
          <option value={0.85}>Lenta</option>
          <option value={0.95}>Normal</option>
          <option value={1.05}>Rápida</option>
        </select>
      </label>
      <Boton
        variante="fantasma"
        style={{ padding: "8px 12px", fontSize: 14 }}
        onClick={() => hablar(texto, idioma, actual, prefs.velocidad)}
      >
        Probar voz
      </Boton>
    </div>
  );
}

export default function Practica({ ejercicio, intento, onCambio, onTerminar, onSalir }) {
  const [idx, setIdx] = useState(() => {
    const i = ejercicio.turnos.findIndex((_, n) => !intento.grabados[n]);
    return i === -1 ? ejercicio.turnos.length - 1 : i;
  });
  const [sonando, setSonando] = useState(false);
  const [voces, setVoces] = useState([]);
  const [prefs, setPrefs] = useState(leerPreferencias);
  const [verVoz, setVerVoz] = useState(false);
  const audioRef = useRef(null);
  const { grabando, error, segundos, nivel, iniciar, detener } = useRecorder();

  const turno = ejercicio.turnos[idx];
  const reps = intento.repeticiones[idx] || 0;
  const grabado = intento.grabados[idx];
  const ultimo = idx === ejercicio.turnos.length - 1;

  useEffect(() => {
    cargarVoces().then(setVoces);
    return () => detenerVoz();
  }, []);

  function cambiarPrefs(p) {
    setPrefs(p);
    guardarPreferencias(p);
  }

  async function escuchar() {
    onCambio({ ...intento, repeticiones: { ...intento.repeticiones, [idx]: reps + 1 } });
    setSonando(true);
    if (turno.audio) {
      const a = audioRef.current || new Audio();
      audioRef.current = a;
      // Respeta la ruta base (necesario en GitHub Pages).
      a.src = turno.audio.startsWith("/")
        ? import.meta.env.BASE_URL + turno.audio.slice(1)
        : turno.audio;
      a.onended = () => setSonando(false);
      a.onerror = () => setSonando(false);
      a.play().catch(() => setSonando(false));
    } else {
      await hablar(turno.plano, turno.idioma, vozElegida(voces, turno.idioma, prefs), prefs.velocidad);
      setSonando(false);
    }
  }

  async function alternarGrabacion() {
    if (grabando) {
      const duracion = segundos || 1;
      const blob = await detener();
      if (blob) {
        await guardarAudio(claveAudio(intento.id, idx), blob);
        onCambio({ ...intento, grabados: { ...intento.grabados, [idx]: duracion } });
      }
    } else {
      detenerVoz();
      setSonando(false);
      iniciar();
    }
  }

  const totalReps = Object.values(intento.repeticiones).reduce((s, n) => s + Math.max(0, n - 1), 0);
  const idiomaOrigen = turno.idioma;
  const textoPrueba =
    idiomaOrigen === "es"
      ? "Buenos días. Esta es la voz que escuchará durante el ejercicio."
      : "Good morning. This is the voice you will hear during the exercise.";

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <style>{`
        .pj-grabando-punto { width: 14px; height: 14px; border-radius: 50%; background: ${C.coral};
          animation: pjLatido 1s ease-in-out infinite; flex-shrink: 0; }
        @keyframes pjLatido { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: .35; transform: scale(.8); } }
        @media (prefers-reduced-motion: reduce) { .pj-grabando-punto { animation: none; } }
      `}</style>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <button
          onClick={() => { detenerVoz(); onSalir(); }}
          disabled={grabando}
          style={{ background: "none", border: "none", color: C.suave, display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontFamily: F.cuerpo, fontSize: 14 }}
        >
          <ArrowLeft size={16} /> Salir (se guarda el avance)
        </button>
        <span style={{ fontSize: 14, color: C.suave }}>
          Repeticiones pedidas: <strong style={{ color: C.tinta }}>{totalReps}</strong>
        </span>
      </div>

      <div style={{ display: "flex", gap: 4 }} aria-label="Progreso de segmentos">
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
            Segmento {idx + 1} de {ejercicio.turnos.length} · {hablanteNombre(turno.hablante)}
          </p>
          <Titulo nivel={2}>Escucha e interpreta al {destino(turno.idioma)}</Titulo>
          <p style={{ margin: "6px 0 0", color: C.suave, fontSize: 14 }}>
            El texto queda oculto, como en el examen. Solo escuchas.
          </p>
        </div>

        {turno.contexto && (
          <div style={{ background: C.fondo, borderRadius: 10, padding: "10px 14px", fontSize: 15 }}>
            <span style={{ display: "block", fontSize: 13, color: C.suave, marginBottom: 2 }}>
              Pregunta (contexto, no se interpreta)
            </span>
            <span style={{ color: C.tinta, fontStyle: "italic" }}>{turno.contexto}</span>
          </div>
        )}

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
            disabled={reps === 0}
          >
            {grabando ? <Square size={18} /> : <Mic size={18} />}
            {grabando ? "Detener grabación" : grabado ? "Grabar de nuevo" : "Grabar interpretación"}
          </Boton>
        </div>

        {grabando && <IndicadorGrabacion segundos={segundos} nivel={nivel} />}

        {grabado && !grabando && (
          <p style={{ margin: 0, color: C.verde, fontSize: 14, display: "flex", alignItems: "center", gap: 6 }}>
            <Check size={16} /> Interpretación grabada
            {typeof grabado === "number" ? ` (${reloj(grabado)})` : ""}.
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
              background: "#fff",
            }}
          />
        </label>

        <div style={{ borderTop: `1px solid ${C.borde}`, paddingTop: 12 }}>
          <button
            onClick={() => setVerVoz(!verVoz)}
            aria-expanded={verVoz}
            style={{ background: "none", border: "none", padding: 0, color: C.azul, fontSize: 14, cursor: "pointer", fontFamily: F.cuerpo, textDecoration: "underline" }}
          >
            {verVoz ? "Ocultar ajustes de voz" : "Ajustar la voz"}
          </button>
          {verVoz && (
            <div style={{ marginTop: 12 }}>
              <SelectorVoz idioma={idiomaOrigen} voces={voces} prefs={prefs} onPrefs={cambiarPrefs} texto={textoPrueba} />
              <p style={{ margin: "8px 0 0", fontSize: 13, color: C.suave }}>
                Las voces dependen de tu navegador. Las más naturales suelen ser las «Natural» de Edge y las de Google en Chrome.
              </p>
            </div>
          )}
        </div>
      </Tarjeta>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        {ultimo ? (
          <Boton onClick={onTerminar} disabled={!grabado || grabando}>
            Terminar y evaluar <ChevronRight size={18} />
          </Boton>
        ) : (
          <Boton onClick={() => setIdx(idx + 1)} disabled={!grabado || grabando}>
            Siguiente segmento <ChevronRight size={18} />
          </Boton>
        )}
      </div>
    </div>
  );
}
