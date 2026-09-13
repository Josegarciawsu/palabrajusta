// src/components/RelacionarView.jsx
import { useState, useMemo, useCallback } from "react";
import { Check, X, RefreshCw } from "lucide-react";
import { glosarioCompleto, semanas } from "../data/index.js";

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickRound(semanaFiltro) {
  const base =
    semanaFiltro === "todas"
      ? glosarioCompleto
      : glosarioCompleto.filter((t) => t.semanaId === semanaFiltro);
  const chosen = shuffle(base).slice(0, Math.min(5, base.length));
  return {
    pairs: chosen,
    left: shuffle(chosen.map((t) => ({ key: t.en, label: t.en }))),
    right: shuffle(chosen.map((t) => ({ key: t.en, label: t.es }))),
  };
}

export default function RelacionarView() {
  const [semanaFiltro, setSemanaFiltro] = useState("todas");
  const [round, setRound] = useState(() => pickRound("todas"));
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [matched, setMatched] = useState([]);
  const [wrong, setWrong] = useState(null);

  const newRound = useCallback(
    (semana) => {
      setRound(pickRound(semana));
      setSelectedLeft(null);
      setMatched([]);
      setWrong(null);
    },
    []
  );

  const handleLeft = (key) => {
    setSelectedLeft(key);
    setWrong(null);
  };

  const handleRight = (key) => {
    if (!selectedLeft) return;
    if (selectedLeft === key) {
      setMatched((m) => [...m, key]);
      setSelectedLeft(null);
    } else {
      setWrong(key);
      setTimeout(() => setWrong(null), 600);
    }
  };

  const allMatched = matched.length === round.pairs.length && round.pairs.length > 0;

  return (
    <div>
      <h1 className="text-[26px] font-serif mb-5 text-gray-900">Relacionar</h1>

      <div className="flex items-center gap-3 mb-6">
        <select
          value={semanaFiltro}
          onChange={(e) => {
            setSemanaFiltro(e.target.value);
            newRound(e.target.value);
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
          onClick={() => newRound(semanaFiltro)}
          className="flex items-center gap-1.5 text-sm text-gray-500 px-3 py-2"
        >
          <RefreshCw size={14} /> nueva ronda
        </button>
      </div>

      {allMatched && (
        <div className="mb-5 flex items-center gap-2 text-progressGreen bg-green-50 border border-green-100 rounded-lg px-4 py-3 text-sm">
          <Check size={16} /> ¡Completado! 5 de 5 emparejados correctamente.
        </div>
      )}

      <div className="grid grid-cols-2 gap-6 max-w-lg">
        <div className="space-y-2">
          {round.left.map((item) => {
            const isMatched = matched.includes(item.key);
            const isSelected = selectedLeft === item.key;
            return (
              <button
                key={item.key}
                disabled={isMatched}
                onClick={() => handleLeft(item.key)}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm border transition-colors ${
                  isMatched
                    ? "bg-green-50 border-progressGreen text-progressGreen"
                    : isSelected
                    ? "bg-blue-50 border-accent text-accent"
                    : "bg-white border-gray-200 text-gray-700"
                }`}
              >
                {isMatched && <Check size={13} className="inline mr-1.5" />}
                {item.label}
              </button>
            );
          })}
        </div>
        <div className="space-y-2">
          {round.right.map((item) => {
            const isMatched = matched.includes(item.key);
            const isWrong = wrong === item.key;
            return (
              <button
                key={item.key + item.label}
                disabled={isMatched}
                onClick={() => handleRight(item.key)}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm border transition-colors ${
                  isMatched
                    ? "bg-green-50 border-progressGreen text-progressGreen"
                    : isWrong
                    ? "bg-red-50 border-errorCoral text-errorCoral"
                    : "bg-white border-gray-200 text-gray-700"
                }`}
              >
                {isMatched && <Check size={13} className="inline mr-1.5" />}
                {isWrong && <X size={13} className="inline mr-1.5" />}
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
