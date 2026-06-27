import * as THREE from "three";
import { COLORS } from "../../config";
import { performanceManager } from "../PerformanceManager";
import { PERFORMANCE_PRESETS } from "../../config";

export class EnvironmentEngine {
  
  public getBackground(): THREE.Color {
    return new THREE.Color(COLORS.background);
  }

  public getFog(): THREE.FogExp2 | null {
    const quality = performanceManager.getQuality();
    if (PERFORMANCE_PRESETS[quality].enableVolumetricFog) {
      return new THREE.FogExp2(COLORS.background, 0.05);
    }
    return null;
  }
}

export const environmentEngine = new EnvironmentEngine();
