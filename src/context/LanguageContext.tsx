"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

const dictionaries = {
  es: {
    nav: { services: "Servicios", projects: "Proyectos", renting: "Renting", quote: "Cotizar" },
    hero: {
      badge: "Tu página web, tus redes y tu publicidad digital en manos de expertos — tú solo enfócate en vender.",
      title1: "La Nueva Era de tu",
      title2: "Infraestructura Digital.",
      description: "Diseñamos, construimos y gestionamos tu presencia digital para que tu negocio consiga más clientes todos los días — sin preocuparte por nada técnico.",
      btnPrimary: "Ver Planes Enterprise",
      btnSecondary: "Explorar Showcase"
    },
    stats: {
      uptime: "Uptime Garantizado",
      uptimeValue: "99.9%",
      projects: "Proyectos Entregados",
      projectsValue: "150+",
      roi: "Retorno de Inversión",
      roiValue: "300%+",
      support: "Soporte Global",
      supportValue: "24/7"
    },
    services: {
      title1: "Nuestras Soluciones",
      title2: "AMC",
      web: { 
        title: "Desarrollo Web de Élite", 
        desc: "Sitios ultra-rápidos con Next.js 15, renderizado híbrido y optimización Core Web Vitals al límite.",
        icon: "Globe"
      },
      cloud: { 
        title: "Infraestructura Cloud", 
        desc: "Arquitectura serverless global en AWS y Vercel. Escalabilidad automática sin límites.",
        icon: "Cpu"
      },
      renting: { 
        title: "Renting Tecnológico", 
        desc: "Modelo de suscripción todo incluido: desarrollo, mantenimiento y evolución continua.",
        icon: "Zap"
      },
      security: { 
        title: "Sitio Seguro y Siempre Activo", 
        desc: "Tu web protegida las 24 horas, sin caidas, sin hackeos y con respaldo automatico de toda tu informacion.",
        icon: "Shield"
      }
    },
    process: {
      subtitle: "Nuestro Proceso",
      title1: "De la idea a",
      title2: "la realidad",
      step1: { t: "Descubrimiento", d: "Analizamos tu negocio y visión para crear una estrategia personalizada." },
      step2: { t: "Arquitectura", d: "Diseñamos la infraestructura digital escalable y segura que tu empresa necesita." },
      step3: { t: "Desarrollo", d: "Construimos con Next.js 15, tecnologías cloud y máxima optimización." },
      step4: { t: "Despliegue", d: "Lanzamos tu solución en producción con monitoreo 24/7 y soporte continuo." },
      verified: "Implementado y verificado"
    },
    // === NUEVA SECCIÓN EMPRESA ===
    company: {
      about: {
        title: "Sobre Nosotros",
        subtitle: "Arquitectos Digitales",
        desc: "En AMC Agency no solo escribimos código; diseñamos el futuro de la infraestructura corporativa. Somos un equipo global dedicado a la perfección técnica y la escalabilidad infinita."
      },
      portfolio: {
        title: "Portafolio",
        subtitle: "Casos de Éxito",
        desc: "Explora los ecosistemas digitales que hemos construido para líderes de la industria bajo estándares de alto rendimiento."
      },
      blog: {
        title: "Blog & Insights",
        subtitle: "Conocimiento de Élite",
        desc: "Análisis técnicos sobre Next.js 15, Cloud Infrastructure y estrategias avanzadas de crecimiento digital."
      }
    },
    contact: {
      badge: "Contacto Directo",
      title: "Inicia tu era",
      titleHighlight: "Digital",
      description: "No somos una agencia más. Somos tu partner tecnológico. Cuéntanos tu proyecto y lo haremos realidad.",
      fullName: "Nombre Completo",
      fullNamePlaceholder: "Ej. Christian S.",
      email: "Email Corporativo",
      emailPlaceholder: "tu@empresa.com",
      service: "Servicio de Interés",
      message: "Cuéntanos tu proyecto",
      messagePlaceholder: "¿Qué necesitas desarrollar?",
      budget: "Presupuesto Estimado",
      send: "Enviar Proyecto",
      sending: "Enviando...",
      successMessage: "¡Recibimos tu proyecto! Te contactaremos pronto.",
      errorMessage: "Error al enviar. Intenta nuevamente."
    },
    footer: {
      branding: { brand: "AMC", highlight: "Agency", desc: "Arquitectura digital de élite para marcas globales." },
      services: { title: "Servicios", web: "Desarrollo Web", cloud: "Cloud Infrastructure", renting: "Renting Tecnológico" },
      company: { title: "Empresa", about: "Sobre Nosotros", portfolio: "Portafolio", blog: "Blog" },
      connect: { title: "Conecta" },
      copyright: "AMC Agency. Todos los derechos reservados.",
      privacy: "Política de Privacidad",
      terms: "Términos de Servicio"
    },
    webDev: {
      badge: "Servicio de Élite",
      title: "Desarrollo Web",
      titleHighlight: "Ultrarrápido.",
      description: "No hacemos 'páginas web'. Construimos plataformas digitales avanzadas que cargan en milisegundos y posicionan tu marca como el líder indiscutible de tu industria.",
      feature1Title: "Velocidad Extrema (Core Web Vitals)",
      feature1Desc: "Desarrollamos con Next.js 15 y React Server Components. Tu sitio cargará en milisegundos, reduciendo la tasa de rebote y dominando los puntajes de Google.",
      feature2Title: "Arquitectura SEO Nativa",
      feature2Desc: "No dependemos de plugins básicos. Implementamos renderizado del lado del servidor (SSR) para que tu contenido sea indexado instantáneamente.",
      feature3Title: "Diseño UI/UX de Lujo",
      feature3Desc: "Interfaces construidas con Tailwind CSS y Framer Motion. Cada interacción, botón y transición transmite autoridad y confianza.",
      feature4Title: "Seguridad y Escalabilidad",
      feature4Desc: "Despliegues automatizados en Vercel Edge Network. Protegidos contra ataques DDoS y listos para soportar picos de tráfico virales.",
      auditLabel: "Auditoría en Tiempo Real: Google Lighthouse Vitals",
      metricsLabel: "Métricas Clave",
      gridTitle: "Tecnología",
      gridHighlight: "Insuperable",
      ctaTitle: "Tu competencia usa plantillas lentas.",
      ctaHighlight: "Tú dominarás con tecnología de punta.",
      ctaDesc: "Agenda una auditoría gratuita y descubre cómo una infraestructura moderna multiplica tus conversiones reales.",
      ctaButton: "Aplicar Ahora",
      modalBadge: "🔥 Atención Prioritaria de Desarrollo",
      modalSubtitle: "Auditoría de Arquitectura",
      modalTitle: "Solicitud",
      modalHighlight: "VIP",
      modalDesc: "Nuestros arquitectos evaluarán si tu modelo de negocio es compatible con nuestra infraestructura ultrarrápida.",
      namePlaceholder: "Ej. Christian S.",
      fieldName: "Nombre del CEO / Fundador",
      fieldEmail: "Email Corporativo",
      emailPlaceholder: "ceo@tuempresa.com",
      fieldOptional: "WhatsApp + Url de tu web actual (si tienes)",
      placeholderOptional: "Mi WhatsApp es... y mi web actual es...",
      btnSubmit: "Enviar Aplicación",
      btnSubmitting: "Analizando...",
      successMsg: "¡Aplicación prioritaria recibida! Evaluaremos tu caso en breve.",
      errorMsg: "Error al enviar. Intenta nuevamente."
    },
    cloudInfra: {
      badge: "Arquitectura Serverless",
      title: "Infraestructura",
      titleHighlight: "Inquebrantable.",
      description: "Migramos y gestionamos tu ecosistema digital en la nube. Olvídate de los servidores caídos, las actualizaciones manuales y los cuellos de botella. Escala al infinito.",
      feature1Title: "Auto-Escalabilidad Inteligente",
      feature1Desc: "Tus servidores detectan picos de tráfico y se multiplican automáticamente en milisegundos. Paga solo por lo que usas, sin caídas en Black Friday.",
      feature2Title: "Distribución Global (CDN)",
      feature2Desc: "Desplegamos tu plataforma en más de 300 ciudades simultáneamente a través de Vercel Edge y AWS. Tu web cargará igual de rápido en Tokio que en Bogotá.",
      feature3Title: "Seguridad de Grado Bancario",
      feature3Desc: "Protección DDoS nativa, encriptación de extremo a extremo y copias de seguridad continuas. Tus datos y los de tus clientes son intocables.",
      feature4Title: "Uptime Garantizado (99.99%)",
      feature4Desc: "Arquitectura Serverless sin un punto único de fallo. Si un nodo cae, otro toma su lugar instantáneamente sin que tus usuarios lo noten.",
      clusterStatus: "Estado del Cluster:",
      clusterHealthy: "Óptimo (99.99% Uptime)",
      nodeLabel: "Nodo Cloud",
      nodeStatus: "Enrutando...",
      gridTitle: "Poder",
      gridHighlight: "Bajo Demanda",
      ctaTitle: "¿Tu plataforma está lista para el",
      ctaHighlight2: "próximo nivel de crecimiento?",
      ctaDesc: "Deja de preocuparte por el hosting. Hablemos de alta disponibilidad, bases de datos distribuidas y rendimiento global.",
      ctaButton: "Contactar Arquitecto Cloud",
      modalBadge: "⚡ Evaluación de Riesgo de Servidores",
      modalSubtitle: "Auditoría Cloud",
      modalTitle: "Despliegue",
      modalHighlight: "Global",
      modalDesc: "Cuéntanos tu volumen de tráfico actual y diseñaremos una arquitectura inquebrantable para tu negocio.",
      fieldName: "Nombre del CEO / CTO",
      fieldEmail: "Email Corporativo",
      fieldOptional: "WhatsApp + Tráfico mensual aprox. (Visitas)",
      placeholderOptional: "Mi WhatsApp es... y actualmente recibimos X visitas...",
      namePlaceholder: "Ej. Christian S.",
      emailPlaceholder: "ceo@tuempresa.com",
      btnSubmit: "Solicitar Infraestructura",
      btnSubmitting: "Evaluando...",
      successMsg: "¡Solicitud de infraestructura recibida! Un arquitecto te contactará.",
      errorMsg: "Error al enviar. Intenta nuevamente."
    },
    renting: {
      badge: "Enterprise Subscription Model",
      title: "Tech",
      titleHighlight: "Renting.",
      description: "Deja de inyectar capital en plataformas que quedan obsoletas al año. Transforma tu software en un gasto operativo (OPEX) predecible, deducible y siempre actualizado.",
      feature1Title: "Cero Inversión Inicial (CAPEX a OPEX)",
      feature1Desc: "No descapitalices tu empresa comprando software que se devalúa. Paga una cuota mensual predecible que es 100% deducible de impuestos.",
      feature2Title: "Evolución Continua (Anti-Obsolescencia)",
      feature2Desc: "El mundo digital cambia cada mes. Con el Renting, tu plataforma se actualiza constantemente con las últimas tecnologías sin costos adicionales.",
      feature3Title: "Soporte Ilimitado de Élite",
      feature3Desc: "No somos freelancers que desaparecen. Te asignamos un equipo dedicado de ingenieros como tu departamento digital externo (In-House).",
      feature4Title: "Retorno de Inversión (ROI) Acelerado",
      feature4Desc: "Al no tener que gastar decenas de miles de dólares por adelantado, tu presupuesto queda libre para inyectarlo en pautas publicitarias y ventas.",
      chartLabel: "Proyección a 12 Meses:",
      chartStatus: "Escalabilidad Sostenible",
      chartTitle: "Costo de Oportunidad",
      chartValue: "+",
      chartSubtitle: "Ahorro en CAPEX",
      gridTitle: "Inteligencia",
      gridHighlight: "Financiera",
      ctaTitle: "No compres software.",
      ctaHighlight2: "Renta un motor de crecimiento.",
      ctaDesc: "Descubre cuánto capital puedes liberar este año migrando tu empresa a nuestro modelo de Renting Digital.",
      ctaButton: "Agendar Estrategia",
      modalBadge: "📈 Optimización de OPEX",
      modalSubtitle: "Auditoría Financiera Digital",
      modalTitle: "Aplicación",
      modalHighlight: "Renting",
      modalDesc: "Evaluaremos tu infraestructura actual y te presentaremos una proyección de ahorro a 12 meses.",
      fieldName: "Nombre del CEO / CFO",
      fieldEmail: "Email Corporativo",
      fieldOptional: "WhatsApp + Gasto actual en software/mantenimiento",
      placeholderOptional: "Mi WhatsApp es... y gastamos aprox $X al mes en tecnología...",
      namePlaceholder: "Ej. Christian S.",
      emailPlaceholder: "ceo@tuempresa.com",
      btnSubmit: "Solicitar Proyección de Renting",
      btnSubmitting: "Proyectando...",
      successMsg: "¡Solicitud estratégica recibida! Evaluaremos tu modelo de negocio.",
      errorMsg: "Error al enviar. Intenta nuevamente."
    }
  },
  en: {
    nav: { services: "Services", projects: "Projects", renting: "Renting", quote: "Get Quote" },
    hero: {
      badge: "Enterprise Digital Solutions", 
      title1: "The New Era of Your", 
      title2: "Digital Infrastructure.",
      description: "AMC Agency designs, builds, and manages high-performance software platforms for global corporations under a smart renting model.",
      btnPrimary: "View Enterprise Plans", 
      btnSecondary: "Explore Showcase"
    },
    stats: {
      uptime: "Guaranteed Uptime",
      uptimeValue: "99.9%",
      projects: "Delivered Projects",
      projectsValue: "150+",
      roi: "Return on Investment",
      roiValue: "300%+",
      support: "Global Support",
      supportValue: "24/7"
    },
    services: {
      title1: "Our Solutions",
      title2: "AMC",
      web: { 
        title: "Elite Web Development", 
        desc: "Ultra-fast sites with Next.js 15, hybrid rendering, and Core Web Vitals pushed to the limit.",
        icon: "Globe"
      },
      cloud: { 
        title: "Cloud Infrastructure", 
        desc: "Global serverless architecture on AWS and Vercel. Limitless automatic scalability.",
        icon: "Cpu"
      },
      renting: { 
        title: "Tech Renting", 
        desc: "All-inclusive subscription model: development, maintenance, and continuous evolution.",
        icon: "Zap"
      },
      security: { 
        title: "Military-Grade Security", 
        desc: "Advanced DDoS protection, WAF, end-to-end encryption, and regulatory compliance.",
        icon: "Shield"
      }
    },
    process: {
      subtitle: "Our Process",
      title1: "From Idea to",
      title2: "Reality",
      step1: { t: "Discovery", d: "We analyze your business and vision to create a personalized strategy." },
      step2: { t: "Architecture", d: "We design the scalable and secure digital infrastructure your company needs." },
      step3: { t: "Development", d: "We build with Next.js 15, cloud technologies, and maximum optimization." },
      step4: { t: "Deployment", d: "We launch your solution in production with 24/7 monitoring and continuous support." },
      verified: "Implemented and verified"
    },
    // === NUEVA SECCIÓN EMPRESA (INGLÉS) ===
    company: {
      about: {
        title: "About Us",
        subtitle: "Digital Architects",
        desc: "At AMC Agency, we don't just write code; we design the future of corporate infrastructure. We are a global team dedicated to technical perfection and infinite scalability."
      },
      portfolio: {
        title: "Portfolio",
        subtitle: "Success Stories",
        desc: "Explore the digital ecosystems we've built for industry leaders under high-performance standards."
      },
      blog: {
        title: "Blog & Insights",
        subtitle: "Elite Knowledge",
        desc: "Technical analysis on Next.js 15, Cloud Infrastructure, and advanced digital growth strategies."
      }
    },
    contact: {
      badge: "Direct Contact",
      title: "Start Your",
      titleHighlight: "Digital Era",
      description: "We're not just another agency. We're your tech partner. Tell us your project and we'll make it happen.",
      fullName: "Full Name",
      fullNamePlaceholder: "E.g. Christian S.",
      email: "Corporate Email",
      emailPlaceholder: "you@company.com",
      service: "Service of Interest",
      message: "Tell us about your project",
      messagePlaceholder: "What do you need to develop?",
      budget: "Estimated Budget",
      send: "Send Project",
      sending: "Sending...",
      successMessage: "We received your project! We'll contact you soon.",
      errorMessage: "Error sending. Please try again."
    },
    footer: {
      branding: { brand: "AMC", highlight: "Agency", desc: "Elite digital architecture for global brands." },
      services: { title: "Services", web: "Web Development", cloud: "Cloud Infrastructure", renting: "Tech Renting" },
      company: { title: "Company", about: "About Us", portfolio: "Portfolio", blog: "Blog" },
      connect: { title: "Connect" },
      copyright: "AMC Agency. All rights reserved.",
      privacy: "Privacy Policy",
      terms: "Terms of Service"
    },
    webDev: {
      badge: "Elite Service",
      title: "Web Development",
      titleHighlight: "Ultra-fast.",
      description: "We don't build 'websites'. We construct advanced digital platforms that load in milliseconds and position your brand as the undisputed leader in your industry.",
      feature1Title: "Extreme Speed (Core Web Vitals)",
      feature1Desc: "We develop with Next.js 15 and React Server Components. Your site will load in milliseconds, reducing bounce rate and dominating Google scores.",
      feature2Title: "Native SEO Architecture",
      feature2Desc: "We don't rely on basic plugins. We implement server-side rendering (SSR) so your content is indexed instantly.",
      feature3Title: "Luxury UI/UX Design",
      feature3Desc: "Interfaces built with Tailwind CSS and Framer Motion. Every interaction, button, and transition conveys authority and trust.",
      feature4Title: "Security and Scalability",
      feature4Desc: "Automated deployments on Vercel Edge Network. Protected against DDoS attacks and ready to handle traffic spikes.",
      auditLabel: "Real-Time Audit: Google Lighthouse Vitals",
      metricsLabel: "Key Metrics",
      gridTitle: "Unsurpassed",
      gridHighlight: "Technology",
      ctaTitle: "Your competitors use slow templates.",
      ctaHighlight: "You'll dominate with cutting-edge technology.",
      ctaDesc: "Schedule a free audit and discover how modern infrastructure multiplies your real conversions.",
      ctaButton: "Apply Now",
      modalBadge: "🔥 Priority Development Attention",
      modalSubtitle: "Architecture Audit",
      modalTitle: "Application",
      modalHighlight: "VIP",
      modalDesc: "Our architects will evaluate if your business model is compatible with our ultra-fast infrastructure.",
      namePlaceholder: "E.g. Christian S.",
      fieldName: "Name of CEO / Founder",
      fieldEmail: "Corporate Email",
      emailPlaceholder: "ceo@yourcompany.com",
      fieldOptional: "WhatsApp + URL of your current website (if you have one)",
      placeholderOptional: "My WhatsApp is... and my current website is...",
      btnSubmit: "Send Application",
      btnSubmitting: "Analyzing...",
      successMsg: "Priority application received! We'll evaluate your case soon.",
      errorMsg: "Error sending. Please try again."
    },
    cloudInfra: {
      badge: "Serverless Architecture",
      title: "Infrastructure",
      titleHighlight: "Unbreakable.",
      description: "We migrate and manage your digital ecosystem in the cloud. Forget about downed servers, manual updates, and bottlenecks. Scale infinitely.",
      feature1Title: "Intelligent Auto-Scaling",
      feature1Desc: "Your servers detect traffic spikes and multiply automatically in milliseconds. Pay only for what you use, without Black Friday outages.",
      feature2Title: "Global Distribution (CDN)",
      feature2Desc: "We deploy your platform simultaneously in 300+ cities through Vercel Edge and AWS. Your web will load just as fast in Tokyo as in Bogotá.",
      feature3Title: "Bank-Grade Security",
      feature3Desc: "Native DDoS protection, end-to-end encryption, and continuous backups. Your data and your customers' data are untouchable.",
      feature4Title: "Guaranteed Uptime (99.99%)",
      feature4Desc: "Serverless architecture with no single point of failure. If one node goes down, another takes its place instantly without your users noticing.",
      clusterStatus: "Cluster Status:",
      clusterHealthy: "Optimal (99.99% Uptime)",
      nodeLabel: "Cloud Node",
      nodeStatus: "Routing...",
      gridTitle: "On-Demand",
      gridHighlight: "Power",
      ctaTitle: "Is your platform ready for the",
      ctaHighlight2: "next level of growth?",
      ctaDesc: "Stop worrying about hosting. Let's talk about high availability, distributed databases, and global performance.",
      ctaButton: "Contact Cloud Architect",
      modalBadge: "⚡ Server Risk Assessment",
      modalSubtitle: "Cloud Audit",
      modalTitle: "Deployment",
      modalHighlight: "Global",
      modalDesc: "Tell us your current traffic volume and we'll design an unbreakable architecture for your business.",
      fieldName: "Name of CEO / CTO",
      fieldEmail: "Corporate Email",
      fieldOptional: "WhatsApp + Approx. monthly traffic (Visits)",
      placeholderOptional: "My WhatsApp is... and we currently receive X visits...",
      namePlaceholder: "E.g. Christian S.",
      emailPlaceholder: "ceo@yourcompany.com",
      btnSubmit: "Request Infrastructure",
      btnSubmitting: "Evaluating...",
      successMsg: "Infrastructure request received! An architect will contact you.",
      errorMsg: "Error sending. Please try again."
    },
    renting: {
      badge: "Enterprise Subscription Model",
      title: "Tech",
      titleHighlight: "Renting.",
      description: "Stop injecting capital into platforms that become obsolete in a year. Transform your software into a predictable, tax-deductible operating expense (OPEX) that's always updated.",
      feature1Title: "Zero Initial Investment (CAPEX to OPEX)",
      feature1Desc: "Don't drain your company's capital buying software that depreciates. Pay a predictable monthly fee that's 100% tax-deductible.",
      feature2Title: "Continuous Evolution (Anti-Obsolescence)",
      feature2Desc: "The digital world changes every month. With Renting, your platform updates constantly with the latest technologies at no extra cost.",
      feature3Title: "Elite Unlimited Support",
      feature3Desc: "We're not freelancers who disappear. We assign you a dedicated team of engineers as your external digital department (In-House).",
      feature4Title: "Accelerated Return on Investment (ROI)",
      feature4Desc: "By not having to spend tens of thousands of dollars upfront, your budget stays free to inject into advertising and sales.",
      chartLabel: "12-Month Projection:",
      chartStatus: "Sustainable Scalability",
      chartTitle: "Cost of Opportunity",
      chartValue: "+",
      chartSubtitle: "CAPEX Savings",
      gridTitle: "Financial",
      gridHighlight: "Intelligence",
      ctaTitle: "Don't buy software.",
      ctaHighlight2: "Rent an engine for growth.",
      ctaDesc: "Discover how much capital you can free up this year by migrating your company to our Digital Renting model.",
      ctaButton: "Schedule Strategy",
      modalBadge: "📈 OPEX Optimization",
      modalSubtitle: "Digital Financial Audit",
      modalTitle: "Application",
      modalHighlight: "Renting",
      modalDesc: "We'll evaluate your current infrastructure and present you with a 12-month savings forecast.",
      fieldName: "Name of CEO / CFO",
      fieldEmail: "Corporate Email",
      fieldOptional: "WhatsApp + Current software/maintenance spending",
      placeholderOptional: "My WhatsApp is... and we spend about $X per month on technology...",
      namePlaceholder: "E.g. Christian S.",
      emailPlaceholder: "ceo@yourcompany.com",
      btnSubmit: "Request Renting Projection",
      btnSubmitting: "Projecting...",
      successMsg: "Strategic request received! We'll evaluate your business model.",
      errorMsg: "Error sending. Please try again."
    }
  }
};

type Language = "es" | "en";
type Dictionary = typeof dictionaries.es;

interface LanguageContextType {
  language: Language;
  t: Dictionary;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<Language>("es");

  // Opcional: Persistir el idioma en localStorage
  useEffect(() => {
    const saved = localStorage.getItem("amc_language") as Language;
    if (saved) setLanguage(saved);
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("amc_language", lang);
  };

  return (
    <LanguageContext.Provider value={{ language, t: dictionaries[language], setLanguage: handleSetLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};