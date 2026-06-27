import * as THREE from "three";
import gsap from "gsap";
import { SceneState } from "../../types";
import { SCENE_DEFINITIONS, CAMERA_PRESETS, ENGINEERING_DOMAINS } from "../../config";

export class CameraEngine {
  private camera: THREE.PerspectiveCamera | null = null;
  private isParallaxEnabled = true;
  private isScreenshotMode = false;
  private activePreset: string | null = null;

  public init(camera: THREE.PerspectiveCamera) {
    this.camera = camera;

    // Check for debug/marketing flags
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("debug") === "screenshot") {
        this.isScreenshotMode = true;
        this.isParallaxEnabled = false; // Freeze parallax for clean shots
      }
      
      const preset = params.get("preset");
      if (preset && CAMERA_PRESETS[preset as keyof typeof CAMERA_PRESETS]) {
        this.activePreset = preset;
        const pos = CAMERA_PRESETS[preset as keyof typeof CAMERA_PRESETS];
        camera.position.set(pos[0], pos[1], pos[2]);
      }
    }
  }

  public onSceneStateChange(state: SceneState) {
    if (!this.camera || this.activePreset) return; // Don't animate if locked to a preset
    
    // Domain focus logic for Scene 03
    if (state.currentSceneId === 2 && state.activeDomainId) {
      const domain = ENGINEERING_DOMAINS.find(d => d.id === state.activeDomainId);
      if (domain) {
        gsap.to(this.camera.position, {
          x: domain.pos[0] * 0.8,
          y: domain.pos[1] * 0.8,
          z: domain.pos[2] + 4, 
          duration: 1.5,
          ease: "power2.inOut",
        });
        this.isParallaxEnabled = false;
        return;
      }
    }

    if (!this.isScreenshotMode) {
      this.isParallaxEnabled = true;
    }
    
    const sceneDef = SCENE_DEFINITIONS.find(s => s.id === state.currentSceneId) || SCENE_DEFINITIONS[0];
    const target = sceneDef.camera.target;

    gsap.to(this.camera.position, {
      x: target[0],
      y: target[1],
      z: target[2],
      duration: 1.5,
      ease: "power2.inOut",
      overwrite: "auto",
    });
  }

  public applyParallax(mouseX: number, mouseY: number) {
    if (!this.camera || !this.isParallaxEnabled) return;
    
    // Cap to +- 8 degrees (0.14 rad)
    const targetX = (mouseY * 0.12);
    const targetY = (mouseX * 0.12);
    
    this.camera.rotation.x += (targetX - this.camera.rotation.x) * 0.05;
    this.camera.rotation.y += (targetY - this.camera.rotation.y) * 0.05;
    
    const cap = 0.14;
    this.camera.rotation.x = Math.max(-cap, Math.min(cap, this.camera.rotation.x));
    this.camera.rotation.y = Math.max(-cap, Math.min(cap, this.camera.rotation.y));
  }

  public getPosition(): [number, number, number] {
    if (!this.camera) return [0, 0, 0];
    return [this.camera.position.x, this.camera.position.y, this.camera.position.z];
  }
}

export const cameraEngine = new CameraEngine();
