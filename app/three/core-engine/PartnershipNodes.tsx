"use client";

import React, { useRef, useState, useMemo, useEffect } from "react";
import * as THREE from "three";
import { useFrame, ThreeEvent } from "@react-three/fiber";
import gsap from "gsap";
import { PARTNERSHIP_STAGES, COLORS } from "../../config";
import { sceneManager } from "../SceneManager";

export function PartnershipNodes({ activeStageId, hoveredStageId }: { activeStageId?: string | null, hoveredStageId?: string | null }) {
  const rootRef = useRef<THREE.Group>(null);
  const clientEcosystemRef = useRef<THREE.Group>(null);
  const bridgeRef = useRef<THREE.Group>(null);
  
  // Bridge runs from X=0 to X=20 at Y=12, Z=-29
  const origin = new THREE.Vector3(0, 12, -29);
  const destination = new THREE.Vector3(25, 12, -29);
  const distance = origin.distanceTo(destination);

  useFrame((state, delta) => {
    if (clientEcosystemRef.current) {
      // Client Ecosystem revolves slowly
      clientEcosystemRef.current.rotation.y += delta * 0.1;
      clientEcosystemRef.current.rotation.x += delta * 0.05;
    }
  });

  // Fade in animation
  useEffect(() => {
    if (rootRef.current) {
      rootRef.current.scale.set(0.01, 0.01, 0.01);
      gsap.to(rootRef.current.scale, {
        x: 1, y: 1, z: 1,
        duration: 1.5,
        ease: "power2.out"
      });
    }
  }, []);

  return (
    <group ref={rootRef}>
      {/* Client Ecosystem (Right side) */}
      <group position={[destination.x, destination.y, destination.z]} ref={clientEcosystemRef}>
        <ClientEcosystem activeStageId={activeStageId} hoveredStageId={hoveredStageId} />
      </group>

      {/* Engineering Bridge */}
      <group position={[origin.x, origin.y, origin.z]} ref={bridgeRef}>
        <EngineeringBridge distance={distance} activeStageId={activeStageId} hoveredStageId={hoveredStageId} />
      </group>
    </group>
  );
}

