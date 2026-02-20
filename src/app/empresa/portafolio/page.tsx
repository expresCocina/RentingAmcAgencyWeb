"use client";
import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import { Reveal } from "@/components/marketing/Reveal";
import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";
import { ExternalLink, Globe, Code2, Server } from "lucide-react";
import Image from "next/image";

const projects = [
  {
    title: "CRM Vida Digital",
    category: "Software de Gestión",
    desc: "Plataforma SaaS de CRM con mensajería multicanal, gestión de leads y automatización con IA. Arquitectura Serverless en Supabase + Next.js 15.",
    img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop",
    tags: ["Next.js 15", "Supabase", "WhatsApp API"],
    link: "https://crm-vida-digitalcol.vercel.app",
    color: "from-blue-500 to-indigo-600",
    featured: true,
  },
  {
    title: "Elegancia Atemporal",
    category: "Luxury E-commerce",
    desc: "Tienda online de relojes de lujo con catálogo interactivo, integración de pagos y experiencia premium alineada con la identidad de la marca.",
    img: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=1200&auto=format&fit=crop",
    tags: ["E-commerce", "Tailwind CSS", "Stripe"],
    link: "https://www.cycrelojeria.com",
    color: "from-amber-500 to-orange-600",
    featured: false,
  },
  {
    title: "Lyon Visión CRM",
    category: "HealthTech",
    desc: "Sistema clínico integral para ópticas: gestión de pacientes, historial de prescripciones y agendamiento de citas con notificaciones automáticas.",
    img: "https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=1200&auto=format&fit=crop",
    tags: ["HealthTech", "CRM", "Automatización"],
    link: "https://crmopticalyonvision.vercel.app",
    color: "from-emerald-500 to-teal-600",
    featured: false,
  },
  {
    title: "Taller de Italia",
    category: "Landing Elite",
    desc: "Sitio web de lujo para sastrería artesanal italiana. Galería visual inmersiva, formulario de citas a medida y experiencia de marca de alto nivel.",
    img: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?q=80&w=1200&auto=format&fit=crop",
    tags: ["Diseño Premium", "Next.js", "Animaciones"],
    link: "https://www.italiatelier.com",
    color: "from-violet-500 to-purple-600",
    featured: false,
  },
  {
    title: "Turbo Brand",
    category: "Marketing Agency",
    desc: "Web de agencia de marketing con animaciones de alto impacto, portafolio visual y embudo de conversión optimizado para captación de clientes.",
    img: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop",
    tags: ["Marketing", "Performance", "SEO"],
    link: "https://www.turbobrandcol.com",
    color: "from-pink-500 to-rose-600",
    featured: false,
  },
];

const techIcons = [
  { icon: <Globe className="w-4 h-4" />, label: "Next.js 15" },
  { icon: <Server className="w-4 h-4" />, label: "Supabase" },
  { icon: <Code2 className="w-4 h-4" />, label: "TypeScript" },
];

