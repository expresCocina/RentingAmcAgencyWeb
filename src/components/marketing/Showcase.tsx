"use client";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ExternalLink, ArrowRight } from "lucide-react";
import Image from "next/image";
import { Reveal } from "./Reveal";

const projects = [
  {
    title: "CRM Vida Digital",
    category: "Software de Gestion",
    image: "/portafolio/crm-vida-digital.png",
    description: "Infraestructura SaaS optimizada para escalabilidad de leads.",
    link: "https://crm-vida-digitalcol.vercel.app",
  },
  {
    title: "Elegancia Atemporal",
    category: "Luxury E-commerce",
    image: "/portafolio/elegancia-atemporal.png",
    description: "Experiencia premium de alta relojeria y catalogo exclusivo.",
    link: "https://www.cycrelojeria.com",
  },
  {
    title: "Lyon Vision CRM",
    category: "HealthTech",
    image: "/portafolio/lyon-vision.png",
    description: "Sistema clinico especializado para el sector optico.",
    link: "https://crmopticalyonvision.vercel.app",
  },
  {
    title: "Taller de Italia",
    category: "Landing Elite",
    image: "/portafolio/taller-italia.png",
    description: "Sastreria profesional: presencia digital con enfoque artesanal.",
    link: "https://www.italiatelier.com",
  },
  {
    title: "Somos Turbo Brand",
    category: "Marketing Agency",
    image: "/portafolio/turbo-brand.png",
    description: "Diseno disruptivo y optimizacion de rendimiento digital.",
    link: "https://www.turbobrandcol.com",
  },
];

const ProjectCard = ({ project }: { project: (typeof projects)[0] }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-8deg", "8deg"]);
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
      {/* Imagen con lazy loading */}
      <div className="absolute inset-0 z-0">
        <Image
          src={project.image}
          alt={project.title}
          fill
          loading="lazy"
          className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
      </div>

      {/* Overlay oscuro en hover */}
      <div className="absolute inset-0 z-10 bg-black/0 group-hover:bg-black/60 transition-all duration-400" />

      {/* Contenido normal (badge arriba + titulo abajo) */}
      <div className="relative z-20 h-full p-6 md:p-8 flex flex-col justify-between" style={{ transform: "translateZ(50px)" }}>
        <div className="flex justify-between items-start">
          <span className="px-3 py-1 rounded-full border border-white/10 bg-black/40 backdrop-blur-md text-[9px] font-bold tracking-widest uppercase text-blue-400">
            {project.category}
          </span>
          <div className="p-2 rounded-full bg-blue-600 text-white opacity-0 group-hover:opacity-100 transition-opacity">
            <ExternalLink size={14} />
          </div>
        </div>

        <div className="space-y-1 md:space-y-2">
          <h3 className="text-xl md:text-3xl font-bold tracking-tighter text-white">{project.title}</h3>
          <p className="text-gray-400 text-sm font-light max-w-[220px] md:max-w-[250px]">{project.description}</p>
        </div>
      </div>

      {/* Overlay hover con info centrada */}
      <div className="absolute inset-0 z-30 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-400 p-6">
        <span className="text-[10px] font-black tracking-[0.25em] uppercase text-blue-400 mb-2">{project.category}</span>
        <h3 className="text-2xl md:text-3xl font-black tracking-tighter text-white text-center mb-4">{project.title}</h3>
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
        <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-12 md:mb-20 italic">
          CASOS DE <span className="text-blue-500">EXITO</span>
        </h2>
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
