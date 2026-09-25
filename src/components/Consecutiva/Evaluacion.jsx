import { useEffect, useState } from "react";
import { Check, X, MinusCircle, ChevronLeft, ChevronRight, Lightbulb, Plus, ArrowLeft } from "./icons.jsx";
import { C, F } from "../../lib/consecutiva/tokens.js";
import { claveAudio, leerAudio } from "../../lib/consecutiva/audioStore.js";
import { sugerir, estaEnLista } from "../../lib/consecutiva/match.js";
import { leerExtras, agregarExtra } from "../../lib/consecutiva/storage.js";
import { Boton, Tarjeta, Titulo, ChipCategoria, destino, hablanteNombre } from "./ui.jsx";

const VEREDICTOS = [
  { v: "correcto", label: "Correcto", Icono: Check, color: C.verde, fondo: C.verdeSuave },
  { v: "incorrecto", label: "Incorrecto", Icono: X, color: C.coral, fondo: C.coralSuave },
  { v: "omision", label: "Omisión", Icono: MinusCircle, color: C.coral, fondo: C.coralSuave },
];

function GuionMarcado({ turno, evaluacion, activa, onElegir }) {
  return (
    <p style={{ fontFamily: F.titulo, fontSize: 17, lineHeight: 1.9, margin: 0, color: C.tinta }}>
      {turno.segmentos.map((s, i) => {
        if (s.tipo === "texto") return <span key={i}>{s.valor}</span>;
        const v = evaluacion[s.id] && evaluacion[s.id].veredicto;
        const error = v === "incorrecto" || v === "omision";
        return (
          <button
            key={s.id}
            onClick={() => onElegir(s.id)}
            title={error ? "Marcada como error" : v === "correcto" ? "Correcta" : "Sin evaluar"}
            style={{
              font: "inherit",
              fontWeight: 700,
              cursor: "pointer",
              border: "none",
              borderRadius: 4,
              padding: "0 3px",
              background: activa === s.id ? C.azulSuave : "transparent",
              color: error ? C.coral : v === "correcto" ? C.verde : C.tinta,
              textDecoration: error ? "line-through" : "underline",
              textDecorationThickness: error ? 2 : 1,
              textUnderlineOffset: 4,
            }}
          >
            {s.valor}
            {error && " ✕"}
          </button>
        );
      })}
    </p>
  );
}

function FilaUnidad({ ejercicioId, unidad, estado, extras, activa, onCambio, onExtra, onFoco }) {
  const [mostrar, setMostrar] = useState(false);
  const dije = estado.dije || "";
  const veredicto = estado.veredicto || null;
  const sug = sugerir(unidad, dije, extras);
  const puedeVer = mostrar || veredicto === "omision";
  const todas = [...unidad.equiv, ...extras];
  const nueva = veredicto === "correcto" && dije.trim() && !estaEnLista(dije, todas);

  return (
    <div
      onFocus={onFoco}
      style={{
        border: `1px solid ${activa ? C.azul : C.borde}`,
        borderRadius: 12,
        padding: 14,
        display: "grid",
        gap: 10,
        background: C.superficie,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <strong style={{ fontSize: 16, color: C.tinta }}>{unidad.valor}</strong>
        <ChipCategoria cat={unidad.cat} />
      </div>

      <label style={{ display: "grid", gap: 4 }}>
        <span style={{ fontSize: 13, color: C.suave }}>Lo que dije</span>
        <input
          value={dije}
          disabled={veredicto === "omision"}
          onChange={(e) => onCambio({ dije: e.target.value, veredicto })}
          placeholder={veredicto === "omision" ? "No dije nada" : "Escribe exactamente lo que dijiste"}
          style={{
            fontFamily: F.cuerpo,
            fontSize: 15,
            padding: "9px 12px",
            borderRadius: 8,
            border: `1px solid ${C.borde}`,
            background: veredicto === "omision" ? C.fondo : "#fff",
          }}
        />
      </label>

      {sug && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            flexWrap: "wrap",
            fontSize: 14,
            color: sug.veredicto === "correcto" ? C.verde : sug.veredicto === "incorrecto" ? C.coral : C.suave,
          }}
        >
          <Lightbulb size={16} />
          <span>{sug.razon}</span>
          {sug.veredicto && sug.veredicto !== veredicto && (
            <button
              onClick={() => onCambio({ dije, veredicto: sug.veredicto })}
              style={{
                fontSize: 13,
                fontWeight: 600,
                border: `1px solid currentColor`,
                background: "transparent",
                color: "inherit",
                borderRadius: 999,
                padding: "2px 10px",
                cursor: "pointer",
              }}
            >
              Marcar como {sug.veredicto}
            </button>
          )}
        </div>
      )}

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {VEREDICTOS.map(({ v, label, Icono, color, fondo }) => {
          const sel = veredicto === v;
          return (
            <button
              key={v}
              aria-pressed={sel}
              onClick={() => onCambio({ dije: v === "omision" ? "" : dije, veredicto: sel ? null : v })}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 14,
                fontWeight: 600,
                padding: "7px 12px",
                borderRadius: 8,
                cursor: "pointer",
                border: `1px solid ${sel ? color : C.borde}`,
                background: sel ? fondo : "#fff",
                color: sel ? color : C.suave,
              }}
            >
              <Icono size={16} /> {label}
            </button>
          );
        })}
      </div>

      {puedeVer ? (
        <div style={{ fontSize: 14, color: C.suave, background: C.fondo, borderRadius: 8, padding: "8px 12px" }}>
          <span style={{ fontWeight: 600, color: C.tinta }}>Equivalencias aceptadas: </span>
          {todas.length ? todas.join(" · ") : "ninguna en el glosario todavía"}
        </div>
      ) : (
        <button
          onClick={() => setMostrar(true)}
          disabled={!dije.trim()}
          title={!dije.trim() ? "Primero escribe lo que dijiste" : ""}
          style={{
            justifySelf: "start",
            background: "none",
            border: "none",
            padding: 0,
            fontSize: 14,
            color: dije.trim() ? C.azul : C.suave,
            cursor: dije.trim() ? "pointer" : "not-allowed",
            textDecoration: "underline",
          }}
        >
          Ver equivalencias del glosario
        </button>
      )}

      {nueva && (
        <button
          onClick={() => onExtra(`${ejercicioId}:${unidad.id}`, dije.trim())}
          style={{
            justifySelf: "start",
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 14,
            fontWeight: 600,
            color: C.azul,
            background: C.azulSuave,
            border: "none",
            borderRadius: 8,
            padding: "6px 12px",
            cursor: "pointer",
          }}
        >
          <Plus size={16} /> Agregar «{dije.trim()}» como equivalencia aceptable
        </button>
      )}
    </div>
  );
}

