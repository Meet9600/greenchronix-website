'use client'

import { useLayoutEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { GEO, MAT, LINE_MAT } from '../three-shared'
import { SceneGroup } from '../SceneGroup'

const HERO_PANEL = 1

/** 05 - Six shipped products as a floating panel wall. */
export function Outcomes() {
  const panelMesh = useRef<THREE.InstancedMesh>(null)
  const insetMesh = useRef<THREE.InstancedMesh>(null)
  const lightMesh = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const edgeGeo = useMemo(() => new THREE.EdgesGeometry(GEO.panel), [])

  const positions = useMemo(() => {
    const out: [number, number, number][] = []
    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < 3; col++) {
        out.push([(col - 1) * 2.6, (0.5 - row) * 1.8, (col % 2) * -0.4])
      }
    }
    return out
  }, [])

  useLayoutEffect(() => {
    for (let i = 0; i < positions.length; i++) {
      const p = positions[i]
      const scale = i === HERO_PANEL ? 1.08 : 0.82
      dummy.scale.setScalar(scale)
      dummy.position.set(p[0], p[1], p[2])
      dummy.updateMatrix()
      panelMesh.current?.setMatrixAt(i, dummy.matrix)

      dummy.scale.setScalar(scale)
      dummy.position.set(p[0], p[1], p[2] + 0.06)
      dummy.updateMatrix()
      insetMesh.current?.setMatrixAt(i, dummy.matrix)

      dummy.scale.setScalar(i === HERO_PANEL ? 1.15 : 0.78)
      dummy.position.set(p[0] + 0.85, p[1] - 0.52, p[2] + 0.08)
      dummy.updateMatrix()
      lightMesh.current?.setMatrixAt(i, dummy.matrix)
    }
    if (panelMesh.current) panelMesh.current.instanceMatrix.needsUpdate = true
    if (insetMesh.current) insetMesh.current.instanceMatrix.needsUpdate = true
    if (lightMesh.current) lightMesh.current.instanceMatrix.needsUpdate = true
  }, [dummy, positions])

  return (
    <SceneGroup index={4} rotation={[0, 0.4, 0]}>
      <group>
        <instancedMesh ref={panelMesh} args={[GEO.panel, MAT.graphite, positions.length]} />
        <instancedMesh ref={insetMesh} args={[GEO.panelInset, MAT.darkMetal, positions.length]} />
        <instancedMesh ref={lightMesh} args={[GEO.statusLight, MAT.emerald, positions.length]} />
        {positions.map((p, i) => (
          <lineSegments
            key={i}
            position={p}
            scale={i === HERO_PANEL ? 1.08 : 0.82}
            geometry={edgeGeo}
            material={i === HERO_PANEL ? LINE_MAT.emerald : LINE_MAT.emeraldFaint}
          />
        ))}
      </group>
    </SceneGroup>
  )
}
