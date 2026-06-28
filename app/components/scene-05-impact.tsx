"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SceneState } from "../types";
import { SceneLayout } from "./scene-layout";
import { IMPACT_DOMAINS } from "../config";

export function Scene05Impact({ sceneState }: { sceneState: SceneState }) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useGSAP(() => {
    gsap.fromTo(containerRef.current, 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1.2, ease: "power2.out", delay: 0.2 }
    );
  }, []);

  const activeDomain = IMPACT_DOMAINS.find(
    d => d.id === (sceneState.activeImpactDomainId || sceneState.hoveredImpactDomainId)
  );

  return (
    <div className="absolute inset-0 pointer-events-none transition-opacity duration-700 opacity-100">
      <SceneLayout>
        <div ref={containerRef} className="relative w-full h-[300px]">
          
          {/* Default Content */}
          <div className={`absolute inset-0 transition-all duration-700 origin-left ${activeDomain ? 'opacity-0 scale-95 pointer-events-none blur-md' : 'opacity-100 scale-100 blur-0'}`}>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-[-0.02em] text-white leading-[1.05] text-balance">
              Engineering <br className="hidden md:block" /> Impact.
            </h2>
            
            <p className="mt-6 text-lg text-zinc-400 font-light leading-relaxed text-balance max-w-md">
              The pipeline culminates in tangible outcomes. Hover the impact domains to explore how intelligent engineering drives real-world capabilities.
            </p>
          </div>

          {/* Active Domain Content */}
          {IMPACT_DOMAINS.map(domain => {
            const isActive = domain.id === activeDomain?.id;
            return (
              <div 
                key={domain.id} 
                className={`absolute inset-0 transition-all duration-700 origin-left ${isActive ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-95 pointer-events-none blur-md'}`}
              >
                <div className="inline-flex items-center space-x-2 mb-4">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: domain.color, boxShadow: `0 0 10px ${domain.color}` }}></span>
                  <span className="text-xs font-bold tracking-widest uppercase text-white" style={{ color: domain.color }}>
                    Impact Domain
                  </span>
                </div>

                <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-[-0.02em] text-white leading-[1.05] text-balance">
                  {domain.title}
                </h2>
                
                <p className="mt-6 text-lg text-zinc-300 font-light leading-relaxed text-balance max-w-md">
                  {domain.desc}
                </p>

                <div className="mt-8 border-t border-white/10 pt-6">
                  <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-4 block">Key Deliverables</span>
                  <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                    {domain.examples.map((example, i) => (
                      <div key={i} className="text-sm text-zinc-200 flex items-center">
                        <span className="w-1.5 h-1.5 rounded-sm mr-3 opacity-50" style={{ backgroundColor: domain.color }}></span>
                        {example}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}

        </div>
      </SceneLayout>
    </div>
  );
}
