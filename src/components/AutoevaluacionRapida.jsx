// src/components/AutoevaluacionRapida.jsx
import { useState } from "react";
import { Check, Sparkles } from "lucide-react";

function Pregunta({ p, index }) {
  const [respuesta, setRespuesta] = useState("");
  const [revelado, setRevelado] = useState(false);

  const esCorrecta =
    p.tipo === "completar" &&
    respuesta.trim().length > 0 &&
    p.respuesta.toLowerCase().includes(respuesta.trim().toLowerCase());

  return (
    <div className="py-3 first:pt-0">
      <p className="text-[13.5px] text-gray-800 mb-2">
        <span className="text-amber font-medium">{index + 1}.</span> {p.pregunta}
      </p>
      {p.tipo === "completar" ? (
        <div className="flex items-center gap-2 flex-wrap">
          <input
            value={respuesta}
            onChange={(e) => setRespuesta(e.target.value)}
            placeholder="Escribe tu respuesta..."
            className="px-3 py-1.5 rounded-md border border-gray-200 text-sm outline-none focus:border-amber flex-1 min-w-[180px]"
          />
          <button
            onClick={() => setRevelado(true)}
            className="text-xs text-gray-500 underline"
          >
            ver respuesta
          </button>
          {respuesta && esCorrecta && (
            <span className="flex items-center gap-1 text-progressGreen text-xs font-medium">
              <Check size={13} /> bien encaminado
            </span>
          )}
        </div>
      ) : (
        <button
          onClick={() => setRevelado(!revelado)}
          className="text-xs text-amber underline"
        >
          {revelado ? "ocultar" : "mostrar"} pista de respuesta
        </button>
      )}
      {revelado && (
        <p className="text-xs text-gray-500 mt-1.5 bg-white rounded px-3 py-2 border border-amber/30">
          {p.tipo === "completar"
            ? `Respuesta esperada: ${p.respuesta}`
            : "Repasa la sección correspondiente arriba y redacta tu propia respuesta con tus palabras."}
        </p>
      )}
    </div>
  );
}

export default function AutoevaluacionRapida({ preguntas }) {
  if (!preguntas || preguntas.length === 0) return null;

  return (
    <div className="mt-6 rounded-lg border border-amber/40 bg-amberBg overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-amber/30">
        <Sparkles size={15} className="text-amber" />
        <p className="text-[13.5px] font-medium text-gray-900">
          Autoevaluación rápida
        </p>
        <span className="text-xs text-gray-400">{preguntas.length} preguntas</span>
      </div>
      <div className="px-4 py-1 divide-y divide-amber/20">
        {preguntas.map((p, i) => (
          <Pregunta key={i} p={p} index={i} />
        ))}
      </div>
    </div>
  );
}
