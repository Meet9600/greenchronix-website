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
    
    if (state.currentSceneId >= 3 && state.currentSceneId <= 6) {
      // Progression logic for Pipeline, Impact, Architecture, and Partnership scenes
      
      // Scene 3 (Pipeline): 0.52 -> 0.68
      const pPipeline = Math.max(0, Math.min(1, (state.scrollProgress - 0.36) / 0.16));
      let targetZ = 2 - (pPipeline * 31); // ends at Z = -29
      
      // Scene 4 (Impact): 0.68 -> 0.86
      const pImpact = Math.max(0, Math.min(1, (state.scrollProgress - 0.52) / 0.16));
      let targetY = pImpact * 4.5;
      let targetRotX = -(pImpact * 0.15);
      
      // Scene 5 (Architecture): 0.86 -> 1.0
      const pArch = Math.max(0, Math.min(1, (state.scrollProgress - 0.68) / 0.18));
      
      if (pArch > 0) {
        // Move back to view the Core (which unfolds into Architecture)
        targetZ = -29 + (pArch * 35); // ends at Z = 6
        targetY = 4.5 + (pArch * 20); // climbs to Y = 24.5
        targetRotX = -0.15 - (pArch * 0.1); // pitch down slightly more
      }

      // Scene 6 (Partnership): 0.86 -> 1.0 (Wait, Scene 07 is 0.86 to 1.0)
      const pPartner = Math.max(0, Math.min(1, (state.scrollProgress - 0.86) / 0.14));
      
      let targetX = 0;
      
      if (pPartner > 0) {
        // Pull back from Scene 06 and apply slow orbital drift
        // Move camera to center of bridge [12.5, 12, -29] but pull back to Z = -5
        targetX = 12.5;
        targetY = 24.5 - (pPartner * 12.5); // Descend to Y=12
        targetZ = 6 - (pPartner * 6); // Pull back Z
        targetRotX = -0.25 + (pPartner * 0.25); // Pitch back to 0
        
        // Orbital drift (5-10 degrees over the scene) -> pan slowly across
        targetX += pPartner * 4; // slowly drift X
        targetZ += pPartner * 2; // slowly drift Z
      }

      gsap.to(this.camera.position, {
        x: targetX,
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
