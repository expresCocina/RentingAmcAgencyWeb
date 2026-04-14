import { NextResponse } from 'next/server';

// ── GET /api/app/plans ─────────────────────────────────────────────────────
// Devuelve los planes y precios de AMC Agency para la app móvil.
// No requiere autenticación (datos públicos).

export const dynamic = 'force-static';
export const revalidate = 3600;

const plans = [
  {
    id: 'renting_basico',
    name: 'Renting Básico',
    price: '$199.000',
    priceNote: 'COP / mes',
    tagline: 'El arranque perfecto',
    isPopular: false,
    includesPrevious: false,
    features: [
      'Sitio web profesional de 5 páginas',
      'Hosting y dominio incluidos',
      'Diseño responsive (mobile-first)',
      'SEO básico optimizado',
      'Formulario de contacto',
      'Integración WhatsApp',
      'Soporte vía email',
      '1 actualización mensual de contenido',
    ],
    cta: 'Comenzar ahora',
    whatsapp: '+573138537261',
  },
  {
    id: 'renting_pro',
    name: 'Renting Pro',
    price: '$349.000',
    priceNote: 'COP / mes',
    tagline: 'Para negocios que quieren crecer',
    isPopular: true,
    includesPrevious: true,
    features: [
      'Todo lo del plan Básico',
      'Sitio web de hasta 10 páginas',
      'Blog o catálogo de productos',
      'SEO avanzado + Google Search Console',
      'Integración Google Analytics 4',
      'Chat bot básico con IA',
      'Soporte prioritario 48h',
      '3 actualizaciones mensuales',
      'Informe mensual de rendimiento',
    ],
    cta: 'Quiero el Pro',
    whatsapp: '+573138537261',
  },
  {
    id: 'renting_elite',
    name: 'Renting Elite',
    price: '$599.000',
    priceNote: 'COP / mes',
    tagline: 'La experiencia premium completa',
    isPopular: false,
    includesPrevious: true,
    features: [
      'Todo lo del plan Pro',
      'Páginas ilimitadas',
      'CRM integrado (gestión de clientes)',
      'App móvil para tu negocio',
      'Automatización de marketing',
      'Campañas Google/Meta Ads gestionadas',
      'Soporte prioritario 24/7',
      'Actualizaciones ilimitadas',
      'Reunión estratégica mensual',
      'Portal de cliente personalizado',
    ],
    cta: 'Ir al Elite',
    whatsapp: '+573138537261',
  },
];

export async function GET() {
  return NextResponse.json(
    { success: true, data: plans },
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    }
  );
}
