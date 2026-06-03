"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Line } from "@react-three/drei";
import * as THREE from "three";

/* === NODE MESH === */
function NetworkNodes() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const count = 60;

  const [positions, scales] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const scl = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6;
      scl[i] = Math.random() * 0.12 + 0.05;
    }
    return [pos, scl];
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      dummy.position.set(
        positions[i3] + Math.sin(t * 0.3 + i * 0.5) * 0.3,
        positions[i3 + 1] + Math.cos(t * 0.2 + i * 0.7) * 0.3,
        positions[i3 + 2] + Math.sin(t * 0.15 + i) * 0.2
      );
      dummy.scale.setScalar(scales[i]);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 12, 12]} />
      <meshBasicMaterial color="#5e6ad2" transparent opacity={0.6} />
    </instancedMesh>
  );
}

/* === CONNECTION LINES === */
function NetworkLines() {
  const lines = useMemo(() => {
    const result: [THREE.Vector3, THREE.Vector3][] = [];
    const nodes: THREE.Vector3[] = [];
    for (let i = 0; i < 60; i++) {
      nodes.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 12,
          (Math.random() - 0.5) * 12,
          (Math.random() - 0.5) * 6
        )
      );
    }
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (nodes[i].distanceTo(nodes[j]) < 4) {
          result.push([nodes[i], nodes[j]]);
        }
      }
    }
    return result;
  }, []);

  return (
    <group>
      {lines.map(([start, end], i) => (
        <Line
          key={i}
          points={[start, end]}
          color="#5e6ad2"
          lineWidth={0.5}
          transparent
          opacity={0.08}
        />
      ))}
    </group>
  );
}

/* === HERO GLOW ORBS === */
function GlowOrbs() {
  return (
    <>
      <Float speed={0.5} rotationIntensity={0.2} floatIntensity={0.5}>
        <mesh position={[-4, 2, -3]}>
          <sphereGeometry args={[0.6, 32, 32]} />
          <meshBasicMaterial color="#5e6ad2" transparent opacity={0.04} />
        </mesh>
      </Float>
      <Float speed={0.3} rotationIntensity={0.1} floatIntensity={0.3}>
        <mesh position={[5, -1, -2]}>
          <sphereGeometry args={[0.8, 32, 32]} />
          <meshBasicMaterial color="#7c85e0" transparent opacity={0.03} />
        </mesh>
      </Float>
      <Float speed={0.4} rotationIntensity={0.15} floatIntensity={0.4}>
        <mesh position={[0, -3, -4]}>
          <sphereGeometry args={[0.4, 32, 32]} />
          <meshBasicMaterial color="#5e6ad2" transparent opacity={0.05} />
        </mesh>
      </Float>
    </>
  );
}

/* === MAIN EXPORT === */
export default function NodeNetwork3D() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.5} />
        <NetworkNodes />
        <NetworkLines />
        <GlowOrbs />
      </Canvas>
    </div>
  );
}
