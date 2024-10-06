"use client";
import { useState, useEffect } from "react";
import AFrameAsteroidViewer from "./AFrameAsteroidViewer";
import { Section2 } from "./_components/sec2";

export default function Home() {
  const [showAFrame, setShowAFrame] = useState(false); // Estado para controlar si mostramos AFrame

  useEffect(() => {
    if (showAFrame) {
      const script = document.createElement("script");
      script.src = "https://aframe.io/releases/1.2.0/aframe.min.js";
      script.async = true;
      document.body.appendChild(script);

      // Cleanup function to remove the script when the component unmounts
      return () => {
        document.body.removeChild(script);
      };
    }
  }, [showAFrame]); // El efecto se ejecutará solo cuando showAFrame cambie

  return (
    <main className="w-full min-h-screen bg-white">
      <Section2 />
      <div className="mt-8 flex justify-center gap-5">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => setShowAFrame(true)} // Cambia el estado para mostrar AFrame
        >
          Ver Asteroides en A-Frame
        </button>
      </div>

      {showAFrame && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <AFrameAsteroidViewer />
          <button
            className="absolute top-4 right-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => setShowAFrame(false)} // Botón para cerrar el AFrame
          >
            Cerrar A-Frame
          </button>
        </div>
      )}
    </main>
  );
}
