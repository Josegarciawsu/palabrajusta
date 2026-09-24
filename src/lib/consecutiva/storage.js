// Intentos, equivalencias agregadas por el usuario y errores para repasar.
const K = {
  intentos: "pj-consecutiva-intentos",
  extras: "pj-consecutiva-equivalencias",
  errores: "pj-consecutiva-errores",
};

function leer(k, def) {
  try {
    const v = localStorage.getItem(k);
    return v ? JSON.parse(v) : def;
  } catch {
    return def;
  }
}
function escribir(k, v) {
  try {
    localStorage.setItem(k, JSON.stringify(v));
  } catch {
    /* almacenamiento lleno o bloqueado */
  }
}

export const leerIntentos = () => leer(K.intentos, []);

export function guardarIntento(intento) {
  const lista = leerIntentos().filter((i) => i.id !== intento.id);
  escribir(K.intentos, [intento, ...lista]);
}

export function borrarIntento(id) {
  escribir(K.intentos, leerIntentos().filter((i) => i.id !== id));
}

export function nuevoIntento(ejercicioId) {
  return {
    id: `${ejercicioId}-${Date.now()}`,
    ejercicioId,
    fecha: new Date().toISOString(),
    fase: "practica", // practica | evaluacion | terminado
    repeticiones: {},
    notas: {},
    grabados: {},
    evaluacion: {}, // unidadId -> { dije, veredicto }
    estilo: {},
  };
}

// Equivalencias aceptables agregadas por el usuario: { "ejercicioId:unidadId": [..] }
export const leerExtras = () => leer(K.extras, {});
export function agregarExtra(clave, valor) {
  const todo = leerExtras();
  const lista = todo[clave] || [];
  if (!lista.includes(valor)) todo[clave] = [...lista, valor];
  escribir(K.extras, todo);
  return todo;
}

// Errores para repasar (se pueden mostrar en Términos difíciles o Flashcards).
export const leerErrores = () => leer(K.errores, []);
export function agregarErrores(nuevos) {
  const actuales = leerErrores();
  const claves = new Set(actuales.map((e) => e.clave));
  const suma = [...actuales, ...nuevos.filter((e) => !claves.has(e.clave))];
  escribir(K.errores, suma);
  return suma.length - actuales.length;
}

export function calcularPuntaje(ejercicio, intento) {
  const total = ejercicio.unidades.length;
  let correctas = 0;
  let evaluadas = 0;
  const porCategoria = {};
  for (const u of ejercicio.unidades) {
    const e = intento.evaluacion[u.id];
    const c = (porCategoria[u.cat] ||= { total: 0, correctas: 0 });
    c.total += 1;
    if (e && e.veredicto) {
      evaluadas += 1;
      if (e.veredicto === "correcto") {
        correctas += 1;
        c.correctas += 1;
      }
    }
  }
  return {
    total,
    correctas,
    evaluadas,
    errores: total - correctas,
    pct: total ? Math.round((correctas / total) * 1000) / 10 : 0,
    porCategoria,
  };
}
