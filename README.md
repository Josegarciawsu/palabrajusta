# Palabra Justa

Herramienta de estudio para la certificación de intérprete judicial
inglés-español (Utah). React + Vite + Tailwind, sin backend — todo el
contenido vive en archivos de datos dentro del proyecto.

## Desarrollo local

```bash
npm install
npm run dev
```

Abre la URL que muestre la terminal (usualmente `http://localhost:5173`).

## Cómo agregar contenido (directo en GitHub, sin tocar código)

La estructura está pensada para que puedas editar el contenido **desde el
navegador de GitHub**, usando el botón de lápiz ("Edit this file") en
cualquiera de estos archivos — no necesitas abrir una terminal ni instalar
nada para agregar una palabra o una pregunta.

```
content/
  glosario/
    semana1.json   ← vocabulario de la Semana 1
    semana2.json
    semana3.json
  preguntas/
    semana1.json   ← autoevaluación rápida de la Semana 1
    semana2.json
    semana3.json
```

### Agregar una palabra al glosario

Abre `content/glosario/semanaN.json` en GitHub, dale al lápiz de editar, y
agrega un objeto al arreglo (cuida la coma entre elementos):

```json
{ "seccion": "id-de-la-seccion", "en": "Término en inglés", "es": "Equivalente en español", "definicion": "Definición breve." }
```

`seccion` debe coincidir con el `id` de alguna sección definida en
`src/data/semanaN.js` (por ejemplo `"search-warrants"`), para que el término
aparezca agrupado correctamente dentro de esa semana. Si no coincide con
ninguna, simplemente no aparecerá agrupado en la vista de la semana — pero
sí seguirá apareciendo en el Glosario general.

### Agregar una pregunta de autoevaluación

Abre `content/preguntas/semanaN.json` y agrega uno de estos dos formatos:

```json
{ "tipo": "completar", "pregunta": "Texto con un ______ para completar.", "respuesta": "palabra esperada" }
```
```json
{ "tipo": "reflexion", "pregunta": "Pregunta abierta para reflexionar." }
```

Confirma el cambio ("Commit changes") y listo — Netlify vuelve a publicar el
sitio automáticamente con el contenido nuevo en 1-2 minutos.

### Agregar una semana completamente nueva

Esto sí requiere tres archivos (una sola vez por semana, no cada vez que
agregues una palabra):

1. Crea `src/data/semanaN.js`:
   ```js
   export default {
     id: "semana4",
     titulo: "Título de la semana",
     fuente: "Notas de clase — Clase 4",
     secciones: [
       { id: "tema-ejemplo", titulo: "Nombre del tema", contenido: "Resumen breve." }
     ],
   };
   ```
2. Crea `content/glosario/semana4.json` y `content/preguntas/semana4.json`
   (pueden empezar como `[]`).
3. Abre `src/data/index.js` e impórtalos, agregándolos a los arreglos
   `semanasMeta`, `glosarioJSON` y `preguntasJSON` siguiendo el mismo patrón
   que las semanas anteriores.


## Desplegar (GitHub + Netlify, sin depender de Replit ni de ninguna otra plataforma)

1. **Sube el proyecto a GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Primera versión de Palabra Justa"
   git branch -M main
   git remote add origin https://github.com/TU-USUARIO/palabra-justa.git
   git push -u origin main
   ```

2. **Conecta el repositorio a Netlify:**
   - Entra a [app.netlify.com](https://app.netlify.com) → "Add new site" → "Import an existing project".
   - Elige tu repositorio de GitHub (`palabra-justa`).
   - Netlify detecta automáticamente la configuración desde `netlify.toml`
     (build command: `npm run build`, carpeta publicada: `dist`) — no hace
     falta configurar nada a mano.
   - Haz clic en "Deploy".

3. **Actualizaciones futuras:** cada vez que subas un cambio a la rama `main`
   en GitHub (por ejemplo, agregar `semana4.js`), Netlify vuelve a publicar
   el sitio automáticamente. No necesitas volver a tocar la configuración.

Con esto, ni el código ni el sitio publicado dependen de Replit ni de
ninguna otra herramienta — viven en tu cuenta de GitHub y se sirven desde
Netlify.

## Estructura del proyecto

```
content/
  glosario/       ← vocabulario editable directamente en GitHub
  preguntas/      ← autoevaluación editable directamente en GitHub
src/
  data/           ← estructura narrativa de cada semana (títulos, secciones)
  components/     ← la interfaz (no debería necesitar cambios al agregar contenido)
  hooks/          ← progreso guardado en localStorage (quiz, tarjetas aprendidas, splash)
```

## Nota sobre subir el código a GitHub

Este proyecto no depende de ninguna plataforma para existir — es un
proyecto Vite + React estándar. La forma de subirlo a GitHub es la misma
que para cualquier repositorio: los tres comandos de la sección de arriba
(`git init`, `git add`, `git commit`, `git push`), una sola vez. De ahí en
adelante, todos los cambios de contenido (agregar palabras o preguntas) se
hacen directamente en la interfaz web de GitHub, sin volver a usar la
terminal.
