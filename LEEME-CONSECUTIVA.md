# Sección de Consecutiva — Palabra Justa (nivel 1)

## Cómo integrarla
1. Copia las carpetas de `src/` dentro del `src/` de tu proyecto:
   - `src/components/Consecutiva/`
   - `src/content/consecutiva/`
   - `src/lib/consecutiva/`
2. En el archivo donde defines la navegación (por ejemplo `App.jsx`), importa la sección:
   `import ConsecutivaSection from "./components/Consecutiva/ConsecutivaSection.jsx";`
   y agrégala como una sección más del menú (icono sugerido: `Headphones` de lucide-react).
3. No necesita paquetes nuevos: usa React y lucide-react, que ya tienes.
4. Si cambiaste colores o tipografías de la app, ajústalos en `src/lib/consecutiva/tokens.js`.

## Cómo agregar un guion real
Copia `ejercicio-01.js`, cámbiale el `id` y el `titulo`, y marca cada unidad en negrita así:

    [[texto original|categoría|equivalencia 1; equivalencia 2]]

Categorías: mod, idiom, gv, leg, fc, gram, num, reg, pos, slang.
Luego impórtalo en `src/content/consecutiva/index.js`.

Audio: pon los archivos en `public/audio/consecutiva/` y agrega `audio: "/audio/consecutiva/archivo.mp3"`
al turno. Sin audio, la app usa la voz del navegador.

## Dónde se guardan los datos
- Intentos y calificaciones: localStorage, `pj-consecutiva-intentos`
- Equivalencias que agregas tú: localStorage, `pj-consecutiva-equivalencias`
- Errores para repasar: localStorage, `pj-consecutiva-errores`
  (cada uno tiene `original`, `dije`, `equivalencias`, `categoria` — listo para mostrarse en Términos difíciles)
- Grabaciones: IndexedDB, base `palabra-justa-audio`

Todo vive en el navegador: las grabaciones no pasan de un dispositivo a otro.
El micrófono solo funciona en https (Netlify) o en localhost.
