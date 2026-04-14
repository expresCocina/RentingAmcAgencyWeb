import '../models/models.dart';

/// AMC Agency Mock Data
/// Replace with real API/Supabase calls when backend is connected
class MockData {
  MockData._();

  // ── Services ─────────────────────────────────────────────────────────────
  static const List<ServiceModel> services = [
    ServiceModel(
      id: 'web-dev',
      title: 'Desarrollo Web de Élite',
      subtitle: 'Sitios ultra-rápidos y escalables',
      description:
          'Construimos plataformas digitales con Next.js 15, renderizado híbrido y optimización Core Web Vitals al límite. Tu web como ventaja competitiva real.',
      icon: '🚀',
      tag: 'Performance',
      features: [
        'Next.js 15 + React 19',
        'Core Web Vitals optimizados',
        'SEO técnico avanzado',
        'Diseño UI/UX premium',
        'Integraciones API REST / GraphQL',
        'Panel de administración a medida',
        'Soporte post-lanzamiento 24/7',
      ],
    ),
    ServiceModel(
      id: 'cloud',
      title: 'Infraestructura Cloud',
      subtitle: 'Arquitectura serverless global',
      description:
          'Diseñamos y desplegamos arquitecturas serverless en AWS y Vercel. Escalabilidad automática, alta disponibilidad y costos optimizados para tu negocio.',
      icon: '☁️',
      tag: 'Cloud',
      features: [
        'AWS / Vercel / GCP',
        'Arquitectura serverless',
        'Auto-scaling inteligente',
        'CDN global de alta velocidad',
        'Monitoreo y alertas 24/7',
        'Disaster recovery automatizado',
        'Optimización de costos cloud',
      ],
    ),
    ServiceModel(
      id: 'renting',
      title: 'Renting Tecnológico',
      subtitle: 'Tu plataforma siempre actualizada',
      description:
          'Modelo de suscripción todo incluido: desarrollo continuo, mantenimiento, seguridad y evolución constante. Sin sorpresas. Sin inversión desproporcionada.',
      icon: '♾️',
      tag: 'Suscripción',
      features: [
        'Desarrollo y mantenimiento incluido',
        'Actualizaciones tecnológicas continuas',
        'Hosting premium incluido',
        'Seguridad y backups diarios',
        'Soporte prioritario 24/7',
        'Reportes mensuales de rendimiento',
        'Evolución del producto sin costo extra',
      ],
    ),
    ServiceModel(
      id: 'security',
      title: 'Seguridad Enterprise',
      subtitle: 'Protección de grado militar',
      description:
          'Protección DDoS avanzada, WAF, cifrado de extremo a extremo y cumplimiento normativo. Tu infraestructura digital blindada con los más altos estándares.',
      icon: '🛡️',
      tag: 'Seguridad',
      features: [
        'Protección DDoS avanzada',
        'Web Application Firewall (WAF)',
        'Cifrado SSL/TLS de extremo a extremo',
        'Autenticación multifactor',
        'Análisis de vulnerabilidades',
        'Cumplimiento GDPR / ISO 27001',
        'Respuesta ante incidentes 24/7',
      ],
    ),
  ];

