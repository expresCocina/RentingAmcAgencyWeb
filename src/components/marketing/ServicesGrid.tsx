"use client";
import { motion } from "framer-motion";
import { Globe, Cpu, Zap, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";
import { useTilt } from "@/hooks/useTilt";

// ── Card individual con tilt 3D ─────────────────────────────────────
interface ServiceItem {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  shadow: string;
  className: string;
  href: string;
}

function ServiceCard({ service, index }: { service: ServiceItem; index: number }) {
  const { ref, onMouseMove, onMouseLeave } = useTilt(10);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      className={service.className}
    >
      <div
        ref={ref}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        className="group relative p-7 md:p-10 rounded-[30px] md:rounded-[40px] bg-[#080808] border border-white/10 overflow-hidden h-full"
        style={{ transition: "transform 0.15s ease, box-shadow 0.3s ease" }}
      >
        {/* Brillo dinámico que sigue al cursor */}
        <div
          data-shine
          className="absolute inset-0 rounded-[30px] md:rounded-[40px] pointer-events-none z-20"
          style={{ opacity: 0, transition: "opacity 0.3s ease" }}
        />

        {/* Glow de fondo en hover */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-[0.08] transition-opacity duration-700 blur-2xl`}
        />

        {/* Borde degradado en hover */}
        <div
          className={`absolute inset-0 rounded-[30px] md:rounded-[40px] border-2 border-transparent bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 [-webkit-mask:linear-gradient(#fff_0_0)_padding-box,linear-gradient(#fff_0_0)]`}
          style={{ maskComposite: "exclude" }}
        />

        <div className="relative z-10 flex flex-col h-full">
          {/* Ícono */}
          <div
            className={`mb-6 md:mb-8 inline-flex p-3 md:p-4 rounded-2xl md:rounded-3xl bg-gradient-to-br ${service.color} ${service.shadow} shadow-2xl ring-1 ring-white/20 group-hover:ring-white/50 group-hover:scale-110 transition-all duration-500`}
          >
            {service.icon}
          </div>

          <div className="mt-auto">
            <h3 className="text-xl md:text-3xl font-bold mb-3 md:mb-4 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-200 transition-all duration-300 leading-tight">
              {service.title}
            </h3>
            <p className="text-gray-400 text-base md:text-lg font-light leading-relaxed group-hover:text-gray-300 transition-colors duration-300 mb-4">
              {service.description}
            </p>
            {service.href !== "/#contacto" && (
              <Link
                href={service.href}
                className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-gray-500 hover:text-blue-400 transition-colors"
              >
                Ver más →
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Grid principal ──────────────────────────────────────────────────
export const ServicesGrid = () => {
  const { t } = useLanguage();

  const services: ServiceItem[] = [
    {
      title: t.services.web.title,
      description: t.services.web.desc,
      icon: <Globe className="w-6 h-6 text-white" />,
      color: "from-blue-500 to-cyan-400",
      shadow: "shadow-blue-500/40",
      className: "md:col-span-2",
      href: "/servicios/desarrollo-web",
    },
    {
      title: t.services.cloud.title,
      description: t.services.cloud.desc,
      icon: <Cpu className="w-6 h-6 text-white" />,
      color: "from-violet-500 to-purple-400",
      shadow: "shadow-violet-500/40",
      className: "md:col-span-1",
      href: "/servicios/cloud-infrastructure",
    },
    {
      title: t.services.renting.title,
      description: t.services.renting.desc,
      icon: <Zap className="w-6 h-6 text-white" />,
      color: "from-amber-400 to-orange-500",
      shadow: "shadow-amber-500/40",
      className: "md:col-span-1",
      href: "/servicios/renting-tecnologico",
    },
    {
      title: t.services.security.title,
      description: t.services.security.desc,
      icon: <ShieldCheck className="w-6 h-6 text-white" />,
      color: "from-emerald-400 to-green-500",
      shadow: "shadow-emerald-500/40",
      className: "md:col-span-2",
      href: "/#contacto",
    },
  ];

  return (
    <section className="py-20 md:py-32 px-4 md:px-6 relative">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-12 md:mb-20 tracking-tighter text-center">
          {t.services.title1}{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400">
            {t.services.title2}
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
          {services.map((service, index) => (
            <ServiceCard key={index} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};