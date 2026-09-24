import { useMemo, useState } from "react";
import { Play, ClipboardCheck, BarChart3, Trash2 } from "lucide-react";
import { C, F } from "../../lib/consecutiva/tokens.js";
import { prepararEjercicio } from "../../lib/consecutiva/parse.js";
import {
  leerIntentos,
  guardarIntento,
  borrarIntento,
  nuevoIntento,
  calcularPuntaje,
} from "../../lib/consecutiva/storage.js";
import { borrarAudiosDeIntento } from "../../lib/consecutiva/audioStore.js";
import { EJERCICIOS_CONSECUTIVA } from "../../content/consecutiva/index.js";
import { Boton, Tarjeta, Titulo } from "./ui.jsx";
import Practica from "./Practica.jsx";
import Evaluacion from "./Evaluacion.jsx";
import Resultados from "./Resultados.jsx";

const PASOS = [
  ["Interpreta", "Escuchas cada turno sin ver el texto, tomas notas y grabas tu interpretación."],
  ["Califícate", "Revisas cada unidad de puntuación: escribes lo que dijiste y decides si fue correcto, incorrecto u omisión."],
  ["Revisa", "Ves tu porcentaje, tus puntos débiles por tipo de unidad y tus errores para repasar."],
];

export default function ConsecutivaSection() {
  const ejercicios = useMemo(() => EJERCICIOS_CONSECUTIVA.map(prepararEjercicio), []);
  const [intentos, setIntentos] = useState(leerIntentos);
  const [actual, setActual] = useState(null); // intento abierto

  const ejercicio = actual && ejercicios.find((e) => e.id === actual.ejercicioId);

  function actualizar(intento) {
    guardarIntento(intento);
    setActual(intento);
    setIntentos(leerIntentos());
  }
  function salir() {
    setActual(null);
    setIntentos(leerIntentos());
    window.scrollTo({ top: 0 });
  }
  async function eliminar(i) {
    if (!window.confirm("¿Eliminar este intento y sus grabaciones?")) return;
    borrarIntento(i.id);
    await borrarAudiosDeIntento(i.id).catch(() => {});
    setIntentos(leerIntentos());
  }

  const contenedor = {
    fontFamily: F.cuerpo,
    color: C.tinta,
    maxWidth: 760,
    margin: "0 auto",
    padding: "24px 16px 48px",
  };

  if (actual && ejercicio) {
    const props = { ejercicio, intento: actual, onCambio: actualizar, onSalir: salir };
    return (
      <div style={contenedor}>
        {actual.fase === "practica" && (
          <Practica {...props} onTerminar={() => { actualizar({ ...actual, fase: "evaluacion" }); window.scrollTo({ top: 0 }); }} />
        )}
        {actual.fase === "evaluacion" && (
          <Evaluacion {...props} onTerminar={() => { actualizar({ ...actual, fase: "terminado" }); window.scrollTo({ top: 0 }); }} />
        )}
        {actual.fase === "terminado" && <Resultados {...props} />}
      </div>
    );
  }

  return (
    <div style={{ ...contenedor, display: "grid", gap: 20 }}>
      <div style={{ display: "grid", gap: 8 }}>
        <Titulo>Interpretación consecutiva</Titulo>
        <p style={{ margin: 0, fontSize: 16, lineHeight: 1.6, color: C.suave, maxWidth: 620 }}>
          Practica y califícate con el mismo método del examen: cada unidad de puntuación cuenta, y las omisiones
          cuentan como error. Necesitas al menos 70 % en cada sección.
        </p>
      </div>

      <ol style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: 10 }}>
        {PASOS.map(([t, d], i) => (
          <li key={t} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <span
              style={{
                flex: "0 0 28px",
                height: 28,
                borderRadius: 999,
                background: C.azulSuave,
                color: C.azul,
                fontWeight: 700,
                display: "grid",
                placeItems: "center",
                fontSize: 14,
              }}
            >
              {i + 1}
            </span>
            <span style={{ fontSize: 15, lineHeight: 1.5 }}>
              <strong>{t}.</strong> <span style={{ color: C.suave }}>{d}</span>
            </span>
          </li>
        ))}
      </ol>

      {ejercicios.map((ej) => {
        const propios = intentos.filter((i) => i.ejercicioId === ej.id);
        return (
          <Tarjeta key={ej.id} style={{ display: "grid", gap: 14 }}>
            <div style={{ display: "grid", gap: 4 }}>
              <Titulo nivel={2}>{ej.titulo}</Titulo>
              {ej.descripcion && <p style={{ margin: 0, fontSize: 14, color: C.suave }}>{ej.descripcion}</p>}
              <p style={{ margin: 0, fontSize: 14, color: C.suave }}>
                {ej.turnos.length} turnos · {ej.unidades.length} unidades de puntuación
              </p>
            </div>
            <div>
              <Boton onClick={() => actualizar(nuevoIntento(ej.id))}>
                <Play size={18} /> Empezar práctica
              </Boton>
            </div>

            {propios.length > 0 && (
              <div style={{ display: "grid", gap: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 600 }}>Tus intentos</span>
                {propios.map((i) => {
                  const p = calcularPuntaje(ej, i);
                  const fecha = new Date(i.fecha).toLocaleDateString("es-MX", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
                  const accion =
                    i.fase === "terminado"
                      ? { t: `${p.pct}% · Ver resultados`, I: BarChart3 }
                      : i.fase === "evaluacion"
                      ? { t: "Continuar evaluación", I: ClipboardCheck }
                      : { t: "Continuar práctica", I: Play };
                  return (
                    <div
                      key={i.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 10,
                        flexWrap: "wrap",
                        borderTop: `1px solid ${C.borde}`,
                        paddingTop: 8,
                      }}
                    >
                      <span style={{ fontSize: 14, color: C.suave }}>{fecha}</span>
                      <div style={{ display: "flex", gap: 8 }}>
                        <Boton variante="secundario" style={{ padding: "6px 12px", fontSize: 14 }} onClick={() => setActual(i)}>
                          <accion.I size={16} /> {accion.t}
                        </Boton>
                        <Boton
                          variante="fantasma"
                          aria-label="Eliminar intento"
                          style={{ padding: "6px 10px" }}
                          onClick={() => eliminar(i)}
                        >
                          <Trash2 size={16} />
                        </Boton>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Tarjeta>
        );
      })}
    </div>
  );
}
