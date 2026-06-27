"use client";

import React, { useState } from "react";
import { Html, Line } from "@react-three/drei";
import { COLORS } from "../../config";

const PRINCIPLES = [
  { id: 'sys', title: 'Systems Thinking', desc: 'Holistic architecture over isolated fixes.', pos: [-2.5, 1.2, 0.5] as [number,number,number] },
  { id: 'exc', title: 'Engineering Excellence', desc: 'Precision, performance, and clean code.', pos: [2.5, 1.5, -0.5] as [number,number,number] },
  { id: 'ai', title: 'Responsible AI', desc: 'Ethical, transparent, and aligned AI.', pos: [-1.8, -1.8, 1.2] as [number,number,number] },
  { id: 'lt', title: 'Long-Term Thinking', desc: 'Built to last. No technical debt.', pos: [2.2, -1.5, 1.8] as [number,number,number] },
];

export function NetworkNodes() {
  return (
    <>
      {PRINCIPLES.map((node, i) => (
        <InteractiveNode key={node.id} data={node} />
      ))}
    </>
  );
}

function InteractiveNode({ data }: { data: typeof PRINCIPLES[0] }) {
  const [hovered, setHovered] = useState(false);

  return (
    <group position={data.pos}>
      <mesh 
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }} 
        onPointerOut={(e) => { e.stopPropagation(); setHovered(false); }}
        scale={hovered ? 1.2 : 1}
      >
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshPhysicalMaterial 
          color={hovered ? COLORS.emeraldPrimary : COLORS.surface}
          emissive={hovered ? COLORS.emeraldPrimary : COLORS.emeraldDeep}
          emissiveIntensity={hovered ? 1.0 : 0.4}
          roughness={0.1}
          metalness={0.8}
        />
      </mesh>
      
      <Line 
        points={[[0, 0, 0], [-data.pos[0], -data.pos[1], -data.pos[2]]]} 
        color={COLORS.emeraldPrimary} 
        transparent 
        opacity={hovered ? 0.8 : 0.2} 
        lineWidth={hovered ? 2 : 1} 
      />

      <Html position={[0.3, 0, 0]} style={{ pointerEvents: 'none' }} className={`transition-opacity duration-300 ${hovered ? 'opacity-100 z-50' : 'opacity-0 z-10'}`}>
        <div className="w-56 bg-black/80 backdrop-blur-md border border-[#00E38C]/40 rounded-lg p-4 text-left shadow-[0_0_20px_rgba(0,227,140,0.2)] transition-transform duration-300 origin-left" style={{ transform: hovered ? 'scale(1.05)' : 'scale(0.95)' }}>
          <h3 className="text-sm font-bold text-white tracking-wide uppercase">{data.title}</h3>
          <p className="mt-2 text-xs text-zinc-300 leading-relaxed">
            {data.desc}
          </p>
        </div>
      </Html>
    </group>
  );
}
