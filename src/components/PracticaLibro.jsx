// src/components/PracticaLibro.jsx
// Glosario y modos de práctica con el glosario del libro (inglés ↔ español).
import { useState, useMemo, useEffect, useRef } from "react";
import { Check, X, Star, ChevronDown, Download } from "lucide-react";
import LIBRO from "../data/glosarioLibro.js";
import GLOSARIO, { letraDe } from "../data/glosarioUnificado.js";
import { trampas, principal } from "../lib/trampas.js";
import { C, serif, sans } from "../theme.js";

/* ---------- utilidades ---------- */

export const TOTAL_LIBRO = LIBRO.length;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const sortKey = (s) =>
  s.toLowerCase().replace(/^["«]/, "").replace(/^(the|a|an|to) /, "");
const letterOf = (t) => sortKey(t.en)[0].toUpperCase();

const norm = (s) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\([^)]*\)/g, " ")
    .replace(/[«»"'.,;:¿?¡!…]/g, " ")
    .replace(/\b(el|la|los|las|un|una|the|a|an|to|de)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();

function alternativas(s) {
  const out = new Set();
  s.split(";").forEach((p) => {
    out.add(norm(p));
    p.split(/\s+o\s+|,\s*/).forEach((q) => out.add(norm(q)));
  });
  out.delete("");
  return [...out];
}

function lev(a, b) {
  const m = a.length, n = b.length;
  if (!m) return n;
  if (!n) return m;
  let prev = Array.from({ length: n + 1 }, (_, i) => i);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++)
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    prev = cur;
  }
  return prev[n];
}

// "ok" | "casi" | "no" | "vacio"
function revisar(entrada, correcta) {
  const u = norm(entrada);
  if (!u) return "vacio";
  const as = alternativas(correcta);
  if (as.includes(u)) return "ok";
  if (as.some((a) => a.length > 5 && lev(a, u) <= (a.length > 12 ? 2 : 1))) return "casi";
  return "no";
}

const pregunta = (t, dir) => (dir === "en" ? t.en : t.es);
const respuesta = (t, dir) => (dir === "en" ? t.es : t.en);

/* ---------- términos difíciles (solo en este navegador) ---------- */

const KEY = "palabraJusta_dificilesLibro_v1";

function cargarDificiles() {
  try {
    return JSON.parse(window.localStorage.getItem(KEY) || "{}");
  } catch (e) {
    return {};
  }
}
function guardarDificiles(d) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(d));
  } catch (e) {}
}
// Un fallo suma 1; un acierto resta 1. Al llegar a 0 el término sale de la lista.
function registrar(t, acierto) {
  const d = cargarDificiles();
  const n = (d[t.en] || 0) + (acierto ? -1 : 1);
  if (n > 0) d[t.en] = n;
  else delete d[t.en];
  guardarDificiles(d);
}
function alternarDificil(t) {
  const d = cargarDificiles();
  if (d[t.en]) delete d[t.en];
  else d[t.en] = 1;
  guardarDificiles(d);
}

/* ---------- piezas de interfaz ---------- */

function Titulo({ children, sub }) {
  return (
    <>
      <h1 style={{ fontFamily: serif, fontWeight: 600, color: C.navy, fontSize: 33, lineHeight: 1.15, margin: 0 }}>
        {children}
      </h1>
      {sub && (
        <p style={{ fontFamily: sans, color: C.muted, fontSize: 16, margin: "6px 0 0 0" }}>{sub}</p>
      )}
    </>
  );
}

