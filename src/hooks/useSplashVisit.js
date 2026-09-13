// src/hooks/useSplashVisit.js
// Controla cuándo se muestra la pantalla de bienvenida (splash) con el logo:
// aparece en la visita 1 y en la visita 4, y el contador se reinicia después de la 4.
import { useState, useEffect } from "react";

const KEY = "palabra-justa-visit-count";

export function useSplashVisit() {
  const [showSplash, setShowSplash] = useState(false);

  useEffect(() => {
    let count = 1;
    try {
      const stored = window.localStorage.getItem(KEY);
      count = stored ? parseInt(stored, 10) + 1 : 1;
      if (count > 4) count = 1;
      window.localStorage.setItem(KEY, String(count));
    } catch (e) {
      // localStorage no disponible (modo privado, etc.) — no mostramos splash.
      count = 0;
    }
    setShowSplash(count === 1 || count === 4);
  }, []);

  const dismiss = () => setShowSplash(false);

  return { showSplash, dismiss };
}
