// src/components/SemanaView.jsx
import { useState } from "react";
import { ChevronDown, BookOpenCheck, Layers3 } from "lucide-react";
import AutoevaluacionRapida from "./AutoevaluacionRapida.jsx";

export default function SemanaView({ semana }) {
  const [open, setOpen] = useState(0);

  if (!semana) {
    return <p className="text-gray-500">No se encontró contenido para esta semana.</p>;
  }

  return (
    <div className="view-enter">
      <header className="study-hero mb-8">
        <div className="relative z-10 max-w-2xl">
          <p className="text-[10px] font-semibold tracking-[0.16em] text-blue-200 uppercase mb-3">
            Ruta de aprendizaje · Intérprete judicial
          </p>
          <h1 className="text-[28px] md:text-[38px] leading-[1.13] font-serif font-semibold text-white tracking-[-0.035em]">
            {semana.titulo}
          </h1>
          <p className="text-sm text-blue-100/80 mt-3">
            {semana.fuente || "Guía de estudio oficial"}
          </p>
        </div>
        <div className="relative z-10 grid grid-cols-2 gap-2 mt-7 sm:mt-0">
          <div className="hero-stat">
            <Layers3 size={17} />
            <strong>{semana.secciones.length}</strong>
            <span>temas</span>
          </div>
          <div className="hero-stat">
            <BookOpenCheck size={17} />
            <strong>{semana.totalTerminos}</strong>
            <span>términos</span>
          </div>
        </div>
      </header>

      <div className="mb-3 flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.12em] text-accent uppercase mb-1">Contenido</p>
          <h2 className="text-xl font-serif font-semibold text-gray-900">Temario de la semana</h2>
        </div>
        <p className="hidden sm:block text-xs text-gray-400">Selecciona un tema para estudiarlo</p>
      </div>

      <div className="space-y-3">
        {semana.secciones.map((s, i) => (
          <div key={s.id || s.titulo} className={`topic-card ${open === i ? "topic-card-open" : ""}`}>
            <button
              onClick={() => setOpen(open === i ? -1 : i)}
              className="w-full min-h-14 text-left px-3.5 md:px-5 py-3.5 md:py-4 flex items-center gap-3"
            >
              <span className="grid place-items-center w-8 h-8 rounded-[10px] bg-blue-50 text-sm text-accent font-semibold flex-shrink-0 tabular-nums">
                {i + 1}
              </span>
              <span className="flex-1 text-[14px] font-medium text-gray-900">{s.titulo}</span>
              <span className="count-pill">
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
                <div className="bg-slate-50/70 border-t border-slate-100">
                  {s.contenido && (
                    <p className="text-sm text-gray-600 leading-relaxed px-4 pt-4 md:pl-12 md:pr-6">
                      {s.contenido}
                    </p>
                  )}
                  <div className="divide-y divide-gray-100">
                    {(s.terminos || []).map((t) => (
                      <div
                        key={t.en}
                        className="px-4 py-3 md:pl-12 flex flex-col sm:flex-row sm:items-baseline gap-x-4 gap-y-1"
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
              <div key={t.en} className="px-4 py-3 flex flex-col sm:flex-row sm:justify-between text-sm gap-1 sm:gap-4">
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
