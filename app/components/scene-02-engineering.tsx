"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SceneLayout } from "./scene-layout";

export function Scene02Engineering() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(containerRef.current, 
      { opacity: 0, x: -30 },
      { opacity: 1, x: 0, duration: 1.2, ease: "power2.out", delay: 0.2 }
    );
  }, []);

  return (
    <SceneLayout>
      <div ref={containerRef}>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-[-0.02em] text-white leading-[1.05] text-balance">
          Engineering Clarity<br className="hidden md:block" /> From Complexity.
        </h2>
        
        <p className="mt-6 text-lg text-zinc-400 font-light leading-relaxed text-balance">
          We build intelligent digital systems designed for precision, performance, and long-term stability. Hover the active network nodes to explore our principles.
        </p>
      </div>
    </SceneLayout>
  );
}
