"use client";
import { useRef, useCallback } from "react";

/**
 * useTilt: Hook que aplica efecto de perspectiva 3D a un elemento
 * siguiendo la posición del cursor. Retorna el ref y los handlers.
 */
export function useTilt(intensity = 12) {
    const ref = useRef<HTMLDivElement>(null);

    const onMouseMove = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            const el = ref.current;
            if (!el) return;
            const rect = el.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            el.style.transform = `perspective(800px) rotateY(${x * intensity}deg) rotateX(${-y * intensity}deg) scale3d(1.03,1.03,1.03)`;
            // Mover el brillo según el cursor
            const shine = el.querySelector<HTMLElement>("[data-shine]");
            if (shine) {
                shine.style.opacity = "1";
                shine.style.background = `radial-gradient(circle at ${(x + 0.5) * 100}% ${(y + 0.5) * 100}%, rgba(255,255,255,0.12) 0%, transparent 70%)`;
            }
        },
        [intensity]
    );

    const onMouseLeave = useCallback(() => {
        const el = ref.current;
        if (!el) return;
        el.style.transform =
            "perspective(800px) rotateY(0deg) rotateX(0deg) scale3d(1,1,1)";
        const shine = el.querySelector<HTMLElement>("[data-shine]");
        if (shine) shine.style.opacity = "0";
    }, []);

    return { ref, onMouseMove, onMouseLeave };
}
