// src/components/QuizView.jsx
import { useState, useMemo } from "react";
import { Check, X, RotateCcw } from "lucide-react";
import { glosarioCompleto, semanas } from "../data/index.js";

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildQuiz(pool, count = 8) {
  const chosen = shuffle(pool).slice(0, Math.min(count, pool.length));
  return chosen.map((t) => {
    const distractors = shuffle(
      pool.filter((p) => p.en !== t.en)
    ).slice(0, 2);
    const options = shuffle([t.es, ...distractors.map((d) => d.es)]);
    return { pregunta: t.en, correcta: t.es, options, definicion: t.definicion };
  });
}

export default function QuizView({ recordQuizScore }) {
  const [semanaFiltro, setSemanaFiltro] = useState("todas");
  const pool = useMemo(
    () =>
      semanaFiltro === "todas"
        ? glosarioCompleto
        : glosarioCompleto.filter((t) => t.semanaId === semanaFiltro),
    [semanaFiltro]
  );
  const [quiz, setQuiz] = useState(() => buildQuiz(pool));
  const [i, setI] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const restart = (semana = semanaFiltro) => {
    const newPool =
      semana === "todas"
        ? glosarioCompleto
        : glosarioCompleto.filter((t) => t.semanaId === semana);
    setQuiz(buildQuiz(newPool));
    setI(0);
    setSelected(null);
    setScore(0);
    setDone(false);
  };

  if (quiz.length === 0) {
    return <p className="text-gray-500">No hay suficientes términos para armar un quiz aquí.</p>;
  }

  const q = quiz[i];

  const choose = (opt) => {
    if (selected) return;
    setSelected(opt);
    const correct = opt === q.correcta;
    const newScore = correct ? score + 1 : score;
    if (correct) setScore(newScore);
    setTimeout(() => {
      if (i + 1 < quiz.length) {
        setI(i + 1);
        setSelected(null);
      } else {
        setDone(true);
        if (recordQuizScore) {
          recordQuizScore(semanaFiltro === "todas" ? "general" : semanaFiltro, newScore, quiz.length);
        }
      }
    }, 700);
  };

  return (
    <div>
      <h1 className="text-[26px] font-serif mb-5 text-gray-900">Quiz</h1>

      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-5">
        <select
          value={semanaFiltro}
          onChange={(e) => {
            setSemanaFiltro(e.target.value);
            restart(e.target.value);
          }}
          className="px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none bg-white"
        >
          <option value="todas">Todas las semanas</option>
          {semanas.map((s) => (
            <option key={s.id} value={s.id}>
              {s.id}
            </option>
          ))}
        </select>
      </div>

      {!done ? (
        <div className="max-w-md">
          <p className="text-xs text-gray-400 mb-2">
            Pregunta {i + 1} de {quiz.length}
          </p>
          <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 mb-4">
            <p className="text-xs text-gray-400 mb-1">¿Cuál es el equivalente en español de:</p>
            <p className="text-xl font-serif text-gray-900">{q.pregunta}</p>
          </div>
          <div className="space-y-2">
            {q.options.map((opt) => {
              const isSelected = selected === opt;
              const isCorrect = opt === q.correcta;
              let style = "bg-white border-gray-200 text-gray-700";
              if (selected) {
                if (isCorrect) style = "bg-green-50 border-progressGreen text-progressGreen";
                else if (isSelected) style = "bg-red-50 border-errorCoral text-errorCoral";
              }
              return (
                <button
                  key={opt}
                  onClick={() => choose(opt)}
                  disabled={!!selected}
                  className={`w-full min-h-14 text-left px-4 py-3 rounded-xl text-sm border transition-colors flex items-center gap-2 ${style}`}
                >
                  {selected && isCorrect && <Check size={14} />}
                  {selected && isSelected && !isCorrect && <X size={14} />}
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="max-w-md bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-3xl font-serif text-gray-900 mb-2">
            {score} / {quiz.length}
          </p>
          <p className="text-sm text-gray-500 mb-6">
            {score === quiz.length
              ? "Perfecto — dominas estos términos."
              : "Sigue practicando, cada intento ayuda a fijarlo."}
          </p>
          <button
            onClick={() => restart()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white bg-accent"
          >
            <RotateCcw size={14} /> Intentar de nuevo
          </button>
        </div>
      )}
    </div>
  );
}
