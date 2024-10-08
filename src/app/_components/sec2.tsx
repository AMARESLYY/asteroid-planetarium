"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export const Section2 = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100); 

    return () => clearTimeout(timer); 
  }, []);

  return (
    <section className="w-full h-screen flex items-start justify-start md:py-28 lg:py-32 xl:py-48 px-5 relative bg-[url('/universo.png')]">
      <div className="w-full h-full items-start justify-start gap-y-4 gap-5 z-20">
        <p
          className={`text-xl md:text-6xl text-background font-bold text-left transition-transform duration-1000 ${
            isVisible ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
          }`}
        >
          Orrery X
        </p>
        <p className="text-xl md:text-2xl lg:text-4xl text-pretty text-bold antialiased tracking-wide text-background text-left md:mt-4">
         Window to the Interactive Cosmos
        </p>
      </div>
    </section>
  );
};