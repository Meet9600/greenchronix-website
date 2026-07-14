'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type * as THREE from 'three'
import { LogoParticles } from './LogoParticles'
import { GEO, MAT } from '../three-shared'
import { SceneGroup } from '../SceneGroup'
import { isSceneActive } from '../progress'

/**
 * 08 - The journey resolves back into the GX monogram (sampled from the
 * uploaded square logo), ringed in emerald.
 */
export function Handshake() {
  const ring = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (!isSceneActive(7)) return
    const t = clock.elapsedTime
    if (ring.current) ring.current.rotation.z = t * 0.25
  })

  return (
    <SceneGroup index={7}>
      {/* Monogram region of the uploaded square logo, as particles */}
      <LogoParticles
        src="/logo-mark.png"
        sceneIndex={7}
        worldWidth={5.2}
        pointSize={2.3}
        maxPoints={7600}
        region={{ x0: 0.24, y0: 0.24, x1: 0.78, y1: 0.58 }}
      />
      {/* Orbiting emerald ring */}
      <mesh ref={ring} rotation={[Math.PI / 2, 0, 0]} geometry={GEO.handshakeRing} material={MAT.emerald} />
      <mesh rotation={[Math.PI / 2, 0, 0]} geometry={GEO.handshakeWire} material={MAT.wireFaint} />
    </SceneGroup>
  )
}
