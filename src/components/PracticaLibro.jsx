// src/components/PracticaLibro.jsx
// Glosario y modos de práctica con el glosario del libro (inglés ↔ español).
import { useState, useMemo, useEffect } from "react";
import { Check, X, Star } from "lucide-react";
import LIBRO from "../data/glosarioLibro.js";
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
      <h1 style={{ fontFamily: serif, fontWeight: 600, color: C.text, fontSize: 33, lineHeight: 1.15, margin: 0 }}>
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

function Controles({ dir, setDir, grupo, setGrupo, cantidad, setCantidad }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px 16px", alignItems: "center", margin: "20px 0 18px 0", fontFamily: sans, fontSize: 14, color: C.muted }}>
      <Segmento
        etiqueta="Dirección"
        valor={dir}
        onChange={setDir}
        opciones={[["en", "Inglés → Español"], ["es", "Español → Inglés"]]}
      />
      <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
        Grupo
        <select value={grupo} onChange={(e) => setGrupo(e.target.value)} style={selectStyle}>
          {GRUPOS.map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>
      </label>
      {setCantidad && (
        <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
          Términos
          <select value={cantidad} onChange={(e) => setCantidad(e.target.value)} style={selectStyle}>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="todos">Todos</option>
          </select>
        </label>
      )}
    </div>
  );
}

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

// Ronda de práctica compartida por Tarjetas, Opción múltiple y Escribir.
function useRonda(grupo, cantidad, fijo) {
  const armar = (lista) => {
    const base = lista || fijo || poolDe(grupo);
    const n = cantidad === "todos" ? base.length : Number(cantidad);
    return shuffle(base).slice(0, n);
  };
  const [mazo, setMazo] = useState(() => armar());
  const [pos, setPos] = useState(0);
  const [aciertos, setAciertos] = useState(0);
  const [fallas, setFallas] = useState([]);

  const reiniciar = (lista) => {
    setMazo(armar(lista));
    setPos(0);
    setAciertos(0);
    setFallas([]);
  };
  useEffect(() => reiniciar(), [grupo, cantidad]); // eslint-disable-line react-hooks/exhaustive-deps

  const contestar = (t, ok) => {
    registrar(t, ok);
    if (ok) setAciertos((a) => a + 1);
    else setFallas((f) => (f.includes(t) ? f : [...f, t]));
  };
  const siguiente = () => setPos((p) => p + 1);
  return { mazo, pos, aciertos, fallas, contestar, siguiente, reiniciar, actual: mazo[pos], fin: pos >= mazo.length };
}

function Resultado({ ronda }) {
  const { mazo, aciertos, fallas, reiniciar } = ronda;
  const pct = Math.round((aciertos / mazo.length) * 100);
  return (
    <div style={{ backgroundColor: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 24 }}>
      <p style={{ fontFamily: serif, fontWeight: 600, fontSize: 40, lineHeight: 1, color: C.text, margin: 0 }}>
        {aciertos} de {mazo.length}
      </p>
      <p style={{ fontFamily: sans, fontSize: 15, color: C.muted, margin: "8px 0 16px 0" }}>
        {pct}% correctas.{" "}
        {fallas.length ? "Los términos que fallaste se sumaron a Términos difíciles." : "Sin errores en esta ronda."}
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
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {fallas.length > 0 && (
          <Boton variante="primario" onClick={() => reiniciar(fallas)}>Repasar las falladas</Boton>
        )}
        <Boton variante={fallas.length ? "secundario" : "primario"} onClick={() => reiniciar()}>Nueva ronda</Boton>
      </div>
    </div>
  );
}

const idiomaDe = (dir, lado) =>
  (dir === "en") === (lado === "pregunta") ? "Inglés" : "Español";

/* ---------- Glosario ---------- */

