// Voz del navegador: elige la voz más natural disponible y permite cambiarla.
const CLAVE = "pj-consecutiva-voz";

const ROBOTICAS =
  /compact|eloquence|novelty|albert|bad news|bahh|bells|boing|bubbles|cellos|good news|jester|organ|superstar|trinoids|whisper|wobble|zarvox|grandma|grandpa|rocko|shelley|sandy|flo|reed|eddy|fred|junior|ralph|kathy/i;

function puntaje(v, idioma) {
  let p = 0;
  if (/natural/i.test(v.name)) p += 100; // Edge: voces "Natural"
  if (/online/i.test(v.name)) p += 60;
  if (/google/i.test(v.name)) p += 70; // Chrome
  if (/premium|enhanced|neural|mejorad/i.test(v.name)) p += 80; // Mac descargadas
  if (!v.localService) p += 10;
  if (ROBOTICAS.test(v.name)) p -= 200;
  const lang = v.lang.toLowerCase();
  if (idioma === "en" && lang === "en-us") p += 15;
  if (idioma === "es" && (lang === "es-mx" || lang === "es-us")) p += 15;
  if (idioma === "es" && lang === "es-es") p += 5;
  return p;
}

export function cargarVoces() {
  return new Promise((resolve) => {
    const synth = window.speechSynthesis;
    if (!synth) return resolve([]);
    const lista = synth.getVoices();
    if (lista.length) return resolve(lista);
    const listo = () => resolve(synth.getVoices());
    synth.addEventListener("voiceschanged", listo, { once: true });
    setTimeout(listo, 1500);
  });
}

export function vocesPara(voces, idioma) {
  return voces
    .filter((v) => v.lang.toLowerCase().startsWith(idioma))
    .map((v) => ({ voz: v, puntaje: puntaje(v, idioma) }))
    .sort((a, b) => b.puntaje - a.puntaje);
}

export function leerPreferencias() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE)) || { velocidad: 0.95 };
  } catch {
    return { velocidad: 0.95 };
  }
}

export function guardarPreferencias(p) {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(p));
  } catch {
    /* sin almacenamiento */
  }
}

export function vozElegida(voces, idioma, prefs) {
  const lista = vocesPara(voces, idioma);
  const guardada = lista.find((x) => x.voz.name === prefs[idioma]);
  return (guardada || lista[0] || {}).voz || null;
}

// Divide en oraciones: Chrome corta los textos largos a los ~15 segundos.
function oraciones(texto) {
  return (texto.match(/[^.!?¿¡]+[.!?]+["')\]]*|[^.!?]+$/g) || [texto])
    .map((s) => s.trim())
    .filter(Boolean);
}

export function detener() {
  window.speechSynthesis && window.speechSynthesis.cancel();
}

export function hablar(texto, idioma, voz, velocidad = 0.95) {
  return new Promise((resolve) => {
    const synth = window.speechSynthesis;
    if (!synth) return resolve();
    synth.cancel();
    const partes = oraciones(texto);
    let i = 0;
    const siguiente = () => {
      if (i >= partes.length) return resolve();
      const u = new SpeechSynthesisUtterance(partes[i++]);
      u.lang = voz ? voz.lang : idioma === "es" ? "es-MX" : "en-US";
      if (voz) u.voice = voz;
      u.rate = velocidad;
      u.onend = siguiente;
      u.onerror = () => resolve();
      synth.speak(u);
    };
    siguiente();
  });
}
