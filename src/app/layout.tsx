import "./globals.css";
import type { Metadata } from "next";
import { LanguageProvider } from "@/context/LanguageContext"; // <-- 1. Importamos el Cerebro de Idiomas

// Configuración de los metadatos de la plataforma
export const metadata: Metadata = {
  title: "Renting AMC Agency Web | Arquitectura Digital de Élite",
  description: "Plataforma de infraestructura de software escalable y servicios de renting tecnológico.",
  keywords: ["Renting Web", "Software Architecture", "Elite Digital agency"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <body 
        className="bg-[#050505] text-white antialiased selection:bg-blue-500/30"
        suppressHydrationWarning
      >
        {/* 2. Envolvemos toda la aplicación con el Proveedor de Idiomas */}
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}