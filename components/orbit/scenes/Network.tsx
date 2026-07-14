'use client'

import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { GEO, MAT, LINE_MAT } from '../three-shared'
import { SceneGroup } from '../SceneGroup'
import { isSceneActive } from '../progress'

const NODE_COUNT = 6

/** 03 - Six capability nodes wired to a hub with emerald links. */
export function Network() {
  const group = useRef<THREE.Group>(null)
  const nodeMesh = useRef<THREE.InstancedMesh>(null)
  const coreMesh = useRef<THREE.InstancedMesh>(null)

  const { nodes, lineGeo, matrices } = useMemo(() => {
    const pts: THREE.Vector3[] = []
    for (let i = 0; i < NODE_COUNT; i++) {
      const a = (i / NODE_COUNT) * Math.PI * 2
      const r = 3.2
      pts.push(
        new THREE.Vector3(
          Math.cos(a) * r,
          Math.sin(a * 2) * 0.9,
          Math.sin(a) * r * 0.6,
        ),
      )
    }
    const positions: number[] = []
    for (const p of pts) positions.push(0, 0, 0, p.x, p.y, p.z)
    // ring links between neighbors
    for (let i = 0; i < NODE_COUNT; i++) {
      const a = pts[i]
      const b = pts[(i + 1) % NODE_COUNT]
      positions.push(a.x, a.y, a.z, b.x, b.y, b.z)
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    const dummy = new THREE.Object3D()
    const matrices = pts.map((p) => {
      dummy.position.copy(p)
      dummy.updateMatrix()
      return dummy.matrix.clone()
    })
    return { nodes: pts, lineGeo: geo, matrices }
  }, [])

  useLayoutEffect(() => {
    const nodes = nodeMesh.current
    const cores = coreMesh.current
    if (!nodes || !cores) return
    matrices.forEach((matrix, i) => {
      nodes.setMatrixAt(i, matrix)
      cores.setMatrixAt(i, matrix)
    })
    nodes.instanceMatrix.needsUpdate = true
    cores.instanceMatrix.needsUpdate = true
  }, [matrices])

  useFrame(({ clock }) => {
    if (!isSceneActive(2)) return
    if (group.current) group.current.rotation.y = clock.elapsedTime * 0.1
  })

  return (
    <SceneGroup index={2}>
      <group ref={group}>
        {/* Hub */}
        <mesh geometry={GEO.hub} material={MAT.metal} />
        {/* Capability nodes */}
        <instancedMesh ref={nodeMesh} args={[GEO.node, MAT.graphite, nodes.length]} />
        <instancedMesh ref={coreMesh} args={[GEO.nodeCore, MAT.darkMetal, nodes.length]} />
        {/* Emerald links */}
        <lineSegments geometry={lineGeo} material={LINE_MAT.emeraldFaint} />
      </group>
    </SceneGroup>
  )
}
