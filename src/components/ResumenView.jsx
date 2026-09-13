// src/components/ResumenView.jsx
import { semanas, glosarioCompleto, totalSemanas } from "../data/index.js";

export default function ResumenView({ quizScores, onNavigate }) {
  const totalTerminos = glosarioCompleto.length;

  return (
    <div className="view-enter">
      <header className="dashboard-hero mb-8">
        <p className="text-[10px] font-semibold tracking-[0.16em] text-blue-600 uppercase mb-3">Palabra Justa</p>
        <h1 className="text-[32px] md:text-[42px] leading-tight font-serif font-semibold text-slate-900 tracking-[-0.04em]">
          Tu preparación,<br /><span className="text-accent">palabra por palabra.</span>
        </h1>
        <p className="text-slate-500 mt-4 max-w-xl leading-relaxed">
          Entrena vocabulario y precisión para la certificación de intérprete judicial inglés–español en Utah.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <div className="metric-card">
          <p className="metric-label">Términos disponibles</p>
          <p className="metric-value">{totalTerminos}</p>
        </div>
        <div className="metric-card">
          <p className="metric-label">Semanas con contenido</p>
          <p className="metric-value">
            {semanas.length} de {totalSemanas}
          </p>
        </div>
        <div className="metric-card">
          <p className="metric-label">Mejor quiz</p>
          <p className="metric-value">
            {Object.keys(quizScores).length > 0
              ? `${Math.max(...Object.values(quizScores).map((s) => s.score))} aciertos`
              : "Sin intentos"}
          </p>
        </div>
      </div>

      <div className="progress-card">
        <p className="text-sm font-semibold text-gray-900 mb-5">
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
