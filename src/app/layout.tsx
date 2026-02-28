import "./globals.css";
import type { Metadata } from "next";
import { LanguageProvider } from "@/context/LanguageContext";
import Script from "next/script";
import { ScrollToTop } from "@/components/marketing/ScrollToTop";
import { WhatsAppButton } from "@/components/marketing/WhatsAppButton";

const GA_ID = "G-EWKT9CG3FZ";
const FB_PIXEL_ID = "780457111253195";

export const metadata: Metadata = {
  metadataBase: new URL("https://amcagencyweb.com"),
  title: {
    default: "AMC Agency | Renting Web de Élite en Colombia",
    template: "%s | AMC Agency",
  },
  description:
    "Agencia digital colombiana especializada en renting web, desarrollo con Next.js, SEO técnico, cloud infrastructure y marketing digital. Tu sitio web profesional desde $299.000/mes.",
  keywords: [
    "agencia digital Colombia",
    "renting web Colombia",
    "diseño web profesional",
    "desarrollo web Next.js",
    "SEO Colombia",
    "marketing digital Bogotá",
    "hosting Colombia",
    "AMC Agency",
    "páginas web para negocios",
    "infraestructura cloud",
  ],
  authors: [{ name: "AMC Agency", url: "https://amcagencyweb.com" }],
  creator: "AMC Agency",
  publisher: "AMC Agency",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: "https://amcagencyweb.com",
    siteName: "AMC Agency",
    title: "AMC Agency | Renting Web de Élite en Colombia",
    description:
      "Tu plataforma digital profesional desde $299.000/mes. Diseño, hosting, SEO y soporte 24/7.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "AMC Agency - Renting Web Colombia",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AMC Agency | Renting Web de Élite",
    description: "Agencia digital colombiana. Tu web profesional desde $299k/mes.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "https://amcagencyweb.com",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "32x32" },
    ],
    apple: "/favicon.svg",
  },
  verification: {
    google: "google-site-verification",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <head>
        {/* ─── Preconnect — Dominios externos críticos ─── */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="preconnect" href="https://connect.facebook.net" />
        <link rel="dns-prefetch" href="https://connect.facebook.net" />
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />

        {/* ─── Google Analytics ─── */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}', { page_path: window.location.pathname });
          `}
        </Script>

        {/* ─── Facebook Pixel Base ─── */}
        <Script id="facebook-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${FB_PIXEL_ID}');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
      </head>
      <body
        className="bg-[#050505] text-white antialiased selection:bg-blue-500/30"
        suppressHydrationWarning
      >
        <LanguageProvider>
          {children}
          <ScrollToTop />
          <WhatsAppButton />
        </LanguageProvider>
      </body>
    </html>
  );
}