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

// Preserve offsets for karaoke across sentence-sized utterances.
export function speechParts(texto) {
  return Array.from(texto.matchAll(/[^.!?]+[.!?]+["')\]]*|[^.!?]+$/g))
    .map(m => ({ text: m[0].trim(), start: m.index + m[0].search(/\S/) }))
    .filter(p => p.text);
}
let playback = 0;
let finishPlayback = null;
export function detener() {
  playback++;
  window.speechSynthesis && window.speechSynthesis.cancel();
  finishPlayback?.();
  finishPlayback = null;
}
export function hablar(texto, idioma, voz, velocidad = 0.95, onProgress) {
  detener();
  const token = playback;
  return new Promise(resolve => {
    const synth = window.speechSynthesis;
    if (!synth) return resolve();
    const parts = speechParts(texto);
    let i = 0;
    const finish = () => { if (token === playback) finishPlayback = null; resolve(); };
    finishPlayback = finish;
    const siguiente = () => {
      if (token !== playback) return finish();
      if (i >= parts.length) return finish();
      const part = parts[i++];
      const u = new SpeechSynthesisUtterance(part.text);
      u.lang = voz ? voz.lang : idioma === "es" ? "es-MX" : "en-US";
      if (voz) u.voice = voz;
      u.rate = velocidad;
      // Sentence fallback for phones that do not emit word boundaries.
      u.onstart = () => { if (token === playback) onProgress?.({ start: part.start, end: part.start + part.text.length }); };
      u.onboundary = e => {
        if (token !== playback || e.name !== 'word') return;
        const local = e.charIndex;
        const length = part.text.slice(local).match(/^\S+/)?.[0].length || 1;
        onProgress?.({ start: part.start + local, end: part.start + local + length });
      };
      u.onend = siguiente;
      u.onerror = finish;
      synth.speak(u);
    };
    siguiente();
  });
}
