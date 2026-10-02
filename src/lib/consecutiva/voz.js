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
export function hablar(texto, idioma, voz, velocidad = 0.95, onProgress, options = {}) {
  detener();
  const token = playback;
  return new Promise(resolve => {
    const synth = window.speechSynthesis;
    if (!synth) return resolve({ok:false});
    const parts = options.single ? [{text:texto.trim(),start:texto.search(/\S/)}] : speechParts(texto);
    let i = 0, settled=false, started=false, startTimer, endTimer, poll;
    const finish = (result={ok:true}) => {
      if(settled)return;settled=true;clearTimeout(startTimer);clearTimeout(endTimer);clearInterval(poll);
      if (token === playback) finishPlayback = null;
      resolve(result);
    };
    finishPlayback = () => finish({ok:false,cancelled:true});
    const siguiente = () => {
      if (token !== playback) return finish({ok:false,cancelled:true});
      if (i >= parts.length) return finish();
      const part = parts[i++];
      const u = new SpeechSynthesisUtterance(part.text);
      u.lang = voz ? voz.lang : idioma === "es" ? "es-MX" : "en-US";
      if (voz) u.voice = voz;
      u.rate = velocidad;
      // Sentence fallback for phones that do not emit word boundaries.
      u.onstart = () => {
        if (token !== playback || settled) return;
        started=true;clearTimeout(startTimer);
        onProgress?.({ start: part.start, end: part.start + part.text.length });
      };
      u.onboundary = e => {
        if (token !== playback || settled || e.name !== 'word') return;
        const local = e.charIndex;
        const length = part.text.slice(local).match(/^\S+/)?.[0].length || 1;
        onProgress?.({ start: part.start + local, end: part.start + local + length });
      };
      u.onend = siguiente;
      u.onerror = () => finish({ok:false});
      try { synth.resume?.();synth.speak(u); } catch { finish({ok:false}); }
      if(options.watchdog&&!settled){
        startTimer=setTimeout(()=>{if(!started){finish({ok:false});synth.cancel();}},4000);
        endTimer=setTimeout(()=>{finish({ok:false});synth.cancel();},options.watchdog);
        poll=setInterval(()=>{if(started&&synth.speaking===false&&synth.pending===false)finish({ok:true});},300);
      }
    };
    siguiente();
  });
}
