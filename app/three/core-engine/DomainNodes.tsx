"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Html, Line } from "@react-three/drei";
import gsap from "gsap";
import { ENGINEERING_DOMAINS, COLORS } from "../../config";
import { sceneManager } from "../SceneManager";
import { particleEngine } from "../world-engine";
import { SceneState } from "../../types";

export function DomainNodes({ sceneState }: { sceneState: SceneState }) {
  // Arrow key navigation
  useEffect(() => {
    if (sceneState.currentSceneId !== 2) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'ArrowRight', 'a', 'd'].includes(e.key)) {
        const currentIdx = sceneState.activeDomainId 
          ? ENGINEERING_DOMAINS.findIndex(d => d.id === sceneState.activeDomainId) 
          : -1;
          
        let nextIdx = 0;
        if (currentIdx !== -1) {
          const dir = (e.key === 'ArrowRight' || e.key === 'd') ? 1 : -1;
          nextIdx = (currentIdx + dir + ENGINEERING_DOMAINS.length) % ENGINEERING_DOMAINS.length;
        }
        
        sceneManager.setDomain(ENGINEERING_DOMAINS[nextIdx].id);
      } else if (e.key === 'Escape') {
        sceneManager.setDomain(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sceneState.currentSceneId, sceneState.activeDomainId]);

  if (sceneState.currentSceneId !== 2) return null;

  return (
    <group>
      {ENGINEERING_DOMAINS.map((domain) => (
        <DomainNode key={domain.id} data={domain} activeDomainId={sceneState.activeDomainId} />
      ))}
    </group>
  );
}

function DomainNode({ data, activeDomainId }: { data: typeof ENGINEERING_DOMAINS[0], activeDomainId?: string | null }) {
  const [hovered, setHovered] = useState(false);
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshPhysicalMaterial>(null);
  
  const isActive = activeDomainId === data.id;
  const isAnotherActive = activeDomainId !== null && !isActive;

  useEffect(() => {
    if (hovered || isActive) {
      particleEngine.setAttractor(data.pos);
    } else {
      particleEngine.setAttractor(null);
    }
    return () => particleEngine.setAttractor(null);
  }, [hovered, isActive, data.pos]);

  useEffect(() => {
    if (!meshRef.current || !matRef.current) return;
    
    const targetScale = isActive ? 1.5 : hovered ? 1.2 : 1;
    const targetEmissive = isActive ? 2.0 : hovered ? 1.0 : 0.2;
    
    gsap.to(meshRef.current.scale, {
      x: targetScale,
      y: targetScale,
      z: targetScale,
      duration: 0.3,
      ease: "power2.out",
      overwrite: "auto"
    });
    
    gsap.to(matRef.current, {
      emissiveIntensity: targetEmissive,
      duration: 0.3,
      ease: "power2.out",
      overwrite: "auto"
    });
  }, [isActive, hovered]);

  const geo = useMemo(() => {
    switch (data.geometry) {
      case "icosahedron": return new THREE.IcosahedronGeometry(0.4, 1);
      case "octahedron": return new THREE.OctahedronGeometry(0.4, 0);
      case "box": return new THREE.BoxGeometry(0.5, 0.5, 0.5);
      case "dodecahedron": return new THREE.DodecahedronGeometry(0.4, 0);
      case "tetrahedron": return new THREE.TetrahedronGeometry(0.5, 0);
      default: return new THREE.SphereGeometry(0.4, 32, 32);
    }
  }, [data.geometry]);

  const handleClick = (e: any) => {
    e.stopPropagation();
    sceneManager.setDomain(isActive ? null : data.id);
  };

  const opacity = isAnotherActive ? 0.1 : 1;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick(e as any);
    }
  };

  useFrame((state, delta) => {
    if (meshRef.current) {
      const speed = (isActive || isAnotherActive) ? 0.05 : 0.4;
      meshRef.current.rotation.y += speed * delta;
      meshRef.current.rotation.x += speed * delta * 0.5;
    }
  });

  return (
    <group position={data.pos}>
      <mesh 
        ref={meshRef}
        geometry={geo}
        onClick={handleClick}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
        onPointerOut={(e) => { e.stopPropagation(); setHovered(false); }}
      >
        <meshPhysicalMaterial 
          ref={matRef}
          color={hovered || isActive ? data.color : COLORS.surface}
          emissive={hovered || isActive ? data.color : COLORS.emeraldDeep}
          roughness={0.2}
          metalness={0.7}
          transparent
          opacity={opacity}
        />
      </mesh>

      <Line 
        points={[[0, 0, 0], [-data.pos[0], -data.pos[1], -data.pos[2]]]} 
        color={data.color} 
        transparent 
        opacity={isAnotherActive ? 0.02 : hovered || isActive ? 0.6 : 0.1} 
        lineWidth={isActive ? 3 : hovered ? 2 : 1} 
      />

      <Html position={[0.7, 0, 0]} className={`transition-all duration-500 origin-left ${isActive ? 'opacity-100 scale-100 pointer-events-auto z-[100]' : 'opacity-0 scale-90 pointer-events-none z-10'}`}>
        <div className={`w-[320px] bg-black/90 backdrop-blur-xl border rounded-xl p-6 text-left shadow-[0_0_40px_rgba(0,0,0,0.5)] transition-colors duration-300`} style={{ borderColor: `${data.color}40` }}>
          
          <button 
            className="sr-only" 
            onKeyDown={handleKeyDown}
            onFocus={() => setHovered(true)}
            onBlur={() => setHovered(false)}
            aria-label={`Select ${data.title}`}
          >
            Select {data.title}
          </button>

          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold text-white tracking-wide" style={{ color: data.color }}>{data.title}</h3>
            {isActive && (
              <button 
                onClick={(e) => { e.stopPropagation(); sceneManager.setDomain(null); }}
                className="text-zinc-500 hover:text-white transition-colors cursor-pointer"
                aria-label="Close panel"
              >
                ✕
              </button>
            )}
          </div>
          
          <p className="mt-2 text-sm text-zinc-300 leading-relaxed font-light">
            {data.desc}
          </p>

          <div className="mt-5 border-t border-white/10 pt-4">
            <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-3 block">Key Capabilities</span>
            <ul className="space-y-2">
              {data.capabilities.map((cap, i) => (
                <li key={i} className="text-sm text-zinc-200 flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full mr-3" style={{ backgroundColor: data.color }}></span>
                  {cap}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Html>
    </group>
  );
}