  // ── Portfolio ─────────────────────────────────────────────────────────────
  static const List<ProjectModel> portfolio = [
    ProjectModel(
      id: 'emision-facturacion',
      title: 'E-Misión · Facturación',
      category: 'SaaS · Facturación DIAN',
      description: 'Plataforma de facturación electrónica para empresas colombianas. Emisión de facturas DIAN en segundos.',
      longDescription:
          'Diseñamos la plataforma de facturación electrónica de E-Misión, un SaaS especializado en cumplimiento DIAN para PYMEs colombianas. UX ultra-simplificado que permite emitir, gestionar y enviar facturas electrónicas en pocos clics, con integración directa a la DIAN y dashboard de reportes en tiempo real.',
      technologies: ['Next.js', 'Supabase', 'API DIAN', 'Vercel', 'Resend'],
      result: 'Facturación electrónica DIAN en <30 segundos',
      colorHex: '#00D4A1',
      liveUrl: 'https://ventas.emision.co',
    ),
    ProjectModel(
      id: 'crm-vida-digital',
      title: 'CRM Vida Digital',
      category: 'SaaS / CRM',
      description: 'Infraestructura SaaS optimizada para escalabilidad masiva de leads.',
      longDescription:
          'Desarrollamos una plataforma CRM SaaS desde cero con arquitectura multi-tenant, pipeline de ventas personalizable y dashboard analítico en tiempo real. Escalamos de 0 a +10,000 leads mensuales en 4 meses.',
      technologies: ['Next.js', 'Supabase', 'PostgreSQL', 'Vercel', 'Stripe'],
      result: '+10,000 leads/mes · Escalabilidad 10x',
      colorHex: '#00B4FF',
      liveUrl: 'https://crm-vida-digitalcol.vercel.app',
    ),
    ProjectModel(
      id: 'elegancia-atemporal',
      title: 'Elegancia Atemporal',
      category: 'E-Commerce Premium',
      description: 'Experiencia premium de alta relojería y catálogo exclusivo.',
      longDescription:
          'Diseñamos y desarrollamos una tienda de lujo para una boutique de alta relojería. Experiencia de usuario inmersiva, catálogo 3D de productos y checkout ultra-fluido que incrementó un 340% la tasa de conversión.',
      technologies: ['Next.js', 'Three.js', 'Stripe', 'Sanity CMS'],
      result: '+340% conversión · Ticket promedio \$2,800 USD',
      colorHex: '#C9A84C',
      liveUrl: 'https://www.cycrelojeria.com',
    ),
    ProjectModel(
      id: 'lyon-vision-crm',
      title: 'Lyon Visión CRM',
      category: 'Software Médico',
      description: 'Sistema clínico especializado para el sector óptico.',
      longDescription:
          'Sistema de gestión clínica a medida para una cadena de ópticas médicas. Historia clínica digital, agenda inteligente, facturación automatizada y reportes regulatorios. Reducción del 60% en tiempo administrativo.',
      technologies: ['React', 'Node.js', 'PostgreSQL', 'AWS RDS'],
      result: '-60% tiempo administrativo · 15 clínicas',
      colorHex: '#00D4A1',
      liveUrl: 'https://crmopticalyonvision.vercel.app',
    ),
    ProjectModel(
      id: 'taller-de-italia',
      title: 'Taller de Italia',
      category: 'Presencia Digital',
      description: 'Sastrería artesanal: presencia digital con enfoque premium.',
      longDescription:
          'Plataforma digital completa para una sastrería de alta costura. Portfolio visual de colecciones, sistema de citas online y módulo de pedidos a medida. SEO local que triplicó las consultas mensuales.',
      technologies: ['Next.js', 'Sanity CMS', 'Calendly API', 'Vercel'],
      result: '3x consultas mensuales · Top 3 Google Local',
      colorHex: '#7C3AED',
      liveUrl: 'https://www.italiatelier.com',
    ),
    ProjectModel(
      id: 'somos-turbo',
      title: 'Somos Turbo Brand',
      category: 'Branding + Performance',
      description: 'Diseño disruptivo y optimización de rendimiento digital.',
      longDescription:
          'Rebranding completo y plataforma digital para agencia de marketing. Nueva identidad visual, sitio web de alto rendimiento y estrategia de contenido digital. Score Lighthouse 98/100 y 500% más tráfico orgánico.',
      technologies: ['Next.js', 'Framer Motion', 'Figma', 'Google Analytics 4'],
      result: '+500% tráfico orgánico · Lighthouse 98/100',
      colorHex: '#FF4D6D',
      liveUrl: 'https://www.turbobrandcol.com', // Nota: este sitio bloquea iframes
    ),
  ];


