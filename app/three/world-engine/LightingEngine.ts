import * as THREE from "three";
import { COLORS } from "../../config";

export class LightingEngine {
  private keyLight: THREE.DirectionalLight | null = null;
  private rimLight: THREE.DirectionalLight | null = null;
  private ambientLight: THREE.AmbientLight | null = null;

  public getLights(): THREE.Group {
    const group = new THREE.Group();
    
    this.keyLight = new THREE.DirectionalLight(COLORS.emeraldPrimary, 1.5);
    this.keyLight.position.set(5, 5, 5);
    group.add(this.keyLight);

    this.rimLight = new THREE.DirectionalLight(COLORS.highlightBlue, 0.8);
    this.rimLight.position.set(-5, 5, -5);
    group.add(this.rimLight);

    this.ambientLight = new THREE.AmbientLight(COLORS.surface, 0.5);
    group.add(this.ambientLight);

    return group;
  }
}

export const lightingEngine = new LightingEngine();
