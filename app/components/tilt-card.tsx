"use client";

import { useRef, useEffect, useState, type ReactNode, type PointerEvent } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";

/**
 * Pseudo-3D tilt card wrapper using Framer Motion only (no R3F/WebGL).
 * - rotateX/rotateY from pointer position, capped at maxTilt degrees
 * - Soft green glow + vertical lift on hover
 * - TiltCardFront slot: translateZ(16px) depth layer
 * - Reduced motion: returns children as-is, preserving existing whileHover
 * - Touch device: clamps tilt to 4° max
 * Requirements: 3.1–3.8
 */

const SPRING = { stiffness: 300, damping: 28 };

// boxShadow intentionally removed from the wrapper — it has no border-radius
// so it would render as a hard rectangle. The existing card styles already
// handle hover glow via hover:border-emerald-400/20 and the internal glow div.

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
}

export function TiltCardFront({ children }: { children: ReactNode }) {
  return (
    <div style={{ transform: "translateZ(16px)" }}>
      {children}
    </div>
  );
}

export default function TiltCard({
  children,
  className,
  maxTilt = 12,
}: TiltCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch(window.matchMedia("(hover: none)").matches);
  }, []);

  const effectiveMaxTilt = isTouch ? Math.min(maxTilt, 4) : maxTilt;

  const rotateXRaw = useMotionValue(0);
  const rotateYRaw = useMotionValue(0);
  const liftYRaw = useMotionValue(0);

  const rotateX = useSpring(rotateXRaw, SPRING);
  const rotateY = useSpring(rotateYRaw, SPRING);
  const liftY = useSpring(liftYRaw, SPRING);

  const wrapperRef = useRef<HTMLDivElement>(null);

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) return;
    const rect = wrapperRef.current?.getBoundingClientRect();
    if (!rect) return;
    const relX = (e.clientX - rect.left) / rect.width;   // [0,1]
    const relY = (e.clientY - rect.top) / rect.height;   // [0,1]
    rotateYRaw.set((relX - 0.5) * 2 * effectiveMaxTilt);
    rotateXRaw.set(-(relY - 0.5) * 2 * effectiveMaxTilt);
    liftYRaw.set(-6);
  };

  const handlePointerLeave = () => {
    rotateXRaw.set(0);
    rotateYRaw.set(0);
    liftYRaw.set(0);
  };

  // Reduced motion: return children without any tilt wrapper
  if (prefersReducedMotion) {
    return <>{children}</>;
  }

  return (
    <motion.div
      ref={wrapperRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{
        perspective: "800px",
        rotateX,
        rotateY,
        y: liftY,
      }}
      className={className}
    >
      <div style={{ transformStyle: "preserve-3d" }}>
        {children}
      </div>
    </motion.div>
  );
}
