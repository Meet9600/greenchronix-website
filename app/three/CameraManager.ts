import * as THREE from "three";
import { SceneState } from "../types";

export class CameraManager {
  private camera: THREE.PerspectiveCamera | null = null;
  private targetPosition = new THREE.Vector3();
  private targetLookAt = new THREE.Vector3();

  public setCamera(camera: THREE.PerspectiveCamera) {
    this.camera = camera;
  }

  public updateState(state: SceneState) {
    // Implemented in later phases using GSAP
  }

  public applyMouseParallax(mouseX: number, mouseY: number) {
    // Implemented in later phases
  }
}

export const cameraManager = new CameraManager();
