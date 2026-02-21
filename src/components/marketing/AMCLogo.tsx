import Link from "next/link";

/**
 * AMCLogo — Componente SVG vectorial elegante para Navbar, Footer y cualquier uso.
 * Props:
 *   size: "sm" | "md" | "lg" — controla el tamaño
 *   variant: "light" (texto blanco) | "dark" (texto oscuro)
 */
interface Props {
    size?: "sm" | "md" | "lg";
    variant?: "light" | "dark";
    withLink?: boolean;
}

const sizes = {
    sm: { width: 100, height: 28, iconSize: 22, fontSize: 13 },
    md: { width: 130, height: 34, iconSize: 28, fontSize: 16 },
    lg: { width: 170, height: 44, iconSize: 36, fontSize: 20 },
};

export function AMCLogo({ size = "md", variant = "light", withLink = true }: Props) {
    const s = sizes[size];
    const textColor = variant === "light" ? "#ffffff" : "#0a0a0a";

    const logo = (
        <span className="inline-flex items-center gap-2 select-none" aria-label="AMC Agency">
            {/* ── Ícono: cuadrado con "A" estilizada + acento azul ── */}
            <svg
                width={s.iconSize}
                height={s.iconSize}
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
            >
                {/* Fondo cuadrado redondeado */}
                <rect width="40" height="40" rx="10" fill="#050505" />
                {/* Borde sutil */}
                <rect x="0.5" y="0.5" width="39" height="39" rx="9.5" stroke="#3b82f6" strokeOpacity="0.4" />

                {/* Letra A estilizada */}
                <path
                    d="M20 8L30 32H25.5L23.5 27H16.5L14.5 32H10L20 8Z"
                    fill="white"
                />
                <path
                    d="M17.8 23H22.2L20 17L17.8 23Z"
                    fill="#3b82f6"
                />

                {/* Línea horizontal decorativa (corte de la A) */}
                <rect x="14" y="21" width="12" height="1.5" rx="0.75" fill="#3b82f6" opacity="0.3" />

                {/* Punto de acento azul vibrante */}
                <circle cx="32" cy="9" r="3.5" fill="#3b82f6" />
                <circle cx="32" cy="9" r="2" fill="#60a5fa" />
            </svg>

            {/* ── Tipografía ── */}
            <span
                style={{
                    display: "inline-flex",
                    alignItems: "baseline",
                    gap: 2,
                    lineHeight: 1,
                }}
            >
                <span
                    style={{
                        fontFamily: "'Inter', system-ui, sans-serif",
                        fontWeight: 900,
                        fontSize: s.fontSize,
                        letterSpacing: "0.12em",
                        color: textColor,
                        textTransform: "uppercase",
                    }}
                >
                    AMC
                </span>
                <span
                    style={{
                        fontFamily: "'Inter', system-ui, sans-serif",
                        fontWeight: 400,
                        fontSize: s.fontSize * 0.65,
                        letterSpacing: "0.3em",
                        color: "#3b82f6",
                        textTransform: "uppercase",
                    }}
                >
                    AGENCY
                </span>
            </span>
        </span>
    );

    if (withLink) {
        return (
            <Link href="/" className="hover:opacity-80 transition-opacity">
                {logo}
            </Link>
        );
    }

    return logo;
}
