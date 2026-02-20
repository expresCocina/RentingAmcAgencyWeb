"use client";
import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import { Reveal } from "@/components/marketing/Reveal";
import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight, Tag } from "lucide-react";

const posts = [
  {
    id: 1,
    title: "Next.js 15: El Futuro de la Velocidad Web",
    excerpt:
      "Exploramos las nuevas características de Next.js 15: Turbopack estable, mejoras en Server Actions y cómo lograr 100/100 en Lighthouse desde el día uno.",
    date: "20 Feb 2026",
    readTime: "5 min",
    category: "Tecnología",
    gradient: "from-blue-500/20 to-indigo-500/20",
    badge: "bg-blue-500",
  },
  {
    id: 2,
    title: "Arquitectura Serverless at Scale: Lecciones Reales",
    excerpt:
      "Cómo diseñamos infraestructuras que escalan de 100 a 100,000 visitas sin caerse. Casos reales con AWS Lambda, Supabase Edge Functions y Vercel.",
    date: "15 Feb 2026",
    readTime: "8 min",
    category: "Cloud",
    gradient: "from-amber-500/20 to-orange-500/20",
    badge: "bg-amber-500",
  },
  {
    id: 3,
    title: "Renting Tecnológico: El Modelo que Está Cambiando las Empresas",
    excerpt:
      "Por qué las empresas más inteligentes están migrando del CAPEX al OPEX en tecnología. El modelo de Renting Digital que proponemos y sus ventajas reales.",
    date: "10 Feb 2026",
    readTime: "6 min",
    category: "Estrategia",
    gradient: "from-emerald-500/20 to-teal-500/20",
    badge: "bg-emerald-500",
  },
  {
    id: 4,
    title: "SEO Técnico en 2026: Más Allá de las Keywords",
    excerpt:
      "Los factores que realmente posicionan en Google hoy: Core Web Vitals, estructuras de datos, internacionalización y optimización de JavaScript.",
    date: "5 Feb 2026",
    readTime: "7 min",
    category: "Marketing",
    gradient: "from-violet-500/20 to-purple-500/20",
    badge: "bg-violet-500",
  },
  {
    id: 5,
    title: "WhatsApp Business API: Automatización sin Perder lo Humano",
    excerpt:
      "Cómo integrar WhatsApp Business API con tu CRM para automatizar respuestas, calificar leads y mantener conversaciones auténticas con tus clientes.",
    date: "28 Ene 2026",
    readTime: "6 min",
    category: "Automatización",
    gradient: "from-green-500/20 to-emerald-500/20",
    badge: "bg-green-500",
  },
  {
    id: 6,
    title: "Seguridad en Aplicaciones SaaS: Checklist Completo",
    excerpt:
      "Las 20 medidas de seguridad que implementamos en cada proyecto: autenticación multifactor, encriptación end-to-end, auditorías de acceso y más.",
    date: "20 Ene 2026",
    readTime: "10 min",
    category: "Seguridad",
    gradient: "from-red-500/20 to-rose-500/20",
    badge: "bg-red-500",
  },
];

const categories = ["Todos", "Tecnología", "Cloud", "Estrategia", "Marketing", "Automatización", "Seguridad"];

