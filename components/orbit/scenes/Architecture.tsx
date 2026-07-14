'use client'

import { useMemo } from 'react'
import * as THREE from 'three'
import { MAT } from '../three-shared'
import { SceneGroup } from '../SceneGroup'

const FRAME_COUNT = 7
const SPACING = 4
const W = 7
const H = 5

/** 06 — Massive metal truss the camera cranes through. Instanced beams. */
export function Architecture() {
  const { beamGeo, transforms } = useMemo(() => {
    const geo = new THREE.BoxGeometry(1, 0.14, 0.14)
    const list: THREE.Matrix4[] = []
    const m = new THREE.Matrix4()
    const q = new THREE.Quaternion()
    const up = new THREE.Vector3()
    const scale = new THREE.Vector3()

    const addBeam = (a: THREE.Vector3, b: THREE.Vector3) => {
      const mid = a.clone().add(b).multiplyScalar(0.5)
      const dir = b.clone().sub(a)
      const len = dir.length()
      q.setFromUnitVectors(new THREE.Vector3(1, 0, 0), dir.normalize())
      scale.set(len, 1, 1)
      m.compose(mid, q, scale)
      list.push(m.clone())
    }

    for (let i = 0; i < FRAME_COUNT; i++) {
      const z = -((i - (FRAME_COUNT - 1) / 2) * SPACING)
      const tl = new THREE.Vector3(-W / 2, H / 2, z)
      const tr = new THREE.Vector3(W / 2, H / 2, z)
      const bl = new THREE.Vector3(-W / 2, -H / 2, z)
      const br = new THREE.Vector3(W / 2, -H / 2, z)
      addBeam(tl, tr)
      addBeam(bl, br)
      addBeam(tl, bl)
      addBeam(tr, br)
      // connect to next frame + cross braces
      if (i < FRAME_COUNT - 1) {
        const z2 = z - SPACING
        addBeam(tl, new THREE.Vector3(-W / 2, H / 2, z2))
        addBeam(tr, new THREE.Vector3(W / 2, H / 2, z2))
        addBeam(bl, new THREE.Vector3(-W / 2, -H / 2, z2))
        addBeam(br, new THREE.Vector3(W / 2, -H / 2, z2))
        addBeam(tl, new THREE.Vector3(W / 2, H / 2, z2))
        addBeam(bl, new THREE.Vector3(W / 2, -H / 2, z2))
      }
    }
    void up
    return { beamGeo: geo, transforms: list }
  }, [])

  return (
    <SceneGroup index={5}>
      <instancedMesh
        args={[beamGeo, MAT.graphite, transforms.length]}
        ref={(mesh) => {
          if (!mesh) return
          transforms.forEach((t, i) => mesh.setMatrixAt(i, t))
          mesh.instanceMatrix.needsUpdate = true
        }}
      />
      {/* Emerald spine running through the truss */}
      <mesh rotation={[Math.PI / 2, 0, 0]} material={MAT.emerald}>
        <cylinderGeometry args={[0.03, 0.03, FRAME_COUNT * SPACING, 6]} />
      </mesh>
    </SceneGroup>
  )
}
