"use client";

import React, { useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EngineeringCore } from "../three/core-engine";
import { 
  cameraEngine, 
  particleEngine, 
  lightingEngine, 
  environmentEngine, 
  renderLoopEngine,
  DebugOverlayRenderer 
} from "../three/world-engine";
import { sceneManager } from "../three/SceneManager";
import { Scene01Arrival } from "./scene-01-arrival";
import { Scene02Engineering } from "./scene-02-engineering";
import { Scene03Capabilities } from "./scene-03-capabilities";
import { Scene04Pipeline } from "./scene-04-pipeline";
import { Scene05Impact } from "./scene-05-impact";
import { Scene06Architecture } from "./scene-06-architecture";
import { Scene07Partnership } from "./scene-07-partnership";
import { useSyncExternalStore } from "react";
import { useExperienceLayout } from "../hooks/use-experience-layout";
import { SceneId } from "../types";

function ScrollOrchestrator() {
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = Math.max(1, document.body.scrollHeight - window.innerHeight);
      const progress = Math.max(0, Math.min(1, scrollY / maxScroll));
      
      sceneManager.updateScroll(progress);
      
      let newScene: SceneId = 0;
      if (progress > 0.86) newScene = 6;
      else if (progress > 0.68) newScene = 5;
      else if (progress > 0.52) newScene = 4;
      else if (progress > 0.36) newScene = 3;
      else if (progress > 0.22) newScene = 2;
      else if (progress > 0.10) newScene = 1;
      
      if (newScene !== sceneManager.getState().currentSceneId) {
        sceneManager.setScene(newScene);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return null;
}

function WorldOrchestrator() {
  const { camera } = useThree();
  
  useEffect(() => {
    // @ts-expect-error - cameraEngine requires explicit typing initialization
    cameraEngine.init(camera);
  }, [camera]);

  useFrame((state, delta) => {
    renderLoopEngine.update(delta);
    
    // Abstract mouse input mapping for parallax (normalized -1 to 1)
    const mouseX = (state.pointer.x);
    const mouseY = (state.pointer.y);
    cameraEngine.applyParallax(mouseX, mouseY);
  });

  const fog = environmentEngine.getFog();
  const particles = particleEngine.getMesh();

  return (
    <>
      <primitive object={lightingEngine.getLights()} />
      {fog && <primitive object={fog!} attach="fog" />}
      {particles && <primitive object={particles!} />}
    </>
  );
}

// Custom hook to subscribe to SceneManager state
function useSceneState() {
  return useSyncExternalStore(
    (callback) => sceneManager.subscribe(callback),
    () => sceneManager.getState(),
    () => sceneManager.getState()
  );
}

export function Experience() {
  const sceneState = useSceneState();
  const { worldOffset } = useExperienceLayout();

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#050505]">
      <ScrollOrchestrator />
      {/* 3D World Layer */}
      <div className="absolute inset-0 z-0">
        <Canvas
          dpr={[1, 2]}
          camera={{ position: [0, 0, 6], fov: 60 }}
          gl={{ antialias: false, powerPreference: "high-performance" }}
        >
          <color attach="background" args={[environmentEngine.getBackground()]} />
          
          <group position={worldOffset}>
            <WorldOrchestrator />
            <EngineeringCore sceneState={sceneState} />
          </group>
          <DebugOverlayRenderer />
        </Canvas>
      </div>

      {/* HTML UI Layer */}
      <div className="relative z-10 w-full h-full pointer-events-none">
        <div className={`absolute inset-0 transition-opacity duration-700 ${sceneState.currentSceneId === 0 ? 'opacity-100 pointer-events-auto delay-1000' : 'opacity-0 pointer-events-none'}`}>
          <Scene01Arrival />
        </div>
        <div className={`absolute inset-0 transition-opacity duration-700 ${sceneState.currentSceneId === 1 ? 'opacity-100 pointer-events-auto delay-1000' : 'opacity-0 pointer-events-none'}`}>
          <Scene02Engineering />
        </div>
        <div className={`absolute inset-0 transition-opacity duration-700 ${sceneState.currentSceneId === 2 ? 'opacity-100 pointer-events-auto delay-1000' : 'opacity-0 pointer-events-none'}`}>
          <Scene03Capabilities sceneState={sceneState} />
        </div>
        <div className={`absolute inset-0 transition-opacity duration-700 ${sceneState.currentSceneId === 3 ? 'opacity-100 pointer-events-auto delay-1000' : 'opacity-0 pointer-events-none'}`}>
          <Scene04Pipeline sceneState={sceneState} />
        </div>
        <div className={`absolute inset-0 transition-opacity duration-700 ${sceneState.currentSceneId === 4 ? 'opacity-100 pointer-events-auto delay-1000' : 'opacity-0 pointer-events-none'}`}>
          <Scene05Impact sceneState={sceneState} />
        </div>
        <div className={`absolute inset-0 transition-opacity duration-700 ${sceneState.currentSceneId === 5 ? 'opacity-100 pointer-events-auto delay-1000' : 'opacity-0 pointer-events-none'}`}>
          <Scene06Architecture sceneState={sceneState} />
        </div>
        <div className={`absolute inset-0 transition-opacity duration-700 ${sceneState.currentSceneId === 6 ? 'opacity-100 pointer-events-auto delay-1000' : 'opacity-0 pointer-events-none'}`}>
          <Scene07Partnership sceneState={sceneState} />
        </div>
      </div>
    </div>
  );
}
