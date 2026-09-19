// src/components/ResumenView.jsx
import { semanas, glosarioCompleto, totalSemanas } from "../data/index.js";

export default function ResumenView({ quizScores, onNavigate }) {
  const totalTerminos = glosarioCompleto.length;

  return (
    <div>
      <h1 className="text-[26px] font-serif mb-3 text-gray-900">
        Bienvenido de vuelta
      </h1>
      <p className="text-gray-500 mb-8 max-w-lg">
        Certificación de intérprete judicial inglés-español · Utah. Continúa
        donde te quedaste o repasa lo ya visto.
      </p>

      <div className="border border-gray-200 rounded-lg bg-white grid grid-cols-3 divide-x divide-gray-200 mb-6">
        <div className="p-4">
          <p className="text-xs text-gray-400 mb-1">Términos disponibles</p>
          <p className="text-xl font-semibold text-gray-900">{totalTerminos}</p>
        </div>
        <div className="p-4">
          <p className="text-xs text-gray-400 mb-1">Semanas con contenido</p>
          <p className="text-xl font-semibold text-gray-900">
            {semanas.length} de {totalSemanas}
          </p>
        </div>
        <div className="p-4">
          <p className="text-xs text-gray-400 mb-1">Mejor quiz</p>
          <p className="text-xl font-semibold text-gray-900">
            {Object.keys(quizScores).length > 0
              ? `${Math.max(...Object.values(quizScores).map((s) => s.score))} aciertos`
              : "Sin intentos"}
          </p>
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg bg-white p-5">
        <p className="text-sm font-medium text-gray-900 mb-4">
          Progreso por semana
        </p>
        {semanas.map((s) => {
          const score = quizScores[s.id];
          const pct = score ? Math.round((score.score / score.total) * 100) : 0;
          return (
            <button
              key={s.id}
              onClick={() => onNavigate(s.id)}
              className="w-full flex items-center gap-3 mb-3 last:mb-0 text-left"
            >
              <span className="text-xs text-gray-400 w-20 flex-shrink-0">
                {s.titulo.length > 22 ? s.id : s.titulo}
              </span>
              <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-progressGreen"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-xs text-gray-400 w-10 text-right">
                {pct}%
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
