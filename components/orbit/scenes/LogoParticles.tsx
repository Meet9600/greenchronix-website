'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { loadLogoPoints, type LogoPointCloud } from '../logo-points'
import { progressStore, scenePresence, isSceneActive } from '../progress'

const VERT = /* glsl */ `
  attribute vec3 aColor;
  attribute vec3 aScatter;
  uniform float uAssemble;
  uniform float uSize;
  varying vec3 vColor;
  varying float vFade;

  void main() {
    vColor = aColor;

    // Assembly: particles drift in from a scattered cloud and settle
    vec3 scattered = position + aScatter * 5.5;
    vec3 p = mix(scattered, position, uAssemble);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    // ~3px dots at the standard 9-unit camera distance (denser sampling)
    gl_PointSize = uSize * (15.0 / max(1.0, -mv.z));
    vFade = 0.55 + 0.45 * uAssemble;
  }
`

const FRAG = /* glsl */ `
  uniform float uOpacity;
  varying vec3 vColor;
  varying float vFade;

  void main() {
    // Soft round sprite from the point square
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    // Crisp dot-matrix sprite: normal blending, so overlaps keep the
    // logo's true colors instead of accumulating to white.
    float alpha = smoothstep(0.5, 0.3, d) * uOpacity * vFade;
    if (alpha < 0.02) discard;
    gl_FragColor = vec4(vColor, alpha);
  }
`

/**
 * Renders the actual uploaded logo as a living point cloud.
 * The PNG is sampled at runtime (luminance mask on black) — the logo file
 * itself is the source geometry. Assembly + opacity are driven by the
 * scene's scroll presence so it never pops in or out.
 */
export function LogoParticles({
  src,
  sceneIndex,
  worldWidth = 7,
  region,
  pointSize = 2.0,
  maxPoints = 9000,
  position = [0, 0, 0] as [number, number, number],
}: {
  src: string
  sceneIndex: number
  worldWidth?: number
  region?: { x0: number; y0: number; x1: number; y1: number }
  pointSize?: number
  maxPoints?: number
  position?: [number, number, number]
}) {
  const [cloud, setCloud] = useState<LogoPointCloud | null>(null)
  const matRef = useRef<THREE.ShaderMaterial>(null)
  const groupRef = useRef<THREE.Group>(null)
  const assembleRef = useRef(0)

  // Fit the cloud to the visible frustum on narrow screens so the wide
  // lockup never overflows on phones. Visible width at the camera plane
  // is ~2 * dist * tan(fov/2) * aspect; keep the logo within ~86% of it.
  const { size, camera } = useThree()
  const fitScale = useMemo(() => {
    const persp = camera as THREE.PerspectiveCamera
    const dist = 9
    const visibleW =
      2 * dist * Math.tan(((persp.fov ?? 50) * Math.PI) / 360) * (size.width / size.height)
    return Math.min(1, (visibleW * 0.86) / worldWidth)
  }, [size.width, size.height, camera, worldWidth])

  const sampledMaxPoints = size.width < 820 ? Math.min(maxPoints, 5600) : maxPoints

  useEffect(() => {
    let alive = true
    loadLogoPoints(src, { worldWidth, region, maxPoints: sampledMaxPoints })
      .then((c) => {
        if (alive) setCloud(c)
      })
      .catch((err) => console.log('[v0] Logo point extraction failed:', err))
    return () => {
      alive = false
    }
  }, [src, worldWidth, region, sampledMaxPoints])

  const geometry = useMemo(() => {
    if (!cloud) return null
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(cloud.positions, 3))
    geo.setAttribute('aColor', new THREE.BufferAttribute(cloud.colors, 3))
    geo.setAttribute('aScatter', new THREE.BufferAttribute(cloud.scatter, 3))
    geo.computeBoundingSphere()
    return geo
  }, [cloud])

  const uniforms = useMemo(
    () => ({
      uAssemble: { value: 0 },
      uOpacity: { value: 0 },
      uSize: { value: pointSize },
    }),
    [pointSize],
  )

  useFrame(({ gl }, delta) => {
    // Skip all work while the parent SceneGroup has culled this scene.
    if (!isSceneActive(sceneIndex)) return
    const presence = scenePresence(sceneIndex, progressStore.value)
    if (presence <= 0.002 && assembleRef.current <= 0.002) return
    // Critically damped approach — settles with weight, no snapping
    assembleRef.current += (presence - assembleRef.current) * Math.min(1, delta * 2.4)
    const a = assembleRef.current
    if (matRef.current) {
      matRef.current.uniforms.uAssemble.value = a * a * (3 - 2 * a) // smoothstep
      matRef.current.uniforms.uOpacity.value = Math.min(1, a * 1.4)
      // gl_PointSize is in device pixels: scale by the live pixel ratio so
      // dots stay the same visual size and stay crisp on Retina displays.
      matRef.current.uniforms.uSize.value = pointSize * Math.min(1.6, gl.getPixelRatio())
    }
  })

  if (!geometry) return null

  return (
    <group ref={groupRef} position={position} scale={fitScale}>
      <points geometry={geometry}>
        <shaderMaterial
          ref={matRef}
          vertexShader={VERT}
          fragmentShader={FRAG}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.NormalBlending}
        />
      </points>
    </group>
  )
}
