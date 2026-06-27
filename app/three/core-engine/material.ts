import { useMemo } from "react";
import * as THREE from "three";
import { COLORS } from "../../config";
import { performanceManager } from "../PerformanceManager";

export function useCoreMaterials() {
  const quality = performanceManager.getQuality();
  
  const isHighQuality = quality === "Ultra" || quality === "High";

  const innerGlassMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: COLORS.background, // Deep dark base
    emissive: COLORS.emeraldDeep,
    emissiveIntensity: 0.05, // Subtle internal warmth
    roughness: isHighQuality ? 0.08 : 0.2,
    metalness: 0.9,
    transparent: true,
    opacity: 0.9,
    transmission: isHighQuality ? 0.98 : 0, 
    thickness: 2.0,
    ior: 1.5,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
  }), [isHighQuality]);

  const outerEdgeMaterial = useMemo(() => new THREE.LineBasicMaterial({
    color: COLORS.emeraldPrimary,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending, // Makes overlapping lines glow brighter
  }), []);

  return { innerGlassMaterial, outerEdgeMaterial };
}
