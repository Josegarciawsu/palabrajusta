// src/components/SplashScreen.jsx
import { useEffect, useState } from "react";
import Logo from "./Logo.jsx";

export default function SplashScreen({ onDone }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const fadeIn = setTimeout(() => setVisible(true), 30);
    const fadeOut = setTimeout(() => setVisible(false), 1400);
    const finish = setTimeout(() => onDone(), 1800);
    return () => {
      clearTimeout(fadeIn);
      clearTimeout(fadeOut);
      clearTimeout(finish);
    };
  }, [onDone]);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white transition-opacity duration-500"
      style={{ opacity: visible ? 1 : 0 }}
    >
      <Logo size={84} />
      <p className="font-serif text-2xl text-gray-900 mt-5">Palabra Justa</p>
      <p className="text-sm text-gray-400 mt-1">
        Certificación de intérprete judicial
      </p>
    </div>
  );
}
