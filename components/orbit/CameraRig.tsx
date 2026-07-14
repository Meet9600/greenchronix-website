'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { progressStore, SCENE_COUNT } from './progress'
import { SCENE_POS, CAM_OFFSET } from './three-shared'

/**
 * Dwell remap: scroll progress lingers at each scene center and travels
 * faster in between. Users get time to appreciate each composition, and
 * every camera move exists to reveal the next hero.
 */
function dwell(t: number) {
  const segs = SCENE_COUNT - 1
  const scaled = t * segs
  const i = Math.min(segs - 1, Math.floor(scaled))
  const f = scaled - i
  // smootherstep: zero 1st+2nd derivative at ends → long holds, weighted travel
  const eased = f * f * f * (f * (f * 6 - 15) + 10)
  return (i + eased) / segs
}

/** Highest t we ever sample. getPointAt(1.0) can hit an undefined
 *  arc-length bucket in CatmullRomCurve3, so we stay just below it. */
const T_MAX = 0.99999
const CAMERA_SAMPLES = 640

function samplePath(samples: THREE.Vector3[], t: number, out: THREE.Vector3) {
  const scaled = t * (samples.length - 1)
  const i = Math.min(samples.length - 2, Math.max(0, Math.floor(scaled)))
  return out.copy(samples[i]).lerp(samples[i + 1], scaled - i)
}

export function CameraRig({ reducedMotion }: { reducedMotion: boolean }) {
  const targetRef = useRef(new THREE.Vector3())

  const { camSamples, lookSamples } = useMemo(() => {
    const camPoints = SCENE_POS.map(
      (p, i) =>
        new THREE.Vector3(
          p[0] + CAM_OFFSET[i][0],
          p[1] + CAM_OFFSET[i][1],
          p[2] + CAM_OFFSET[i][2],
        ),
    )
    const lookPoints = SCENE_POS.map((p) => new THREE.Vector3(...p))
    const camCurve = new THREE.CatmullRomCurve3(camPoints, false, 'centripetal')
    const lookCurve = new THREE.CatmullRomCurve3(lookPoints, false, 'centripetal')
    // Precompute arc-length tables once so per-frame sampling never
    // triggers lazy initialization mid-render.
    camCurve.getLength()
    lookCurve.getLength()
    const camSamples: THREE.Vector3[] = []
    const lookSamples: THREE.Vector3[] = []
    for (let i = 0; i < CAMERA_SAMPLES; i++) {
      const t = (i / (CAMERA_SAMPLES - 1)) * T_MAX
      camSamples.push(camCurve.getPointAt(t))
      lookSamples.push(lookCurve.getPointAt(t))
    }
    return { camSamples, lookSamples }
  }, [])

  const pos = useRef(new THREE.Vector3(0, 0.6, 9))
  const look = useRef(new THREE.Vector3())

  useFrame(({ camera }, delta) => {
    // Guard the store against NaN/Infinity (e.g. zero-height documents
    // during hydration) before it can poison the curve sampling.
    if (!Number.isFinite(progressStore.raw)) progressStore.raw = 0
    if (!Number.isFinite(progressStore.value)) progressStore.value = progressStore.raw

    // Smooth the raw scroll value
    const lerpSpeed = reducedMotion ? 1 : Math.min(1, delta * 5)
    progressStore.value += (progressStore.raw - progressStore.value) * lerpSpeed

    let t = dwell(THREE.MathUtils.clamp(progressStore.value, 0, 1))
    if (!Number.isFinite(t)) t = 0
    t = THREE.MathUtils.clamp(t, 0, T_MAX)

    samplePath(camSamples, t, pos.current)
    samplePath(lookSamples, t, look.current)

    camera.position.copy(pos.current)
    targetRef.current.copy(look.current)
    camera.lookAt(targetRef.current)
  })

  return null
}
