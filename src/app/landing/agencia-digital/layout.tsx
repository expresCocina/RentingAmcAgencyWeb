import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://amcagencyweb.com"),
  title: "Agencia Digital en Neiva Colombia | Páginas Web, Publicidad y SEO — AMC Agency",
  description:
    "¿Tu negocio necesita más clientes? AMC Agency crea páginas web, gestiona publicidad en Meta y Google Ads, SEO y redes sociales para negocios colombianos desde $250.000/mes. Respondemos en 10 minutos.",
  keywords: [
    "agencia digital Neiva",
    "agencia digital Colombia",
    "páginas web Colombia",
    "publicidad en Facebook Neiva",
    "Google Ads Colombia",
    "SEO posicionamiento Google Colombia",
    "diseño web profesional Colombia",
    "marketing digital Neiva Huila",
    "redes sociales para negocios Colombia",
    "AMC Agency Neiva",
  ],
  authors: [{ name: "AMC Agency", url: "https://amcagencyweb.com" }],
  creator: "AMC Agency",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: "https://amcagencyweb.com/landing/agencia-digital",
    siteName: "AMC Agency",
    title: "Agencia Digital en Colombia | Más Clientes para tu Negocio — AMC Agency",
    description:
      "Páginas web profesionales, publicidad digital, SEO y redes sociales. Ya ayudamos a 47+ negocios colombianos a vender más por internet. Desde $250.000/mes.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "AMC Agency — Agencia Digital Colombia",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Agencia Digital Colombia | AMC Agency",
    description:
      "Páginas web, publicidad y SEO para negocios colombianos. Desde $250.000/mes. Respondemos en 10 minutos.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "https://amcagencyweb.com/landing/agencia-digital",
  },
};

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
