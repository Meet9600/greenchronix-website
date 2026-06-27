import { SceneId, SceneState } from "../types";
import { cameraEngine } from "./world-engine/CameraEngine";

export class SceneManager {
  private state: SceneState = {
    currentSceneId: 0,
    scrollProgress: 0,
    activeDomainId: null,
    activePipelineStageId: null,
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
    this.state.scrollProgress = progress;
    this.notify();
  }

  public setScene(id: SceneId) {
    this.state.currentSceneId = id;
    if (id !== 2) this.state.activeDomainId = null;
    if (id !== 3) this.state.activePipelineStageId = null;
    this.notify();
  }

  public setDomain(id: string | null) {
    this.state.activeDomainId = id;
    this.notify();
  }

  public setPipelineStage(id: string | null) {
    this.state.activePipelineStageId = id;
    this.notify();
  }

  public getState(): SceneState {
    return this.state;
  }
}

export const sceneManager = new SceneManager();
