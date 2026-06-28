"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Html, QuadraticBezierLine } from "@react-three/drei";
import gsap from "gsap";
import { IMPACT_DOMAINS, COLORS } from "../../config";
import { sceneManager } from "../SceneManager";
import { particleEngine } from "../world-engine";

// --- Custom Architectures ---

function AIArchitecture({ color, isActive }: { color: string, isActive: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state, delta) => {
    if (groupRef.current && isActive) {
      groupRef.current.rotation.y += 0.2 * delta;
      groupRef.current.rotation.x += 0.1 * delta;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Central neural core */}
      <mesh>
        <icosahedronGeometry args={[0.5, 1]} />
        <meshPhysicalMaterial color={color} emissive={color} emissiveIntensity={2} wireframe transparent opacity={0.4} />
      </mesh>
      {/* Orbiting inference nodes */}
      {Array.from({ length: 6 }).map((_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        const x = Math.cos(angle) * 1.2;
        const z = Math.sin(angle) * 1.2;
        const y = Math.sin(angle * 2) * 0.5;
        return (
          <group key={i}>
            <mesh position={[x, y, z]}>
              <sphereGeometry args={[0.1, 8, 8]} />
              <meshPhysicalMaterial color={color} emissive={color} emissiveIntensity={3} />
            </mesh>
            <QuadraticBezierLine start={[0,0,0]} end={[x, y, z]} color={color} opacity={0.3} lineWidth={1} transparent />
          </group>
        );
      })}
    </group>
  );
}

function EnterpriseArchitecture({ color, isActive }: { color: string, isActive: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current && isActive) {
      const time = state.clock.elapsedTime;
      groupRef.current.children.forEach((child, i) => {
        if (child.type === "Mesh") {
          child.position.y = Math.sin(time * 2 + i) * 0.2;
        }
      });
      groupRef.current.rotation.y = Math.sin(time * 0.5) * 0.2;
    }
  });

  const nodes = [
    [-0.8, 0, -0.8], [0, 0, -0.8], [0.8, 0, -0.8],
    [-0.8, 0, 0],    [0, 0, 0],    [0.8, 0, 0],
    [-0.8, 0, 0.8],  [0, 0, 0.8],  [0.8, 0, 0.8],
  ];

  return (
    <group ref={groupRef}>
      {/* Platform modules */}
      {nodes.map((pos, i) => (
        <mesh key={i} position={new THREE.Vector3(pos[0], pos[1], pos[2])}>
          <boxGeometry args={[0.3, 0.3, 0.3]} />
          <meshPhysicalMaterial color={color} emissive={color} emissiveIntensity={i % 2 === 0 ? 2 : 0.5} transparent opacity={0.8} />
        </mesh>
      ))}
      {/* Workflow orchestrator base */}
      <mesh position={[0, -0.4, 0]}>
        <boxGeometry args={[2.2, 0.05, 2.2]} />
        <meshBasicMaterial color={color} wireframe transparent opacity={0.2} />
      </mesh>
    </group>
  );
}

function DataArchitecture({ color, isActive }: { color: string, isActive: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current && isActive) {
      const time = state.clock.elapsedTime;
      groupRef.current.rotation.z = time * 0.2;
      groupRef.current.rotation.x = Math.sin(time * 0.5) * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Streaming pipelines */}
      {[0, 1, 2].map((i) => {
        const r = 0.8 - (i * 0.25);
        return (
          <mesh key={i} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[r, 0.02, 16, 64]} />
            <meshPhysicalMaterial color={color} emissive={color} emissiveIntensity={1} transparent opacity={0.8} />
          </mesh>
        );
      })}
      
      {/* Analytics nodes */}
      {[0, Math.PI/2, Math.PI, Math.PI*1.5].map((angle, i) => {
        const x = Math.cos(angle) * 0.8;
        const y = Math.sin(angle) * 0.8;
        return (
          <mesh key={`node-${i}`} position={[x, y, 0]}>
            <octahedronGeometry args={[0.15, 0]} />
            <meshPhysicalMaterial color={color} emissive={color} emissiveIntensity={3} />
          </mesh>
        );
      })}
      
      {/* Core decision processor */}
      <mesh>
        <cylinderGeometry args={[0.2, 0.2, 0.4, 32]} />
        <meshBasicMaterial color={color} wireframe transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

