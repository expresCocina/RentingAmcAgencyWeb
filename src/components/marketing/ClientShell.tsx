"use client";
// Este componente CLIENT wrappea los imports dinámicos con ssr:false
// que NO pueden vivir en layout.tsx (Server Component)
import dynamic from "next/dynamic";

const ParticlesWrapper = dynamic(
  () => import("./ParticlesWrapper").then((m) => ({ default: m.ParticlesWrapper })),
  { ssr: false }
);
const DiscountPopup = dynamic(
  () => import("./DiscountPopup").then((m) => ({ default: m.DiscountPopup })),
  { ssr: false }
);

export function ClientShell() {
  return (
    <>
      <ParticlesWrapper />
      <DiscountPopup />
    </>
  );
}
