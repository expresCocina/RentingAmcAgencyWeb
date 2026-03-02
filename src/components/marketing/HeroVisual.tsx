"use client";
import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, MeshDistortMaterial, Stars, Float } from "@react-three/drei";
import * as THREE from "three";

// ── Globo principal con efecto distorsión ───────────────────────────
function Globe() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.12;
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.08) * 0.1;
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1.6, 64, 64]} />
      <MeshDistortMaterial
        color="#1d4ed8"
        emissive="#3b82f6"
        emissiveIntensity={0.4}
        roughness={0.1}
        metalness={0.8}
        distort={0.35}
        speed={1.5}
        wireframe={false}
        transparent
        opacity={0.92}
      />
    </mesh>
  );
}

// ── Anillos orbitales ───────────────────────────────────────────────
function OrbitalRing({ radius, speed, tilt }: { radius: number; speed: number; tilt: number }) {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ringRef.current) return;
    ringRef.current.rotation.z = state.clock.elapsedTime * speed;
  });

  return (
    <mesh ref={ringRef} rotation={[tilt, 0, 0]}>
      <torusGeometry args={[radius, 0.008, 16, 120]} />
      <meshStandardMaterial
        color="#60a5fa"
        emissive="#3b82f6"
        emissiveIntensity={0.8}
        transparent
        opacity={0.5}
      />
    </mesh>
  );
}

// ── Partícula orbital que se mueve alrededor del globo ──────────────
function OrbitalDot({ radius, speed, offset }: { radius: number; speed: number; offset: number }) {
  const dotRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!dotRef.current) return;
    const t = state.clock.elapsedTime * speed + offset;
    dotRef.current.position.x = Math.cos(t) * radius;
    dotRef.current.position.z = Math.sin(t) * radius;
    dotRef.current.position.y = Math.sin(t * 0.7) * 0.5;
  });

  return (
    <mesh ref={dotRef}>
      <sphereGeometry args={[0.04, 8, 8]} />
      <meshStandardMaterial
        color="#93c5fd"
        emissive="#bfdbfe"
        emissiveIntensity={2}
      />
    </mesh>
  );
}

// ── Escena completa ─────────────────────────────────────────────────
function Scene() {
  return (
    <>
      {/* Iluminación */}
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={2} color="#3b82f6" />
      <pointLight position={[-5, -3, -2]} intensity={1} color="#6366f1" />
      <pointLight position={[0, 0, 4]} intensity={0.8} color="#ffffff" />

      {/* Estrellas de fondo */}
      <Stars
        radius={60}
        depth={60}
        count={800}
        factor={2}
        saturation={0}
        fade
        speed={0.3}
      />

      {/* Globo flotante */}
      <Float speed={1.4} rotationIntensity={0.2} floatIntensity={0.5}>
        <Globe />

        {/* Anillos orbitales */}
        <OrbitalRing radius={2.2} speed={0.4} tilt={0.3} />
        <OrbitalRing radius={2.7} speed={-0.25} tilt={1.1} />
        <OrbitalRing radius={3.1} speed={0.18} tilt={0.7} />

        {/* Puntos orbitando */}
        <OrbitalDot radius={2.2} speed={0.6} offset={0} />
        <OrbitalDot radius={2.7} speed={-0.4} offset={2} />
        <OrbitalDot radius={3.1} speed={0.3} offset={4.5} />
        <OrbitalDot radius={2.2} speed={0.5} offset={3.2} />
      </Float>
    </>
  );
}

// ── Componente exportado (canvas + fallback) ────────────────────────
export const HeroVisual = () => {
  return (
    <div className="w-full h-full relative">
      {/* Glow de fondo */}
      <div className="absolute inset-0 bg-blue-600/15 blur-[80px] rounded-full scale-75" />

      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Scene />
      </Canvas>
    </div>
  );
};