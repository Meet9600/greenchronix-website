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
    
    if (state.currentSceneId === 3 || state.currentSceneId === 4) {
      // Shared progression logic for Pipeline and Impact scenes
      // Scene 3: 0.5 -> 0.75
      // Scene 4: 0.75 -> 1.0
      // Total progress from 0.5 to 1.0 mapped to 0 -> 1
      const p = Math.max(0, Math.min(1, (state.scrollProgress - 0.5) / 0.5));
      
      // Camera Z moves from 2 down to -28 smoothly across both scenes
      const targetZ = 2 - (p * 30);
      
      // In Scene 05 (p > 0.5), gradually rise and pitch down slightly
      const isImpact = p > 0.5;
      const impactProgress = isImpact ? (p - 0.5) * 2 : 0; // 0 to 1 during Scene 5
      
      const targetY = impactProgress * 4.5; 
      const targetRotX = -(impactProgress * 0.15);

      gsap.to(this.camera.position, {
        x: 0,
        y: targetY,
        z: targetZ,
        duration: 0.8, // Snappy but smooth tracking
        ease: "power2.out",
        overwrite: "auto",
      });

      gsap.to(this.camera.rotation, {
        x: targetRotX,
        duration: 0.8,
        ease: "power2.out",
        overwrite: "auto",
      });

      return;
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
    
    // If not in a state where rotation.x is animated (Scene 4/5 pitch), apply normal X parallax
    // We can just rely on isParallaxEnabled, but since we disabled it for Scene 3 domains,
    // let's just apply full parallax but maybe without clamping x if we are pitching?
    // Actually, Scene 05 needs pitch, so we can't overwrite rotation.x with parallax directly.
    // We will just add rotation.y parallax globally, and only rotation.x if rotation.x is near 0.
    
    if (Math.abs(this.camera.rotation.x) < 0.05) {
      this.camera.rotation.x += (targetX - this.camera.rotation.x) * 0.05;
      const cap = 0.14;
      this.camera.rotation.x = Math.max(-cap, Math.min(cap, this.camera.rotation.x));
    }
    
    this.camera.rotation.y += (targetY - this.camera.rotation.y) * 0.05;
  }

  public getPosition(): [number, number, number] {
    if (!this.camera) return [0, 0, 0];
    return [this.camera.position.x, this.camera.position.y, this.camera.position.z];
  }
}

export const cameraEngine = new CameraEngine();
