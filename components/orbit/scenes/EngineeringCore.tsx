'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type * as THREE from 'three'
import { GEO, MAT } from '../three-shared'
import { SceneGroup } from '../SceneGroup'
import { isSceneActive } from '../progress'

/** 02 - Machined core: nested rotating graphite rings + emerald conduit. */
export function EngineeringCore() {
  const conduit = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (!isSceneActive(1)) return
    const t = clock.elapsedTime
    if (conduit.current) conduit.current.rotation.y = -t * 0.2
  })

  return (
    <SceneGroup index={1}>
      {/* Nested machined rings */}
      <mesh scale={0.96} geometry={GEO.coreOuter} material={MAT.graphite} />
      <mesh rotation={[Math.PI / 2, 0, 0]} geometry={GEO.coreInner} material={MAT.darkMetal} />
      {/* Emerald energy conduit */}
      <mesh ref={conduit} rotation={[Math.PI / 2.4, 0, 0]} geometry={GEO.coreConduit} material={MAT.emerald} />
      {/* Precision center */}
      <mesh geometry={GEO.coreCenter} material={MAT.metal} />
    </SceneGroup>
  )
}
