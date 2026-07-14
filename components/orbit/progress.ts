// Shared scroll-progress store. Written by the scroll driver each frame,
// read by the camera rig (inside the canvas) and the overlay (outside it).
// A plain mutable object avoids per-frame React re-renders entirely.
export const progressStore = {
  /** Raw scroll progress 0..1 */
  raw: 0,
  /** Smoothed progress 0..1 (lerped toward raw) */
  value: 0,
}

export const SCENE_COUNT = 8

/** Progress position (0..1) of a scene's center. */
export function sceneCenter(i: number) {
  return i / (SCENE_COUNT - 1)
}

/**
 * Opacity/presence of scene i at progress p.
 * 1 at the scene center, fading to 0 halfway toward neighbors.
 */
export function scenePresence(i: number, p: number) {
  const half = 1 / (SCENE_COUNT - 1) / 2
  const d = Math.abs(p - sceneCenter(i))
  return Math.max(0, Math.min(1, 1 - (d - half * 0.35) / (half * 0.85)))
}

/**
 * Whether scene i is close enough to the camera to be worth rendering
 * and animating. Fog fully hides scenes beyond ~1.3 segments away, so
 * culling them costs nothing visually and saves draw calls + CPU.
 */
export function isSceneActive(i: number, span = 1.35) {
  const p = Number.isFinite(progressStore.value) ? progressStore.value : 0
  return Math.abs(p * (SCENE_COUNT - 1) - i) < span
}
