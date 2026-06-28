import { SceneId, SceneState } from "../types";
import { cameraEngine } from "./world-engine/CameraEngine";

export class SceneManager {
  private state: SceneState = {
    currentSceneId: 0,
    scrollProgress: 0,
    activeDomainId: null,
    activePipelineStageId: null,
    activeImpactDomainId: null,
    hoveredImpactDomainId: null,
    activeArchitectureLayerId: null,
    hoveredArchitectureLayerId: null,
  };

  private listeners: Set<(state: SceneState) => void> = new Set();

  public subscribe(listener: (state: SceneState) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((l) => l(this.state));
    
    // Orchestrate independent engines
    cameraEngine.onSceneStateChange(this.state);
  }

  public updateScroll(progress: number) {
    this.state = { ...this.state, scrollProgress: progress };
    this.notify();
  }

  public setScene(id: SceneId) {
    this.state = {
      ...this.state,
      currentSceneId: id,
      activeDomainId: id === 2 ? this.state.activeDomainId : null,
      activePipelineStageId: id === 3 ? this.state.activePipelineStageId : null,
      activeImpactDomainId: id === 4 ? this.state.activeImpactDomainId : null,
      hoveredImpactDomainId: null,
      activeArchitectureLayerId: id === 5 ? this.state.activeArchitectureLayerId : null,
      hoveredArchitectureLayerId: null,
    };
    this.notify();
  }

  public setDomain(id: string | null) {
    this.state = { ...this.state, activeDomainId: id };
    this.notify();
  }

  public setPipelineStage(id: string | null) {
    this.state = { ...this.state, activePipelineStageId: id };
    this.notify();
  }

  public setImpactDomain(id: string | null) {
    this.state = { ...this.state, activeImpactDomainId: id };
    this.notify();
  }

  public setHoveredImpactDomain(id: string | null) {
    if (this.state.hoveredImpactDomainId !== id) {
      this.state = { ...this.state, hoveredImpactDomainId: id };
      this.notify();
    }
  }

  public setArchitectureLayer(id: string | null) {
    this.state = { ...this.state, activeArchitectureLayerId: id };
    this.notify();
  }

  public setHoveredArchitectureLayer(id: string | null) {
    if (this.state.hoveredArchitectureLayerId !== id) {
      this.state = { ...this.state, hoveredArchitectureLayerId: id };
      this.notify();
    }
  }

  public getState(): SceneState {
    return this.state;
  }
}

export const sceneManager = new SceneManager();
