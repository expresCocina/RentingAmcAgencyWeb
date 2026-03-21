import "./globals.css";
import type { Metadata } from "next";
import { LanguageProvider } from "@/context/LanguageContext";
import Script from "next/script";
import { ScrollToTop } from "@/components/marketing/ScrollToTop";
import { WhatsAppButton } from "@/components/marketing/WhatsAppButton";
import { FbPageViewTracker } from "@/components/marketing/FbPageViewTracker";
import { ClientShell } from "@/components/marketing/ClientShell";

const GA_ID = "G-EWKT9CG3FZ";
const FB_PIXEL_ID = "780457111253195";

export const metadata: Metadata = {
  metadataBase: new URL("https://amcagencyweb.com"),
  title: {
    default: "AMC Agency | Renting Web de Elite en Colombia",
    template: "%s | AMC Agency",
  },
  description:
    "Agencia digital colombiana especializada en renting web, desarrollo con Next.js, SEO tecnico, cloud infrastructure y marketing digital. Tu sitio web profesional desde $490.000/mes.",
  keywords: [
    "agencia digital Colombia",
    "renting web Colombia",
    "diseno web profesional",
    "desarrollo web Next.js",
    "SEO Colombia",
    "marketing digital Bogota",
    "hosting Colombia",
    "AMC Agency",
    "paginas web para negocios",
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
    title: "AMC Agency | Renting Web de Elite en Colombia",
    description:
      "Tu plataforma digital profesional desde $490.000/mes. Diseno, hosting, SEO y soporte 24/7.",
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
    title: "AMC Agency | Renting Web de Elite",
    description: "Agencia digital colombiana. Tu web profesional desde $490k/mes.",
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <head>
        {/* ─── Preconnect - solo dominios que realmente se usan ─── */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="preconnect" href="https://connect.facebook.net" />
        <link rel="dns-prefetch" href="https://connect.facebook.net" />

        {/* ─── Preload fuente critica (Inter via Google Fonts) ─── */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="preload"
          as="style"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap"
          media="print"
          // @ts-expect-error onload trick for non-blocking font load
          onLoad="this.media='all'"
        />

        {/* ─── Google Analytics: carga diferida ─── */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="lazyOnload"
        />
        <Script id="google-analytics" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}', { page_path: window.location.pathname });
          `}
        </Script>

        {/* ─── Facebook Pixel: afterInteractive para no bloquear LCP ─── */}
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
      </head>
      <body
        className="bg-[#050505] text-white antialiased selection:bg-blue-500/30"
        suppressHydrationWarning
      >
        <LanguageProvider>
          <FbPageViewTracker />
          <ClientShell />
          {children}
          <ScrollToTop />
          <WhatsAppButton />
        </LanguageProvider>
      </body>
    </html>
  );
}
