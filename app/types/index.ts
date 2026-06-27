export type QualityLevel = "Ultra" | "High" | "Medium" | "Low" | "Fallback";

export interface PerformanceBudget {
  maxParticles: number;
  dpr: [number, number];
  enablePostProcessing: boolean;
  enableVolumetricFog: boolean;
  textureResolution: "high" | "low";
}

export type SceneId = 0 | 1 | 2 | 3;

export interface SceneState {
  currentSceneId: SceneId;
  scrollProgress: number;
  activeDomainId?: string | null;
  activePipelineStageId?: string | null;
}
