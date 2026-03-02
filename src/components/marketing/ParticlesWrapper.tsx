"use client";
import dynamic from "next/dynamic";

// Cargamos el canvas 3D solo en el cliente (Three.js no funciona en SSR)
const ParticlesCanvas = dynamic(
    () => import("./ParticlesBackground").then((mod) => ({
        default: mod.ParticlesBackground,
    })),
    { ssr: false, loading: () => null }
);

export function ParticlesWrapper() {
    return <ParticlesCanvas />;
}
