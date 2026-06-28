"use client";

import React, { useRef, useState, useMemo, useEffect } from "react";
import * as THREE from "three";
import { useFrame, ThreeEvent } from "@react-three/fiber";
import { Html, Box, Cylinder } from "@react-three/drei";
import gsap from "gsap";
import { ARCHITECTURE_LAYERS, COLORS } from "../../config";
import { sceneManager } from "../SceneManager";
import { particleEngine } from "../world-engine";

// --- Custom Internal Architectures per Layer ---

function LayerTechnologies({ layerId, color, isActive }: { layerId: string, color: string, isActive: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state, delta) => {
    if (groupRef.current && isActive) {
      const time = state.clock.elapsedTime;
      groupRef.current.children.forEach((child, i) => {
        if (child.type === "Mesh") {
          // Subtle floating motion
          child.position.y = Math.sin(time * 2 + i) * 0.1;
          child.rotation.y += 0.2 * delta * (i % 2 === 0 ? 1 : -1);
        }
      });
    }
  });

  // Different geometric layouts based on layer
  const renderLayout = () => {
    switch(layerId) {
      case "infrastructure": // Network of robust cubes
        return Array.from({length: 4}).map((_, i) => (
          <mesh key={i} position={[(i%2 - 0.5) * 1.5, 0, (Math.floor(i/2) - 0.5) * 1.5]}>
            <boxGeometry args={[0.5, 0.5, 0.5]} />
            <meshPhysicalMaterial color={color} emissive={color} emissiveIntensity={2} transparent opacity={0.8} />
          </mesh>
        ));
      case "cloud-platform": // Floating scalable platforms
        return Array.from({length: 3}).map((_, i) => (
          <mesh key={i} position={[(i - 1) * 1.2, 0, 0]}>
            <cylinderGeometry args={[0.4, 0.4, 0.2, 16]} />
            <meshPhysicalMaterial color={color} emissive={color} emissiveIntensity={2} transparent opacity={0.8} />
          </mesh>
        ));
      case "data-platform": // Streaming pipes and storage blocks
        return Array.from({length: 5}).map((_, i) => (
          <mesh key={i} position={[(i - 2) * 0.6, 0, 0]} rotation={[Math.PI/2, 0, 0]}>
            <cylinderGeometry args={[0.2, 0.2, 0.8, 8]} />
            <meshPhysicalMaterial color={color} emissive={color} emissiveIntensity={2} transparent opacity={0.8} />
          </mesh>
        ));
      case "intelligence": // Neural nodes
        return Array.from({length: 6}).map((_, i) => {
          const angle = (i / 6) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(angle), 0, Math.sin(angle)]}>
              <icosahedronGeometry args={[0.25, 0]} />
              <meshPhysicalMaterial color={color} emissive={color} emissiveIntensity={3} />
            </mesh>
          )
        });
      case "business-apps": // Interconnected enterprise modules
        return Array.from({length: 4}).map((_, i) => (
          <mesh key={i} position={[(i%2 - 0.5) * 1.2, 0.2, (Math.floor(i/2) - 0.5) * 1.2]}>
            <boxGeometry args={[0.8, 0.1, 0.8]} />
            <meshPhysicalMaterial color={color} emissive={color} emissiveIntensity={2} transparent opacity={0.8} />
          </mesh>
        ));
      case "experience": // Cinematic presentation layers
        return (
          <mesh position={[0, 0.3, 0]}>
            <planeGeometry args={[2, 1.2]} />
            <meshPhysicalMaterial color={color} emissive={color} emissiveIntensity={1.5} transparent opacity={0.8} side={THREE.DoubleSide} />
          </mesh>
        );
      case "users": // The apex focus point
        return (
          <mesh position={[0, 0.5, 0]}>
            <octahedronGeometry args={[0.5, 0]} />
            <meshPhysicalMaterial color={color} emissive={color} emissiveIntensity={3} transparent opacity={0.9} />
          </mesh>
        );
      default:
        return null;
    }
  };

  return (
    <group ref={groupRef} scale={1.5} position={[0, 0.5, 0]}>
      {renderLayout()}
    </group>
  );
}

