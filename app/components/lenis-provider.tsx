"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import ScrollProgressBar from "./scroll-progress-bar";

interface LenisProviderProps {
  children: ReactNode;
}

/**
 * Wraps the app with Lenis smooth scrolling.
 * - Client-only: all logic runs inside useEffect (zero SSR execution)
 * - Skipped entirely when prefers-reduced-motion: reduce is active
 * - try/catch ensures Lenis failures never break the page
 * Requirements: 1.1, 1.2, 1.3, 1.4, 1.5
 */
export default function LenisProvider({ children }: LenisProviderProps) {
  useEffect(() => {
    // Requirement 1.3: skip Lenis when user prefers reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let lenis: Lenis | null = null;
    let rafId: number;

    try {
      lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });

      function raf(time: number) {
        lenis!.raf(time);
        rafId = requestAnimationFrame(raf);
      }

      rafId = requestAnimationFrame(raf);
    } catch (err) {
      // Requirement 1.5: never throw, fall back to native scroll silently
      console.error("[LenisProvider] Failed to initialise:", err);
    }

    return () => {
      cancelAnimationFrame(rafId);
      lenis?.destroy();
    };
  }, []);

  // Renders children as-is — no wrapper DOM element
  return (
    <>
      <ScrollProgressBar />
      {children}
    </>
  );
}
