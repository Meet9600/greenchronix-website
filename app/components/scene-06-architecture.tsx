"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SceneState } from "../types";
import { SceneLayout } from "./scene-layout";
import { ARCHITECTURE_LAYERS } from "../config";

export function Scene06Architecture({ sceneState }: { sceneState: SceneState }) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useGSAP(() => {
    gsap.fromTo(containerRef.current, 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1.2, ease: "power2.out", delay: 0.2 }
    );
  }, []);

  const activeLayer = ARCHITECTURE_LAYERS.find(
    l => l.id === (sceneState.activeArchitectureLayerId || sceneState.hoveredArchitectureLayerId)
  );

  return (
    <div className="absolute inset-0 pointer-events-none transition-opacity duration-700 opacity-100">
      <SceneLayout>
        <div ref={containerRef} className="relative w-full h-[400px]">
          
          {/* Default Content */}
          <div className={`absolute inset-0 transition-all duration-700 origin-left ${activeLayer ? 'opacity-0 scale-95 pointer-events-none blur-md' : 'opacity-100 scale-100 blur-0'}`}>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-[-0.02em] text-white leading-[1.05] text-balance">
              Engineering <br className="hidden md:block" /> Architecture.
            </h2>
            
            <p className="mt-6 text-lg text-zinc-400 font-light leading-relaxed text-balance max-w-md">
              We engineer complete systems, not isolated technologies. Explore how infrastructure, data, and intelligence integrate to form a single, cohesive architecture.
            </p>
          </div>

          {/* Active Layer Content */}
          {ARCHITECTURE_LAYERS.map(layer => {
            const isActive = layer.id === activeLayer?.id;
            return (
              <div 
                key={layer.id} 
                className={`absolute inset-0 transition-all duration-700 origin-left ${isActive ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-95 pointer-events-none blur-md'}`}
              >
                <div className="inline-flex items-center space-x-2 mb-4">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: layer.color, boxShadow: `0 0 10px ${layer.color}` }}></span>
                  <span className="text-xs font-bold tracking-widest uppercase text-white" style={{ color: layer.color }}>
                    Architecture Layer
                  </span>
                </div>

                <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-[-0.02em] text-white leading-[1.05] text-balance">
                  {layer.title}
                </h2>
                
                <p className="mt-6 text-lg text-zinc-300 font-light leading-relaxed text-balance max-w-md">
                  {layer.desc}
                </p>

                <div className="mt-8 border-t border-white/10 pt-6">
                  <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-4 block">Key Technologies</span>
                  <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                    {layer.technologies.map((tech, i) => (
                      <div key={i} className="text-sm text-zinc-200 flex items-center">
                        <span className="w-1.5 h-1.5 rounded-sm mr-3 opacity-50" style={{ backgroundColor: layer.color }}></span>
                        {tech}
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
