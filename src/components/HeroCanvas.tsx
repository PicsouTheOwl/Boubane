"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function ParticleNetwork() {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);

  const { positions, colors, connections } = useMemo(() => {
    const count = 60;
    const posArr = new Float32Array(count * 3);
    const colArr = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      posArr[i3] = (Math.random() - 0.5) * 12;
      posArr[i3 + 1] = (Math.random() - 0.5) * 8;
      posArr[i3 + 2] = (Math.random() - 0.5) * 6;

      const t = Math.random();
      colArr[i3] = 0.39 + t * 0.24;
      colArr[i3 + 1] = 0.4 + t * 0.15;
      colArr[i3 + 2] = 0.95 - t * 0.05;
    }

    const linePositions: number[] = [];
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const dx = posArr[i * 3] - posArr[j * 3];
        const dy = posArr[i * 3 + 1] - posArr[j * 3 + 1];
        const dz = posArr[i * 3 + 2] - posArr[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < 3.5) {
          linePositions.push(
            posArr[i * 3], posArr[i * 3 + 1], posArr[i * 3 + 2],
            posArr[j * 3], posArr[j * 3 + 1], posArr[j * 3 + 2]
          );
        }
      }
    }

    return {
      positions: posArr,
      colors: colArr,
      connections: new Float32Array(linePositions),
    };
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.03) * 0.1;
    }
    if (linesRef.current) {
      linesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      linesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.03) * 0.1;
    }
  });

  return (
    <>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[colors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.12}
          vertexColors
          transparent
          opacity={0.8}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[connections, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#6366f1"
          transparent
          opacity={0.08}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </>
  );
}

function GlowSphere() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -2]}>
      <sphereGeometry args={[1.8, 64, 64]} />
      <meshBasicMaterial
        color="#6366f1"
        transparent
        opacity={0.04}
        side={THREE.BackSide}
      />
    </mesh>
  );
}

export default function HeroCanvas() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        style={{ background: "transparent" }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.3} />
        <ParticleNetwork />
        <GlowSphere />
      </Canvas>
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-bg/80 via-transparent to-bg/60 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-bg/40 pointer-events-none" />
    </div>
  );
}
