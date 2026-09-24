import { C, F } from "../../lib/consecutiva/tokens.js";
import { categoria } from "../../lib/consecutiva/categorias.js";

export function Boton({ variante = "primario", children, style, ...props }) {
  const base = {
    fontFamily: F.cuerpo,
    fontSize: 15,
    fontWeight: 600,
    borderRadius: 10,
    padding: "10px 16px",
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    cursor: props.disabled ? "not-allowed" : "pointer",
    opacity: props.disabled ? 0.45 : 1,
    border: "1px solid transparent",
    transition: "background .15s",
  };
  const v = {
    primario: { background: C.azul, color: "#fff" },
    secundario: { background: C.superficie, color: C.azul, borderColor: C.azul },
    fantasma: { background: "transparent", color: C.suave, borderColor: C.borde },
    peligro: { background: C.coral, color: "#fff" },
  }[variante];
  return (
    <button {...props} style={{ ...base, ...v, ...style }}>
      {children}
    </button>
  );
}

export function Tarjeta({ children, style }) {
  return (
    <div
      style={{
        background: C.superficie,
        border: `1px solid ${C.borde}`,
        borderRadius: 14,
        padding: 20,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function ChipCategoria({ cat }) {
  return (
    <span
      title={categoria(cat).nombre}
      style={{
        fontSize: 12,
        fontWeight: 600,
        color: C.azul,
        background: C.azulSuave,
        borderRadius: 999,
        padding: "2px 10px",
        whiteSpace: "nowrap",
      }}
    >
      {categoria(cat).corto}
    </span>
  );
}

export function Titulo({ children, nivel = 1 }) {
  const size = nivel === 1 ? 26 : 19;
  return (
    <h2
      style={{
        fontFamily: F.titulo,
        fontSize: size,
        lineHeight: 1.3,
        color: C.tinta,
        margin: 0,
        fontWeight: 700,
      }}
    >
      {children}
    </h2>
  );
}

export const idiomaNombre = (i) => (i === "es" ? "español" : "inglés");
export const destino = (i) => (i === "es" ? "inglés" : "español");
export const hablanteNombre = (h) => (h === "P" ? "Pregunta" : "Respuesta");