export function GlosarioView({ referencia, juvenil }) {
  const [fuente, setFuente] = useState("libro");
  const [q, setQ] = useState("");
  const [letra, setLetra] = useState(null);
  const [abierto, setAbierto] = useState(null);
  const [dificiles, setDificiles] = useState(() => cargarDificiles());

  const lista = fuente === "libro" ? LIBRO : fuente === "courts" ? referencia : juvenil;
  const primera = (t) => (fuente === "libro" ? letterOf(t) : t.term[0].toUpperCase());
  const letras = useMemo(() => [...new Set(lista.map(primera))].sort(), [lista]); // eslint-disable-line react-hooks/exhaustive-deps

  const filtrados = useMemo(() => {
    const nq = norm(q);
    return lista.filter((t) => {
      if (letra && primera(t) !== letra) return false;
      if (!nq) return true;
      const texto = fuente === "libro" ? t.en + " " + t.es : t.term + " " + t.definition;
      return norm(texto).includes(nq);
    });
  }, [lista, q, letra, fuente]); // eslint-disable-line react-hooks/exhaustive-deps

  function cambiarFuente(f) {
    setFuente(f);
    setLetra(null);
    setAbierto(null);
  }

  return (
    <div>
      <Titulo sub="Busca en inglés o en español, o navega por letra.">Glosario jurídico</Titulo>

      <div style={{ marginTop: 20 }}>
        <Segmento
          etiqueta="Fuente del glosario"
          valor={fuente}
          onChange={cambiarFuente}
          opciones={[
            ["libro", `Procesos penales · ${LIBRO.length}`],
            ["courts", `U.S. Courts · ${referencia.length}`],
            ["juvenil", `Corte Juvenil · ${juvenil.length}`],
          ]}
        />
      </div>
      <p style={{ fontFamily: sans, fontSize: 13.5, color: C.muted, margin: "10px 0 0 0", lineHeight: 1.5 }}>
        {fuente === "libro"
          ? "Equivalencias según El inglés jurídico norteamericano, cap. 6 (pp. 125–154). Es el glosario que usan todos los modos de práctica."
          : fuente === "courts"
          ? "Glosario de términos de los tribunales federales (uscourts.gov), con definiciones en inglés."
          : "Glosario de la Corte Juvenil de Utah, con definiciones en inglés."}
      </p>

      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={fuente === "libro" ? "Buscar en inglés o español" : "Buscar término o definición"}
        aria-label="Buscar"
        style={{ width: "100%", marginTop: 16, fontFamily: sans, fontSize: 16, color: C.text, backgroundColor: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 12px", boxSizing: "border-box" }}
      />

      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 12 }}>
        {[null, ...letras].map((l) => (
          <button
            key={l || "todas"}
            onClick={() => setLetra(l)}
            aria-pressed={letra === l}
            style={{
              fontFamily: sans,
              fontSize: 13.5,
              padding: "4px 9px",
              borderRadius: 6,
              border: `1px solid ${letra === l ? C.accent : C.border}`,
              backgroundColor: letra === l ? C.accent : C.card,
              color: letra === l ? "#fff" : C.muted,
              cursor: "pointer",
            }}
          >
            {l || "Todas"}
          </button>
        ))}
      </div>

      <p style={{ fontFamily: sans, fontSize: 13, color: C.muted, margin: "14px 0 8px 0" }}>
        {filtrados.length} términos
        {fuente === "libro" && ` · ${Object.keys(dificiles).length} en Términos difíciles`}
      </p>

      {filtrados.length === 0 ? (
        <p style={{ fontFamily: sans, fontSize: 15, color: C.muted }}>Ningún término coincide con la búsqueda.</p>
      ) : fuente === "libro" ? (
        <div style={{ backgroundColor: C.card, border: `1px solid ${C.border}`, borderRadius: 10, overflow: "hidden" }}>
          {filtrados.map((t, i) => (
            <div
              key={t.en}
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr) 32px",
                gap: 12,
                alignItems: "center",
                padding: "9px 12px 9px 14px",
                borderTop: i ? `1px solid ${C.border}` : "none",
                backgroundColor: i % 2 ? C.accentSoft : C.card,
                fontFamily: sans,
                fontSize: 14.5,
              }}
            >
              <span style={{ fontWeight: 600, color: C.accent }}>{t.en}</span>
              <span style={{ color: C.text }}>{t.es}</span>
              <button
                onClick={() => {
                  alternarDificil(t);
                  setDificiles(cargarDificiles());
                }}
                aria-label={dificiles[t.en] ? `Quitar ${t.en} de difíciles` : `Marcar ${t.en} como difícil`}
                style={{ background: "none", border: "none", cursor: "pointer", color: C.clay, padding: 4, display: "flex" }}
              >
                <Star size={17} fill={dificiles[t.en] ? C.clay : "none"} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filtrados.map((t) => {
            const open = abierto === t.term;
            return (
              <div key={t.term} style={{ backgroundColor: C.card, border: `1px solid ${C.border}`, borderRadius: 8 }}>
                <button
                  onClick={() => setAbierto(open ? null : t.term)}
                  aria-expanded={open}
                  style={{ width: "100%", textAlign: "left", padding: "12px 14px", fontFamily: sans, fontSize: 15.5, color: C.text, background: "none", border: "none", cursor: "pointer" }}
                >
                  {t.term}
                </button>
                {open && (
                  <p style={{ fontFamily: sans, fontSize: 14.5, color: C.muted, lineHeight: 1.5, margin: 0, padding: "0 14px 14px 14px" }}>
                    {t.definition}
                  </p>
                )}
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
  const [grupo, setGrupo] = useState("todo");
  const [cantidad, setCantidad] = useState("20");
  const ronda = useRonda(grupo, cantidad, fijo);
  const [volteada, setVolteada] = useState(false);
  useEffect(() => setVolteada(false), [ronda.pos, ronda.mazo]);

  const marcar = (ok) => {
    ronda.contestar(ronda.actual, ok);
    ronda.siguiente();
  };

  return (
    <div>
      <Titulo sub="Mira el término, voltea la tarjeta y di si lo sabías.">{titulo}</Titulo>
      {fijo ? <div style={{ height: 20 }} /> : <Controles {...{ dir, setDir, grupo, setGrupo, cantidad, setCantidad }} />}
      {ronda.mazo.length === 0 ? (
        <Vacio grupo={grupo} />
      ) : ronda.fin ? (
        <Resultado ronda={ronda} />
      ) : (
        <>
          <Progreso pos={ronda.pos} total={ronda.mazo.length} aciertos={ronda.aciertos} />
          <Tarjeta borde={volteada ? C.clay : C.accent} onClick={() => setVolteada(true)} etiqueta="Voltear tarjeta">
            <Termino texto={pregunta(ronda.actual, dir)} idioma={idiomaDe(dir, "pregunta")} />
            {volteada ? (
              <p style={{ fontFamily: serif, fontSize: 20, lineHeight: 1.4, color: C.accent, margin: "18px 0 0 0", paddingTop: 16, borderTop: `1px dashed ${C.border}` }}>
                {respuesta(ronda.actual, dir)}
              </p>
            ) : (
              <p style={{ fontFamily: sans, fontSize: 13.5, color: C.muted, margin: "16px 0 0 0" }}>Toca la tarjeta para ver la respuesta.</p>
            )}
          </Tarjeta>
          {volteada && (
            <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
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

function distractores(t, dir) {
  const r = respuesta(t, dir);
  const largo = r.length;
  const candidatos = shuffle(LIBRO.filter((x) => x !== t && respuesta(x, dir) !== r));
  candidatos.sort((a, b) => Math.abs(respuesta(a, dir).length - largo) - Math.abs(respuesta(b, dir).length - largo));
  return shuffle(candidatos.slice(0, 12)).slice(0, 3);
}

export function OpcionMultipleView({ fijo, titulo = "Opción múltiple" }) {
  const [dir, setDir] = useState("en");
  const [grupo, setGrupo] = useState("todo");
  const [cantidad, setCantidad] = useState("20");
  const ronda = useRonda(grupo, cantidad, fijo);
  const [elegida, setElegida] = useState(null);

  const opciones = useMemo(
    () => (ronda.actual ? shuffle([ronda.actual, ...distractores(ronda.actual, dir)]) : []),
    [ronda.actual, dir]
  );
  useEffect(() => setElegida(null), [ronda.pos, ronda.mazo]);

  const elegir = (o) => {
    if (elegida) return;
    setElegida(o);
    ronda.contestar(ronda.actual, o === ronda.actual);
  };

  return (
    <div>
      <Titulo sub="Elige la equivalencia correcta entre cuatro opciones.">{titulo}</Titulo>
      {fijo ? <div style={{ height: 20 }} /> : <Controles {...{ dir, setDir, grupo, setGrupo, cantidad, setCantidad }} />}
      {ronda.mazo.length === 0 ? (
        <Vacio grupo={grupo} />
      ) : ronda.fin ? (
        <Resultado ronda={ronda} />
      ) : (
        <>
          <Progreso pos={ronda.pos} total={ronda.mazo.length} aciertos={ronda.aciertos} />
          <Tarjeta>
            <Termino texto={pregunta(ronda.actual, dir)} idioma={idiomaDe(dir, "pregunta")} />
          </Tarjeta>
          <div style={{ display: "grid", gap: 10, marginTop: 16 }}>
            {opciones.map((o, i) => {
              const correcta = o === ronda.actual;
              const bg = elegida && correcta ? C.successSoft : elegida === o ? C.errorSoft : C.card;
              const bd = elegida && correcta ? C.success : elegida === o ? C.error : C.border;
              return (
                <button
                  key={o.en}
                  onClick={() => elegir(o)}
                  disabled={!!elegida}
                  style={{ textAlign: "left", display: "flex", gap: 12, alignItems: "flex-start", fontFamily: sans, fontSize: 15.5, lineHeight: 1.35, color: C.text, backgroundColor: bg, border: `1px solid ${bd}`, borderRadius: 8, padding: "12px 14px", cursor: elegida ? "default" : "pointer" }}
                >
                  <span style={{ flexShrink: 0, width: 22, height: 22, borderRadius: "50%", backgroundColor: C.accentSoft, color: C.accent, fontSize: 12, fontWeight: 600, lineHeight: "22px", textAlign: "center" }}>{i + 1}</span>
                  <span style={{ flex: 1 }}>{respuesta(o, dir)}</span>
                  {elegida && correcta && <Check size={18} color={C.success} style={{ flexShrink: 0 }} />}
                  {elegida === o && !correcta && <X size={18} color={C.error} style={{ flexShrink: 0 }} />}
                </button>
              );
            })}
          </div>
          {elegida && (
            <>
              <Aviso ok={elegida === ronda.actual}>
                {elegida === ronda.actual ? "Correcto." : <>La respuesta es <b style={{ color: C.text }}>{respuesta(ronda.actual, dir)}</b>.</>}
              </Aviso>
              <div style={{ marginTop: 14 }}>
                <Boton variante="primario" onClick={ronda.siguiente}>Siguiente</Boton>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

/* ---------- Escribir ---------- */

export function EscribirView({ fijo, titulo = "Escribir" }) {
  const [dir, setDir] = useState("en");
  const [grupo, setGrupo] = useState("todo");
  const [cantidad, setCantidad] = useState("20");
  const ronda = useRonda(grupo, cantidad, fijo);
  const [texto, setTexto] = useState("");
  const [estado, setEstado] = useState(null); // null | "ok" | "casi" | "no"
  useEffect(() => {
    setTexto("");
    setEstado(null);
  }, [ronda.pos, ronda.mazo]);

  const comprobar = (saltar) => {
    if (estado) return;
    const r = saltar ? "no" : revisar(texto, respuesta(ronda.actual, dir));
    if (r === "vacio") return;
    setEstado(r);
    ronda.contestar(ronda.actual, r !== "no");
  };

  return (
    <div>
      <Titulo sub="Escribe la equivalencia. Se acepta cualquiera de las que da el libro, sin importar acentos ni artículos.">{titulo}</Titulo>
      {fijo ? <div style={{ height: 20 }} /> : <Controles {...{ dir, setDir, grupo, setGrupo, cantidad, setCantidad }} />}
      {ronda.mazo.length === 0 ? (
        <Vacio grupo={grupo} />
      ) : ronda.fin ? (
        <Resultado ronda={ronda} />
      ) : (
        <>
          <Progreso pos={ronda.pos} total={ronda.mazo.length} aciertos={ronda.aciertos} />
          <Tarjeta>
            <Termino texto={pregunta(ronda.actual, dir)} idioma={idiomaDe(dir, "pregunta")} />
          </Tarjeta>
          <input
            key={ronda.pos}
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (estado ? ronda.siguiente() : comprobar(false))}
            readOnly={!!estado}
            autoFocus
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
            <>
              <Aviso ok={estado !== "no"}>
                {estado === "ok" ? "Correcto. " : estado === "casi" ? "Casi: revisa la ortografía. " : "Respuesta del libro: "}
                <b style={{ color: C.text }}>{respuesta(ronda.actual, dir)}</b>
              </Aviso>
              <div style={{ marginTop: 14 }}>
                <Boton variante="primario" onClick={ronda.siguiente}>Siguiente</Boton>
              </div>
            </>
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
  const [grupo, setGrupo] = useState("todo");
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
      <Controles {...{ dir, setDir, grupo, setGrupo }} />
      {pares.length === 0 ? (
        <Vacio grupo={grupo} />
      ) : fin ? (
        <div style={{ backgroundColor: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 24 }}>
          <p style={{ fontFamily: serif, fontWeight: 600, fontSize: 24, color: C.text, margin: "0 0 14px 0" }}>Tanda completa</p>
          <Boton variante="primario" onClick={nueva}>Nueva tanda</Boton>
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
            <Boton onClick={() => setModo("multiple")}>Opción múltiple</Boton>
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
                <span style={{ fontSize: 13, fontWeight: 600, color: C.clay }}>{t.fallas}×</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