export default function BlogPage() {
  const { t } = useLanguage();
  const featuredPost = posts[0] ?? null;
  const restPosts = posts.slice(1);

  return (
    <main className="min-h-screen bg-[#050505]">
      <Navbar />

      {/* ——— HERO ——— */}
      <section className="relative pt-28 pb-12 md:pt-36 md:pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/8 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <Reveal>
            <div className="text-center max-w-4xl mx-auto">
              <span className="inline-block px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-[10px] font-bold tracking-[0.3em] uppercase mb-6">
                {t.company.blog.subtitle}
              </span>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tighter mb-5 leading-[1.05]">
                {t.company.blog.title}
              </h1>
              <p className="text-gray-400 text-base md:text-lg font-light leading-relaxed max-w-2xl mx-auto">
                {t.company.blog.desc}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ——— FILTROS DE CATEGORÍA ——— */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 mb-8 md:mb-12">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat, i) => (
            <button
              key={i}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all flex-shrink-0 ${i === 0
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                : "bg-white/5 border border-white/10 text-gray-400 hover:border-blue-500/30 hover:text-blue-400"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* ——— ARTÍCULO DESTACADO ——— */}
      {featuredPost && (
        <section className="max-w-7xl mx-auto px-4 md:px-6 mb-6">
          <Reveal width="100%">
            <motion.div
              whileHover={{ y: -4 }}
              className="group relative p-6 sm:p-8 md:p-12 rounded-[28px] md:rounded-[40px] bg-gradient-to-br from-blue-500/10 to-indigo-500/5 border border-blue-500/20 hover:border-blue-500/40 transition-all cursor-pointer"
            >
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className="px-3 py-1 rounded-full bg-blue-500 text-white text-[9px] font-black uppercase tracking-widest">
                      Artículo Destacado
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                      <Calendar size={11} /> {featuredPost.date}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                      <Clock size={11} /> {featuredPost.readTime}
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tighter mb-3 md:mb-4 group-hover:text-blue-300 transition-colors">
                    {featuredPost.title}
                  </h2>
                  <p className="text-gray-400 font-light leading-relaxed text-sm md:text-base mb-6">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center gap-2 text-blue-400 text-xs font-bold group-hover:gap-3 transition-all">
                    Leer artículo completo <ArrowRight size={14} />
                  </div>
                </div>
                <div className={`w-full md:w-44 h-28 md:h-44 rounded-2xl bg-gradient-to-br ${featuredPost.gradient} border border-white/10 flex-shrink-0 hidden sm:flex items-center justify-center text-5xl font-black text-white/10`}>
                  01
                </div>
              </div>
            </motion.div>
          </Reveal>
        </section>
      )}

      {/* ——— GRID DE ARTÍCULOS ——— */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 pb-20 md:pb-28">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {restPosts.map((post, i) => (
            <Reveal key={post.id} width="100%">
              <motion.div
                whileHover={{ y: -6 }}
                className="group relative p-6 md:p-7 rounded-[24px] md:rounded-[30px] bg-white/[0.02] border border-white/5 hover:border-blue-500/20 hover:bg-white/[0.04] transition-all cursor-pointer h-full flex flex-col"
              >
                {/* Número decorativo */}
                <div className={`absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 rounded-xl bg-gradient-to-br ${post.gradient} border border-white/10 flex items-center justify-center text-[10px] font-black text-white/30`}>
                  {String(post.id).padStart(2, "0")}
                </div>

                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className={`px-2.5 py-0.5 rounded-full ${post.badge} text-white text-[8px] font-black uppercase tracking-widest`}>
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1 text-[9px] text-gray-600 font-bold uppercase tracking-widest">
                    <Calendar size={9} /> {post.date}
                  </span>
                </div>

                <h3 className="text-base md:text-lg font-bold text-white tracking-tight mb-2.5 group-hover:text-blue-300 transition-colors leading-snug pr-8">
                  {post.title}
                </h3>
                <p className="text-gray-400 font-light text-xs md:text-sm leading-relaxed flex-grow mb-5">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between mt-auto">
                  <span className="flex items-center gap-1 text-[10px] text-gray-600 font-bold">
                    <Clock size={10} /> {post.readTime} lectura
                  </span>
                  <div className="flex items-center gap-1 text-blue-500 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    Leer <ArrowRight size={11} />
                  </div>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>

        {/* SUSCRIPCIÓN NEWSLETTER */}
        <Reveal width="100%">
          <div className="mt-12 md:mt-16 p-6 sm:p-8 md:p-12 rounded-[24px] md:rounded-[40px] bg-gradient-to-br from-blue-500/10 to-purple-500/5 border border-blue-500/20 text-center">
            <p className="text-[10px] text-blue-500 font-black uppercase tracking-[0.3em] mb-3">NEWSLETTER</p>
            <h3 className="text-2xl md:text-3xl font-black text-white tracking-tighter mb-3">
              Recibe los mejores artículos
            </h3>
            <p className="text-gray-400 text-sm font-light mb-6 max-w-md mx-auto">
              Estrategia digital, tecnología y arquitectura de software. Directo a tu inbox cada semana.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="tu@empresa.com"
                className="flex-1 bg-black/50 border border-white/10 rounded-full px-5 py-3 text-sm text-white outline-none focus:border-blue-500 transition-all"
              />
              <button className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-full transition-all text-xs tracking-widest uppercase whitespace-nowrap shadow-lg shadow-blue-500/20 flex-shrink-0">
                Suscribirme
              </button>
            </div>
          </div>
        </Reveal>
      </section>

      <Footer />
    </main>
  );
}