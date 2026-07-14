'use client'

import { LogoParticles } from './LogoParticles'
import { GEO, MAT } from '../three-shared'
import { SceneGroup } from '../SceneGroup'

/**
 * 01 - The full GreenChronix lockup, extracted from the uploaded PNG at
 * runtime and rendered as a living point cloud, framed by a wire cage.
 */
export function Arrival() {
  return (
    <SceneGroup index={0}>
      {/* The uploaded logo IS the geometry - full horizontal lockup */}
      <LogoParticles
        src="/logo-full.png"
        sceneIndex={0}
        worldWidth={8.4}
        pointSize={2.1}
        maxPoints={11000}
        position={[0, 1.15, 0]}
      />
      {/* Wireframe cage frames the mark */}
      <mesh scale={0.92} geometry={GEO.arrivalCage} material={MAT.wireFaint} />
    </SceneGroup>
  )
}
