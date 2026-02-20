"use client";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ExternalLink } from "lucide-react";
import Image from "next/image";
import { Reveal } from "./Reveal";

const projects = [
  {
    title: "CRM Vida Digital",
    category: "Software de Gestión",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop",
    description: "Infraestructura SaaS optimizada para escalabilidad de leads.",
    link: "https://crm-vida-digitalcol.vercel.app",
  },
  {
    title: "Elegancia Atemporal",
    category: "Luxury E-commerce",
    image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=2680&auto=format&fit=crop",
    description: "Experiencia premium de alta relojería y catálogo exclusivo.",
    link: "https://www.cycrelojeria.com",
  },
  {
    title: "Lyon Visión CRM",
    category: "HealthTech",
    image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=2680&auto=format&fit=crop",
    description: "Sistema clínico especializado para el sector óptico.",
    link: "https://crmopticalyonvision.vercel.app",
  },
  {
    title: "Taller de Italia",
    category: "Landing Elite",
    image: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?q=80&w=2670&auto=format&fit=crop",
    description: "Sastrería profesional: presencia digital con enfoque artesanal.",
    link: "https://www.italiatelier.com",
  },
  {
    title: "Somos Turbo Brand",
    category: "Marketing Agency",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2670&auto=format&fit=crop",
    description: "Diseño disruptivo y optimización de rendimiento digital.",
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
      <div className="absolute inset-0 z-0">
        <Image src={project.image} alt={project.title} fill className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
      </div>

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
    </motion.div>
  );
};

export const Showcase = () => (
  <section id="proyectos" className="py-20 md:py-32 px-4 md:px-6">
    <div className="max-w-7xl mx-auto">
      <Reveal>
        <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-12 md:mb-20 italic">
          CASOS DE <span className="text-blue-500">ÉXITO</span>
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