function ClientEcosystem({ activeStageId, hoveredStageId }: { activeStageId?: string | null, hoveredStageId?: string | null }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const count = 150;
  
  // Pre-calculate positions using useState lazy initializer to avoid useMemo impurity
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const [positions] = useState(() => {
    return Array.from({ length: count }, () => {
      const radius = 4 + Math.random() * 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      return new THREE.Vector3(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.sin(phi) * Math.sin(theta),
        radius * Math.cos(phi)
      );
    });
  });

  const activeIndex = PARTNERSHIP_STAGES.findIndex(s => s.id === (activeStageId || hoveredStageId));
  // Structure level increases from 0 (chaotic) to 1 (structured) based on the stage progress
  const structureLevel = activeIndex !== -1 ? (activeIndex + 1) / PARTNERSHIP_STAGES.length : 0; 

  useFrame((state) => {
    if (!meshRef.current) return;
    
    // The more structured, the more the particles align to a grid or perfect sphere
    const time = state.clock.elapsedTime;
    
    positions.forEach((pos, i) => {
      // Structured target: perfect sphere
      const perfectRadius = 5;
      const pTheta = (i / count) * Math.PI * 2 * 10;
      const pPhi = Math.acos(-1 + (2 * i) / count);
      const structuredPos = new THREE.Vector3(
        perfectRadius * Math.sin(pPhi) * Math.cos(pTheta),
        perfectRadius * Math.sin(pPhi) * Math.sin(pTheta),
        perfectRadius * Math.cos(pPhi)
      );

      // Interpolate based on structureLevel (0 = chaotic, 1 = structured)
      const currentPos = new THREE.Vector3().lerpVectors(pos, structuredPos, structureLevel);
      
      // Add subtle noise
      currentPos.x += Math.sin(time * 2 + i) * 0.1 * (1 - structureLevel * 0.8);
      currentPos.y += Math.cos(time * 2 + i) * 0.1 * (1 - structureLevel * 0.8);
      
      dummy.position.copy(currentPos);
      dummy.scale.setScalar(0.2 + (structureLevel * 0.3));
      
      // Orient them towards center if structured
      if (structureLevel > 0.5) {
        dummy.lookAt(0, 0, 0);
      } else {
        dummy.rotation.x = time * 0.5 + i;
        dummy.rotation.y = time * 0.3 + i;
      }
      
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
        <boxGeometry args={[0.2, 0.2, 0.5]} />
        <meshPhysicalMaterial 
          color="#0ea5e9" 
          emissive="#0ea5e9" 
          emissiveIntensity={0.8 + (structureLevel * 0.7)}
          transparent 
          opacity={0.6 + (structureLevel * 0.3)} 
        />
      </instancedMesh>
      {/* Central Core of Client Ecosystem */}
      <mesh>
        <sphereGeometry args={[2, 32, 32]} />
        <meshPhysicalMaterial color="#0284c7" wireframe transparent opacity={0.3} />
      </mesh>
    </>
  );
}

function EngineeringBridge({ distance, activeStageId, hoveredStageId }: { distance: number, activeStageId?: string | null, hoveredStageId?: string | null }) {
  
  const stageSpacing = distance / (PARTNERSHIP_STAGES.length + 1);

  return (
    <group>
      {/* The Core Bridge Beam */}
      <mesh position={[distance / 2, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, distance, 8]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.1} />
        <group rotation={[0, 0, Math.PI / 2]} />
      </mesh>
      <mesh position={[distance / 2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.05, 0.05, distance, 8]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.1} />
      </mesh>

      {/* Energy Flows */}
      <EnergyFlow distance={distance} direction={1} color={COLORS.emeraldPrimary} yOffset={0.5} speed={2} />
      <EnergyFlow distance={distance} direction={-1} color="#0ea5e9" yOffset={-0.5} speed={1.5} />

      {/* Connection Points (Stages) */}
      {PARTNERSHIP_STAGES.map((stage, index) => {
        const xPos = stageSpacing * (index + 1);
        const isActive = activeStageId === stage.id;
        const isHovered = hoveredStageId === stage.id;
        return (
          <BridgeNode 
            key={stage.id}
            stage={stage}
            position={[xPos, 0, 0]}
            isActive={isActive}
            isHovered={isHovered}
          />
        );
      })}
    </group>
  );
}

function BridgeNode({ stage, position, isActive, isHovered }: { stage: typeof PARTNERSHIP_STAGES[0], position: [number, number, number], isActive: boolean, isHovered: boolean }) {
  const nodeRef = useRef<THREE.Group>(null);
  
  useEffect(() => {
    if (!nodeRef.current) return;
    const targetScale = isActive ? 1.5 : (isHovered ? 1.2 : 1.0);
    gsap.to(nodeRef.current.scale, {
      x: targetScale,
      y: targetScale,
      z: targetScale,
      duration: 0.4,
      ease: "power2.out"
    });
  }, [isActive, isHovered]);

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    document.body.style.cursor = "pointer";
    sceneManager.setHoveredPartnershipStage(stage.id);
  };

  const handlePointerOut = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    document.body.style.cursor = "auto";
    sceneManager.setHoveredPartnershipStage(null);
  };

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    sceneManager.setPartnershipStage(isActive ? null : stage.id);
  };

  return (
    <group 
      position={position} 
      ref={nodeRef}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    >
      {/* Node Geometry */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.8, 0.1, 16, 32]} />
        <meshPhysicalMaterial 
          color={isActive || isHovered ? COLORS.emeraldPrimary : "#6b7280"} 
          emissive={isActive || isHovered ? COLORS.emeraldPrimary : "#000000"}
          emissiveIntensity={isActive ? 2 : (isHovered ? 1 : 0)}
        />
      </mesh>
      {/* Node Core */}
      <mesh>
        <octahedronGeometry args={[0.4]} />
        <meshBasicMaterial color={isActive ? "#ffffff" : "#9ca3af"} />
      </mesh>
    </group>
  );
}

function EnergyFlow({ distance, direction, color, yOffset, speed }: { distance: number, direction: number, color: string, yOffset: number, speed: number }) {
  const flowRef = useRef<THREE.Group>(null);
  const particleCount = 12;
  
  // Track positions manually to avoid mutating refs
  const [positions] = useState(() => Array.from({ length: particleCount }, (_, i) => (distance / particleCount) * i));

  useFrame((state, delta) => {
    if (!flowRef.current) return;
    
    flowRef.current.children.forEach((child, i) => {
      positions[i] += direction * speed * delta * 5;
      
      if (direction === 1 && positions[i] > distance) {
        positions[i] = 0;
      } else if (direction === -1 && positions[i] < 0) {
        positions[i] = distance;
      }
      
      child.position.x = positions[i];
    });
  });

  return (
    <group ref={flowRef} position={[0, yOffset, 0]}>
      {positions.map((x, i) => (
        <mesh key={i} position={[x, 0, 0]}>
          <boxGeometry args={[0.8, 0.05, 0.05]} />
          <meshBasicMaterial color={color} />
        </mesh>
      ))}
    </group>
  );
}
