// src/components/SemanaView.jsx
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import AutoevaluacionRapida from "./AutoevaluacionRapida.jsx";

export default function SemanaView({ semana }) {
  const [open, setOpen] = useState(0);

  if (!semana) {
    return <p className="text-gray-500">No se encontró contenido para esta semana.</p>;
  }

  return (
    <div>
      <h1 className="text-[26px] font-serif text-gray-900 mb-1">{semana.titulo}</h1>
      <p className="text-sm text-gray-500 mb-6">
        {semana.totalTerminos} términos
        {semana.fuente ? ` · ${semana.fuente}` : ""}
      </p>

      <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
        {semana.secciones.map((s, i) => (
          <div key={s.id || s.titulo} className={i > 0 ? "border-t border-gray-100" : ""}>
            <button
              onClick={() => setOpen(open === i ? -1 : i)}
              className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-gray-50"
            >
              <span className="text-sm text-accent font-medium w-5 flex-shrink-0 tabular-nums">
                {i + 1}
              </span>
              <span className="flex-1 text-[14px] text-gray-900">{s.titulo}</span>
              <span className="text-xs text-gray-400 flex-shrink-0">
                {(s.terminos || []).length}
              </span>
              <ChevronDown
                size={15}
                className={`text-gray-400 flex-shrink-0 transition-transform ${
                  open === i ? "rotate-180" : ""
                }`}
              />
            </button>
            <div className={`accordion-wrap ${open === i ? "open" : ""}`}>
              <div className="accordion-inner">
                <div className="bg-gray-50/60 border-t border-gray-100">
                  {s.contenido && (
                    <p className="text-sm text-gray-600 leading-relaxed px-4 pt-3 pl-12 pr-6">
                      {s.contenido}
                    </p>
                  )}
                  <div className="divide-y divide-gray-100">
                    {(s.terminos || []).map((t) => (
                      <div
                        key={t.en}
                        className="px-4 pl-12 py-2.5 flex flex-col sm:flex-row sm:items-baseline gap-x-4 gap-y-0.5"
                      >
                        <div className="sm:w-[46%] flex-shrink-0">
                          <span className="text-[13.5px] font-medium text-gray-900">{t.es}</span>
                          <span className="text-[12.5px] text-gray-400 italic ml-1.5">{t.en}</span>
                        </div>
                        <p className="text-[13px] text-gray-500 leading-snug">{t.definicion}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {semana.apendice && (
        <div className="mt-6">
          <p className="font-medium text-gray-900 text-sm mb-2">{semana.apendice.titulo}</p>
          <div className="border border-gray-200 rounded-lg bg-white divide-y divide-gray-100">
            {semana.apendice.terminos.map((t) => (
              <div key={t.en} className="px-4 py-2 flex justify-between text-sm gap-4">
                <span className="text-gray-700 italic">{t.en}</span>
                <span className="text-gray-500 text-right">{t.es}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <AutoevaluacionRapida preguntas={semana.preguntas} />
    </div>
  );
}