function Boton({ children, onClick, variante = "secundario", disabled, autoFocus }) {
  const v = {
    primario: { bg: C.accent, fg: "#fff", bd: C.accent },
    secundario: { bg: C.card, fg: C.text, bd: C.border },
    bien: { bg: C.successSoft, fg: C.success, bd: C.success },
    mal: { bg: C.errorSoft, fg: C.error, bd: C.error },
  }[variante];
  return (
    <button
      className="pj-btn"
      onClick={onClick}
      disabled={disabled}
      autoFocus={autoFocus}
      style={{
        fontFamily: sans,
        fontSize: 15,
        fontWeight: 500,
        padding: "10px 16px",
        borderRadius: 8,
        border: `1px solid ${v.bd}`,
        backgroundColor: v.bg,
        color: v.fg,
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.5 : 1,
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      {children}
    </button>
  );
}

function Segmento({ opciones, valor, onChange, etiqueta }) {
  return (
    <div role="group" aria-label={etiqueta} style={{ display: "inline-flex", border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden" }}>
      {opciones.map(([v, l]) => (
        <button
          key={v}
          onClick={() => onChange(v)}
          aria-pressed={valor === v}
          style={{
            fontFamily: sans,
            fontSize: 13.5,
            fontWeight: 500,
            padding: "7px 11px",
            border: "none",
            backgroundColor: valor === v ? C.accent : C.card,
            color: valor === v ? "#fff" : C.muted,
            cursor: "pointer",
          }}
        >
          {l}
        </button>
      ))}
    </div>
  );
}

const selectStyle = {
  fontFamily: sans,
  fontSize: 14,
  color: C.text,
  backgroundColor: C.card,
  border: `1px solid ${C.border}`,
  borderRadius: 8,
  padding: "6px 8px",
};

const GRUPOS = [
  ["todo", "Todo el glosario"],
  ["A-D", "A–D"],
  ["E-L", "E–L"],
  ["M-P", "M–P"],
  ["Q-Z", "Q–Z"],
  ["dificiles", "Mis difíciles"],
];

function poolDe(grupo) {
  if (grupo === "todo") return LIBRO;
  if (grupo === "dificiles") {
    const d = cargarDificiles();
    return LIBRO.filter((t) => d[t.en]);
  }
  const [a, b] = grupo.split("-");
  return LIBRO.filter((t) => {
    const L = letterOf(t);
    return L >= a && L <= b;
  });
}

function Controles({ dir, setDir }) {
  return (
    <div style={{ margin: "0 0 14px 0" }}>
      <Segmento
        etiqueta="Idioma"
        valor={dir}
        onChange={setDir}
        opciones={[["en", "Inglés → Español"], ["es", "Español → Inglés"]]}
      />
    </div>
  );
}

// Pantalla de instrucciones antes de empezar.
function Intro({ titulo, pasos, onEmpezar }) {
  return (
    <div>
      <Titulo>{titulo}</Titulo>
      <div style={{ backgroundColor: C.card, border: `1px solid ${C.border}`, borderLeft: `5px solid ${C.clay}`, borderRadius: 10, padding: "20px 22px", marginTop: 18 }}>
        <ol style={{ margin: 0, paddingLeft: 20, listStyle: "decimal", fontFamily: sans, fontSize: 16, lineHeight: 1.55, color: C.text, display: "flex", flexDirection: "column", gap: 8 }}>
          {pasos.map((p, i) => (
            <li key={i}>{p}</li>
          ))}
        </ol>
        <div style={{ marginTop: 18 }}>
          <Boton variante="primario" onClick={onEmpezar}>Empezar</Boton>
        </div>
      </div>
    </div>
  );
}

const PASO_IDIOMA = "Puedes cambiar de idioma en la pestaña que está arriba de la tarjeta.";

function Progreso({ pos, total, aciertos }) {
  return (
    <>
      <div style={{ height: 4, background: C.border, borderRadius: 2, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${(pos / total) * 100}%`, background: C.sage, transition: "width .25s" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: sans, fontSize: 13, color: C.muted, margin: "6px 0 14px 0" }}>
        <span>{Math.min(pos + 1, total)} de {total}</span>
        <span>{aciertos} correctas</span>
      </div>
    </>
  );
}

function Tarjeta({ children, borde = C.accent, onClick, etiqueta }) {
  return (
    <div
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={etiqueta}
      onKeyDown={onClick ? (e) => (e.key === " " || e.key === "Enter") && (e.preventDefault(), onClick()) : undefined}
      style={{
        backgroundColor: C.card,
        border: `1px solid ${C.border}`,
        borderLeft: `5px solid ${borde}`,
        borderRadius: 10,
        padding: "28px 24px",
        minHeight: 180,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        cursor: onClick ? "pointer" : "default",
      }}
    >
      {children}
    </div>
  );
}

function Termino({ texto, idioma }) {
  const partes = texto.split(/(\([^)]*\))/g).filter(Boolean);
  return (
    <>
      <p style={{ fontFamily: sans, fontSize: 13, color: C.muted, margin: "0 0 8px 0" }}>{idioma}</p>
      <p style={{ fontFamily: serif, fontWeight: 600, fontSize: 28, lineHeight: 1.2, color: C.text, margin: 0, overflowWrap: "anywhere" }}>
        {partes.map((p, i) =>
          p.startsWith("(") ? (
            <span key={i} style={{ fontWeight: 400, fontStyle: "italic", color: C.muted, fontSize: "0.6em" }}>{p}</span>
          ) : (
            <span key={i}>{p}</span>
          )
        )}
      </p>
    </>
  );
}

function Aviso({ ok, children }) {
  return (
    <div
      style={{
        marginTop: 14,
        padding: "12px 14px",
        borderRadius: 8,
        display: "flex",
        gap: 10,
        alignItems: "flex-start",
        fontFamily: sans,
        fontSize: 15,
        backgroundColor: ok ? C.successSoft : C.errorSoft,
        color: ok ? C.success : C.error,
      }}
    >
      {ok ? <Check size={18} strokeWidth={2.5} style={{ flexShrink: 0, marginTop: 2 }} /> : <X size={18} strokeWidth={2.5} style={{ flexShrink: 0, marginTop: 2 }} />}
      <span>{children}</span>
    </div>
  );
}

function Vacio({ grupo }) {
  return (
    <div style={{ backgroundColor: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 24, fontFamily: sans, fontSize: 15, color: C.muted }}>
      {grupo === "dificiles"
        ? "Todavía no tienes términos difíciles. Se agregan solos cuando fallas uno en cualquier modo de práctica, o puedes marcarlos con la estrella en el Glosario."
        : "No hay términos en este grupo."}
    </div>
  );
}

// Sesión de práctica compartida por Tarjetas, Quiz y Escribir.
// Los términos se revuelven cada vez que se abre la sección y se practican de 20 en 20,
// sin repetir hasta terminar el grupo completo.
const POR_SESION = 20;

function useRonda(fijo) {
  const grupo = "todo";
  const [orden, setOrden] = useState(() => shuffle(fijo || poolDe(grupo)));
  const [inicio, setInicio] = useState(0);
  const [mazo, setMazo] = useState(() => orden.slice(0, POR_SESION));
  const [pos, setPos] = useState(0);
  const [aciertos, setAciertos] = useState(0);
  const [fallas, setFallas] = useState([]);

  const empezar = (lista) => {
    setMazo(lista);
    setPos(0);
    setAciertos(0);
    setFallas([]);
  };

  // Al cambiar de grupo se revuelve todo de nuevo.
  const primeraVez = useRef(true);
  useEffect(() => {
    if (primeraVez.current) {
      primeraVez.current = false;
      return;
    }
    const nuevo = shuffle(fijo || poolDe(grupo));
    setOrden(nuevo);
    setInicio(0);
    empezar(nuevo.slice(0, POR_SESION));
  }, [grupo]); // eslint-disable-line react-hooks/exhaustive-deps

  const restantes = Math.max(0, orden.length - (inicio + POR_SESION));

  const continuar = () => {
    if (restantes === 0) {
      const nuevo = shuffle(orden);
      setOrden(nuevo);
      setInicio(0);
      empezar(nuevo.slice(0, POR_SESION));
    } else {
      const siguienteInicio = inicio + POR_SESION;
      setInicio(siguienteInicio);
      empezar(orden.slice(siguienteInicio, siguienteInicio + POR_SESION));
    }
  };
  const repasar = (lista) => empezar(shuffle(lista));

  const contestar = (t, ok) => {
    registrar(t, ok);
    if (ok) setAciertos((a) => a + 1);
    else setFallas((f) => (f.includes(t) ? f : [...f, t]));
  };
  const siguiente = () => setPos((p) => p + 1);
  return { mazo, pos, aciertos, fallas, restantes, contestar, siguiente, continuar, repasar, actual: mazo[pos], fin: pos >= mazo.length };
}

function Resultado({ ronda }) {
  const { mazo, aciertos, fallas, restantes, continuar, repasar } = ronda;
  const pct = Math.round((aciertos / mazo.length) * 100);
  const siguientes = Math.min(POR_SESION, restantes);
  return (
    <div style={{ backgroundColor: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 24 }}>
      <p style={{ fontFamily: serif, fontWeight: 600, fontSize: 40, lineHeight: 1, color: C.text, margin: 0 }}>
        {aciertos} de {mazo.length}
      </p>
      <p style={{ fontFamily: sans, fontSize: 15, color: C.muted, margin: "8px 0 16px 0" }}>
        {pct}% correctas.{" "}
        {fallas.length ? "Los términos que fallaste se sumaron a Términos difíciles." : "Sin errores en esta sesión."}
      </p>
      {fallas.length > 0 && (
        <div style={{ borderTop: `1px solid ${C.border}`, marginBottom: 16 }}>
          {fallas.map((t) => (
            <div key={t.en} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, padding: "9px 0", borderBottom: `1px solid ${C.border}`, fontFamily: sans, fontSize: 14.5 }}>
              <span style={{ fontWeight: 600, color: C.text }}>{t.en}</span>
              <span style={{ color: C.text }}>{t.es}</span>
            </div>
          ))}
        </div>
      )}
      <p style={{ fontFamily: sans, fontSize: 16, fontWeight: 500, color: C.text, margin: "0 0 12px 0" }}>
        {siguientes > 0
          ? `¿Quieres continuar con ${siguientes === POR_SESION ? "20" : `los ${siguientes}`} más?`
          : "Terminaste todos los términos de este grupo. ¿Quieres empezar de nuevo?"}
      </p>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <Boton variante="primario" onClick={continuar}>
          {siguientes > 0 ? `Continuar con ${siguientes} más` : "Empezar de nuevo"}
        </Boton>
        {fallas.length > 0 && <Boton onClick={() => repasar(fallas)}>Repasar las falladas</Boton>}
      </div>
    </div>
  );
}

const idiomaDe = (dir, lado) =>
  (dir === "en") === (lado === "pregunta") ? "Inglés" : "Español";

/* ---------- Glosario ---------- */

const NOMBRE_FUENTE = { courts: "U.S. Courts", juvenil: "Corte Juvenil" };

// Ícono de joven para los términos propios de la Corte Juvenil.
function IconoJoven({ size = 16, color = C.clayText }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d="M8.5 7.5a3.5 3.5 0 0 1 7 0v1a3.5 3.5 0 0 1-7 0z" />
      <path d="M7.5 6.2c1.2-2.1 3-2.9 4.8-2.7 1.4.1 2.6.8 3.4 2" />
      <path d="M5 21v-2.5A5.5 5.5 0 0 1 10.5 13h3a5.5 5.5 0 0 1 5.5 5.5V21" />
      <path d="M9.5 13.3 12 17l2.5-3.7" />
    </svg>
  );
}

function descargarPendientes(lista) {
  const celda = (v) => `"${(v || "").replace(/"/g, '""')}"`;
  const filas = [["en", "es", "fuentes", "definicion"]].concat(
    lista.map((f) => [f.en, "", f.fuentes.filter((x) => x !== "libro").map((x) => NOMBRE_FUENTE[x]).join(" + "), f.defs.map((d) => d.texto).join(" | ")])
  );
  const csv = "\uFEFF" + filas.map((r) => r.map(celda).join(",")).join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = "palabra-justa-sin-traduccion.csv";
  a.click();
  URL.revokeObjectURL(url);
}

function FichaDetalle({ f }) {
  const [verAdulto, setVerAdulto] = useState(false);
  return (
    <div style={{ padding: "0 14px 14px 14px", display: "flex", flexDirection: "column", gap: 10 }}>
      {f.juvenil && (
        <div style={{ padding: "10px 12px", backgroundColor: C.claySoft, borderLeft: `3px solid ${C.clay}`, borderRadius: 4, fontFamily: sans, fontSize: 14, color: C.text, lineHeight: 1.45 }}>
          <span style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <IconoJoven />
            Aplica generalmente solo en la corte juvenil.
          </span>
          {f.juvenil.sinEquivalente && <span style={{ display: "block", marginTop: 6, color: C.muted }}>{f.juvenil.sinEquivalente}</span>}
          {f.juvenil.adulto &&
            (verAdulto ? (
              <span style={{ display: "block", marginTop: 6 }}>
                En la corte de adultos: <b>{f.juvenil.adulto.en}</b>
                {f.juvenil.adulto.es && <> · {f.juvenil.adulto.es}</>}
              </span>
            ) : (
              <button
                onClick={() => setVerAdulto(true)}
                style={{ marginTop: 8, fontFamily: sans, fontSize: 13.5, fontWeight: 500, color: C.accent, backgroundColor: C.card, border: `1px solid ${C.border}`, borderRadius: 999, padding: "5px 12px", cursor: "pointer" }}
              >
                Ver el equivalente en la corte de adultos
              </button>
            ))}
        </div>
      )}
      {f.nota && (
        <p style={{ fontFamily: sans, fontSize: 14, lineHeight: 1.45, color: C.text, margin: 0, padding: "8px 12px", backgroundColor: C.claySoft, borderLeft: `3px solid ${C.clay}`, borderRadius: 4, display: "flex", gap: 8, alignItems: "flex-start" }}>
          <IconoJoven />
          <span>{f.nota}</span>
        </p>
      )}
      {f.defs.map((d, k) => (
        <div key={k}>
          {f.defs.length > 1 && (
            <span style={{ fontFamily: sans, fontSize: 12, fontWeight: 600, color: C.label }}>{NOMBRE_FUENTE[d.fuente]}</span>
          )}
          <p style={{ fontFamily: sans, fontSize: 14, lineHeight: 1.5, color: C.muted, margin: f.defs.length > 1 ? "2px 0 0 0" : 0 }}>{d.texto}</p>
        </div>
      ))}
    </div>
  );
}

export function GlosarioView() {
  // La pestaña "Sin traducción" es solo para ti: se abre con palabrajusta.com/#pendientes
  const leerAdmin = () => typeof window !== "undefined" && window.location.hash === "#pendientes";
  const [admin, setAdmin] = useState(leerAdmin);
  const [vista, setVista] = useState(() => (leerAdmin() ? "pendientes" : "traduccion"));
  useEffect(() => {
    const alCambiar = () => {
      const a = leerAdmin();
      setAdmin(a);
      setVista((v) => (a ? "pendientes" : v === "pendientes" ? "traduccion" : v));
    };
    window.addEventListener("hashchange", alCambiar);
    return () => window.removeEventListener("hashchange", alCambiar);
  }, []);
  const [q, setQ] = useState("");
  const [letra, setLetra] = useState(null);
  const [abierta, setAbierta] = useState(null);
  const [dificiles, setDificiles] = useState(() => cargarDificiles());

  const conTraduccion = useMemo(() => GLOSARIO.filter((f) => f.es), []);
  const conDefinicion = useMemo(() => GLOSARIO.filter((f) => f.defs.length), []);
  const pendientes = useMemo(() => GLOSARIO.filter((f) => !f.es), []);
  const base = vista === "traduccion" ? conTraduccion : vista === "definicion" ? conDefinicion : pendientes;

  const letras = useMemo(() => [...new Set(base.map(letraDe))].sort(), [base]);
  const nq = norm(q);
  const buscando = nq.length > 0;

  // Búsqueda global: siempre en todo el glosario, ordenada por relevancia.
  const filtradas = useMemo(() => {
    if (!buscando) return letra ? base.filter((f) => letraDe(f) === letra) : base;
    const puntaje = (f) => {
      const en = norm(f.en);
      const es = alternativas(f.es || "");
      if (en === nq || es.includes(nq)) return 0;
      if (en.startsWith(nq) || es.some((x) => x.startsWith(nq))) return 1;
      if (en.includes(nq) || norm(f.es || "").includes(nq)) return 2;
      if (norm(f.defs.map((d) => d.texto).join(" ")).includes(nq)) return 3;
      return null;
    };
    return GLOSARIO.map((f) => [f, puntaje(f)])
      .filter(([, p]) => p !== null)
      .sort((a, b) => a[1] - b[1])
      .map(([f]) => f);
  }, [base, letra, nq, buscando]);

  const opciones = [
    ["traduccion", `Términos con traducción · ${conTraduccion.length}`],
    ["definicion", `Términos con definiciones · ${conDefinicion.length}`],
  ];
  if (admin) opciones.push(["pendientes", `Sin traducción · ${pendientes.length}`]);

  return (
    <div>
      <Titulo>Glosario jurídico</Titulo>

      <div style={{ marginTop: 20 }}>
        <Segmento
          etiqueta="Tipo de glosario"
          valor={buscando ? null : vista}
          onChange={(v) => {
            setVista(v);
            setQ("");
            setLetra(null);
            setAbierta(null);
          }}
          opciones={opciones}
        />
      </div>

      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Busca una palabra en inglés o español"
        aria-label="Buscar"
        style={{ width: "100%", marginTop: 14, fontFamily: sans, fontSize: 16, color: C.text, backgroundColor: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 12px", boxSizing: "border-box" }}
      />

      {!buscando && (
      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 10 }}>
        {[null, ...letras].map((l) => (
          <button
            key={l || "todas"}
            onClick={() => setLetra(l)}
            aria-pressed={letra === l}
            style={{ fontFamily: sans, fontSize: 13, padding: "3px 8px", borderRadius: 6, border: `1px solid ${letra === l ? C.accent : C.border}`, backgroundColor: letra === l ? C.accentSoft : C.card, color: letra === l ? C.accent : C.muted, cursor: "pointer" }}
          >
            {l || "A–Z"}
          </button>
        ))}
      </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap", margin: "14px 0 8px 0" }}>
        <p style={{ fontFamily: sans, fontSize: 13, color: C.muted, margin: 0 }}>
          {buscando
            ? `${filtradas.length} ${filtradas.length === 1 ? "resultado" : "resultados"}`
            : `${filtradas.length} términos`}
          {!buscando && vista === "pendientes" && " sin traducción. Escríbelas en src/data/traduccionesPropias.js."}
        </p>
        {!buscando && vista === "pendientes" && (
          <Boton onClick={() => descargarPendientes(filtradas)}>
            <Download size={16} /> Descargar lista (CSV)
          </Boton>
        )}
      </div>

      {filtradas.length === 0 ? (
        <p style={{ fontFamily: sans, fontSize: 15, color: C.muted }}>Ningún término coincide con la búsqueda.</p>
      ) : (
        <div style={{ backgroundColor: C.card, border: `1px solid ${C.border}`, borderRadius: 10, overflow: "hidden" }}>
          {filtradas.map((f, i) => {
            const tieneDetalle = f.defs.length > 0 || f.nota || f.juvenil;
            const open = abierta === f;
            return (
              <div key={f.en + i} style={{ borderTop: i ? `1px solid ${C.border}` : "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 10px 10px 14px" }}>
                  <button
                    onClick={() => tieneDetalle && setAbierta(open ? null : f)}
                    aria-expanded={tieneDetalle ? open : undefined}
                    style={{ flex: 1, minWidth: 0, display: "grid", gridTemplateColumns: f.es ? "minmax(0,1fr) minmax(0,1fr)" : "minmax(0,1fr)", gap: 12, alignItems: "baseline", textAlign: "left", background: "none", border: "none", padding: 0, cursor: tieneDetalle ? "pointer" : "default", fontFamily: sans }}
                  >
                    <span style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 14.5, fontWeight: 600, color: C.accent }}>
                      {f.en}
                      {(f.juvenil || f.nota) && <IconoJoven size={15} />}
                    </span>
                    {f.es && (
                      <span style={{ fontSize: 14.5, color: C.text }}>
                        {f.es}
                        {f.esFuente === "propia" && (
                          <span style={{ display: "block", fontSize: 12, color: C.clayText, marginTop: 2 }}>Traducción propia</span>
                        )}
                      </span>
                    )}
                  </button>
                  {tieneDetalle ? (
                    <ChevronDown size={17} color={C.label} style={{ flexShrink: 0, transform: open ? "rotate(180deg)" : "none", transition: "transform .15s" }} />
                  ) : (
                    <span style={{ width: 17, flexShrink: 0 }} />
                  )}
                  {f.libro && (
                    <button
                      onClick={() => {
                        alternarDificil(f.libro);
                        setDificiles(cargarDificiles());
                      }}
                      aria-label={dificiles[f.libro.en] ? `Quitar ${f.en} de difíciles` : `Marcar ${f.en} como difícil`}
                      style={{ background: "none", border: "none", cursor: "pointer", color: C.clayText, padding: 4, display: "flex", flexShrink: 0 }}
                    >
                      <Star size={17} fill={dificiles[f.libro.en] ? C.clay : "none"} />
                    </button>
                  )}
                </div>
                {open && <FichaDetalle f={f} />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ---------- Tarjetas ---------- */

export function TarjetasView({ fijo, titulo = "Tarjetas" }) {
  const [dir, setDir] = useState("en");
  const [empezado, setEmpezado] = useState(!!fijo);
  const ronda = useRonda(fijo);
  const [volteada, setVolteada] = useState(false);
  // Cada tarjeta nueva entra sin voltear (así no se asoma la respuesta de la siguiente).
  useEffect(() => setVolteada(false), [ronda.pos, ronda.mazo]);

  const marcar = (ok) => {
    ronda.contestar(ronda.actual, ok);
    ronda.siguiente();
  };

  if (!empezado)
    return (
      <Intro
        titulo="Tarjetas"
        pasos={["Lee el término y trata de recordar su traducción.", "Toca la tarjeta para ver la respuesta y marca si la sabías.", "Son 20 términos por sesión; al terminar puedes seguir con 20 más.", PASO_IDIOMA]}
        onEmpezar={() => setEmpezado(true)}
      />
    );

  return (
    <div>
      {fijo && <Titulo>{titulo}</Titulo>}
      {fijo && <div style={{ height: 14 }} />}
      <Controles {...{ dir, setDir }} />
      {ronda.mazo.length === 0 ? (
        <Vacio grupo={fijo ? "dificiles" : "todo"} />
      ) : ronda.fin ? (
        <Resultado ronda={ronda} />
      ) : (
        <>
          <Progreso pos={ronda.pos} total={ronda.mazo.length} aciertos={ronda.aciertos} />
          <div key={ronda.pos} className="pj-flip pj-in">
            <button
              className={volteada ? "pj-flip-in volteada" : "pj-flip-in"}
              onClick={() => setVolteada((v) => !v)}
              aria-label={volteada ? "Ver el término" : "Voltear tarjeta"}
              style={{ display: "block", width: "100%", height: 240, padding: 0, border: "none", background: "none", cursor: "pointer", textAlign: "left" }}
            >
              <span
                className="pj-cara"
                style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "26px 24px", boxSizing: "border-box", backgroundColor: C.card, border: `1px solid ${C.border}`, borderRadius: 14, boxShadow: "0 6px 18px rgba(38,48,58,.06)" }}
              >
                <Termino texto={pregunta(ronda.actual, dir)} idioma={idiomaDe(dir, "pregunta")} />
                <span style={{ fontFamily: sans, fontSize: 13.5, color: C.muted, marginTop: 16 }}>Toca la tarjeta para ver la traducción.</span>
              </span>
              <span
                className="pj-cara pj-reverso"
                style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 8, padding: "26px 24px", boxSizing: "border-box", backgroundColor: C.claySoft, border: "1px solid #F2D58E", borderRadius: 14, overflow: "auto" }}
              >
                <span style={{ fontFamily: sans, fontSize: 13, color: "#9A6200" }}>{idiomaDe(dir, "respuesta")}</span>
                <span style={{ fontFamily: serif, fontSize: 22, fontWeight: 600, lineHeight: 1.35, color: C.text }}>{respuesta(ronda.actual, dir)}</span>
              </span>
            </button>
          </div>
          {volteada && (
            <div className="pj-fade" style={{ display: "flex", gap: 10, marginTop: 16 }}>
              <Boton variante="mal" onClick={() => marcar(false)}><X size={17} /> Repasar</Boton>
              <Boton variante="bien" onClick={() => marcar(true)}><Check size={17} /> Lo sé</Boton>
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ---------- Opción múltiple ---------- */

export function OpcionMultipleView({ fijo, titulo = "Quiz" }) {
  const [dir, setDir] = useState("en");
  const [empezado, setEmpezado] = useState(!!fijo);
  const ronda = useRonda(fijo);
  const [elegida, setElegida] = useState(null);

  const opciones = useMemo(
    () => (ronda.actual ? shuffle([ronda.actual, ...trampas(ronda.actual, LIBRO, dir)]) : []),
    [ronda.actual, dir]
  );
  useEffect(() => setElegida(null), [ronda.pos, ronda.mazo]);

  const elegir = (o) => {
    if (elegida) return;
    setElegida(o);
    ronda.contestar(ronda.actual, o === ronda.actual);
  };

  if (!empezado)
    return (
      <Intro
        titulo="Quiz"
        pasos={["Escoge la traducción correcta entre las cuatro opciones.", "Cuidado: las otras tres son términos parecidos.", PASO_IDIOMA]}
        onEmpezar={() => setEmpezado(true)}
      />
    );

  return (
    <div>
      {fijo && <Titulo>{titulo}</Titulo>}
      {fijo && <div style={{ height: 14 }} />}
      <Controles {...{ dir, setDir }} />
      {ronda.mazo.length === 0 ? (
        <Vacio grupo={fijo ? "dificiles" : "todo"} />
      ) : ronda.fin ? (
        <Resultado ronda={ronda} />
      ) : (
        <>
          <Progreso pos={ronda.pos} total={ronda.mazo.length} aciertos={ronda.aciertos} />
          <div key={ronda.pos} className="pj-in">
            <Tarjeta>
              <Termino texto={pregunta(ronda.actual, dir)} idioma={idiomaDe(dir, "pregunta")} />
            </Tarjeta>
          </div>
          <div style={{ display: "grid", gap: 10, marginTop: 16 }}>
            {opciones.map((o, i) => {
              const correcta = o === ronda.actual;
              const bg = elegida && correcta ? C.successSoft : elegida === o ? C.errorSoft : C.card;
              const bd = elegida && correcta ? C.success : elegida === o ? C.error : C.border;
              return (
                <button
                  key={o.en}
                  className={elegida && correcta && elegida === ronda.actual ? "pj-pulso" : elegida === o && !correcta ? "pj-tiembla" : undefined}
                  onClick={() => elegir(o)}
                  disabled={!!elegida}
                  style={{ textAlign: "left", display: "flex", gap: 12, alignItems: "flex-start", fontFamily: sans, fontSize: 15.5, lineHeight: 1.35, color: C.text, backgroundColor: bg, border: `1px solid ${bd}`, borderRadius: 8, padding: "12px 14px", cursor: elegida ? "default" : "pointer", transition: "background-color .2s ease, border-color .2s ease" }}
                >
                  <span style={{ flexShrink: 0, width: 22, height: 22, borderRadius: "50%", backgroundColor: C.accentSoft, color: C.accent, fontSize: 12, fontWeight: 600, lineHeight: "22px", textAlign: "center" }}>{i + 1}</span>
                  <span style={{ flex: 1 }}>{principal(respuesta(o, dir))}</span>
                  {elegida && correcta && <Check size={18} color={C.success} style={{ flexShrink: 0 }} />}
                  {elegida === o && !correcta && <X size={18} color={C.error} style={{ flexShrink: 0 }} />}
                </button>
              );
            })}
          </div>
          {elegida && (
            <div className="pj-fade">
              <Aviso ok={elegida === ronda.actual}>
                {elegida === ronda.actual ? "Correcto. " : "La respuesta es "}
                <b style={{ color: C.text }}>{respuesta(ronda.actual, dir)}</b>
                {elegida !== ronda.actual && (
                  <>
                    <br />
                    Elegiste: {elegida.en} = {elegida.es}
                  </>
                )}
              </Aviso>
              <div style={{ marginTop: 14 }}>
                <Boton variante="primario" onClick={ronda.siguiente}>Siguiente</Boton>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ---------- Escribir ---------- */

export function EscribirView({ fijo, titulo = "Escribir" }) {
  const [dir, setDir] = useState("en");
  const [empezado, setEmpezado] = useState(!!fijo);
  const ronda = useRonda(fijo);
  const [texto, setTexto] = useState("");
  const [estado, setEstado] = useState(null); // null | "ok" | "casi" | "no"
  const campo = useRef(null);
  // Al empezar una sesión nueva se limpia la casilla.
  useEffect(() => {
    setTexto("");
    setEstado(null);
  }, [ronda.mazo]);

  // Se limpia en el mismo toque que avanza, así el teclado del celular sigue activo.
  const avanzar = () => {
    setTexto("");
    setEstado(null);
    ronda.siguiente();
    if (campo.current) campo.current.focus();
  };

  const comprobar = (saltar) => {
    if (estado) return;
    const r = saltar ? "no" : revisar(texto, respuesta(ronda.actual, dir));
    if (r === "vacio") return;
    setEstado(r);
    ronda.contestar(ronda.actual, r !== "no");
  };

  if (!empezado)
    return (
      <Intro
        titulo="Escribir"
        pasos={["Escribe la traducción del término que aparece en la tarjeta.", "Se acepta cualquiera de las traducciones del libro; no importan los acentos ni los artículos.", PASO_IDIOMA]}
        onEmpezar={() => setEmpezado(true)}
      />
    );

  return (
    <div>
      {fijo && <Titulo>{titulo}</Titulo>}
      {fijo && <div style={{ height: 14 }} />}
      <Controles {...{ dir, setDir }} />
      {ronda.mazo.length === 0 ? (
        <Vacio grupo={fijo ? "dificiles" : "todo"} />
      ) : ronda.fin ? (
        <Resultado ronda={ronda} />
      ) : (
        <>
          <Progreso pos={ronda.pos} total={ronda.mazo.length} aciertos={ronda.aciertos} />
          <div key={ronda.pos} className="pj-in">
            <Tarjeta>
              <Termino texto={pregunta(ronda.actual, dir)} idioma={idiomaDe(dir, "pregunta")} />
            </Tarjeta>
          </div>
          <input
            ref={campo}
            className={estado === "no" ? "pj-tiembla" : undefined}
            value={texto}
            onChange={(e) => !estado && setTexto(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), estado ? avanzar() : comprobar(false))}
            type="text"
            inputMode="text"
            enterKeyHint={estado ? "next" : "done"}
            autoCorrect="off"
            autoCapitalize="none"
            autoComplete="off"
            spellCheck={false}
            aria-label="Tu respuesta"
            placeholder={`Escribe la equivalencia en ${dir === "en" ? "español" : "inglés"}`}
            style={{ width: "100%", boxSizing: "border-box", marginTop: 16, fontFamily: sans, fontSize: 17, color: C.text, backgroundColor: C.card, border: `1px solid ${estado ? (estado === "no" ? C.error : C.success) : C.border}`, borderRadius: 8, padding: "12px 14px" }}
          />
          {!estado ? (
            <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
              <Boton variante="primario" onClick={() => comprobar(false)}>Comprobar</Boton>
              <Boton onClick={() => comprobar(true)}>No lo sé</Boton>
            </div>
          ) : (
            <div className="pj-fade">
              <Aviso ok={estado !== "no"}>
                {estado === "ok" ? "Correcto. " : estado === "casi" ? "Casi: revisa la ortografía. " : "Respuesta del libro: "}
                <b style={{ color: C.text }}>{respuesta(ronda.actual, dir)}</b>
              </Aviso>
              <div style={{ marginTop: 14 }}>
                <Boton variante="primario" onClick={avanzar}>Siguiente</Boton>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ---------- Relacionar ---------- */

function elegirPares(pool, dir) {
  const vistos = new Set();
  const pares = [];
  for (const t of shuffle(pool)) {
    const r = respuesta(t, dir);
    if (vistos.has(r) || vistos.has(pregunta(t, dir))) continue;
    vistos.add(r);
    vistos.add(pregunta(t, dir));
    pares.push(t);
    if (pares.length === 5) break;
  }
  return pares;
}

export function RelacionarView() {
  const [dir, setDir] = useState("en");
  const grupo = "todo";
  const [pares, setPares] = useState([]);
  const [derecha, setDerecha] = useState([]);
  const [sel, setSel] = useState(null);
  const [hechos, setHechos] = useState(new Set());
  const [error, setError] = useState(null);

  const nueva = () => {
    const p = elegirPares(poolDe(grupo), dir);
    setPares(p);
    setDerecha(shuffle(p));
    setSel(null);
    setHechos(new Set());
    setError(null);
  };
  useEffect(nueva, [grupo, dir]); // eslint-disable-line react-hooks/exhaustive-deps

  const tocarDerecha = (t) => {
    if (!sel || hechos.has(t)) return;
    if (sel === t) {
      registrar(t, true);
      setHechos(new Set([...hechos, t]));
    } else {
      registrar(sel, false);
      setError(t);
      setTimeout(() => setError(null), 500);
    }
    setSel(null);
  };

  const fin = pares.length > 0 && hechos.size === pares.length;
  const chip = (activo, malo) => ({
    fontFamily: sans,
    fontSize: 15,
    lineHeight: 1.35,
    textAlign: "left",
    padding: "11px 13px",
    borderRadius: 8,
    border: `1px solid ${activo ? C.accent : malo ? C.error : C.border}`,
    backgroundColor: activo ? C.accent : malo ? C.errorSoft : C.card,
    color: activo ? "#fff" : C.text,
    cursor: "pointer",
  });

  return (
    <div>
      <Titulo sub="Toca un término y luego su equivalencia.">Relacionar</Titulo>
      <div style={{ height: 16 }} />
      <Controles {...{ dir, setDir }} />
      {pares.length === 0 ? (
        <Vacio grupo={grupo} />
      ) : fin ? (
        <div style={{ backgroundColor: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 24 }}>
          <p style={{ fontFamily: serif, fontWeight: 600, fontSize: 24, color: C.text, margin: "0 0 14px 0" }}>Completaste estos 5 pares</p>
          <Boton variante="primario" onClick={nueva}>Otros 5 pares</Boton>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <p style={{ fontFamily: sans, fontSize: 13, color: C.muted, margin: 0 }}>{idiomaDe(dir, "pregunta")}</p>
            {pares.filter((t) => !hechos.has(t)).map((t) => (
              <button key={t.en} onClick={() => setSel(t)} aria-pressed={sel === t} style={{ ...chip(sel === t, false), fontWeight: 600 }}>
                {pregunta(t, dir)}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <p style={{ fontFamily: sans, fontSize: 13, color: C.muted, margin: 0 }}>{idiomaDe(dir, "respuesta")}</p>
            {derecha.filter((t) => !hechos.has(t)).map((t) => (
              <button key={t.en} onClick={() => tocarDerecha(t)} style={{ ...chip(false, error === t), opacity: sel ? 1 : 0.7 }}>
                {respuesta(t, dir)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Términos difíciles ---------- */

export function DificilesView() {
  const [datos, setDatos] = useState(() => cargarDificiles());
  const [modo, setModo] = useState(null);

  const lista = useMemo(
    () => LIBRO.filter((t) => datos[t.en]).map((t) => ({ ...t, fallas: datos[t.en] })).sort((a, b) => b.fallas - a.fallas),
    [datos]
  );
  const fijo = useMemo(() => LIBRO.filter((t) => datos[t.en]), [datos]);

  if (modo) {
    const volver = () => {
      setModo(null);
      setDatos(cargarDificiles());
    };
    const Vista = { tarjetas: TarjetasView, multiple: OpcionMultipleView, escribir: EscribirView }[modo];
    return (
      <div>
        <button onClick={volver} style={{ fontFamily: sans, fontSize: 14, color: C.accent, background: "none", border: "none", cursor: "pointer", padding: 0, marginBottom: 14 }}>
          Volver a la lista
        </button>
        <Vista fijo={fijo} titulo="Practicando tus términos difíciles" />
      </div>
    );
  }

  return (
    <div>
      <Titulo sub="Cada fallo suma uno y cada acierto resta uno; al llegar a cero el término sale de la lista. Se guarda solo en este navegador.">
        Términos difíciles
      </Titulo>
      {lista.length === 0 ? (
        <div style={{ marginTop: 20 }}>
          <Vacio grupo="dificiles" />
        </div>
      ) : (
        <>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, margin: "20px 0 16px 0" }}>
            <Boton variante="primario" onClick={() => setModo("escribir")}>Practicar escribiendo</Boton>
            <Boton onClick={() => setModo("multiple")}>Quiz</Boton>
            <Boton onClick={() => setModo("tarjetas")}>Tarjetas</Boton>
            <Boton
              onClick={() => {
                guardarDificiles({});
                setDatos({});
              }}
            >
              Vaciar lista
            </Boton>
          </div>
          <div style={{ backgroundColor: C.card, border: `1px solid ${C.border}`, borderRadius: 10, overflow: "hidden" }}>
            {lista.map((t, i) => (
              <div key={t.en} style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr) auto", gap: 12, alignItems: "center", padding: "10px 14px", borderTop: i ? `1px solid ${C.border}` : "none", fontFamily: sans, fontSize: 14.5 }}>
                <span style={{ fontWeight: 600, color: C.accent }}>{t.en}</span>
                <span style={{ color: C.text }}>{t.es}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: C.clayText }}>{t.fallas}×</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
