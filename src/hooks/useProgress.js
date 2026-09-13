// src/hooks/useProgress.js
// Guarda el progreso del usuario en localStorage: mejor puntaje de quiz por semana,
// y qué términos ha marcado como "aprendidos" en Tarjetas.
import { useState, useCallback } from "react";

const QUIZ_KEY = "palabra-justa-quiz-scores";
const LEARNED_KEY = "palabra-justa-learned-terms";

function readJSON(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}

function writeJSON(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    // Ignorar si localStorage no está disponible.
  }
}

export function useProgress() {
  const [quizScores, setQuizScores] = useState(() => readJSON(QUIZ_KEY, {}));
  const [learnedTerms, setLearnedTerms] = useState(() =>
    readJSON(LEARNED_KEY, [])
  );

  const recordQuizScore = useCallback((semanaId, score, total) => {
    setQuizScores((prev) => {
      const best = prev[semanaId]?.score ?? -1;
      const next = {
        ...prev,
        [semanaId]:
          score > best ? { score, total } : prev[semanaId] || { score, total },
      };
      writeJSON(QUIZ_KEY, next);
      return next;
    });
  }, []);

  const toggleLearned = useCallback((termEn) => {
    setLearnedTerms((prev) => {
      const next = prev.includes(termEn)
        ? prev.filter((t) => t !== termEn)
        : [...prev, termEn];
      writeJSON(LEARNED_KEY, next);
      return next;
    });
  }, []);

  return { quizScores, learnedTerms, recordQuizScore, toggleLearned };
}
