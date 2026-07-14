import * as THREE from 'three'

// ---- World layout: one scene every 32 units down -Z with lateral drift ----
export const SCENE_POS: [number, number, number][] = [
  [0, 0, 0], // 01 Arrival
  [0, 0, -32], // 02 Core
  [14, 1, -64], // 03 Network
  [0, -1, -96], // 04 Pipeline
  [-14, 0, -128], // 05 Outcomes
  [0, 2, -160], // 06 Architecture
  [12, 0, -192], // 07 Partnership
  [0, 0, -224], // 08 Handshake
]

// Camera offset (relative to each scene) — varied angles for a film feel
export const CAM_OFFSET: [number, number, number][] = [
  [0, 0.6, 9],
  [2.5, 1.4, 10],
  [-3, 2, 11],
  [3.5, 2.4, 12],
  [4, 1, 11],
  [0, -1.5, 13],
  [-4, 1.2, 11],
  [0, 0.8, 10],
]

// ---- Palette: rich graphite world, emerald energy, soft white highlights ----
export const WORLD = {
  // Rich graphite, not pure black — distant fog reads as deep charcoal
  bg: '#131816',
  fogNear: 13,
  fogFar: 42,
  emerald: '#10b981',
  emeraldBright: '#34d399',
}

// ---- Shared materials (single instances, reused everywhere) ----
export const MAT = {
  graphite: new THREE.MeshStandardMaterial({
    color: '#333b38',
    metalness: 0.6,
    roughness: 0.45,
  }),
  metal: new THREE.MeshStandardMaterial({
    color: '#9aa5a0',
    metalness: 0.95,
    roughness: 0.22,
  }),
  darkMetal: new THREE.MeshStandardMaterial({
    color: '#1b201e',
    metalness: 0.85,
    roughness: 0.3,
  }),
  // Controlled emissive: bright enough to read as energy, low enough that
  // bloom never turns it into a glowing blob.
  emerald: new THREE.MeshStandardMaterial({
    color: '#10b981',
    emissive: '#10b981',
    emissiveIntensity: 1.4,
    metalness: 0.2,
    roughness: 0.3,
    toneMapped: false,
  }),
  glass: new THREE.MeshStandardMaterial({
    color: '#c4d0cb',
    metalness: 0,
    roughness: 0.08,
    transparent: true,
    opacity: 0.18,
  }),
  wire: new THREE.MeshBasicMaterial({
    color: '#48524d',
    wireframe: true,
    transparent: true,
    opacity: 0.45,
  }),
  wireFaint: new THREE.MeshBasicMaterial({
    color: '#48524d',
    wireframe: true,
    transparent: true,
    opacity: 0.22,
  }),
}

export const LINE_MAT = {
  emerald: new THREE.LineBasicMaterial({
    color: '#10b981',
    transparent: true,
    opacity: 0.85,
  }),
  faint: new THREE.LineBasicMaterial({
    color: '#f4f6f5',
    transparent: true,
    opacity: 0.12,
  }),
  emeraldFaint: new THREE.LineBasicMaterial({
    color: '#10b981',
    transparent: true,
    opacity: 0.28,
  }),
}

// ---- Shared geometries (single GPU buffers, reused across scenes) ----
export const GEO = {
  panel: new THREE.BoxGeometry(2.1, 1.35, 0.1),
  panelInset: new THREE.BoxGeometry(1.85, 1.1, 0.02),
  slab: new THREE.BoxGeometry(1.4, 1.9, 0.16),
  node: new THREE.IcosahedronGeometry(0.42, 0),
  nodeCore: new THREE.IcosahedronGeometry(0.1, 0),
  hub: new THREE.IcosahedronGeometry(0.6, 0),
  statusLight: new THREE.SphereGeometry(0.045, 8, 8),
  tower0: new THREE.BoxGeometry(1.6, 1.3, 1.6),
  tower1: new THREE.BoxGeometry(1.35, 1.3, 1.35),
  tower2: new THREE.BoxGeometry(1.1, 1.3, 1.1),
  pipelineRail: new THREE.BoxGeometry(16, 0.12, 0.12),
  pipelineGuide: new THREE.BoxGeometry(16, 0.02, 0.02),
  coreOuter: new THREE.TorusGeometry(3.4, 0.22, 12, 64),
  coreMid: new THREE.TorusGeometry(2.6, 0.16, 12, 64),
  coreInner: new THREE.TorusGeometry(1.8, 0.12, 10, 56),
  coreConduit: new THREE.TorusGeometry(1.15, 0.035, 8, 64),
  coreCenter: new THREE.OctahedronGeometry(0.55, 0),
  handshakeRing: new THREE.TorusGeometry(3.3, 0.03, 8, 72),
  handshakeWire: new THREE.TorusGeometry(3.8, 0.015, 6, 72),
  arrivalBaseline: new THREE.BoxGeometry(5.2, 0.04, 0.04),
  arrivalCage: new THREE.BoxGeometry(10.5, 6, 6, 2, 2, 2),
}
