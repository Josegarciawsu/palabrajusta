// EJERCICIO DE EJEMPLO — reemplázalo con el guion de práctica real.
//
// Cómo marcar una unidad de puntuación (las palabras en negrita del guion):
//   [[texto original|categoría|equivalencia 1; equivalencia 2; ...]]
//
// Categorías: mod, idiom, gv, leg, fc, gram, num, reg, pos, slang
//   (ver src/lib/consecutiva/categorias.js)
//
// idioma: idioma en que habla la persona ("en" o "es").
// La interpretación va al otro idioma, así que las equivalencias
// de un turno en inglés van en español y viceversa.
//
// audio (opcional): ruta a un archivo en /public, por ejemplo
//   "/audio/consecutiva/ej01-t01.mp3". Si no hay audio, la app
//   lee el texto con la voz del navegador.

export default {
  id: "consecutiva-ejemplo-01",
  titulo: "Ejemplo: testimonio sobre una discusión doméstica",
  descripcion: "Guion de muestra para probar el flujo. Sustitúyelo por el guion oficial de práctica.",
  turnos: [
    {
      hablante: "P",
      idioma: "en",
      texto:
        "Please tell us if you were living with him back on [[May 19, 2014|num|19 de mayo de 2014; 19 de mayo del 2014]], if you [[recall|gv|recuerda; se acuerda]].",
    },
    {
      hablante: "R",
      idioma: "en",
      texto:
        "Yes, we had a [[lease|leg|contrato de arrendamiento; contrato de alquiler; contrato de renta]] on a house in [[Glenwood Park|num|Glenwood Park]] on [[4372 Lynwood Avenue|num|4372 Avenida Lynwood; 4372 Lynwood Avenue; avenida Lynwood 4372]].",
    },
    {
      hablante: "P",
      idioma: "en",
      texto:
        "And [[at some point|pos|en algún momento]] that night, did the two of you [[get into an argument|idiom|tener una discusión; discutir; pelearse]]?",
    },
    {
      hablante: "R",
      idioma: "es",
      texto:
        "[[Pues sí|reg|Well, yes; Yeah, well]], él llegó [[bien tomado|slang|pretty drunk; really drunk; wasted]] y [[se puso a gritar|gram|started yelling; started screaming]].",
    },
    {
      hablante: "P",
      idioma: "en",
      texto:
        "Did he [[actually|mod|realmente; de verdad; de hecho]] threaten you, or did you just feel [[intimidated|gv|intimidada; amedrentada]]?",
    },
    {
      hablante: "R",
      idioma: "es",
      texto:
        "Me dijo que [[me iba a arrepentir|gram|I was going to regret it; I would regret it]]. Yo estaba muy [[molesta|fc|upset; annoyed]] y [[al día siguiente|num|the next day; the following day]] [[presenté una denuncia|leg|filed a police report; reported it to the police; filed a complaint]].",
    },
  ],
};
