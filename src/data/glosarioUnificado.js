// Glosario unificado: una ficha por término.
// - Traducción: la del libro siempre manda. Si el término no está en el libro,
//   se usa la traducción propia (traduccionesPropias.js) cuando ya la escribiste.
// - Definiciones: una por fuente (U.S. Courts, Corte Juvenil), en inglés.
import LIBRO from "./glosarioLibro.js";
import COURTS from "./glosarioCourts.js";
import JUVENIL from "./glosarioJuvenil.js";
import NOTAS from "./notasJuvenil.js";
import PROPIAS from "./traduccionesPropias.js";

export const clave = (s) =>
  s
    .toLowerCase()
    .replace(/\([^)]*\)/g, " ")
    .replace(/^\s*(the|a|an|to)\s+/, "")
    .replace(/\s+/g, " ")
    .trim();

const fichas = [];
const porClave = new Map();

function registrar(ficha, textoEn) {
  textoEn.split(";").forEach((p) => {
    const k = clave(p);
    if (k && !porClave.has(k)) porClave.set(k, ficha);
  });
}

LIBRO.forEach((t) => {
  const f = { en: t.en, es: t.es, esFuente: "libro", libro: t, defs: [], fuentes: ["libro"], nota: null };
  fichas.push(f);
  registrar(f, t.en);
});

function agregar(lista, fuente) {
  lista.forEach((t) => {
    const k = clave(t.term);
    let f = porClave.get(k);
    if (!f) {
      f = { en: t.term, es: null, esFuente: null, libro: null, defs: [], fuentes: [], nota: null };
      fichas.push(f);
      porClave.set(k, f);
    }
    f.defs.push({ fuente, texto: t.definition });
    if (!f.fuentes.includes(fuente)) f.fuentes.push(fuente);
  });
}
agregar(COURTS, "courts");
agregar(JUVENIL, "juvenil");

// Notas de la corte juvenil
Object.entries(NOTAS).forEach(([k, nota]) => {
  const f = porClave.get(clave(k));
  if (f) f.nota = nota;
});

// Traducciones propias (solo para términos que el libro no tiene)
PROPIAS.forEach((p) => {
  const f = porClave.get(clave(p.en));
  if (f && !f.es && p.es && p.es.trim()) {
    f.es = p.es.trim();
    f.esFuente = "propia";
  }
});

const orden = (s) => s.toLowerCase().replace(/^["«]/, "").replace(/^(the|a|an|to) /, "");
fichas.sort((a, b) => orden(a.en).localeCompare(orden(b.en)));

export const letraDe = (f) => orden(f.en)[0].toUpperCase();
export default fichas;
