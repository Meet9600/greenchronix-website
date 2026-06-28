"use client";

import { useState, useEffect } from "react";
import { EXPERIENCE_LAYOUT } from "../config";

export function useExperienceLayout() {
  const [worldOffset, setWorldOffset] = useState<[number, number, number]>([0, 0, 0]);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1024) {
        setWorldOffset(EXPERIENCE_LAYOUT.desktop.worldOffset);
      } else if (width >= 768) {
        setWorldOffset(EXPERIENCE_LAYOUT.tablet.worldOffset);
      } else {
        setWorldOffset(EXPERIENCE_LAYOUT.mobile.worldOffset);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return { worldOffset };
}
