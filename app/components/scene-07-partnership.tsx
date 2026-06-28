"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SceneState } from "../types";
import { SceneLayout } from "./scene-layout";
import { PARTNERSHIP_STAGES } from "../config";

export function Scene07Partnership({ sceneState }: { sceneState: SceneState }) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useGSAP(() => {
    gsap.fromTo(containerRef.current, 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1.2, ease: "power2.out", delay: 0.2 }
    );
  }, []);

  const activeStageId = sceneState.activePartnershipStageId || sceneState.hoveredPartnershipStageId;
  const activeStage = PARTNERSHIP_STAGES.find(s => s.id === activeStageId);

  return (
    <div className="absolute inset-0 pointer-events-none transition-opacity duration-700 opacity-100">
      <SceneLayout>
        <div ref={containerRef} className="relative w-full h-[400px]">
          
          <div className="inline-flex items-center space-x-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-[#3B82F6] shadow-[0_0_10px_#3B82F6]"></span>
            <span className="text-xs font-bold tracking-widest uppercase text-[#3B82F6]">
              Client Engagement
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-[-0.02em] text-white leading-[1.05] text-balance">
            Engineering Partnerships <br className="hidden md:block" /> Built for the Long Term.
          </h2>
          
          <div className="mt-8 relative h-[100px]">
            {/* Default Introduction Text */}
            <p className={`absolute inset-0 text-lg text-zinc-400 font-light leading-relaxed text-balance max-w-md transition-opacity duration-500 ${activeStage ? 'opacity-0' : 'opacity-100'}`}>
              We work as an extension of your engineering team, delivering systems that continue to evolve long after deployment. Discover our collaborative engineering process.
            </p>

            {/* Active Stage Text */}
            {PARTNERSHIP_STAGES.map((stage) => (
              <div 
                key={stage.id} 
                className={`absolute inset-0 transition-opacity duration-500 ${activeStage?.id === stage.id ? 'opacity-100' : 'opacity-0'}`}
              >
                <h3 className="text-2xl font-medium text-[#00E38C] mb-2">{stage.title}</h3>
                <p className="text-lg text-zinc-300 font-light leading-relaxed text-balance max-w-md">
                  {stage.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </SceneLayout>
    </div>
  );
}
