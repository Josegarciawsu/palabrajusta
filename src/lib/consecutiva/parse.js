// Convierte el texto marcado con [[texto|cat|equiv1; equiv2]] en segmentos.
const RE = /\[\[([^\]|]+)\|([^\]|]+)(?:\|([^\]]*))?\]\]/g;

export function parseTurno(texto, turnoIdx) {
  const segmentos = [];
  let ultimo = 0;
  let n = 0;
  let m;
  RE.lastIndex = 0;
  while ((m = RE.exec(texto)) !== null) {
    if (m.index > ultimo) {
      segmentos.push({ tipo: "texto", valor: texto.slice(ultimo, m.index) });
    }
    n += 1;
    segmentos.push({
      tipo: "unidad",
      id: `t${turnoIdx + 1}-u${n}`,
      valor: m[1].trim(),
      cat: m[2].trim(),
      equiv: (m[3] || "")
        .split(";")
        .map((s) => s.trim())
        .filter(Boolean),
      turno: turnoIdx,
    });
    ultimo = m.index + m[0].length;
  }
  if (ultimo < texto.length) {
    segmentos.push({ tipo: "texto", valor: texto.slice(ultimo) });
  }
  return segmentos;
}

export function textoPlano(texto) {
  return texto.replace(RE, (_, t) => t);
}

// Prepara un ejercicio completo: segmentos por turno y lista plana de unidades.
export function prepararEjercicio(ej) {
  const turnos = ej.turnos.map((t, i) => ({
    ...t,
    segmentos: parseTurno(t.texto, i),
    plano: textoPlano(t.texto),
  }));
  const unidades = turnos.flatMap((t) =>
    t.segmentos.filter((s) => s.tipo === "unidad")
  );
  return { ...ej, turnos, unidades };
}
