export interface WorldEngineConfig {
  debug: boolean;
}

export interface DebugInfo {
  fps: number;
  drawCalls: number;
  triangles: number;
  gpuTier: string;
  particleCount: number;
  currentScene: number;
  cameraPosition: [number, number, number];
}
