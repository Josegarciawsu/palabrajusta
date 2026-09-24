// Nivel 1: sugerencias por comparación con el glosario.
// La app solo sugiere; la decisión final siempre es del usuario.

export function normalizar(s) {
  return (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9ñ\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const digitos = (s) => (s || "").replace(/\D/g, "");

export function estaEnLista(dije, lista) {
  const n = normalizar(dije);
  return lista.some((e) => normalizar(e) === n);
}

export function sugerir(unidad, dije, extras = []) {
  if (!dije || !dije.trim()) return null;
  const lista = [...unidad.equiv, ...extras];
  const n = normalizar(dije);
  const normLista = lista.map(normalizar).filter(Boolean);

  // Para números, fechas y direcciones, los dígitos deben coincidir exactamente.
  if (unidad.cat === "num" && digitos(dije)) {
    const conDigitos = lista.filter((e) => digitos(e));
    if (conDigitos.length && !conDigitos.some((e) => digitos(e) === digitos(dije))) {
      return {
        veredicto: "incorrecto",
        razon: "Los números no coinciden con el original.",
      };
    }
  }

  if (normLista.includes(n)) {
    return { veredicto: "correcto", razon: "Coincide con una equivalencia del glosario." };
  }
  if (normLista.some((e) => e.length > 2 && ` ${n} `.includes(` ${e} `))) {
    return {
      veredicto: "correcto",
      razon: "Contiene una equivalencia del glosario. Revisa que no hayas añadido algo.",
    };
  }
  return {
    veredicto: null,
    razon: "No está en el glosario. Búscalo en un diccionario y decide.",
  };
}
