"use client";

import { useState, useEffect } from "react";

/**
 * Returns true only when all three conditions pass:
 * 1. Fine-pointer device (mouse/trackpad, not touch)
 * 2. Hardware concurrency > 4 (not a low-power device)
 * 3. prefers-reduced-motion is NOT active
 *
 * Always returns false on the server (SSR-safe).
 * Evaluated once on mount, never re-evaluated.
 *
 * Requirements: 2.7
 */
export default function useWebGLCapable(): boolean {
  const [capable, setCapable] = useState(false);

  useEffect(() => {
    const isFinePointer = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    ).matches;
    const isHighPerformance = navigator.hardwareConcurrency > 4;
    const noReducedMotion = !window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    setCapable(isFinePointer && isHighPerformance && noReducedMotion);
  }, []);

  return capable;
}