  // ── Plans ─────────────────────────────────────────────────────────────────
  static const List<PlanModel> plans = [
    PlanModel(
      id: 'digital-core',
      name: 'Digital Core',
      price: '\$299.000',
      priceNote: 'COP / mes',
      tagline: 'Presencia profesional y autoridad de marca',
      isPopular: false,
      features: [
        'Desarrollo Web Next.js 15',
        'Hosting & Mantenimiento Pro',
        'SEO Técnico & Indexación Google',
        'Gestión Social (2 redes)',
        'Soporte 24/7',
        'Actualizaciones continuas',
        'SSL & Seguridad incluida',
      ],
    ),
    PlanModel(
      id: 'growth-ads',
      name: 'Growth & Ads',
      price: '\$699.000',
      priceNote: 'COP / mes',
      tagline: 'Escalabilidad agresiva y captura de leads',
      isPopular: true,
      includesPrevious: true,
      features: [
        'Todo en Digital Core',
        'Gestión Meta & Google Ads',
        'Estrategia de Funnels de Venta',
        'Creación de Contenido Viral',
        'Integración CRM Vida Digital',
        'Dashboard de Analítica en Vivo',
        'A/B Testing continuo',
      ],
    ),
    PlanModel(
      id: 'elite-partner',
      name: 'Elite Partner',
      price: 'A medida',
      priceNote: 'Consultoría incluida',
      tagline: 'Tu departamento digital externo completo',
      isPopular: false,
      includesPrevious: true,
      features: [
        'Todo en Growth & Ads',
        'Inbound Marketing & Emailing',
        'Automatización con IA',
        'Branding & Identidad Visual',
        'Software a Medida Ilimitado',
        'Consultoría Estratégica Semanal',
        'Account Manager dedicado',
      ],
    ),
  ];

  // ── FAQs ─────────────────────────────────────────────────────────────────
  static const List<FaqModel> faqs = [
    FaqModel(
      question: '¿Qué diferencia al Renting Tecnológico de contratar una web tradicional?',
      answer:
          'El ecosistema digital cambia a diario. Con un pago único, tu web queda obsoleta en meses y terminas pagando mantenimientos sorpresa. Con nuestro Renting, tu plataforma evoluciona constantemente: incluye alojamiento premium, seguridad al día y actualizaciones tecnológicas continuas sin gastos imprevistos.',
    ),
    FaqModel(
      question: '¿Cuánto tiempo tarda en estar lista mi plataforma?',
      answer:
          'Dependiendo del plan y la complejidad, entre 2 y 6 semanas. Trabajamos con metodología ágil en sprints semanales para que veas avances constantes desde el primer día.',
    ),
    FaqModel(
      question: '¿Puedo cambiar de plan en el futuro?',
      answer:
          'Sí. Nuestros planes están diseñados para escalar con tu negocio. Puedes hacer upgrade en cualquier momento sin penalizaciones. También personalizamos los planes según tus necesidades específicas.',
    ),
    FaqModel(
      question: '¿Trabajan con empresas fuera de Colombia?',
      answer:
          'Sí. Trabajamos con empresas en toda Latinoamérica, España y Estados Unidos. Nuestra infraestructura cloud está distribuida globalmente para garantizar el mejor rendimiento sin importar la ubicación.',
    ),
    FaqModel(
      question: '¿Qué pasa si quiero cancelar el servicio?',
      answer:
          'Entendemos que los negocios evolucionan. Puedes cancelar con 30 días de aviso. Te entregamos todo el código fuente, accesos y documentación técnica de tu plataforma.',
    ),
    FaqModel(
      question: '¿Incluye el diseño UX/UI el plan Digital Core?',
      answer:
          'Sí. Todos nuestros planes incluyen diseño profesional UI/UX. No usamos plantillas genéricas: cada proyecto tiene una identidad visual única alineada con tu marca.',
    ),
    FaqModel(
      question: '¿Cómo funcionan los pagos y la facturación?',
      answer:
          'Facturamos mensualmente con pago anticipado. Aceptamos transferencia bancaria, PSE y tarjeta de crédito. Emitimos factura electrónica legal en cada periodo.',
    ),
    FaqModel(
      question: '¿AMC Agency puede manejar proyectos de gran escala?',
      answer:
          'Absolutamente. Nuestra arquitectura cloud está diseñada para escalar desde startups hasta empresas con millones de usuarios. El plan Elite Partner incluye consultoría estratégica para proyectos complejos.',
    ),
  ];

  // ── WhatsApp ──────────────────────────────────────────────────────────────
  static const String whatsappNumber = '573138537261';
  static const String whatsappDefaultMessage =
      'Hola! 👋 Vi la app de AMC Agency y me gustaría conocer más sobre sus servicios digitales.';
}
