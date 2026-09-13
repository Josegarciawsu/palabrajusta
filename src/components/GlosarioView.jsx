import { useState, useMemo, useRef } from "react";
import { Search, X, Languages } from "lucide-react";
import { glosarioCompleto, semanas } from "../data/index.js";

const normalizeText = (value = "") => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

function normalizeLetter(value) {
  const letter = normalizeText(value).charAt(0).toUpperCase();
  return /[A-Z]/.test(letter) ? letter : "#";
}

function matchScore(value, query) {
  const text = normalizeText(value);
  if (!query || !text.includes(query)) return 99;
  if (text === query) return 0;
  if (text.startsWith(query)) return 1;
  if (text.split(/\s+/).some((word) => word.startsWith(query))) return 2;
  return 3;
}

export default function GlosarioView() {
  const [q, setQ] = useState("");
  const [semanaFiltro, setSemanaFiltro] = useState("todas");
  const [focused, setFocused] = useState(false);
  const sectionRefs = useRef({});
  const query = normalizeText(q);

  const resultados = useMemo(() => glosarioCompleto
    .map((term) => {
      const esScore = matchScore(term.es, query);
      const enScore = matchScore(term.en, query);
      const definitionMatch = normalizeText(term.definicion).includes(query);
      return { ...term, esScore, enScore, score: Math.min(esScore, enScore, definitionMatch ? 4 : 99), matchLanguage: esScore <= enScore ? "es" : "en" };
    })
    .filter((term) => (!query || term.score < 99) && (semanaFiltro === "todas" || term.semanaId === semanaFiltro))
    .sort((a, b) => a.score - b.score || a.es.localeCompare(b.es, "es")), [query, semanaFiltro]);

  const agrupados = useMemo(() => {
    const groups = {};
    [...resultados].sort((a, b) => a.es.localeCompare(b.es, "es")).forEach((term) => {
      const letter = normalizeLetter(term.es);
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push(term);
    });
    return groups;
  }, [resultados]);

  const letras = Object.keys(agrupados).sort();
  const alfabeto = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split("");
  const sugerencias = query ? resultados.slice(0, 8) : [];
  const jumpTo = (letter) => sectionRefs.current[letter]?.scrollIntoView({ behavior: "smooth", block: "start" });
  const chooseSuggestion = (term) => {
    setQ(term.matchLanguage === "es" ? term.es : term.en);
    setFocused(false);
  };

  return (
    <div className="view-enter glossary-view">
      <div className="flex items-end justify-between gap-4 mb-5">
        <div>
          <p className="text-[10px] font-semibold tracking-[0.16em] text-blue-600 uppercase mb-2">Español · English</p>
          <h1 className="text-[30px] sm:text-[36px] leading-none font-serif font-semibold text-slate-900 tracking-[-0.035em]">Glosario inteligente</h1>
        </div>
        <p className="text-xs text-slate-400 whitespace-nowrap">{resultados.length} de {glosarioCompleto.length}</p>
      </div>

      <div className="glossary-tools sticky top-[60px] md:top-0 z-20 -mx-3 px-3 md:mx-0 md:px-0 pt-2 pb-3 mb-3">
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 z-10" />
            <input
              value={q}
              onFocus={() => setFocused(true)}
              onBlur={() => window.setTimeout(() => setFocused(false), 120)}
              onChange={(event) => setQ(event.target.value)}
              placeholder="Busca en español o inglés"
              autoComplete="off"
              className="glossary-search w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 bg-white text-[15px] outline-none"
            />
            {q && <button type="button" onClick={() => setQ("")} aria-label="Limpiar búsqueda" className="absolute right-2 top-1/2 -translate-y-1/2 grid place-items-center w-9 h-9 text-slate-400 hover:text-slate-700"><X size={17} /></button>}

            {focused && sugerencias.length > 0 && (
              <div className="suggestions-panel absolute left-0 right-0 top-[calc(100%+6px)] overflow-hidden bg-white border border-slate-200 rounded-2xl shadow-2xl">
                {sugerencias.map((term, index) => (
                  <button type="button" key={`${term.en}-${index}`} onMouseDown={(event) => event.preventDefault()} onClick={() => chooseSuggestion(term)} className="w-full px-4 py-3 text-left border-b border-slate-100 last:border-0 hover:bg-slate-50">
                    <span className="term-es">{term.es}</span><span className="term-divider"> / </span><span className="term-en">{term.en}</span>
                    <span className={`match-chip ${term.matchLanguage === "es" ? "match-es" : "match-en"}`}>{term.matchLanguage === "es" ? "ES" : "EN"}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <select value={semanaFiltro} onChange={(event) => setSemanaFiltro(event.target.value)} className="px-3.5 py-3 rounded-xl border border-slate-200 text-sm outline-none bg-white text-slate-600">
            <option value="todas">Todas las semanas</option>
            {semanas.map((week) => <option key={week.id} value={week.id}>{week.id}</option>)}
          </select>
        </div>

        <div className="alphabet-bar mt-2 flex flex-nowrap gap-1 overflow-x-auto">
          {alfabeto.map((letter) => {
            const available = letras.includes(letter);
            return <button key={letter} disabled={!available} onClick={() => jumpTo(letter)} className={`w-8 h-8 text-[11px] rounded-lg flex items-center justify-center flex-shrink-0 ${available ? "text-blue-700 bg-white hover:bg-blue-50 font-semibold border border-slate-200" : "text-slate-300 cursor-default"}`}>{letter}</button>;
          })}
        </div>
      </div>

      <div className="space-y-4">
        {letras.map((letter) => (
          <section key={letter} ref={(element) => (sectionRefs.current[letter] = element)} className="glossary-letter-section scroll-mt-[190px] md:scroll-mt-[130px]">
            <div className="letter-heading"><span>{letter}</span><span>{agrupados[letter].length} términos</span></div>
            <div className="glossary-card divide-y divide-slate-100">
              {agrupados[letter].map((term, index) => (
                <article key={`${term.en}-${index}`} className="glossary-term">
                  <div className="flex items-start gap-2">
                    <Languages size={15} className="text-blue-400 mt-1 flex-shrink-0" />
                    <h2 className="leading-snug"><span className="term-es">{term.es}</span><span className="term-divider"> / </span><span className="term-en">{term.en}</span></h2>
                  </div>
                  <p className="term-definition">{term.definicion}</p>
                  <p className="term-source">{term.semanaId} · {term.seccionTitulo}</p>
                </article>
              ))}
            </div>
          </section>
        ))}

        {resultados.length === 0 && <div className="glossary-empty"><Search size={20} /><p>No encontramos coincidencias para “{q}”.</p><button onClick={() => setQ("")} className="text-sm font-medium text-blue-600">Limpiar búsqueda</button></div>}
      </div>
    </div>
  );
}
