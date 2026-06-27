"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SceneState } from "../types";

export function Scene04Pipeline({ sceneState }: { sceneState: SceneState }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(containerRef.current, 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1.2, ease: "power2.out", delay: 0.2 }
    );
  }, []);

  const isHidden = sceneState.activePipelineStageId !== null;

  return (
    <div className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ${isHidden ? 'opacity-0' : 'opacity-100'}`}>
      <div ref={containerRef} className="absolute top-[15%] md:top-[25%] left-6 md:left-20 max-w-[90%] md:max-w-[450px]">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-[-0.02em] text-white leading-[1.05] text-balance">
          Engineering With Purpose.
        </h2>
        
        <p className="mt-6 text-lg text-zinc-400 font-light leading-relaxed text-balance">
          Great software is not built by chance. Every successful system is the result of structured thinking, disciplined execution, continuous validation, and long-term evolution.
        </p>
      </div>
    </div>
  );
}
