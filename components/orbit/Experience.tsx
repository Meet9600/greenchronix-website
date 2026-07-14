'use client'

import { useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { AdaptiveDpr, AdaptiveEvents } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import Lenis from 'lenis'
import { progressStore } from './progress'
import { CameraRig } from './CameraRig'
import { SCENE_POS, WORLD } from './three-shared'
import { Atmosphere } from './scenes/Atmosphere'
import { Arrival } from './scenes/Arrival'
import { EngineeringCore } from './scenes/EngineeringCore'
import { Network } from './scenes/Network'
import { Pipeline } from './scenes/Pipeline'
import { Outcomes } from './scenes/Outcomes'
import { Architecture } from './scenes/Architecture'
import { Partnership } from './scenes/Partnership'
import { Handshake } from './scenes/Handshake'

/** Detect constrained devices once on mount: phones, low-core CPUs, low RAM. */
function useLowPower() {
  const [low, setLow] = useState(false)
  useEffect(() => {
    const coarse = window.matchMedia('(pointer: coarse)').matches
    const small = window.innerWidth < 820
    const nav = navigator as Navigator & { deviceMemory?: number }
    const weakCpu = (navigator.hardwareConcurrency ?? 8) <= 4
    const weakRam = (nav.deviceMemory ?? 8) <= 4
    setLow((coarse && small) || weakCpu || weakRam)
  }, [])
  return low
}

export function Experience() {
  const [reducedMotion, setReducedMotion] = useState(false)
  const lowPower = useLowPower()

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  // Scroll driver: Lenis smooths wheel/touch, we normalize to 0..1
  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      progressStore.raw = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
    }

    if (reducedMotion) {
      update()
      window.addEventListener('scroll', update, { passive: true })
      return () => window.removeEventListener('scroll', update)
    }

    const lenis = new Lenis({
      lerp: 0.09,
      smoothWheel: true,
      syncTouch: false, // native touch scrolling stays butter-smooth on mobile
    })
    let rafId: number
    const raf = (time: number) => {
      lenis.raf(time)
      update()
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)
    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
    }
  }, [reducedMotion])

  // Quality presets: full DPR + AA + post on capable machines; leaner
  // pipeline on constrained devices. AdaptiveDpr degrades further under load.
  const dpr: [number, number] = lowPower ? [0.75, 1.15] : [1, 1.6]

  return (
    <div className="fixed inset-0" aria-hidden="true">
      <Canvas
        dpr={dpr}
        camera={{ fov: 50, near: 0.1, far: 80, position: [0, 0.6, 9] }}
        gl={{
          antialias: !lowPower,
          alpha: false,
          depth: true,
          stencil: false,
          powerPreference: 'high-performance',
          failIfMajorPerformanceCaveat: false,
        }}
        performance={{ min: 0.65, max: 1, debounce: 260 }}
      >
        {/* Drops render resolution automatically when the frame rate dips */}
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />

        <color attach="background" args={[WORLD.bg]} />
        <fog attach="fog" args={[WORLD.bg, WORLD.fogNear, WORLD.fogFar]} />

        {/* ---- Lighting: key + fill + emerald rim + soft bounce ---- */}
        <ambientLight intensity={0.62} color="#ccd6d1" />
        <hemisphereLight args={['#42504a', '#16241d', 0.6]} />
        {/* Key */}
        <directionalLight position={[6, 10, 4]} intensity={1.9} color="#f2f5f0" />
        {/* Emerald rim */}
        <directionalLight position={[-8, -4, -6]} intensity={0.7} color={WORLD.emerald} />
        {/* Fill */}
        <directionalLight position={[-4, 6, 8]} intensity={0.55} color="#dfe8e3" />

        {/* Per-scene accent lights keep every hero readable.
            Constrained devices get half the point lights (every other
            scene) — a large fragment-shader saving with minimal loss. */}
        {SCENE_POS.map((p, i) =>
          lowPower && i % 2 !== 0 ? null : (
            <pointLight
              key={i}
              position={[p[0] + 3, p[1] + 4, p[2] + 5]}
              intensity={9}
              distance={22}
              decay={2}
              color={i % 2 === 0 ? WORLD.emerald : '#e7efe9'}
            />
          ),
        )}

        <CameraRig reducedMotion={reducedMotion} />

        <Atmosphere />
        <Arrival />
        <EngineeringCore />
        <Network />
        <Pipeline />
        <Outcomes />
        <Architecture />
        <Partnership />
        <Handshake />

        {/* Post-processing is skipped on constrained devices for smoothness */}
        {!lowPower && (
          <EffectComposer multisampling={0} resolutionScale={0.72}>
            <Bloom
              intensity={0.35}
              luminanceThreshold={0.85}
              luminanceSmoothing={0.22}
              mipmapBlur
              resolutionScale={0.7}
            />
            <Vignette eskil={false} offset={0.28} darkness={0.65} />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  )
}
