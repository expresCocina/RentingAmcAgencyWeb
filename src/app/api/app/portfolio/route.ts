import { NextResponse } from 'next/server';

// ── GET /api/app/portfolio ─────────────────────────────────────────────────
// Devuelve el portafolio de proyectos de AMC Agency para la app móvil.
// No requiere autenticación (datos públicos).

export const dynamic = 'force-static';
export const revalidate = 3600;

const portfolio = [
  {
    id: 'emision-facturacion',
    title: 'E-Misión · Facturación',
    category: 'SaaS · Facturación DIAN',
    description: 'Plataforma de ventas y facturación electrónica para empresas colombianas. Emisión de facturas DIAN en segundos.',
    longDescription: 'Diseñamos y desarrollamos la plataforma de facturación electrónica de E-Misión, un SaaS especializado en cumplimiento DIAN para PYMEs colombianas. UX ultra-simplificado que permite emitir, gestionar y enviar facturas electrónicas en pocos clics, con integración directa a la DIAN y dashboard de reportes en tiempo real.',
    technologies: ['Next.js', 'Supabase', 'API DIAN', 'Vercel', 'Resend'],
    result: 'Facturación electrónica DIAN en <30 segundos',
    colorHex: '#00D4A1',
    liveUrl: 'https://ventas.emision.co',
  },
  {
    id: 'spacexlatam',
    title: 'SpaceX Latam',
    category: 'Web Renting + CRM',
    description: 'Plataforma web para empresa aeroespacial latinoamericana con CRM integrado y gestión de clientes.',
    longDescription: 'Desarrollamos la identidad digital completa de SpaceX Latam, incluyendo un sitio web de alto impacto y un sistema CRM personalizado para gestionar sus operaciones regionales.',
    technologies: ['Next.js', 'Supabase', 'Tailwind CSS', 'Resend'],
    result: '+340% en leads calificados en 60 días',
    colorHex: '#1a1a2e',
    liveUrl: null,
  },
  {
    id: 'express-cocina',
    title: 'Express Cocina',
    category: 'Landing Page + Marketing',
    description: 'Landing page de alta conversión para servicio de catering con integración de Google Ads y Meta Ads.',
    longDescription: 'Creamos una landing page optimizada para conversiones con tracking avanzado de Google Analytics 4, Meta Pixel y Google Ads.',
    technologies: ['React', 'GA4', 'Meta Pixel', 'Google Ads'],
    result: '-60% en costo por lead en el primer mes',
    colorHex: '#1a0a00',
    liveUrl: null,
  },
  {
    id: 'italia-atelier',
    title: 'Italia Atelier',
    category: 'Web Renting + Branding',
    description: 'Sitio web premium para marca de moda italiana con identidad visual completa y catálogo digital.',
    longDescription: 'Proyecto integral de transformación digital para una marca de moda de lujo. Incluye diseño editorial premium y catálogo de productos.',
    technologies: ['Next.js', 'Framer Motion', 'Supabase', 'Cloudinary'],
    result: '+200% en tráfico orgánico en 90 días',
    colorHex: '#1a0a1a',
    liveUrl: 'https://www.italiatelier.com',
  },
  {
    id: 'amc-crm',
    title: 'AMC Agency CRM',
    category: 'CRM WaaS',
    description: 'Sistema CRM propio de AMC Agency — el mismo que usamos para gestionar internamente a nuestros clientes.',
    longDescription: 'Desarrollado 100% in-house, el CRM de AMC Agency es la solución para gestionar leads, clientes, pagos y comunicaciones con portal móvil incluido.',
    technologies: ['Next.js', 'Flutter', 'Supabase', 'Resend', 'n8n'],
    result: '100% de clientes gestionados sin fricción',
    colorHex: '#0a1a0a',
    liveUrl: 'https://www.amcagencyweb.com',
  },
];

export async function GET() {
  return NextResponse.json(
    { success: true, data: portfolio },
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    }
  );
}
