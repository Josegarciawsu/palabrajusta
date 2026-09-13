// src/components/GlosarioView.jsx
import { useState, useMemo, useRef } from "react";
import { Search } from "lucide-react";
import { glosarioCompleto, semanas } from "../data/index.js";

function normalizeLetter(str) {
  const l = str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .charAt(0)
    .toUpperCase();
  return /[A-Z]/.test(l) ? l : "#";
}

export default function GlosarioView() {
  const [q, setQ] = useState("");
  const [semanaFiltro, setSemanaFiltro] = useState("todas");
  const sectionRefs = useRef({});

  const filtrados = useMemo(() => {
    return glosarioCompleto.filter((t) => {
      const matchesQuery =
        t.en.toLowerCase().includes(q.toLowerCase()) ||
        t.es.toLowerCase().includes(q.toLowerCase());
      const matchesSemana = semanaFiltro === "todas" || t.semanaId === semanaFiltro;
      return matchesQuery && matchesSemana;
    });
  }, [q, semanaFiltro]);

  const agrupados = useMemo(() => {
    const groups = {};
    [...filtrados]
      .sort((a, b) => a.es.localeCompare(b.es, "es"))
      .forEach((t) => {
        const letra = normalizeLetter(t.es);
        if (!groups[letra]) groups[letra] = [];
        groups[letra].push(t);
      });
    return groups;
  }, [filtrados]);

  const letras = Object.keys(agrupados).sort();
  const alfabeto = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split("");

  const jumpTo = (letra) => {
    sectionRefs.current[letra]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div>
      <div className="flex items-baseline justify-between mb-5">
        <h1 className="text-[26px] font-serif text-gray-900">Glosario</h1>
        <p className="text-sm text-gray-400">{filtrados.length} de {glosarioCompleto.length}</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1 max-w-md">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar en español o inglés..."
            className="w-full pl-9 pr-3 py-2 rounded-md border border-gray-200 text-sm outline-none focus:border-accent"
          />
        </div>
        <select
          value={semanaFiltro}
          onChange={(e) => setSemanaFiltro(e.target.value)}
          className="px-3 py-2 rounded-md border border-gray-200 text-sm outline-none bg-white"
        >
          <option value="todas">Todas las semanas</option>
          {semanas.map((s) => (
            <option key={s.id} value={s.id}>{s.id}</option>
          ))}
        </select>
      </div>

      {/* Índice A-Z */}
      <div className="sticky top-0 z-10 bg-content/95 backdrop-blur-sm py-2 mb-2 flex flex-wrap gap-1 border-b border-gray-200">
        {alfabeto.map((letra) => {
          const disponible = letras.includes(letra);
          return (
            <button
              key={letra}
              disabled={!disponible}
              onClick={() => jumpTo(letra)}
              className={`w-6 h-6 text-[11px] rounded flex items-center justify-center ${
                disponible
                  ? "text-accent hover:bg-badgeBg font-medium"
                  : "text-gray-300 cursor-default"
              }`}
            >
              {letra}
            </button>
          );
        })}
      </div>

      <div className="border border-gray-200 rounded-lg bg-white overflow-hidden">
        <div className="hidden sm:grid grid-cols-[1fr_1fr_2fr_auto] gap-4 px-4 py-2 border-b border-gray-200 bg-gray-50 text-[11px] font-medium text-gray-500 tracking-wide">
          <span>Español</span>
          <span>Inglés</span>
          <span>Definición</span>
          <span>Semana</span>
        </div>
        {letras.map((letra) => (
          <div key={letra} ref={(el) => (sectionRefs.current[letra] = el)}>
            <div className="px-4 py-1.5 bg-badgeBg text-accent text-[12px] font-semibold">
              {letra}
            </div>
            <div className="divide-y divide-gray-100">
              {agrupados[letra].map((t, i) => (
                <div
                  key={`${t.en}-${i}`}
                  className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_2fr_auto] gap-x-4 gap-y-0.5 px-4 py-2.5 hover:bg-gray-50"
                >
                  <span className="text-[13.5px] font-medium text-gray-900">{t.es}</span>
                  <span className="text-[13px] text-gray-500 italic">{t.en}</span>
                  <span className="text-[13px] text-gray-500 leading-snug">{t.definicion}</span>
                  <span className="text-[11px] text-gray-400 sm:text-right">{t.semanaId}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
        {filtrados.length === 0 && (
          <p className="px-4 py-6 text-sm text-gray-400 text-center">
            Sin resultados para "{q}"
          </p>
        )}
      </div>
    </div>
  );
}
