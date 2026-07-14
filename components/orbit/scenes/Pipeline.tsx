'use client'

import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { GEO, MAT, LINE_MAT } from '../three-shared'
import { SceneGroup } from '../SceneGroup'
import { isSceneActive } from '../progress'

const SLAB_COUNT = 4
const TRACK = 14

/** 04 - Industrial conveyor: glass slabs travel along metal rails. */
export function Pipeline() {
  const slabMesh = useRef<THREE.InstancedMesh>(null)
  const slabEdges = useRef<(THREE.LineSegments | null)[]>([])
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const edgeGeo = useMemo(() => new THREE.EdgesGeometry(GEO.slab), [])

  useLayoutEffect(() => {
    const mesh = slabMesh.current
    if (!mesh) return
    for (let i = 0; i < SLAB_COUNT; i++) {
      const offset = (i / SLAB_COUNT) * TRACK
      dummy.position.set(offset - TRACK / 2, 0, 0)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
    }
    mesh.instanceMatrix.needsUpdate = true
  }, [dummy])

  useFrame(({ clock }) => {
    if (!isSceneActive(3)) return
    const t = clock.elapsedTime * 0.9
    const mesh = slabMesh.current
    for (let i = 0; i < SLAB_COUNT; i++) {
      const offset = (i / SLAB_COUNT) * TRACK
      // travel left to right, loop seamlessly
      const x = ((t + offset) % TRACK) - TRACK / 2
      if (mesh) {
        dummy.position.set(x, 0, 0)
        dummy.updateMatrix()
        mesh.setMatrixAt(i, dummy.matrix)
      }
      const edge = slabEdges.current[i]
      if (edge) edge.position.set(x, 0, 0)
    }
    if (mesh) mesh.instanceMatrix.needsUpdate = true
  })

  return (
    <SceneGroup index={3} rotation={[0, -0.35, 0]}>
      {/* Rails */}
      <mesh position={[0, -1.35, 0.35]} geometry={GEO.pipelineRail} material={MAT.darkMetal} />
      <mesh position={[0, -1.35, -0.35]} geometry={GEO.pipelineRail} material={MAT.darkMetal} />
      {/* Emerald guide line */}
      <mesh position={[0, -1.28, 0]} geometry={GEO.pipelineGuide} material={MAT.emerald} />
      {/* Traveling glass slabs */}
      <instancedMesh ref={slabMesh} args={[GEO.slab, MAT.glass, SLAB_COUNT]} />
      {Array.from({ length: SLAB_COUNT }).map((_, i) => (
        <lineSegments
          key={i}
          geometry={edgeGeo}
          material={LINE_MAT.emeraldFaint}
          ref={(el) => {
            slabEdges.current[i] = el
          }}
        />
      ))}
      {/* Support columns */}
      {[-5, 0, 5].map((x) => (
        <mesh key={x} position={[x, -2.6, 0]} material={MAT.graphite}>
          <boxGeometry args={[0.2, 2.4, 0.2]} />
        </mesh>
      ))}
    </SceneGroup>
  )
}
