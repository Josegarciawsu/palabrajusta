// Distractores "trampa" para opción múltiple: términos parecidos en significado
// o en palabras, nunca equivalentes a la respuesta correcta.
const VACIAS = new Set(
  "de del la el los las un una en por con a al o y que se su sus lo le para sin como no es the of to a an in on by for with and or be is his her their its".split(" ")
);

const limpiar = (s) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[«»"'.,;:¿?¡!…()]/g, " ");

// Raíces de 5 letras: "condena" y "condenado" cuentan como la misma palabra.
const raices = (s) =>
  new Set(
    limpiar(s)
      .split(/\s+/)
      .filter((w) => w.length > 2 && !VACIAS.has(w))
      .map((w) => w.slice(0, 5))
  );

const alternativas = (s) =>
  new Set(
    s
      .split(";")
      .map((p) => limpiar(p).replace(/\s+/g, " ").trim())
      .filter(Boolean)
  );

const comparten = (a, b) => {
  let n = 0;
  a.forEach((x) => b.has(x) && n++);
  return n;
};

function mezclar(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Términos que se confunden entre sí en la sala: siempre son buenas trampas.
const GRUPOS = [
  ["overruled", "sustained", "Objection"],
  ["probation", "parole", "on probation", "on parole", "probation sentence"],
  ["acquittal", "conviction", "hung jury; deadlocked jury"],
  ["plead guilty", "plead not guilty", "plea bargaining"],
  ["indictment", "information", "criminal complaint", "arraignment"],
  ["murder", "manslaughter", "premeditated murder", "murder in the first degree"],
  ["robbery", "burglary", "larceny", "larceny by fraud"],
  ["misdemeanor", "felony", "petty misdemeanors", "gross misdemeanors"],
  ["direct examination; examination in-chief", "cross-examination", "re-examination; redirect examination"],
  ["hearsay", "testimony", "expert evidence", "exhibits"],
  ["mitigating circumstances; mitigations", "aggravating circumstances; aggravations", "defenses"],
  ["on bail", "release on own recognizance", "pre-trial release", "remanded in custody"],
  ["complainant", "defendant", "suspect", "victim"],
  ["prosecutor; prosecuting attorney", "district attorney", "counsel for the defense", "magistrate"],
  ["knowingly", "recklessly", "negligently", "purposely; intentionally"],
  ["opening statement", "closing statement", "charge to the jury"],
  ["peremptory challenge", "challenge for cause", "voir dire"],
  ["preliminary hearing; preliminary examination", "preliminary appearance", "arraignment"],
  ["warrant of arrest", "search warrants", "subpoena", "restraining order"],
  ["libel and slander", "perjury", "false testimony"],
  ["duress", "necessity", "self-defense", "insanity", "entrapment"],
];
const grupoDe = new Map();
GRUPOS.forEach((g, i) => g.forEach((en) => grupoDe.set(en, i)));

// Para las opciones se muestra una sola equivalencia, así el largo no delata la correcta.
export const principal = (s) => s.split(";")[0].trim();

const cache = new Map();
function perfil(t) {
  if (!cache.has(t)) cache.set(t, { es: raices(t.es), en: raices(t.en), altEs: alternativas(t.es), altEn: alternativas(t.en) });
  return cache.get(t);
}

// dir "en": la pregunta está en inglés y las opciones en español; "es": al revés.
export function trampas(t, lista, dir, n = 3) {
  const p = perfil(t);
  const respuesta = principal(dir === "en" ? t.es : t.en);
  const resp = limpiar(respuesta).replace(/\s+/g, " ").trim();
  const g = grupoDe.get(t.en);
  const candidatos = [];
  for (const x of lista) {
    if (x === t) continue;
    const q = perfil(x);
    // Fuera cualquier opción que también sería correcta.
    if (comparten(p.altEs, q.altEs) || comparten(p.altEn, q.altEn)) continue;
    const r = principal(dir === "en" ? x.es : x.en);
    const rl = limpiar(r).replace(/\s+/g, " ").trim();
    if (rl === resp) continue;
    // Si una opción contiene a la otra, la correcta se adivina por descarte.
    const contiene = rl.includes(resp) || resp.includes(rl);
    const puntos =
      (g !== undefined && grupoDe.get(x.en) === g ? 6 : 0) +
      3 * comparten(p.es, q.es) +
      2 * comparten(p.en, q.en) -
      (contiene ? 5 : 0) -
      Math.abs(r.length - respuesta.length) / 25;
    candidatos.push({ x, puntos });
  }
  candidatos.sort((a, b) => b.puntos - a.puntos);
  // Nunca dos opciones con el mismo texto visible.
  const vistos = new Set([resp]);
  const texto = (x) => limpiar(principal(dir === "en" ? x.es : x.en)).replace(/\s+/g, " ").trim();
  const unico = (x) => {
    const t = texto(x);
    if (vistos.has(t)) return false;
    vistos.add(t);
    return true;
  };
  const fuertes = candidatos.filter((c) => c.puntos > 0.5).slice(0, 10);
  const elegidos = [];
  for (const c of mezclar(fuertes)) {
    if (elegidos.length === n) break;
    if (unico(c.x)) elegidos.push(c.x);
  }
  if (elegidos.length < n) {
    // Relleno: opciones de largo parecido para no delatar la correcta.
    const resto = candidatos.filter((c) => !elegidos.includes(c.x));
    const largo = (c) => Math.abs(principal(dir === "en" ? c.x.es : c.x.en).length - respuesta.length);
    resto.sort((a, b) => largo(a) - largo(b));
    for (const c of mezclar(resto.slice(0, 30))) {
      if (elegidos.length === n) break;
      if (unico(c.x)) elegidos.push(c.x);
    }
  }
  return elegidos;
}
