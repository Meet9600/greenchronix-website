"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SceneState } from "../types";
import { SceneLayout } from "./scene-layout";

export function Scene03Capabilities({ sceneState }: { sceneState: SceneState }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(containerRef.current, 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1.2, ease: "power2.out", delay: 0.2 }
    );
  }, []);

  const isHidden = sceneState.activeDomainId !== null;

  return (
    <div className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ${isHidden ? 'opacity-0' : 'opacity-100'}`}>
      <SceneLayout>
        <div ref={containerRef}>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-[-0.02em] text-white leading-[1.05] text-balance">
            Engineering <br className="hidden md:block" /> Universe.
          </h2>
          
          <p className="mt-6 text-lg text-zinc-400 font-light leading-relaxed text-balance">
            Our capabilities are interconnected domains. Select an engineering domain in the 3D space to explore our specific expertise and strategic approach.
          </p>
        </div>
      </SceneLayout>
    </div>
  );
}
