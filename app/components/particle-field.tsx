"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Fixed full-viewport particle field rendered with Canvas 2D API (no WebGL).
 * - position: fixed, inset-0, z-index: 2, pointer-events-none
 * - 50 particles with opacity ≤ 0.10, colours: rgba(52,211,153,α) and rgba(255,255,255,α)
 * - Returns null when prefers-reduced-motion: reduce matches
 * - rAF loop cancels on unmount; ResizeObserver keeps canvas sized to viewport
 * Requirements: 6.1, 6.2, 6.4, 6.5, 6.6, 6.7
 */

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  alpha: number;
  color: 0 | 1; // 0 = brand green, 1 = white
}

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function createParticles(w: number, h: number, count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => {
    const speed = rand(0.08, 0.25);
    const angle = Math.random() * Math.PI * 2;
    return {
      x: rand(0, w),
      y: rand(0, h),
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      r: rand(0.8, 2.0),
      alpha: rand(0.04, 0.10),
      color: (i % 2) as 0 | 1,
    };
  });
}

export default function ParticleField() {
  const prefersReducedMotion = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = window.innerWidth;
    let h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;

    const PARTICLE_COUNT = 50;
    let particles = createParticles(w, h, PARTICLE_COUNT);
    let rafId: number;

    function loop() {
      ctx!.clearRect(0, 0, w, h);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        // Wrap edges
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fillStyle =
          p.color === 0
            ? `rgba(52,211,153,${p.alpha})`
            : `rgba(255,255,255,${p.alpha})`;
        ctx!.fill();
      }

      rafId = requestAnimationFrame(loop);
    }

    rafId = requestAnimationFrame(loop);

    const observer = new ResizeObserver(() => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
      particles = createParticles(w, h, PARTICLE_COUNT);
    });
    observer.observe(document.body);

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, []);

  // Requirement 6.6: do not render when reduced motion is active
  if (prefersReducedMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2,
        pointerEvents: "none",
      }}
    />
  );
}
