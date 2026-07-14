'use client'

import { useMemo } from 'react'
import * as THREE from 'three'
import { SCENE_POS } from '../three-shared'

const PER_SCENE = 42

/**
 * Very subtle ambient dust drifting near each scene. One shared Points
 * object for the whole world — alive, never distracting.
 */
export function Atmosphere() {
  const geometry = useMemo(() => {
    const count = SCENE_POS.length * PER_SCENE
    const positions = new Float32Array(count * 3)
    let i = 0
    for (const [sx, sy, sz] of SCENE_POS) {
      for (let k = 0; k < PER_SCENE; k++) {
        positions[i * 3] = sx + (Math.random() - 0.5) * 18
        positions[i * 3 + 1] = sy + (Math.random() - 0.5) * 10
        positions[i * 3 + 2] = sz + (Math.random() - 0.5) * 18
        i++
      }
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.computeBoundingSphere()
    return geo
  }, [])

  return (
    <points geometry={geometry} frustumCulled={false}>
      <pointsMaterial
        color="#5f6f68"
        size={0.045}
        sizeAttenuation
        transparent
        opacity={0.5}
        depthWrite={false}
      />
    </points>
  )
}
