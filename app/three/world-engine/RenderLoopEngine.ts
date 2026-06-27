import { particleEngine } from "./ParticleEngine";

export class RenderLoopEngine {
  
  public update(deltaTime: number) {
    // Orchestrate per-frame engine updates
    particleEngine.update(deltaTime);
    
    // Abstract mouse coordinates would be passed here in a full implementation 
    // to drive cameraEngine.applyParallax(mouseX, mouseY);
  }
}

export const renderLoopEngine = new RenderLoopEngine();
