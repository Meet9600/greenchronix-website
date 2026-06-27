"use client";

import React, { useState } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { DebugInfo } from "./types";
import { performanceManager } from "../PerformanceManager";
import { particleEngine } from "./ParticleEngine";
import { sceneManager } from "../SceneManager";
import { cameraEngine } from "./CameraEngine";
import { FEATURE_FLAGS } from "../../config/feature-flags";

export function DebugOverlayRenderer() {
  const { gl } = useThree();
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);
  
  let frameCount = 0;
  let lastTime = performance.now();

  useFrame(() => {
    if (!FEATURE_FLAGS.ENABLE_DEBUG_GUI) return;

    frameCount++;
    const now = performance.now();
    if (now - lastTime >= 500) { // Update roughly every 500ms
      const fps = Math.round((frameCount * 1000) / (now - lastTime));
      
      setDebugInfo({
        fps,
        drawCalls: gl.info.render.calls,
        triangles: gl.info.render.triangles,
        gpuTier: performanceManager.getQuality(),
        particleCount: particleEngine.getActiveCount(),
        currentScene: sceneManager.getState().currentSceneId,
        cameraPosition: cameraEngine.getPosition(),
      });

      frameCount = 0;
      lastTime = now;
    }
  });

  if (!FEATURE_FLAGS.ENABLE_DEBUG_GUI || !debugInfo) return null;

  return (
    <Html prepend style={{ pointerEvents: 'none', top: 0, left: 0 }}>
      <div className="absolute top-4 left-4 z-[9999] bg-black/80 p-4 border border-[#34d399]/30 rounded-lg text-xs font-mono text-emerald-400 backdrop-blur-md" style={{ width: '280px' }}>
        <div className="mb-2 uppercase tracking-widest font-semibold border-b border-[#34d399]/30 pb-1">World Engine Debug</div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-1">
          <span>FPS:</span> <span className="text-white text-right">{debugInfo.fps}</span>
          <span>Draw Calls:</span> <span className="text-white text-right">{debugInfo.drawCalls}</span>
          <span>Triangles:</span> <span className="text-white text-right">{debugInfo.triangles}</span>
          <span>GPU Tier:</span> <span className="text-white text-right">{debugInfo.gpuTier}</span>
          <span>Particles:</span> <span className="text-white text-right">{debugInfo.particleCount}</span>
          <span>Scene ID:</span> <span className="text-white text-right">{debugInfo.currentScene}</span>
          <span>Camera XYZ:</span> <span className="text-white text-right">
            [{debugInfo.cameraPosition[0].toFixed(1)}, {debugInfo.cameraPosition[1].toFixed(1)}, {debugInfo.cameraPosition[2].toFixed(1)}]
          </span>
        </div>
      </div>
    </Html>
  );
}
