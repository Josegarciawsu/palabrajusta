// src/App.jsx
import { useState } from "react";
import Sidebar from "./components/Sidebar.jsx";
import SplashScreen from "./components/SplashScreen.jsx";
import ResumenView from "./components/ResumenView.jsx";
import SemanaView from "./components/SemanaView.jsx";
import GlosarioView from "./components/GlosarioView.jsx";
import TarjetasView from "./components/TarjetasView.jsx";
import RelacionarView from "./components/RelacionarView.jsx";
import QuizView from "./components/QuizView.jsx";
import CasoView from "./components/CasoView.jsx";
import RecursosView from "./components/RecursosView.jsx";
import { useSplashVisit } from "./hooks/useSplashVisit.js";
import { useProgress } from "./hooks/useProgress.js";
import { semanasPorId } from "./data/index.js";

export default function App() {
  const { showSplash, dismiss } = useSplashVisit();
  const { quizScores, learnedTerms, recordQuizScore, toggleLearned } =
    useProgress();
  const [view, setView] = useState("resumen");

  if (showSplash) {
    return <SplashScreen onDone={dismiss} />;
  }

  const renderView = () => {
    if (semanasPorId[view]) {
      return <SemanaView semana={semanasPorId[view]} />;
    }
    switch (view) {
      case "resumen":
        return <ResumenView quizScores={quizScores} onNavigate={setView} />;
      case "glosario":
        return <GlosarioView />;
      case "tarjetas":
        return (
          <TarjetasView
            learnedTerms={learnedTerms}
            toggleLearned={toggleLearned}
          />
        );
      case "relacionar":
        return <RelacionarView />;
      case "quiz":
        return <QuizView recordQuizScore={recordQuizScore} />;
      case "caso":
        return <CasoView />;
      case "recursos":
        return <RecursosView />;
      default:
        return <ResumenView quizScores={quizScores} onNavigate={setView} />;
    }
  };

  return (
    <div className="app-shell flex min-h-screen font-sans bg-content">
      <Sidebar view={view} onNavigate={setView} />
      <main className="app-main flex-1 min-w-0 p-5 md:p-10 lg:p-12 overflow-y-auto">
        <div className="mx-auto w-full max-w-[1080px]">{renderView()}</div>
      </main>
    </div>
  );
}
