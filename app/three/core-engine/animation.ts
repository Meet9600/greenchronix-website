import gsap from "gsap";
import * as THREE from "three";
import { SceneState } from "../../types";
import { MOTION, SCENE_DEFINITIONS } from "../../config";

export class CoreAnimationController {
  private meshRef: THREE.Group;
  private networkRef: THREE.Group;

  constructor(meshRef: THREE.Group, networkRef: THREE.Group) {
    this.meshRef = meshRef;
    this.networkRef = networkRef;
  }

  /**
   * Explicitly updates the transformation of the Core based on the SceneManager's state.
   */
  public onStateChange(state: SceneState) {
    const sceneDef = SCENE_DEFINITIONS.find(s => s.id === state.currentSceneId) || SCENE_DEFINITIONS[0];

    gsap.to(this.meshRef.scale, {
      x: sceneDef.core.scale,
      y: sceneDef.core.scale,
      z: sceneDef.core.scale,
      duration: MOTION.sceneTransitionDuration,
      ease: MOTION.easeSecondary,
      delay: 0.3, // Core moves after camera starts
      overwrite: "auto",
    });

    gsap.to(this.meshRef.rotation, {
      y: sceneDef.core.rotationY,
      duration: MOTION.sceneTransitionDuration,
      ease: MOTION.easeSecondary,
      delay: 0.3,
      overwrite: "auto",
    });

    const isNetworkActive = state.currentSceneId >= 1;
    gsap.to(this.networkRef.scale, {
      x: isNetworkActive ? 1 : 0.001,
      y: isNetworkActive ? 1 : 0.001,
      z: isNetworkActive ? 1 : 0.001,
      duration: MOTION.sceneTransitionDuration * 1.2,
      ease: "power2.out",
      delay: 0.5, // Network expands after core starts moving
      overwrite: "auto",
    });
  }

  /**
   * Called every frame by the Fiber loop for continuous, subtle ambient animation.
   */
  public onFrame(deltaTime: number) {
    if (this.meshRef) {
      this.meshRef.rotation.x += deltaTime * 0.05;
      this.meshRef.rotation.y += deltaTime * 0.08;
    }
  }
}
