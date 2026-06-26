"use client";

import { useRef, useMemo, useEffect, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// ─── NetworkScene ─────────────────────────────────────────────────────────────

const NODE_COUNT = 50;
const BOUNDS = 4;
const CONNECTION_DIST = 1.8;
const DRIFT_SPEED = 0.002;
const NODE_COLOR = new THREE.Color("#34d399");

interface Node {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
}

function buildNodes(): Node[] {
  return Array.from({ length: NODE_COUNT }, () => ({
    position: new THREE.Vector3(
      (Math.random() - 0.5) * BOUNDS * 2,
      (Math.random() - 0.5) * BOUNDS * 2,
      (Math.random() - 0.5) * BOUNDS * 2
    ),
    velocity: new THREE.Vector3(
      (Math.random() - 0.5) * DRIFT_SPEED * 2,
      (Math.random() - 0.5) * DRIFT_SPEED * 2,
      (Math.random() - 0.5) * DRIFT_SPEED * 2
    ),
  }));
}

function buildLinePositions(nodes: Node[]): Float32Array {
  const positions: number[] = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      if (nodes[i].position.distanceTo(nodes[j].position) < CONNECTION_DIST) {
        positions.push(
          nodes[i].position.x,
          nodes[i].position.y,
          nodes[i].position.z,
          nodes[j].position.x,
          nodes[j].position.y,
          nodes[j].position.z
        );
      }
    }
  }
  return new Float32Array(positions);
}

function NetworkScene({
  pausedRef,
  mouseRef,
}: {
  pausedRef: React.RefObject<boolean>;
  mouseRef: React.RefObject<{ x: number; y: number }>;
}) {
  const { invalidate, camera } = useThree();
  const nodes = useMemo(() => buildNodes(), []);

  // ── Points ──────────────────────────────────────────────────────────────────
  const pointsRef = useRef<THREE.Points>(null);

  // Build the initial points geometry imperatively so we avoid JSX bufferAttribute
  // compatibility issues across R3F versions.
  const pointGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const arr = new Float32Array(NODE_COUNT * 3);
    nodes.forEach((n, i) => {
      arr[i * 3] = n.position.x;
      arr[i * 3 + 1] = n.position.y;
      arr[i * 3 + 2] = n.position.z;
    });
    geo.setAttribute("position", new THREE.BufferAttribute(arr, 3));
    return geo;
  }, [nodes]);

  const pointMat = useMemo(
    () =>
      new THREE.PointsMaterial({
        color: NODE_COLOR,
        size: 0.06,
        transparent: true,
        opacity: 0.45,
        sizeAttenuation: true,
        depthWrite: false,
      }),
    []
  );

  // ── Lines ───────────────────────────────────────────────────────────────────
  const linesRef = useRef<THREE.LineSegments>(null);

  const lineGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const initial = buildLinePositions(nodes);
    geo.setAttribute("position", new THREE.BufferAttribute(initial.slice(), 3));
    return geo;
  }, [nodes]);

  const lineMat = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: NODE_COLOR,
        transparent: true,
        opacity: 0.18,
        depthWrite: false,
      }),
    []
  );

  // Build Three.js object instances once — avoid allocating on every render
  const pointsMesh = useMemo(() => new THREE.Points(pointGeo, pointMat), [pointGeo, pointMat]);
  const linesMesh = useMemo(() => new THREE.LineSegments(lineGeo, lineMat), [lineGeo, lineMat]);

  // Dispose geometry/material on unmount
  useEffect(() => {
    return () => {
      pointGeo.dispose();
      lineGeo.dispose();
      pointMat.dispose();
      lineMat.dispose();
    };
  }, [pointGeo, lineGeo, pointMat, lineMat]);

  // ── Animation loop ───────────────────────────────────────────────────────────
  useFrame(() => {
    if (pausedRef.current) return;

    // Drift nodes
    nodes.forEach((node, i) => {
      node.position.add(node.velocity);
      // Bounce at bounds
      (["x", "y", "z"] as const).forEach((axis) => {
        if (Math.abs(node.position[axis]) > BOUNDS) {
          node.velocity[axis] *= -1;
        }
      });

      // Update point positions buffer
      if (pointsRef.current) {
        const attr = pointsRef.current.geometry.attributes
          .position as THREE.BufferAttribute;
        const arr = attr.array as Float32Array;
        arr[i * 3] = node.position.x;
        arr[i * 3 + 1] = node.position.y;
        arr[i * 3 + 2] = node.position.z;
        attr.needsUpdate = true;
      }
    });

    // Rebuild and update line positions
    if (linesRef.current) {
      const newLines = buildLinePositions(nodes);
      const attr = linesRef.current.geometry.attributes
        .position as THREE.BufferAttribute;
      if (attr.array.length !== newLines.length) {
        // Connection count changed — replace the attribute entirely
        linesRef.current.geometry.setAttribute(
          "position",
          new THREE.BufferAttribute(newLines, 3)
        );
      } else {
        (attr.array as Float32Array).set(newLines);
        attr.needsUpdate = true;
      }
      linesRef.current.geometry.setDrawRange(0, newLines.length / 3);
    }

    // Camera parallax toward mouse — lerp, capped at ±8° (0.14 rad)
    const targetX = (mouseRef.current?.y ?? 0) * 0.12;
    const targetY = (mouseRef.current?.x ?? 0) * 0.12;
    camera.rotation.x += (targetX - camera.rotation.x) * 0.05;
    camera.rotation.y += (targetY - camera.rotation.y) * 0.05;
    const cap = 0.14;
    camera.rotation.x = Math.max(-cap, Math.min(cap, camera.rotation.x));
    camera.rotation.y = Math.max(-cap, Math.min(cap, camera.rotation.y));

    invalidate();
  });

  return (
    <>
      <primitive object={pointsMesh} ref={pointsRef} />
      <primitive object={linesMesh} ref={linesRef} />
    </>
  );
}

