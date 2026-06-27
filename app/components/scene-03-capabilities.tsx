"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SceneState } from "../types";

export function Scene03Capabilities({ sceneState }: { sceneState: SceneState }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(containerRef.current, 
      { opacity: 0, x: 30 },
      { opacity: 1, x: 0, duration: 1.2, ease: "power2.out", delay: 0.2 }
    );
  }, []);

  // When a domain is selected, hide the general headline
  const isHidden = sceneState.activeDomainId !== null;

  return (
    <div className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ${isHidden ? 'opacity-0' : 'opacity-100'}`}>
      <div ref={containerRef} className="absolute top-[15%] md:top-[30%] left-6 right-6 md:left-auto md:right-20 max-w-[90%] md:max-w-[450px] md:text-right">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-[-0.02em] text-white leading-[1.05] text-balance">
          Engineering Intelligent Systems.
        </h2>
        
        <p className="mt-6 text-lg text-zinc-400 font-light leading-relaxed text-balance">
          From artificial intelligence to cloud infrastructure, we design and engineer scalable digital ecosystems built for long-term success. Select an engineering domain to explore.
        </p>
      </div>
    </div>
  );
}
