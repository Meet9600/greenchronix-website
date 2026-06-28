"use client";

import React, { useRef, useEffect, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useCoreMaterials } from "./material";
import { useCoreGeometry } from "./geometry";
import { CoreAnimationController } from "./animation";
import { CoreEngineProps } from "./types";
import { NetworkNodes } from "./NetworkNodes";
import { DomainNodes } from "./DomainNodes";
import { PipelineNodes } from "./PipelineNodes";
import { ImpactNodes } from "./ImpactNodes";
import { ArchitectureNodes } from "./ArchitectureNodes";
import { ENGINEERING_DOMAINS } from "../../config";

export function EngineeringCore({ sceneState }: CoreEngineProps) {
  const groupRef = useRef<THREE.Group>(null);
  const networkRef = useRef<THREE.Group>(null);
  const pointLightRef = useRef<THREE.PointLight>(null);
  const animControllerRef = useRef<CoreAnimationController | null>(null);

  // Isolate logic into custom hooks (Material, Geometry)
  const { innerCoreGeo, edgesGeo } = useCoreGeometry();
  const { innerGlassMaterial, outerEdgeMaterial } = useCoreMaterials();

  // Determine active color for core glow
  const targetColor = useMemo(() => {
    if (sceneState.activeDomainId) {
      const domain = ENGINEERING_DOMAINS.find(d => d.id === sceneState.activeDomainId);
      return new THREE.Color(domain ? domain.color : "#00E38C");
    }
    return new THREE.Color("#00E38C");
  }, [sceneState.activeDomainId]);

  useFrame(() => {
    if (pointLightRef.current) {
      pointLightRef.current.color.lerp(targetColor, 0.05);
    }
  });

  // Initialize Animation Controller
  useEffect(() => {
    if (groupRef.current && networkRef.current && !animControllerRef.current) {
      animControllerRef.current = new CoreAnimationController(groupRef.current, networkRef.current);
    }
  }, []);

  // Update Animation Controller state
  useEffect(() => {
    if (animControllerRef.current) {
      animControllerRef.current.onStateChange(sceneState);
    }
  }, [sceneState]);

  // Hook into the render loop for continuous rotation
  useFrame((state, delta) => {
    if (animControllerRef.current) {
      animControllerRef.current.onFrame(delta);
    }
  });

  return (
    <>
      <group>
        <group ref={groupRef}>
          <mesh geometry={innerCoreGeo} material={innerGlassMaterial} />
          <lineSegments geometry={edgesGeo} material={outerEdgeMaterial} />
          <pointLight ref={pointLightRef} color="#00E38C" intensity={0.4} distance={8} decay={2} />
          
          <group ref={networkRef} scale={0.001}>
            <NetworkNodes />
          </group>
        </group>

        <DomainNodes sceneState={sceneState} />
        {sceneState.currentSceneId >= 3 && (
          <PipelineNodes activePipelineStageId={sceneState.activePipelineStageId} />
        )}
        {sceneState.currentSceneId >= 4 && (
          <ImpactNodes activeImpactDomainId={sceneState.activeImpactDomainId} />
        )}
        {sceneState.currentSceneId >= 5 && (
          <ArchitectureNodes activeArchitectureLayerId={sceneState.activeArchitectureLayerId} />
        )}
      </group>
    </>
  );
}
