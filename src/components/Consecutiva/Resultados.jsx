import { useState } from "react";
import { ArrowLeft, BookmarkPlus, Check } from "lucide-react";
import { C, F } from "../../lib/consecutiva/tokens.js";
import { categoria } from "../../lib/consecutiva/categorias.js";
import { calcularPuntaje, agregarErrores, leerIntentos } from "../../lib/consecutiva/storage.js";
import { Boton, Tarjeta, Titulo, ChipCategoria } from "./ui.jsx";

const MINIMO = 70; // mínimo del NCSC por sección

const PREGUNTAS_ESTILO = [
  { id: "memoria", texto: "¿Tu memoria a corto plazo fue suficiente para toda la sección?" },
  { id: "notas", texto: "¿Tu toma de notas te sirvió para reconstruir cada turno?" },
  { id: "repeticiones", texto: "¿Pudiste interpretar sin sentir que necesitabas repeticiones?" },
  { id: "sentido", texto: "¿Un oyente monolingüe entendería la historia con tu interpretación?" },
  { id: "fidelidad", texto: "¿Evitaste omitir o añadir cosas que no estaban en el original?" },
];

function Barra({ pct, color }) {
  return (
    <div style={{ position: "relative", height: 10, background: C.fondo, borderRadius: 5 }}>
      <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 5 }} />
      <div
        title="Mínimo: 70 %"
        style={{ position: "absolute", left: `${MINIMO}%`, top: -3, bottom: -3, width: 2, background: C.tinta }}
      />
    </div>
  );
}

