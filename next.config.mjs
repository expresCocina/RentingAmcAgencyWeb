/** @type {import('next').NextConfig} */
const nextConfig = {
  // ── Optimización de imágenes ──
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      { protocol: 'https', hostname: 'plus.unsplash.com', pathname: '/**' },
      { protocol: 'https', hostname: 'cdn.sanity.io', pathname: '/**' },
    ],
    // Formatos modernos: WebP + AVIF (Chrome ≥ 85, Safari ≥ 16)
    formats: ['image/avif', 'image/webp'],
    // Tamaños comunes de dispositivos móviles
    deviceSizes: [375, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 64, 128, 256, 384],
    minimumCacheTTL: 86400, // 24h caché de imágenes procesadas
  },

  // ── Redirects para rutas del proyecto anterior ─────────────────────────
  async redirects() {
    return [
      // El redirect de email de Supabase del proyecto viejo
      {
        source: '/capig/autoconfig',
        destination: '/auth/confirm',
        permanent: false,
      },
      {
        source: '/capig/:path*',
        destination: '/login',
        permanent: false,
      },
      // Rutas de auth antiguas
      {
        source: '/auth/callback',
        destination: '/auth/confirm',
        permanent: false,
      },
    ]
  },

  // ── Headers de caché HTTP para activos estáticos ──
  async headers() {
    return [
      {
        // JS, CSS, fuentes e imágenes del _next/static → 1 año (immutable)
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Imágenes públicas → 30 días
        source: '/(:path*\\.(?:jpg|jpeg|png|gif|webp|avif|svg|ico))',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=2592000, stale-while-revalidate=86400',
          },
        ],
      },
      {
        // Fuentes → 1 año
        source: '/(:path*\\.(?:woff|woff2|ttf|otf|eot))',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // ── Compresión ──
  compress: true,

  // ── Experimental ──
  experimental: {
    optimizePackageImports: [
      'framer-motion',
      'lucide-react',
    ],
  },
};

export default nextConfig;