export default function PortfolioPage() {
  const { t } = useLanguage();
  const featuredProject = projects[0] ?? null;
  const otherProjects = projects.slice(1);

  return (
    <main className="min-h-screen bg-[#050505]">
      <Navbar />

      {/* ——— HERO ——— */}
      <section className="relative pt-28 pb-12 md:pt-36 md:pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <Reveal>
            <div className="text-center max-w-4xl mx-auto">
              <span className="inline-block px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-[10px] font-bold tracking-[0.3em] uppercase mb-6">
                {t.company.portfolio.subtitle}
              </span>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tighter mb-5 leading-[1.05]">
                {t.company.portfolio.title}
              </h1>
              <p className="text-gray-400 text-base md:text-lg font-light leading-relaxed max-w-2xl mx-auto">
                {t.company.portfolio.desc}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ——— PROYECTO DESTACADO ——— */}
      {featuredProject && (
        <section className="max-w-7xl mx-auto px-4 md:px-6 mb-6 md:mb-10">
          <Reveal width="100%">
            <a href={featuredProject.link} target="_blank" rel="noopener noreferrer" className="block">
              <motion.div
                whileHover={{ y: -4 }}
                className="group relative rounded-[28px] md:rounded-[40px] overflow-hidden border border-white/10 hover:border-blue-500/30 transition-all cursor-pointer shadow-2xl"
              >
                <div className="relative h-[240px] sm:h-[320px] md:h-[440px] w-full">
                  <Image
                    src={featuredProject.img}
                    alt={featuredProject.title}
                    fill
                    className="object-cover opacity-50 group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />
                </div>
                <div className="absolute inset-0 p-6 md:p-12 flex flex-col justify-end">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 rounded-full bg-blue-500 text-white text-[9px] font-black uppercase tracking-widest">
                      Proyecto Destacado
                    </span>
                    <span className="px-3 py-1 rounded-full border border-white/10 bg-black/40 text-gray-300 text-[9px] font-bold uppercase tracking-widest">
                      {featuredProject.category}
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-white tracking-tighter mb-2 md:mb-4">
                    {featuredProject.title}
                  </h2>
                  <p className="text-gray-400 font-light text-sm md:text-base max-w-2xl mb-4 hidden sm:block">
                    {featuredProject.desc}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {featuredProject.tags.map((tag, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300 text-[10px] font-bold">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="absolute top-4 right-4 md:top-6 md:right-6 p-2 md:p-3 rounded-full bg-blue-600 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <ExternalLink size={14} />
                </div>
              </motion.div>
            </a>
          </Reveal>
        </section>
      )}

      {/* ——— GRID DE PROYECTOS ——— */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 pb-20 md:pb-28">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {otherProjects.map((proj, i) => (
            <Reveal key={i} width="100%">
              <a href={proj.link} target="_blank" rel="noopener noreferrer" className="block h-[260px] sm:h-[300px] md:h-[340px]">
                <motion.div
                  whileHover={{ y: -6, scale: 1.01 }}
                  className="group relative rounded-[24px] md:rounded-[32px] overflow-hidden border border-white/10 hover:border-white/20 transition-all cursor-pointer shadow-xl h-full"
                >
                  <Image
                    src={proj.img}
                    alt={proj.title}
                    fill
                    className="object-cover opacity-50 group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/30 to-transparent" />
                  <div className="absolute inset-0 p-5 md:p-6 flex flex-col justify-end">
                    <span className={`inline-block w-fit px-2.5 py-0.5 rounded-full bg-gradient-to-r ${proj.color} text-white text-[8px] font-black uppercase tracking-widest mb-2`}>
                      {proj.category}
                    </span>
                    <h3 className="text-lg md:text-xl font-black text-white tracking-tight mb-1.5">
                      {proj.title}
                    </h3>
                    <p className="text-gray-400 font-light text-xs leading-snug hidden sm:block line-clamp-2">
                      {proj.desc}
                    </p>
                  </div>
                  <div className="absolute top-3 right-3 p-2 rounded-full bg-white/10 backdrop-blur-sm text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <ExternalLink size={12} />
                  </div>
                </motion.div>
              </a>
            </Reveal>
          ))}
        </div>

        {/* TECNOLOGÍAS USADAS */}
        <Reveal width="100%">
          <div className="mt-12 md:mt-16 p-6 md:p-10 rounded-[24px] md:rounded-[40px] bg-white/[0.02] border border-white/5 text-center">
            <p className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.3em] mb-4">Stack Tecnológico</p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {["Next.js 15", "TypeScript", "Supabase", "AWS", "Tailwind CSS", "Vercel", "Framer Motion"].map((tech, i) => (
                <span
                  key={i}
                  className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-gray-300 text-xs font-bold hover:border-blue-500/30 hover:text-blue-400 transition-all"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      <Footer />
    </main>
  );
}