// src/components/RecursosView.jsx
import { ExternalLink } from "lucide-react";
import { semanas } from "../data/index.js";

// Recursos oficiales citados a lo largo de las semanas disponibles.
const RECURSOS = [
  {
    tag: "Utah Courts",
    titulo: "Utah Courts · Criminal Processes",
    desc: "Descripción oficial de los procedimientos y etapas de un caso penal.",
    url: "https://www.utcourts.gov/en/self-help/legal-help/procedures/court-process/criminal.html",
  },
  {
    tag: "Glosario oficial",
    titulo: "Utah Courts · Glossary of Legal Terms",
    desc: "Términos legales publicados por los tribunales de Utah.",
    url: "https://www.utcourts.gov/en/self-help/case-categories/resources/glossary.html",
  },
  {
    tag: "UCJA Appendix H",
    titulo: "Code of Professional Responsibility for Court Interpreters",
    desc: "Código de responsabilidad profesional para intérpretes judiciales.",
    url: "https://legacy.utcourts.gov/rules/view.php?rule=10H&type=ucja",
  },
  {
    tag: "Reglas",
    titulo: "Utah Rules of Criminal Procedure",
    desc: "Reglas 7, 7A, 7B, 10, 14 y 40, citadas a lo largo del curso.",
    url: "https://legacy.utcourts.gov/rules/urcrp.php",
  },
  {
    tag: "Estatutos",
    titulo: "Utah Code",
    desc: "Código de Utah — estatutos penales y civiles citados en clase.",
    url: "https://le.utah.gov/xcode/",
  },
  {
    tag: "Evidencia",
    titulo: "Utah Rules of Evidence",
    desc: "Reglas de evidencia aplicables en los tribunales de Utah.",
    url: "https://legacy.utcourts.gov/rules/viewall.php?type=URE",
  },
];

export default function RecursosView() {
  return (
    <div className="view-enter">
      <p className="text-[10px] font-semibold tracking-[0.16em] text-blue-600 uppercase mb-3">
        Fuentes de referencia
      </p>
      <h1 className="text-[30px] sm:text-[36px] leading-tight tracking-[-0.035em] font-serif font-semibold mb-4 text-gray-900">
        Recursos del intérprete
      </h1>
      <p className="text-[15px] leading-relaxed text-gray-500 mb-8 max-w-2xl">
        Fuentes oficiales citadas en las semanas {semanas.map((s) => s.id).join(", ")}.
        Úsalas para verificar uso, procedimiento y responsabilidad profesional.
      </p>
      <div className="grid grid-cols-1 min-[540px]:grid-cols-2 gap-3 sm:gap-4">
        {RECURSOS.map((r) => (
          <a
            key={r.titulo}
            href={r.url}
            target="_blank"
            rel="noreferrer"
            className="resource-card bg-white rounded-[18px] border border-gray-200 p-5 hover:border-accent transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-badgeBg text-[#0B4C8C]">
                {r.tag}
              </span>
              <ExternalLink size={15} className="text-accent" />
            </div>
            <p className="font-semibold text-gray-900 mb-2">{r.titulo}</p>
            <p className="text-sm text-gray-500 mb-6">{r.desc}</p>
            <p className="text-xs text-gray-400">
              Fuente externa · {new URL(r.url).hostname}
            </p>
          </a>
        ))}
      </div>
    </div>
  );
}