export default function Resultados({ ejercicio, intento, onCambio, onSalir }) {
  const [guardados, setGuardados] = useState(null);
  const p = calcularPuntaje(ejercicio, intento);
  const aprobado = p.pct >= MINIMO;
  const reps = Object.values(intento.repeticiones).reduce((s, n) => s + Math.max(0, n - 1), 0);

  const errores = ejercicio.unidades.filter(
    (u) => intento.evaluacion[u.id] && intento.evaluacion[u.id].veredicto !== "correcto"
  );

  const historial = leerIntentos()
    .filter((i) => i.ejercicioId === ejercicio.id && i.fase === "terminado")
    .map((i) => ({ id: i.id, fecha: i.fecha, pct: calcularPuntaje(ejercicio, i).pct }))
    .reverse();

  const categorias = Object.entries(p.porCategoria)
    .map(([cat, c]) => ({ cat, ...c, pct: Math.round((c.correctas / c.total) * 100) }))
    .sort((a, b) => a.pct - b.pct);

  function guardarErrores() {
    const n = agregarErrores(
      errores.map((u) => ({
        clave: `${ejercicio.id}:${u.id}`,
        original: u.valor,
        categoria: u.cat,
        dije: intento.evaluacion[u.id].dije || "",
        equivalencias: u.equiv,
        fuente: ejercicio.titulo,
        fecha: new Date().toISOString(),
      }))
    );
    setGuardados(n);
  }

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <button
        onClick={onSalir}
        style={{ justifySelf: "start", background: "none", border: "none", color: C.suave, display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontFamily: F.cuerpo, fontSize: 14 }}
      >
        <ArrowLeft size={16} /> Volver a los ejercicios
      </button>

      <Tarjeta style={{ display: "grid", gap: 14 }}>
        <p style={{ margin: 0, color: C.suave, fontSize: 14 }}>{ejercicio.titulo}</p>
        <div style={{ display: "flex", alignItems: "baseline", gap: 14, flexWrap: "wrap" }}>
          <span style={{ fontFamily: F.titulo, fontSize: 52, fontWeight: 700, color: aprobado ? C.verde : C.coral, lineHeight: 1 }}>
            {p.pct}%
          </span>
          <span style={{ fontSize: 16, color: C.tinta }}>
            {p.correctas} de {p.total} unidades correctas · {p.errores} errores u omisiones
          </span>
        </div>
        <Barra pct={p.pct} color={aprobado ? C.verde : C.coral} />
        <p style={{ margin: 0, fontSize: 14, color: C.suave }}>
          {aprobado
            ? "Por encima del 70 % que se exige en cada sección del examen."
            : `Te faltan ${Math.ceil((MINIMO / 100) * p.total) - p.correctas} unidades para llegar al 70 % que se exige en cada sección.`}{" "}
          Pediste {reps} {reps === 1 ? "repetición" : "repeticiones"}.
        </p>
      </Tarjeta>

      <Tarjeta style={{ display: "grid", gap: 14 }}>
        <Titulo nivel={2}>Por tipo de unidad</Titulo>
        <p style={{ margin: 0, fontSize: 14, color: C.suave }}>Ordenado de más débil a más fuerte.</p>
        {categorias.map((c) => (
          <div key={c.cat} style={{ display: "grid", gap: 6 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: C.tinta }}>
              <span>{categoria(c.cat).nombre}</span>
              <span>
                {c.correctas}/{c.total}
              </span>
            </div>
            <Barra pct={c.pct} color={c.pct >= MINIMO ? C.verde : C.coral} />
          </div>
        ))}
      </Tarjeta>

      {errores.length > 0 && (
        <Tarjeta style={{ display: "grid", gap: 12 }}>
          <Titulo nivel={2}>Para repasar</Titulo>
          {errores.map((u) => {
            const e = intento.evaluacion[u.id];
            return (
              <div key={u.id} style={{ borderTop: `1px solid ${C.borde}`, paddingTop: 10, display: "grid", gap: 4 }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                  <strong style={{ color: C.tinta }}>{u.valor}</strong>
                  <ChipCategoria cat={u.cat} />
                </div>
                <span style={{ fontSize: 14, color: C.coral }}>
                  {e.veredicto === "omision" ? "Omisión" : `Dijiste: «${e.dije || "—"}»`}
                </span>
                <span style={{ fontSize: 14, color: C.suave }}>Aceptadas: {u.equiv.join(" · ") || "—"}</span>
              </div>
            );
          })}
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <Boton variante="secundario" onClick={guardarErrores} disabled={guardados !== null}>
              {guardados !== null ? <Check size={18} /> : <BookmarkPlus size={18} />}
              {guardados !== null ? "Guardados para repasar" : "Guardar errores para repasar"}
            </Boton>
            {guardados === 0 && <span style={{ fontSize: 14, color: C.suave }}>Ya estaban guardados.</span>}
          </div>
        </Tarjeta>
      )}

      <Tarjeta style={{ display: "grid", gap: 14 }}>
        <Titulo nivel={2}>Estilo y entrega</Titulo>
        <p style={{ margin: 0, fontSize: 14, color: C.suave }}>
          Escucha tu grabación completa otra vez y califícate: 1 = nada, 5 = totalmente.
        </p>
        {PREGUNTAS_ESTILO.map((q) => (
          <div key={q.id} style={{ display: "grid", gap: 8 }}>
            <span style={{ fontSize: 15, color: C.tinta }}>{q.texto}</span>
            <div style={{ display: "flex", gap: 6 }} role="radiogroup" aria-label={q.texto}>
              {[1, 2, 3, 4, 5].map((n) => {
                const sel = intento.estilo[q.id] === n;
                return (
                  <button
                    key={n}
                    role="radio"
                    aria-checked={sel}
                    onClick={() => onCambio({ ...intento, estilo: { ...intento.estilo, [q.id]: n } })}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 8,
                      cursor: "pointer",
                      fontWeight: 600,
                      border: `1px solid ${sel ? C.azul : C.borde}`,
                      background: sel ? C.azul : "#fff",
                      color: sel ? "#fff" : C.tinta,
                    }}
                  >
                    {n}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </Tarjeta>

      {historial.length > 1 && (
        <Tarjeta style={{ display: "grid", gap: 10 }}>
          <Titulo nivel={2}>Tu progreso en este ejercicio</Titulo>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 120, borderBottom: `1px solid ${C.borde}` }}>
            {historial.map((h) => (
              <div key={h.id} title={`${new Date(h.fecha).toLocaleDateString("es-MX")}: ${h.pct}%`} style={{ flex: 1, maxWidth: 48, display: "grid", gap: 4, justifyItems: "center" }}>
                <span style={{ fontSize: 12, color: C.suave }}>{Math.round(h.pct)}</span>
                <div style={{ width: "100%", height: h.pct, background: h.id === intento.id ? C.azul : C.azulSuave, borderRadius: "4px 4px 0 0" }} />
              </div>
            ))}
          </div>
        </Tarjeta>
      )}
    </div>
  );
}
