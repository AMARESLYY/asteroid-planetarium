"use client"
import { useState, useEffect } from "react";
import AFrameAsteroidViewer from "../AFrameAsteroidViewer";

export default function Section3() {
  const [showAFrame, setShowAFrame] = useState(false); 

  useEffect(() => {
    if (showAFrame) {
      const script = document.createElement("script");
      script.src = "https://aframe.io/releases/1.2.0/aframe.min.js";
      script.async = true;
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [showAFrame]); 

  return (
    <section className="w-full min-h-screen bg-black items-center justify-center flex flex-col">
      <div className="mt-8 flex justify-center gap-5">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => setShowAFrame(true)} 
        >
          Ver Asteroides en A-Frame
        </button>
      </div>

      {showAFrame && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <AFrameAsteroidViewer />
          <button
            className="absolute top-4 right-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => setShowAFrame(false)} 
          >
            Cerrar A-Frame
          </button>
        </div>
      )}
    </section>
  );
}
