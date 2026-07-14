'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type * as THREE from 'three'
import { GEO, MAT } from '../three-shared'
import { SceneGroup } from '../SceneGroup'
import { isSceneActive } from '../progress'

/** 07 - Two structures joined by an emerald bridge. */
export function Partnership() {
  const bridge = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (!isSceneActive(6)) return
    if (bridge.current) {
      const pulse = 1 + Math.sin(clock.elapsedTime * 1.4) * 0.12
      bridge.current.scale.setY(pulse)
    }
  })

  return (
    <SceneGroup index={6} rotation={[0, 0.2, 0]}>
      <mesh position={[-2.8, -1.4, 0]} geometry={GEO.tower0} material={MAT.graphite} />
      <mesh position={[2.8, -1.4, 0]} geometry={GEO.tower0} material={MAT.graphite} />
      <mesh position={[-2.62, 0.1, 0]} geometry={GEO.tower1} material={MAT.metal} />
      <mesh position={[2.62, 0.1, 0]} geometry={GEO.tower1} material={MAT.metal} />
      <mesh position={[-2.44, 1.6, 0]} geometry={GEO.tower2} material={MAT.graphite} />
      <mesh position={[2.44, 1.6, 0]} geometry={GEO.tower2} material={MAT.graphite} />
      {/* Emerald connection */}
      <mesh ref={bridge} rotation={[0, 0, Math.PI / 2]} material={MAT.emerald}>
        <cylinderGeometry args={[0.05, 0.05, 4.2, 8]} />
      </mesh>
    </SceneGroup>
  )
}
