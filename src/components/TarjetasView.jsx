// src/components/TarjetasView.jsx
import { useState, useMemo } from "react";
import { Check, Shuffle } from "lucide-react";
import { glosarioCompleto, semanas } from "../data/index.js";

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function TarjetasView({ learnedTerms, toggleLearned }) {
  const [semanaFiltro, setSemanaFiltro] = useState("todas");
  const [order, setOrder] = useState(() => glosarioCompleto.map((_, i) => i));
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const cards = useMemo(() => {
    const base =
      semanaFiltro === "todas"
        ? glosarioCompleto
        : glosarioCompleto.filter((t) => t.semanaId === semanaFiltro);
    return base;
  }, [semanaFiltro]);

  const safeIndex = Math.min(i, Math.max(cards.length - 1, 0));
  const card = cards[safeIndex];

  const next = () => {
    setFlipped(false);
    setI((prev) => (prev + 1 >= cards.length ? 0 : prev + 1));
  };
  const prev = () => {
    setFlipped(false);
    setI((prevI) => (prevI - 1 < 0 ? cards.length - 1 : prevI - 1));
  };
  const reshuffle = () => {
    setI(0);
    setFlipped(false);
  };

  if (!card) {
    return <p className="text-gray-500">No hay tarjetas para esta selección.</p>;
  }

  const learned = learnedTerms.includes(card.en);

  return (
    <div>
      <h1 className="text-[26px] font-serif mb-5 text-gray-900">Tarjetas</h1>

      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-5">
        <select
          value={semanaFiltro}
          onChange={(e) => {
            setSemanaFiltro(e.target.value);
            setI(0);
            setFlipped(false);
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
        <button
          onClick={reshuffle}
          className="flex items-center gap-1.5 text-sm text-gray-500 px-3 py-2"
        >
          <Shuffle size={14} /> reiniciar
        </button>
      </div>

      <div className="w-full max-w-md">
        <div
          className="flip-card w-full h-56 cursor-pointer"
          onClick={() => setFlipped(!flipped)}
        >
          <div className={`flip-card-inner ${flipped ? "flipped" : ""}`}>
            <div className="flip-card-front rounded-lg border border-gray-200 bg-white flex flex-col items-center justify-center p-6 text-center">
              <p className="text-2xl font-serif text-gray-900">{card.en}</p>
              <span className="mt-4 text-xs text-gray-400">
                toca para voltear
              </span>
            </div>
            <div className="flip-card-back rounded-lg border border-gray-200 bg-white flex flex-col items-center justify-center p-6 text-center">
              <p className="text-xl font-medium mb-2 text-accent">{card.es}</p>
              <p className="text-sm text-gray-500">{card.definicion}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => toggleLearned(card.en)}
            className={`flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg border ${
              learned
                ? "border-progressGreen text-progressGreen bg-green-50"
                : "border-gray-200 text-gray-500"
            }`}
          >
            <Check size={14} /> {learned ? "Aprendido" : "Marcar aprendido"}
          </button>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={prev}
              className="px-3 py-2 rounded-lg text-sm border border-gray-200 text-gray-600"
            >
              Anterior
            </button>
            <button
              onClick={next}
              className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-accent"
            >
              Siguiente
            </button>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-3">
          {safeIndex + 1} / {cards.length} · {learnedTerms.length} términos marcados como aprendidos en total
        </p>
      </div>
    </div>
  );
}
