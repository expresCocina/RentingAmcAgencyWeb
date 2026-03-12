"use client";
/**
 * FbPageViewTracker — Dispara PageView en cada cambio de ruta de Next.js.
 * El script del Pixel solo dispara al cargar la página por primera vez.
 * Este componente cubre las navegaciones SPA posteriores.
 */
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { trackPageView } from "@/lib/fbPixel";

export function FbPageViewTracker() {
  const pathname = usePathname();
  const isFirst = useRef(true);

  useEffect(() => {
    // Omitimos la primera carga: el script del Pixel ya dispara PageView
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    // Navegaciones SPA posteriores
    trackPageView(window.location.href);
  }, [pathname]);

  return null;
}
