// src/data/index.js
//
// Cómo agregar contenido a una semana (sin tocar código de interfaz):
//
// - Vocabulario nuevo → edita /content/glosario/semanaN.json directamente en GitHub
//   (botón de lápiz "Edit this file"). Agrega un objeto:
//   { "seccion": "id-de-la-seccion", "en": "...", "es": "...", "definicion": "..." }
//
// - Preguntas de autoevaluación → edita /content/preguntas/semanaN.json de la misma forma:
//   { "tipo": "completar", "pregunta": "Texto con un ______ para llenar.", "respuesta": "..." }
//   o { "tipo": "reflexion", "pregunta": "Pregunta abierta." }
//
// - Una semana completamente nueva (semana4, semana5...) sí requiere tres pasos:
//   1. Crea src/data/semanaN.js con { id, titulo, fuente, secciones: [{id, titulo, contenido}] }
//   2. Crea content/glosario/semanaN.json y content/preguntas/semanaN.json (pueden empezar como [])
//   3. Impórtalos abajo y agrégalos a los arreglos `semanasMeta`, `glosarioJSON`, `preguntasJSON`.

import semana1Meta from "./semana1.js";
import semana2Meta from "./semana2.js";
import semana3Meta from "./semana3.js";

import glosario1 from "../../content/glosario/semana1.json";
import glosario2 from "../../content/glosario/semana2.json";
import glosario3 from "../../content/glosario/semana3.json";

import preguntas1 from "../../content/preguntas/semana1.json";
import preguntas2 from "../../content/preguntas/semana2.json";
import preguntas3 from "../../content/preguntas/semana3.json";

const semanasMeta = [semana1Meta, semana2Meta, semana3Meta];
const glosarioJSON = { semana1: glosario1, semana2: glosario2, semana3: glosario3 };
const preguntasJSON = { semana1: preguntas1, semana2: preguntas2, semana3: preguntas3 };

// Combina la metadata (secciones, títulos) con el contenido editable (glosario, preguntas).
export const semanas = semanasMeta.map((meta) => {
  const terminos = glosarioJSON[meta.id] || [];
  const preguntas = preguntasJSON[meta.id] || [];
  const secciones = meta.secciones.map((s) => ({
    ...s,
    terminos: terminos.filter((t) => t.seccion === s.id),
  }));
  const apendiceTerminos = terminos.filter((t) => t.seccion === "apendice");
  return {
    ...meta,
    secciones,
    apendice:
      meta.apendiceTitulo && apendiceTerminos.length
        ? { titulo: meta.apendiceTitulo, terminos: apendiceTerminos }
        : null,
    preguntas,
    totalTerminos: terminos.length,
  };
});

export const semanasPorId = Object.fromEntries(semanas.map((s) => [s.id, s]));

// Todos los términos de todas las semanas, aplanados, para el Glosario general.
export const glosarioCompleto = semanas.flatMap((semana) =>
  semana.secciones.flatMap((seccion) =>
    (seccion.terminos || []).map((t) => ({
      ...t,
      semanaId: semana.id,
      semanaTitulo: semana.titulo,
      seccionTitulo: seccion.titulo,
    }))
  ).concat(
    (semana.apendice?.terminos || []).map((t) => ({
      ...t,
      semanaId: semana.id,
      semanaTitulo: semana.titulo,
      seccionTitulo: semana.apendice.titulo,
    }))
  )
);

export const totalSemanas = 8;
