"use client";
import { useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ExternalLink, ArrowRight, Wifi } from "lucide-react";
import Image from "next/image";
import { Reveal } from "./Reveal";

const projects = [
  { title: "CRM Vida Digital",    category: "Software de Gestion",       image: "/portafolio/crm-vida-digital.png",    description: "Infraestructura SaaS optimizada para escalabilidad de leads.",       link: "https://crm-vida-digitalcol.vercel.app",    iframeUrl: "/api/site-preview?url=https%3A%2F%2Fcrm-vida-digitalcol.vercel.app",    allowIframe: true  },
  { title: "Elegancia Atemporal", category: "Luxury E-commerce",          image: "/portafolio/elegancia-atemporal.png", description: "Experiencia premium de alta relojeria y catalogo exclusivo.",       link: "https://www.cycrelojeria.com",               iframeUrl: "/api/site-preview?url=https%3A%2F%2Fwww.cycrelojeria.com",               allowIframe: true  },
  { title: "Lyon Vision CRM",     category: "HealthTech",                 image: "/portafolio/lyon-vision.png",         description: "Sistema clinico especializado para el sector optico.",            link: "https://crmopticalyonvision.vercel.app",     iframeUrl: "/api/site-preview?url=https%3A%2F%2Fcrmopticalyonvision.vercel.app",     allowIframe: true  },
  { title: "Taller de Italia",    category: "Landing Elite",              image: "/portafolio/taller-italia.png",       description: "Sastreria profesional: presencia digital con enfoque artesanal.", link: "https://www.italiatelier.com",               iframeUrl: "/api/site-preview?url=https%3A%2F%2Fwww.italiatelier.com",               allowIframe: true  },
  { title: "E-Misión",            category: "SaaS · Facturación DIAN",   image: "/portafolio/emision.png",             description: "Facturación electrónica DIAN para PYMEs colombianas.",           link: "https://ventas.emision.co",                 iframeUrl: "/api/site-preview?url=https%3A%2F%2Fventas.emision.co",                  allowIframe: true  },
  { title: "Somos Turbo Brand",   category: "Marketing Agency",           image: "/portafolio/turbo-brand.png",         description: "Diseno disruptivo y optimizacion de rendimiento digital.",        link: "https://www.turbobrandcol.com",              iframeUrl: "/api/site-preview?url=https%3A%2F%2Fwww.turbobrandcol.com",              allowIframe: true  },
];


const ProjectCard = ({ project }: { project: (typeof projects)[0] }) => {
  const [iframeBlocked, setIframeBlocked] = useState(!project.allowIframe);
  const [loaded, setLoaded] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["6deg", "-6deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-6deg", "6deg"]);
  const springConfig = { damping: 20, stiffness: 150 };
  const springX = useSpring(rotateX, springConfig);
  const springY = useSpring(rotateY, springConfig);

  return (
    <motion.div
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
        mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
      }}
      onMouseLeave={() => { mouseX.set(0); mouseY.set(0); }}
      style={{ rotateX: springX, rotateY: springY, transformStyle: "preserve-3d" }}
      className="group relative h-[320px] sm:h-[380px] md:h-[450px] w-full rounded-[28px] md:rounded-[40px] bg-[#0a0a0a] border border-white/10 overflow-hidden cursor-pointer shadow-2xl"
      onClick={() => window.open(project.link, "_blank")}
    >
      {/* === PREVIEW EN VIVO === */}
      <div className="absolute inset-0 z-0 bg-white overflow-hidden">
        {!iframeBlocked ? (
          <>
            {/* Skeleton mientras carga */}
            {!loaded && (
              <div className="absolute inset-0 bg-[#111] flex items-center justify-center z-10">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                  <span className="text-gray-600 text-[10px] tracking-widest uppercase">Cargando preview...</span>
                </div>
              </div>
            )}
            <iframe
              src={project.iframeUrl ?? project.link}
              title={project.title}
              loading="lazy"
              onLoad={() => setLoaded(true)}
              onError={() => setIframeBlocked(true)}
              className="absolute top-0 left-0 border-0"
              style={{
                width: "300%",
                height: "300%",
                transform: "scale(0.333)",
                transformOrigin: "top left",
                pointerEvents: "none",
                opacity: loaded ? 1 : 0,
                transition: "opacity 0.5s ease",
              }}
            />
          </>
        ) : (
          /* Fallback imagen cuando iframe está bloqueado */
          <Image
            src={project.image}
            alt={project.title}
            fill
            loading="lazy"
            className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
          />
        )}
        {/* Gradiente inferior siempre presente */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent z-10 pointer-events-none" />
      </div>

      {/* === BADGE LIVE / PREVIEW === */}
      <div className="absolute top-4 right-4 z-30 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10">
        <Wifi size={10} className={`${!iframeBlocked ? 'text-green-400 animate-pulse' : 'text-gray-500'}`} />
        <span className={`text-[9px] font-black tracking-widest uppercase ${!iframeBlocked ? 'text-green-400' : 'text-gray-500'}`}>
          {!iframeBlocked ? 'Live' : 'Preview'}
        </span>
      </div>

      {/* === INFO INFERIOR === */}
      <div className="absolute bottom-0 left-0 right-0 z-20 p-5 md:p-7" style={{ transform: "translateZ(30px)" }}>
        <span className="px-3 py-1 rounded-full border border-white/10 bg-black/60 backdrop-blur-md text-[9px] font-bold tracking-widest uppercase text-blue-400 mb-3 inline-block">
          {project.category}
        </span>
        <h3 className="text-xl md:text-2xl font-bold tracking-tighter text-white">{project.title}</h3>
        <p className="text-gray-400 text-sm font-light mt-1 max-w-[240px]">{project.description}</p>
      </div>

      {/* === OVERLAY HOVER === */}
      <div className="absolute inset-0 z-30 bg-black/0 group-hover:bg-black/70 transition-all duration-300 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 p-6">
        <span className="text-[10px] font-black tracking-[0.25em] uppercase text-blue-400 mb-2">{project.category}</span>
        <h3 className="text-2xl md:text-3xl font-black tracking-tighter text-white text-center mb-5">{project.title}</h3>
        <button className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-black text-xs tracking-widest uppercase transition-colors shadow-xl shadow-blue-500/30">
          Ver proyecto <ArrowRight size={14} />
        </button>
      </div>
    </motion.div>
  );
};


export const Showcase = () => (
  <section id="proyectos" className="py-20 md:py-32 px-4 md:px-6">
    <div className="max-w-7xl mx-auto">
      <Reveal>
        <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-4 italic">
          CASOS DE <span className="text-blue-500">EXITO</span>
        </h2>
        <p className="text-gray-500 text-sm md:text-base font-light mb-12 md:mb-20 italic">
          Previsualiza cada proyecto en tiempo real
        </p>
      </Reveal>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
        {projects.map((p, i) => (
          <Reveal key={i} width="100%">
            <ProjectCard project={p} />
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);
