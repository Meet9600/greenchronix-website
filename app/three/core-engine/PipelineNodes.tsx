"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Html, Line } from "@react-three/drei";
import gsap from "gsap";
import { PIPELINE_STAGES, COLORS } from "../../config";
import { sceneManager } from "../SceneManager";

function PipelineNode({ data, activePipelineStageId }: { data: typeof PIPELINE_STAGES[0], activePipelineStageId?: string | null }) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Group>(null);
  const matRef = useRef<THREE.MeshPhysicalMaterial>(null);
  const geoRef = useRef<THREE.Mesh>(null);
  
  const isActive = activePipelineStageId === data.id;
  const isAnotherActive = activePipelineStageId !== null && !isActive;

  useEffect(() => {
    if (!geoRef.current || !matRef.current) return;
    
    const targetScale = isActive || hovered ? 1.4 : 1;
    const targetEmissive = isActive || hovered ? 2.0 : 0.4;
    
    gsap.to(geoRef.current.scale, {
      x: targetScale,
      y: targetScale,
      z: targetScale,
      duration: 0.4,
      ease: "power2.out",
      overwrite: "auto"
    });
    
    gsap.to(matRef.current, {
      emissiveIntensity: targetEmissive,
      duration: 0.4,
      ease: "power2.out",
      overwrite: "auto"
    });
  }, [isActive, hovered]);

  const geo = useMemo(() => {
    switch (data.geometry) {
      case "torus": return new THREE.TorusGeometry(0.5, 0.05, 16, 64);
      case "box-wireframe": return new THREE.BoxGeometry(0.8, 0.8, 0.8);
      case "stacked-boxes": return new THREE.BoxGeometry(0.8, 0.8, 0.8, 2, 2, 2);
      case "shield-rings": return new THREE.TorusGeometry(0.6, 0.05, 16, 64);
      case "burst": return new THREE.IcosahedronGeometry(0.6, 1);
      case "infinity": return new THREE.TorusKnotGeometry(0.4, 0.1, 100, 16);
      default: return new THREE.SphereGeometry(0.5, 32, 32);
    }
  }, [data.geometry]);

  const isWireframe = data.geometry === "box-wireframe" || data.geometry === "burst";

  useFrame((state, delta) => {
    if (meshRef.current) {
      const speed = (isActive || isAnotherActive) ? 0.05 : 0.5;
      meshRef.current.rotation.y += speed * delta;
      meshRef.current.rotation.z += speed * delta * 0.5;
    }
  });

  return (
    <group position={data.pos} ref={meshRef}>
      <mesh 
        ref={geoRef}
        geometry={geo}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); sceneManager.setPipelineStage(data.id); }}
        onPointerOut={(e) => { e.stopPropagation(); setHovered(false); sceneManager.setPipelineStage(null); }}
      >
        <meshPhysicalMaterial 
          ref={matRef}
          color={hovered || isActive ? data.color : COLORS.surface}
          emissive={data.color}
          roughness={0.2}
          metalness={0.8}
          wireframe={isWireframe}
          transparent
          opacity={isAnotherActive ? 0.1 : 1}
        />
      </mesh>

      <Html 
        position={[1, 0, 0]} 
        className={`transition-all duration-500 origin-left ${isActive || hovered ? 'opacity-100 scale-100 pointer-events-auto z-[100]' : 'opacity-0 scale-90 pointer-events-none z-10'}`}
      >
        <div className="w-[300px] bg-black/80 backdrop-blur-md border rounded-lg p-5 text-left shadow-[0_0_30px_rgba(0,0,0,0.5)]" style={{ borderColor: `${data.color}40` }}>
          <h3 className="text-lg font-bold tracking-wide" style={{ color: data.color }}>{data.title}</h3>
          <p className="mt-2 text-sm text-zinc-300 leading-relaxed font-light">
            {data.desc}
          </p>
        </div>
      </Html>
    </group>
  );
}

export function PipelineNodes({ activePipelineStageId }: { activePipelineStageId?: string | null }) {
  const linePoints = useMemo(() => {
    return [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, -32)
    ];
  }, []);

  return (
    <group>
      {/* Central Energy Pipeline */}
      <Line 
        points={linePoints} 
        color={COLORS.emeraldPrimary} 
        lineWidth={2} 
        transparent 
        opacity={0.3} 
      />

      {PIPELINE_STAGES.map((stage) => (
        <PipelineNode 
          key={stage.id} 
          data={stage} 
          activePipelineStageId={activePipelineStageId} 
        />
      ))}
    </group>
  );
}