// ─── HeroCanvas ───────────────────────────────────────────────────────────────

/**
 * Full-bleed R3F canvas rendered behind hero HTML content.
 * - position: absolute inset-0 z-0, pointer-events-none
 * - frameloop="demand" — only renders when invalidated
 * - dpr={[1,2]} — caps device pixel ratio
 * - IntersectionObserver pauses rendering when off-screen
 * - pointermove on a parent section triggers camera parallax
 * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6
 */
export default function HeroCanvas() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const mouseRef = useRef({ x: 0, y: 0 });
  const rafIdRef = useRef<number>(0);

  // IntersectionObserver — pause when < 1px visible (Req 2.6)
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        pausedRef.current = entry.intersectionRatio < 0.001;
      },
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // pointermove handler — normalised to [-1, 1] relative to parent section (Req 2.4)
  const handlePointerMove = useCallback((e: PointerEvent) => {
    const el = wrapperRef.current;
    if (!el) return;
    const parent = el.closest("section") ?? el.parentElement;
    if (!parent) return;
    const rect = parent.getBoundingClientRect();
    mouseRef.current = {
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * 2,
    };
  }, []);

  // Throttle pointermove to rAF
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const parent = el.closest("section") ?? el.parentElement;
    if (!parent) return;

    let pending = false;
    const throttled = (e: PointerEvent) => {
      if (pending) return;
      pending = true;
      rafIdRef.current = requestAnimationFrame(() => {
        handlePointerMove(e);
        pending = false;
      });
    };

    parent.addEventListener("pointermove", throttled as EventListener);
    return () => {
      parent.removeEventListener("pointermove", throttled as EventListener);
      cancelAnimationFrame(rafIdRef.current);
    };
  }, [handlePointerMove]);

  return (
    <div
      ref={wrapperRef}
      className="absolute inset-0 z-0 pointer-events-none"
      aria-hidden="true"
    >
      <Canvas
        dpr={[1, 2]}
        frameloop="demand"
        camera={{ position: [0, 0, 5], fov: 60 }}
        gl={{ antialias: false, alpha: true }}
        style={{ width: "100%", height: "100%" }}
      >
        <NetworkScene pausedRef={pausedRef} mouseRef={mouseRef} />
      </Canvas>
    </div>
  );
}
