import { NextResponse } from 'next/server';

// ── GET /api/app/services ──────────────────────────────────────────────────
// Devuelve el catálogo de servicios de AMC Agency para la app móvil.
// No requiere autenticación (datos públicos).

export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidar cada hora

const services = [
  {
    id: 'web-renting',
    title: 'Web Renting',
    subtitle: 'Tu sitio web sin inversión inicial',
    description: 'Obtén un sitio web profesional de alto rendimiento sin pagar una gran suma inicial. Paga mensualmente y mantén siempre tu presencia digital activa.',
    icon: '🌐',
    tag: 'MÁS POPULAR',
    features: [
      'Diseño personalizado y profesional',
      'Hosting incluido en el precio',
      'Dominio premium gestionado',
      'SEO técnico optimizado',
      'Soporte prioritario 24/7',
      'Actualizaciones mensuales incluidas',
    ],
  },
  {
    id: 'crm-waas',
    title: 'CRM WaaS',
    subtitle: 'Gestión de clientes inteligente',
    description: 'Sistema CRM completo para gestionar tus leads, clientes, pagos y comunicaciones desde un solo lugar. Automatización total del negocio.',
    icon: '📊',
    tag: 'ENTERPRISE',
    features: [
      'Panel de administración completo',
      'Gestión de leads en tiempo real',
      'Automatización de emails',
      'Reportes y métricas avanzadas',
      'Integración WhatsApp',
      'Multi-usuario con roles',
    ],
  },
  {
    id: 'marketing-digital',
    title: 'Marketing Digital',
    subtitle: 'Campañas que generan resultados',
    description: 'Estrategias de marketing digital orientadas a resultados. Google Ads, Meta Ads y SEO orgánico para hacer crecer tu negocio.',
    icon: '🚀',
    tag: 'PREMIUM',
    features: [
      'Gestión de Google Ads',
      'Campañas de Meta (Facebook/Instagram)',
      'SEO y posicionamiento orgánico',
      'Análisis de competencia',
      'Reportes mensuales detallados',
      'Optimización continua de campañas',
    ],
  },
  {
    id: 'app-movil',
    title: 'App Móvil',
    subtitle: 'Tu negocio en el bolsillo',
    description: 'Desarrollo de aplicaciones móviles nativas para Android e iOS. Conecta con tus clientes donde estén y ofrece una experiencia premium.',
    icon: '📱',
    tag: 'NUEVO',
    features: [
      'Desarrollo nativo Android & iOS',
      'Diseño UI/UX de alto impacto',
      'Integración con tu sistema actual',
      'Notificaciones push',
      'Panel de administración incluido',
      'Soporte técnico continuo',
    ],
  },
  {
    id: 'branding',
    title: 'Branding & Identidad',
    subtitle: 'Una marca que impacta',
    description: 'Creamos la identidad visual completa de tu marca. Logo, paleta de colores, tipografías y guía de estilo para que tu negocio sea reconocible.',
    icon: '🎨',
    tag: 'CREATIVO',
    features: [
      'Diseño de logotipo profesional',
      'Paleta de colores corporativa',
      'Manual de identidad visual',
      'Papelería corporativa',
      'Aplicaciones digitales del branding',
      'Revisiones ilimitadas',
    ],
  },
  {
    id: 'consultoria',
    title: 'Consultoría Digital',
    subtitle: 'Estrategia para escalar',
    description: 'Sesiones estratégicas de consultoría para llevar tu negocio al siguiente nivel digital. Análisis, planeación y acompañamiento experto.',
    icon: '💡',
    tag: 'ESTRATÉGICO',
    features: [
      'Diagnóstico digital completo',
      'Plan de transformación digital',
      'Sesiones estratégicas mensuales',
      'Análisis de métricas y KPIs',
      'Hoja de ruta de crecimiento',
      'Acceso a red de partners',
    ],
  },
];

export async function GET() {
  return NextResponse.json(
    { success: true, data: services },
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    }
  );
}
