"use client";
import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { usePathname } from "next/navigation";

// ── Nube de partículas conectadas ───────────────────────────────────
function ParticleCloud() {
    const pointsRef = useRef<THREE.Points>(null);
    const COUNT = 1200;

    const { positions, colors } = useMemo(() => {
        const positions = new Float32Array(COUNT * 3);
        const colors = new Float32Array(COUNT * 3);

        for (let i = 0; i < COUNT; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const r = 8 + Math.random() * 12;

            positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.5;
            positions[i * 3 + 2] = r * Math.cos(phi);

            const t = Math.random();
            if (t < 0.5) {
                colors[i * 3] = 0.23; colors[i * 3 + 1] = 0.51; colors[i * 3 + 2] = 0.98;
            } else if (t < 0.8) {
                colors[i * 3] = 0.39; colors[i * 3 + 1] = 0.40; colors[i * 3 + 2] = 0.95;
            } else {
                colors[i * 3] = 0.7; colors[i * 3 + 1] = 0.8; colors[i * 3 + 2] = 1.0;
            }
        }
        return { positions, colors };
    }, []);

    useFrame((state) => {
        if (!pointsRef.current) return;
        pointsRef.current.rotation.y = state.clock.elapsedTime * 0.025;
        pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.05;
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[positions, 3]} />
                <bufferAttribute attach="attributes-color" args={[colors, 3]} />
            </bufferGeometry>
            <pointsMaterial size={0.06} vertexColors transparent opacity={0.7} sizeAttenuation />
        </points>
    );
}

// ── Componente exportado ─────────────────────────────────────────────
export function ParticlesBackground() {
    const pathname = usePathname();

    // No mostrar en admin, dashboard, login o registro (interfieren con clicks)
    const isAppRoute = pathname.startsWith('/admin') ||
        pathname.startsWith('/dashboard') ||
        pathname.startsWith('/login') ||
        pathname.startsWith('/registro');

    if (isAppRoute) return null;

    return (
        <div
            className="fixed inset-0"
            style={{ zIndex: 0, pointerEvents: 'none' }}
            aria-hidden="true"
        >
            <Canvas
                camera={{ position: [0, 0, 1], fov: 75 }}
                dpr={[1, 1.2]}
                gl={{ antialias: false, alpha: true }}
                style={{ background: "transparent", pointerEvents: "none" }}
            >
                <ambientLight intensity={1} />
                <ParticleCloud />
            </Canvas>
        </div>
    );
}
