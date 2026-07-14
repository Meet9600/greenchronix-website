'use client'

import { useRef, type ReactNode } from 'react'
import { useFrame } from '@react-three/fiber'
import type * as THREE from 'three'
import { isSceneActive } from './progress'
import { SCENE_POS } from './three-shared'

/**
 * Positions a scene in the world and culls it (visibility + all child
 * draw calls) whenever the camera is more than ~1.3 segments away.
 * Fog already hides distant scenes, so this is visually free while
 * cutting total draw calls to roughly a quarter at any scroll position.
 */
export function SceneGroup({
  index,
  rotation,
  children,
}: {
  index: number
  rotation?: [number, number, number]
  children: ReactNode
}) {
  const ref = useRef<THREE.Group>(null)

  useFrame(() => {
    const g = ref.current
    if (!g) return
    const active = isSceneActive(index)
    if (g.visible !== active) g.visible = active
  })

  return (
    <group ref={ref} position={SCENE_POS[index]} rotation={rotation}>
      {children}
    </group>
  )
}
