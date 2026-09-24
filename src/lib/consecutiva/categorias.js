// Tipos de unidades de puntuación del examen bilingüe (manual del NCSC).
export const CATEGORIAS = {
  mod: { nombre: "Modificadores y énfasis", corto: "Modificador" },
  idiom: { nombre: "Modismos y expresiones", corto: "Modismo" },
  gv: { nombre: "Vocabulario general", corto: "Vocabulario" },
  leg: { nombre: "Vocabulario legal/técnico", corto: "Legal" },
  fc: { nombre: "Falsos cognados", corto: "Falso cognado" },
  gram: { nombre: "Gramática", corto: "Gramática" },
  num: { nombre: "Números, nombres y fechas", corto: "Número/nombre/fecha" },
  reg: { nombre: "Registro y estilo", corto: "Registro" },
  pos: { nombre: "Posición y función especial", corto: "Posición" },
  slang: { nombre: "Jerga y coloquialismos", corto: "Jerga" },
};

export const categoria = (c) =>
  CATEGORIAS[c] || { nombre: `Categoría "${c}"`, corto: c };