// --- Energy Flow ---

function EnergyFlow({ start, end, color, active }: { start: THREE.Vector3, end: THREE.Vector3, color: string, active: boolean }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const count = 8;
  const dummy = new THREE.Object3D();
  const offsetsRef = useRef<number[] | null>(null);
  if (!offsetsRef.current) {
    offsetsRef.current = Array.from({length: count}, () => 0);
  }
  const offsets = offsetsRef.current;
  
  useEffect(() => {
    for (let i = 0; i < count; i++) {
      offsets[i] = Math.random();
    }
  }, [count, offsets]);
  
  useFrame((state, delta) => {
    if (!meshRef.current || !active) {
      if (meshRef.current) meshRef.current.visible = false;
      return;
    }
    meshRef.current.visible = true;

    for (let i = 0; i < count; i++) {
      offsets[i] += delta * 0.3; 
      if (offsets[i] > 1) offsets[i] = 0;
      
      const p = offsets[i];
      // Arc path
      const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
      mid.y += 2; // Arc up slightly
      
      const pos = new THREE.Vector3();
      const t = p;
      const u = 1 - t;
      pos.copy(start).multiplyScalar(u * u);
      pos.add(mid.clone().multiplyScalar(2 * u * t));
      pos.add(end.clone().multiplyScalar(t * t));
      
      dummy.position.copy(pos);
      // Fade/scale based on progress
      const s = Math.sin(p * Math.PI) * 0.15;
      dummy.scale.set(s, s, s);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      <QuadraticBezierLine start={start} end={end} mid={new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5).add(new THREE.Vector3(0, 2, 0))} color={color} opacity={active ? 0.3 : 0.05} lineWidth={1} transparent />
      <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial color={color} transparent opacity={0.8} />
      </instancedMesh>
    </>
  )
}

// --- Main Domain Node ---

function ImpactNode({ data, origin, activeImpactDomainId }: { data: typeof IMPACT_DOMAINS[0], origin: THREE.Vector3, activeImpactDomainId?: string | null }) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Group>(null);
  const archGroupRef = useRef<THREE.Group>(null);
  const coreMatRef = useRef<THREE.MeshPhysicalMaterial>(null);
  
  const isActive = activeImpactDomainId === data.id;
  const isAnotherActive = activeImpactDomainId !== null && !isActive;

  useEffect(() => {
    if (hovered || isActive) {
      particleEngine.setAttractor(data.pos);
    } else {
      particleEngine.setAttractor(null);
    }
    
    sceneManager.setHoveredImpactDomain(hovered ? data.id : null);
    
    return () => {
      particleEngine.setAttractor(null);
      sceneManager.setHoveredImpactDomain(null);
    };
  }, [hovered, isActive, data.pos, data.id]);

  useEffect(() => {
    if (!meshRef.current || !coreMatRef.current || !archGroupRef.current) return;
    
    const targetScale = isActive ? 1.5 : hovered ? 1.2 : 1;
    const targetEmissive = isActive ? 2.5 : hovered ? 1.5 : 0.5;
    
    gsap.to(meshRef.current.scale, {
      x: targetScale,
      y: targetScale,
      z: targetScale,
      duration: 0.5,
      ease: "power2.out",
      overwrite: "auto"
    });
    
    gsap.to(coreMatRef.current, {
      emissiveIntensity: targetEmissive,
      duration: 0.3,
      ease: "power2.out",
      overwrite: "auto"
    });

    gsap.to(archGroupRef.current.scale, {
      x: isActive ? 1 : 0.001,
      y: isActive ? 1 : 0.001,
      z: isActive ? 1 : 0.001,
      duration: 0.8,
      ease: "elastic.out(1, 0.7)",
      overwrite: "auto"
    });
    
    gsap.to(archGroupRef.current.position, {
      y: isActive ? 1.5 : 0,
      duration: 0.8,
      ease: "power3.out",
      overwrite: "auto"
    });
  }, [isActive, hovered]);

  const geo = useMemo(() => {
    switch (data.geometry) {
      case "icosahedron": return new THREE.IcosahedronGeometry(0.4, 1);
      case "octahedron": return new THREE.OctahedronGeometry(0.4, 0);
      case "box": return new THREE.BoxGeometry(0.6, 0.6, 0.6);
      default: return new THREE.SphereGeometry(0.4, 32, 32);
    }
  }, [data.geometry]);

  const targetPos = new THREE.Vector3(data.pos[0], data.pos[1], data.pos[2]);
  
  // Transition logic
  const rootGroupRef = useRef<THREE.Group>(null);
  useFrame(() => {
    if (rootGroupRef.current) {
      const state = sceneManager.getState();
      const p = Math.max(0, Math.min(1, (state.scrollProgress - 0.75) / 0.15)); // Awaken rapidly between 0.75 and 0.9
      rootGroupRef.current.scale.setScalar(p);
      if (p < 0.01) {
        rootGroupRef.current.visible = false;
      } else {
        rootGroupRef.current.visible = true;
      }
    }
  });

  return (
    <group ref={rootGroupRef}>
      {/* Energy Flow from Pipeline */}
      <EnergyFlow start={origin} end={targetPos} color={data.color} active={!isAnotherActive} />

      <group position={data.pos}>
        {/* The Impact Node */}
        <group 
          ref={meshRef}
          onClick={(e) => { e.stopPropagation(); sceneManager.setImpactDomain(isActive ? null : data.id); }}
          onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
          onPointerOut={(e) => { e.stopPropagation(); setHovered(false); }}
        >
          {/* Inner core */}
          <mesh geometry={geo}>
            <meshPhysicalMaterial 
              ref={coreMatRef}
              color={COLORS.surface}
              emissive={data.color}
              roughness={0.1}
              metalness={0.8}
              transparent
              opacity={isAnotherActive ? 0.2 : 1}
            />
          </mesh>
          {/* Outer wireframe shell */}
          <mesh geometry={geo} scale={1.2}>
            <meshBasicMaterial color={data.color} wireframe transparent opacity={isAnotherActive ? 0.05 : 0.3} />
          </mesh>
        </group>

        {/* 3D Architecture Visualization (Visible only when active) */}
        <group ref={archGroupRef} scale={0.001}>
          {data.id === "ai-systems" && <AIArchitecture color={data.color} isActive={isActive} />}
          {data.id === "enterprise-platforms" && <EnterpriseArchitecture color={data.color} isActive={isActive} />}
          {data.id === "data-analytics" && <DataArchitecture color={data.color} isActive={isActive} />}

          {/* Minimal 3D label */}
          <Html position={[0, -1.0, 0]} center className="pointer-events-none transition-opacity duration-300" style={{ opacity: isActive ? 1 : 0 }}>
            <div className="flex flex-col items-center">
              <span className="text-white font-bold tracking-widest uppercase text-[10px]" style={{ color: data.color, textShadow: `0 0 10px ${data.color}` }}>
                {data.title} Architecture
              </span>
              <span className="text-zinc-400 text-[9px] mt-1">SYSTEMS ACTIVE</span>
            </div>
          </Html>
        </group>
      </group>
    </group>
  );
}

// --- Orchestrator ---

export function ImpactNodes({ activeImpactDomainId }: { activeImpactDomainId?: string | null }) {
  // Energy flow origin: Evolve node from Pipeline
  const origin = new THREE.Vector3(0, 0, -29);

  return (
    <group>
      {IMPACT_DOMAINS.map((domain) => (
        <ImpactNode 
          key={domain.id} 
          data={domain} 
          origin={origin}
          activeImpactDomainId={activeImpactDomainId} 
        />
      ))}
    </group>
  );
}
