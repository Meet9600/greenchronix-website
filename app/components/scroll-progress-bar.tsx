"use client";

import { useScroll, useSpring, useTransform, useReducedMotion, motion } from "framer-motion";

/**
 * Thin fixed scroll-progress bar at the top of the viewport.
 * - height: 3px, z-index: 60 (above nav header z-50)
 * - Colour: brand gradient #34d399 → #6ee7b7
 * - Uses scaleX on a full-width element (not width%) so layout is never shifted → CLS = 0
 * - When prefers-reduced-motion: direct transform (no spring)
 * Requirements: 4.1, 4.2, 4.3, 4.4, 4.5
 */
export default function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const prefersReducedMotion = useReducedMotion();

  // When reduced motion is active: direct transform, no spring animation
  const directScaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  // When reduced motion is inactive: smooth spring-tracked scale
  const springScaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 30,
    restDelta: 0.001,
  });

  const scaleX = prefersReducedMotion ? directScaleX : springScaleX;

  return (
    <motion.div
      style={{
        scaleX,
        transformOrigin: "left",
        background: "linear-gradient(to right, #34d399, #6ee7b7)",
      }}
      className="fixed left-0 top-0 z-[60] h-[3px] w-full origin-left pointer-events-none"
      aria-hidden="true"
    />
  );
}