// --- Individual Layer Node ---

function LayerNode({ 
  data, 
  index,
  activeLayerId, 
  hoveredLayerId 
}: { 
  data: typeof ARCHITECTURE_LAYERS[0],
  index: number,
  activeLayerId?: string | null,
  hoveredLayerId?: string | null
}) {
  const [localHover, setLocalHover] = useState(false);
  const layerRef = useRef<THREE.Group>(null);
  const platformMatRef = useRef<THREE.MeshPhysicalMaterial>(null);
  const techGroupRef = useRef<THREE.Group>(null);

  const isActive = activeLayerId === data.id;
  
  // Determine if this layer is part of the illuminated dependency chain
  const activeIndex = ARCHITECTURE_LAYERS.findIndex(l => l.id === activeLayerId);
  const hoveredIndex = ARCHITECTURE_LAYERS.findIndex(l => l.id === hoveredLayerId);
  
  // A layer is a dependency if it's BELOW or EQUAL TO the currently hovered/active layer
  const targetIndex = activeIndex !== -1 ? activeIndex : hoveredIndex;
  const isDependency = targetIndex !== -1 && index <= targetIndex;
  const isDirectTarget = isActive || localHover;

  useEffect(() => {
    if (localHover || isActive) {
      particleEngine.setAttractor([0, data.yOffset, -29]);
    }
    sceneManager.setHoveredArchitectureLayer(localHover ? data.id : null);
    
    return () => {
      particleEngine.setAttractor(null);
      sceneManager.setHoveredArchitectureLayer(null);
    };
  }, [localHover, isActive, data.yOffset, data.id]);

  useEffect(() => {
    if (!layerRef.current || !platformMatRef.current || !techGroupRef.current) return;
    
    const targetScale = isDirectTarget ? 1.1 : 1;
    // Glow brightly if direct target, glow softly if dependency, dim if not related
    const targetEmissive = isDirectTarget ? 3.0 : isDependency ? 1.0 : 0.1;
    const targetOpacity = isDirectTarget ? 0.9 : isDependency ? 0.5 : 0.15;
    
    gsap.to(layerRef.current.scale, {
      x: targetScale,
      z: targetScale,
      duration: 0.5,
      ease: "power2.out",
      overwrite: "auto"
    });
    
    gsap.to(platformMatRef.current, {
      emissiveIntensity: targetEmissive,
      opacity: targetOpacity,
      duration: 0.4,
      ease: "power2.out",
      overwrite: "auto"
    });

    // Expand technologies inside the layer
    gsap.to(techGroupRef.current.scale, {
      x: isActive ? 1 : 0.001,
      y: isActive ? 1 : 0.001,
      z: isActive ? 1 : 0.001,
      duration: 0.8,
      ease: "elastic.out(1, 0.7)",
      overwrite: "auto"
    });
    
  }, [isDirectTarget, isDependency, isActive]);

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    sceneManager.setArchitectureLayer(isActive ? null : data.id);
  };

  return (
    <group 
      position={[0, data.yOffset, 0]} 
      ref={layerRef}
      onPointerOver={(e: ThreeEvent<PointerEvent>) => { e.stopPropagation(); setLocalHover(true); }}
      onPointerOut={(e: ThreeEvent<PointerEvent>) => { e.stopPropagation(); setLocalHover(false); }}
      onClick={handleClick}
    >
      {/* Structural Glass Platform */}
      <mesh receiveShadow castShadow>
        <boxGeometry args={[4, 0.2, 4]} />
        <meshPhysicalMaterial 
          ref={platformMatRef}
          color={COLORS.surface}
          emissive={data.color}
          roughness={0.1}
          metalness={0.9}
          transparent
          opacity={0.15}
        />
      </mesh>
      
      {/* Wireframe outer perimeter */}
      <mesh>
        <boxGeometry args={[4.2, 0.4, 4.2]} />
        <meshBasicMaterial color={data.color} wireframe transparent opacity={isDependency ? 0.4 : 0.1} />
      </mesh>

      {/* Internal Engineering Components */}
      <group ref={techGroupRef} scale={0.001}>
        <LayerTechnologies layerId={data.id} color={data.color} isActive={isActive} />
        
        {/* Minimal 3D Component Labels */}
        <Html position={[0, 1.5, 0]} center className="pointer-events-none transition-opacity duration-300" style={{ opacity: isActive ? 1 : 0 }}>
          <div className="flex flex-col items-center gap-1">
            {data.technologies.map(tech => (
              <span key={tech} className="text-white font-bold tracking-widest uppercase text-[9px] bg-black/50 px-2 py-0.5 rounded border border-white/20" style={{ color: data.color, boxShadow: `0 0 10px ${data.color}40` }}>
                {tech}
              </span>
            ))}
          </div>
        </Html>
      </group>
    </group>
  );
}

