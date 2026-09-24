// Guarda las grabaciones en IndexedDB (localStorage es muy pequeño para audio).
const DB = "palabra-justa-audio";
const STORE = "grabaciones";

function abrir() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function tx(modo, fn) {
  const db = await abrir();
  return new Promise((resolve, reject) => {
    const t = db.transaction(STORE, modo);
    const r = fn(t.objectStore(STORE));
    t.oncomplete = () => resolve(r && r.result);
    t.onerror = () => reject(t.error);
  });
}

export const claveAudio = (intentoId, turno) => `${intentoId}:${turno}`;

export const guardarAudio = (clave, blob) => tx("readwrite", (s) => s.put(blob, clave));
export const leerAudio = (clave) => tx("readonly", (s) => s.get(clave));

export async function borrarAudiosDeIntento(intentoId) {
  const db = await abrir();
  return new Promise((resolve, reject) => {
    const t = db.transaction(STORE, "readwrite");
    const req = t.objectStore(STORE).openCursor();
    req.onsuccess = () => {
      const c = req.result;
      if (!c) return;
      if (String(c.key).startsWith(`${intentoId}:`)) c.delete();
      c.continue();
    };
    t.oncomplete = () => resolve();
    t.onerror = () => reject(t.error);
  });
}