export default function Evaluacion({ ejercicio, intento, onCambio, onTerminar, onSalir }) {
  const [idx, setIdx] = useState(0);
  const [url, setUrl] = useState(null);
  const [extras, setExtras] = useState(leerExtras);
  const [activa, setActiva] = useState(null);
  const turno = ejercicio.turnos[idx];
  const unidades = turno.segmentos.filter((s) => s.tipo === "unidad");

  useEffect(() => {
    let u = null;
    let vivo = true;
    setUrl(null);
    leerAudio(claveAudio(intento.id, idx))
      .then((blob) => {
        if (blob && vivo) {
          u = URL.createObjectURL(blob);
          setUrl(u);
        }
      })
      .catch(() => {});
    return () => {
      vivo = false;
      if (u) URL.revokeObjectURL(u);
    };
  }, [idx, intento.id]);

  const pendientes = ejercicio.unidades.filter(
    (u) => !(intento.evaluacion[u.id] && intento.evaluacion[u.id].veredicto)
  ).length;

  function cambiar(id, estado) {
    onCambio({ ...intento, evaluacion: { ...intento.evaluacion, [id]: estado } });
  }

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <button
          onClick={onSalir}
          style={{ background: "none", border: "none", color: C.suave, display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontFamily: F.cuerpo, fontSize: 14 }}
        >
          <ArrowLeft size={16} /> Salir (se guarda el avance)
        </button>
        <span style={{ fontSize: 14, color: C.suave }}>
          {pendientes === 0 ? "Todas las unidades evaluadas" : `Faltan ${pendientes} de ${ejercicio.unidades.length} unidades`}
        </span>
      </div>

      <Tarjeta style={{ display: "grid", gap: 16 }}>
        <div>
          <p style={{ margin: 0, color: C.suave, fontSize: 14 }}>
            Segmento {idx + 1} de {ejercicio.turnos.length}
          </p>
          <Titulo nivel={2}>
            {hablanteNombre(turno.hablante)} · interpretado al {destino(turno.idioma)}
          </Titulo>
        </div>

        <div style={{ display: "grid", gap: 6 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: C.tinta }}>Tu grabación</span>
          {url ? (
            <audio controls src={url} style={{ width: "100%" }} />
          ) : (
            <p style={{ margin: 0, fontSize: 14, color: C.suave }}>
              No hay grabación para este segmento en este navegador.
            </p>
          )}
        </div>

        {turno.contexto && (
          <p style={{ margin: 0, fontSize: 14, color: C.suave, fontStyle: "italic" }}>
            Contexto: {turno.contexto}
          </p>
        )}

        <div style={{ borderLeft: `3px solid ${C.azul}`, paddingLeft: 14 }}>
          <GuionMarcado
            turno={turno}
            evaluacion={intento.evaluacion}
            activa={activa}
            onElegir={(id) => {
              setActiva(id);
              const el = document.getElementById(`fila-${id}`);
              el && el.querySelector("input") && el.querySelector("input").focus();
            }}
          />
        </div>

        {intento.notas[idx] && (
          <details style={{ fontSize: 14, color: C.suave }}>
            <summary style={{ cursor: "pointer" }}>Ver las notas que tomaste</summary>
            <p style={{ whiteSpace: "pre-wrap", margin: "8px 0 0" }}>{intento.notas[idx]}</p>
          </details>
        )}
      </Tarjeta>

      <div style={{ display: "grid", gap: 12 }}>
        {unidades.map((u) => (
          <div id={`fila-${u.id}`} key={u.id}>
            <FilaUnidad
              ejercicioId={ejercicio.id}
              unidad={u}
              estado={intento.evaluacion[u.id] || {}}
              extras={extras[`${ejercicio.id}:${u.id}`] || []}
              activa={activa === u.id}
              onFoco={() => setActiva(u.id)}
              onCambio={(e) => cambiar(u.id, e)}
              onExtra={(clave, valor) => setExtras(agregarExtra(clave, valor))}
            />
          </div>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
        <Boton variante="fantasma" onClick={() => setIdx(idx - 1)} disabled={idx === 0}>
          <ChevronLeft size={18} /> Segmento anterior
        </Boton>
        {idx < ejercicio.turnos.length - 1 ? (
          <Boton onClick={() => { setIdx(idx + 1); setActiva(null); window.scrollTo({ top: 0 }); }}>
            Siguiente segmento <ChevronRight size={18} />
          </Boton>
        ) : (
          <Boton onClick={onTerminar} disabled={pendientes > 0} title={pendientes ? "Evalúa todas las unidades primero" : ""}>
            Ver resultados <ChevronRight size={18} />
          </Boton>
        )}
      </div>
    </div>
  );
}