// --- Energy Column Flow ---

function EnergySpine({ activeLayerId, hoveredLayerId }: { activeLayerId?: string | null, hoveredLayerId?: string | null }) {
  const spineRef = useRef<THREE.Group>(null);
  
  // Height calculation: How high does the energy flow need to go?
  const activeIndex = ARCHITECTURE_LAYERS.findIndex(l => l.id === activeLayerId);
  const hoveredIndex = ARCHITECTURE_LAYERS.findIndex(l => l.id === hoveredLayerId);
  const targetIndex = activeIndex !== -1 ? activeIndex : hoveredIndex;
  
  // Target height is the yOffset of the highest dependent layer
  const targetHeight = targetIndex !== -1 ? ARCHITECTURE_LAYERS[targetIndex].yOffset : 0;
  
  useFrame((state, delta) => {
    if (spineRef.current) {
      spineRef.current.children.forEach((mesh, i) => {
        // Animate UV or position to create upward flow
        mesh.position.y += delta * 4 * (i + 1);
        if (mesh.position.y > 24) mesh.position.y = 0;
        
        // Hide energy above target layer
        mesh.visible = mesh.position.y <= targetHeight && targetHeight > 0;
      });
    }
  });

  return (
    <group>
      {/* Central static physical spine */}
      <Cylinder args={[0.2, 0.2, 25, 8]} position={[0, 12, 0]}>
        <meshBasicMaterial color={COLORS.emeraldSoft} wireframe transparent opacity={0.1} />
      </Cylinder>
      
      {/* Flowing energy packets */}
      <group ref={spineRef}>
        {Array.from({length: 15}).map((_, i) => (
          <mesh key={i} position={[0, Math.random() * 24, 0]}>
            <boxGeometry args={[0.3, 0.8, 0.3]} />
            <meshBasicMaterial color={COLORS.emeraldPrimary} transparent opacity={0.8} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// --- Main Architecture Assembly ---

export function ArchitectureNodes({ activeArchitectureLayerId }: { activeArchitectureLayerId?: string | null }) {
  const rootRef = useRef<THREE.Group>(null);
  const originZ = -29;
  
  const state = sceneManager.getState();
  const hoveredArchitectureLayerId = state.hoveredArchitectureLayerId;

  useFrame(() => {
    if (rootRef.current) {
      const p = Math.max(0, Math.min(1, (sceneManager.getState().scrollProgress - 0.83) / 0.17));
      // Subtly scale the whole architecture based on scroll progress to 'unfold' it
      rootRef.current.scale.set(p, p, p);
      rootRef.current.visible = p > 0.01;
    }
  });

  return (
    <group ref={rootRef} position={[0, 0, originZ]}>
      {/* The Central Structural and Energy Spine */}
      <EnergySpine activeLayerId={activeArchitectureLayerId} hoveredLayerId={hoveredArchitectureLayerId} />

      {/* The Stacked Architectural Layers */}
      {ARCHITECTURE_LAYERS.map((layer, index) => (
        <LayerNode 
          key={layer.id} 
          data={layer} 
          index={index}
          activeLayerId={activeArchitectureLayerId} 
          hoveredLayerId={hoveredArchitectureLayerId}
        />
      ))}
    </group>
  );
}
