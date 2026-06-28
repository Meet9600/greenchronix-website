"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SceneLayout } from "./scene-layout";
import { GreenBytesMark } from "./greenbytes-logo";

export function Scene01Arrival() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({ delay: 0.2 });

    tl.fromTo(".nav-element", 
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.1 }
    );

    tl.fromTo(".hero-headline",
      { opacity: 0, y: 30, filter: "blur(10px)" },
      { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.2, ease: "power3.out" },
      "-=0.4"
    );

    tl.fromTo(".hero-subheadline",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1.0, ease: "power3.out" },
      "-=0.6"
    );

    tl.fromTo(".hero-cta",
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.5)" },
      "-=0.4"
    );

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="w-full h-full pointer-events-none">
      {/* Subtle Background Vignette */}
      <div className="absolute inset-0 z-10 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_20%,#050505_120%)] opacity-80" />

      {/* Minimal Transparent Navigation */}
      <nav className="absolute top-0 w-full px-8 py-6 flex justify-between items-center z-50 pointer-events-auto">
        <div className="nav-element text-white w-8 h-8">
          <GreenBytesMark /> 
        </div>
        <div className="nav-element">
          <button className="text-xs font-semibold tracking-widest text-emerald-400 uppercase hover:text-white transition-colors">
            Menu
          </button>
        </div>
      </nav>

      {/* Hero Content */}
      <SceneLayout>
        <div className="z-40">
          <h1 className="hero-headline text-4xl md:text-5xl lg:text-7xl font-semibold tracking-[-0.03em] text-white leading-[1.05] text-balance">
            We Build The Intelligent Future.
          </h1>
          
          <p className="hero-subheadline mt-8 text-lg md:text-xl text-zinc-400 font-light text-balance leading-relaxed">
            Engineering intelligent digital systems with clarity, precision, and long-term thinking.
          </p>

          <div className="hero-cta mt-12">
            <button className="group relative overflow-hidden rounded-full bg-emerald-600/90 backdrop-blur-sm border border-emerald-500/20 px-10 py-4 text-sm font-medium text-white shadow-[0_0_30px_rgba(0,227,140,0.15)] transition-all hover:scale-105 hover:bg-emerald-500 hover:shadow-[0_0_40px_rgba(0,227,140,0.3)] active:scale-95">
              <span className="relative z-10 tracking-wide">Start the Journey</span>
            </button>
          </div>
        </div>
      </SceneLayout>
    </div>
  );
}
