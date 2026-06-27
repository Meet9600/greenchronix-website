import gsap from "gsap";

export class AnimationManager {
  private masterTimeline: gsap.core.Timeline;

  constructor() {
    this.masterTimeline = gsap.timeline({ paused: true });
  }

  public playSceneTransition(fromId: number, toId: number) {
    // Implemented in later phases
  }

  public syncWithScroll(progress: number) {
    this.masterTimeline.progress(progress);
  }
}

export const animationManager = new AnimationManager();
