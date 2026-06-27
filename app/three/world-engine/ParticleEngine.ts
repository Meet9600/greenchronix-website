import * as THREE from "three";
import { performanceManager } from "../PerformanceManager";
import { PERFORMANCE_PRESETS } from "../../config";

export class ParticleEngine {
  private particleCount: number = 0;
  private pointsMesh: THREE.Points | null = null;
  private positions: Float32Array;
  private velocities: Float32Array;
  private attractor: THREE.Vector3 | null = null;

  constructor() {
    const quality = performanceManager.getQuality();
    this.particleCount = PERFORMANCE_PRESETS[quality].maxParticles;
    
    this.positions = new Float32Array(this.particleCount * 3);
    this.velocities = new Float32Array(this.particleCount * 3);

    for (let i = 0; i < this.particleCount; i++) {
      this.positions[i * 3] = (Math.random() - 0.5) * 20;
      this.positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      this.positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

      this.velocities[i * 3] = (Math.random() - 0.5) * 0.005;
      this.velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.005;
      this.velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.005;
    }
  }

  public getMesh(): THREE.Points | null {
    if (this.particleCount === 0) return null;

    if (!this.pointsMesh) {
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(this.positions, 3));
      
      const mat = new THREE.PointsMaterial({
        color: 0x34d399,
        size: 0.08,
        transparent: true,
        opacity: 0.2,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      
      this.pointsMesh = new THREE.Points(geo, mat);
    }
    return this.pointsMesh;
  }

  public setAttractor(pos: [number, number, number] | null) {
    if (pos) {
      this.attractor = new THREE.Vector3(pos[0], pos[1], pos[2]);
    } else {
      this.attractor = null;
    }
  }

  public update(deltaTime: number) {
    if (!this.pointsMesh || this.particleCount === 0) return;

    const attr = this.pointsMesh.geometry.attributes.position as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;

    for (let i = 0; i < this.particleCount; i++) {
      let vx = this.velocities[i * 3];
      let vy = this.velocities[i * 3 + 1];
      let vz = this.velocities[i * 3 + 2];

      if (this.attractor) {
        const dx = this.attractor.x - arr[i * 3];
        const dy = this.attractor.y - arr[i * 3 + 1];
        const dz = this.attractor.z - arr[i * 3 + 2];
        const distSq = dx * dx + dy * dy + dz * dz;
        
        // Attract particles within a radius of 5 units (sq dist 25)
        if (distSq < 25 && distSq > 1) { 
          const force = 0.0005 / distSq;
          vx += dx * force;
          vy += dy * force;
          vz += dz * force;
          
          // Apply friction so they don't explode
          vx *= 0.95;
          vy *= 0.95;
          vz *= 0.95;
        }
      }

      this.velocities[i * 3] = vx;
      this.velocities[i * 3 + 1] = vy;
      this.velocities[i * 3 + 2] = vz;

      arr[i * 3] += vx;
      arr[i * 3 + 1] += vy;
      arr[i * 3 + 2] += vz;

      // wrap coordinates for continuous flow
      if (arr[i * 3 + 1] > 10) arr[i * 3 + 1] = -10;
      if (arr[i * 3 + 1] < -10) arr[i * 3 + 1] = 10;
    }
    
    attr.needsUpdate = true;
  }

  public getActiveCount() {
    return this.particleCount;
  }
}

export const particleEngine = new ParticleEngine();
