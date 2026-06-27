import { QualityLevel } from "../types";
import { FEATURE_FLAGS } from "../config/feature-flags";

export class PerformanceManager {
  private currentQuality: QualityLevel = "High";
  
  constructor() {
    this.detectCapabilities();
  }

  private detectCapabilities() {
    if (FEATURE_FLAGS.FORCE_FALLBACK_MODE) {
      this.currentQuality = "Fallback";
      return;
    }

    if (typeof window !== "undefined") {
      const isMobile = window.matchMedia("(max-width: 768px)").matches;
      const cores = navigator.hardwareConcurrency || 4;
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (prefersReducedMotion) {
        this.currentQuality = "Fallback";
      } else if (isMobile || cores <= 4) {
        this.currentQuality = "Low";
      } else if (cores >= 8) {
        this.currentQuality = "Ultra";
      } else {
        this.currentQuality = "High";
      }
    }
  }

  public getQuality(): QualityLevel {
    return this.currentQuality;
  }

  public setQuality(quality: QualityLevel) {
    this.currentQuality = quality;
  }
}

export const performanceManager = new PerformanceManager();
