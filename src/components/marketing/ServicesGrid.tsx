"use client";
import { motion } from "framer-motion";
import { Globe, Cpu, Zap, ShieldCheck, TrendingUp, Search, Share2, Mail, ArrowRight } from "lucide-react";
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
  badge?: string;
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
          {/* Badge opcional */}
          {service.badge && (
            <span className={`absolute top-0 right-0 text-[9px] font-black tracking-widest uppercase px-3 py-1 rounded-bl-2xl rounded-tr-[28px] bg-gradient-to-r ${service.color} text-white`}>
              {service.badge}
            </span>
          )}

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
            <p className="text-gray-400 text-base md:text-lg font-light leading-relaxed group-hover:text-gray-300 transition-colors duration-300 mb-5">
              {service.description}
            </p>
            <Link
              href={service.href}
              className={`inline-flex items-center gap-2 text-xs font-black tracking-widest uppercase px-4 py-2.5 rounded-full bg-gradient-to-r ${service.color} text-white opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-lg ${service.shadow}`}
            >
              Ver más <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Separador de categoría ───────────────────────────────────────────
function CategoryLabel({ label, gradient }: { label: string; gradient: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="flex items-center gap-4 mb-8 md:mb-10"
    >
      <div className={`h-px flex-1 bg-gradient-to-r ${gradient} opacity-30`} />
      <span className={`text-xs font-black tracking-[0.3em] uppercase text-transparent bg-clip-text bg-gradient-to-r ${gradient}`}>
        {label}
      </span>
      <div className={`h-px flex-1 bg-gradient-to-l ${gradient} opacity-30`} />
    </motion.div>
  );
}

// ── Grid principal ──────────────────────────────────────────────────
export const ServicesGrid = () => {
  const { t } = useLanguage();

  const techServices: ServiceItem[] = [
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
      href: "/servicios/seguridad",
    },
  ];

  const marketingServices: ServiceItem[] = [
    {
      title: "Meta & Google Ads",
      description: "Campañas de publicidad pagada en Facebook, Instagram y Google que generan leads calificados y ventas desde el primer día.",
      icon: <TrendingUp className="w-6 h-6 text-white" />,
      color: "from-pink-500 to-rose-500",
      shadow: "shadow-pink-500/40",
      className: "md:col-span-2",
      href: "/servicios/meta-google-ads",
      badge: "Más popular",
    },
    {
      title: "SEO & Posicionamiento",
      description: "Estrategia para aparecer primero en Google y atraer tráfico orgánico que convierte mes a mes sin pagar por cada clic.",
      icon: <Search className="w-6 h-6 text-white" />,
      color: "from-lime-400 to-green-500",
      shadow: "shadow-lime-500/40",
      className: "md:col-span-1",
      href: "/servicios/seo-posicionamiento",
    },
    {
      title: "Redes Sociales",
      description: "Gestión profesional de Instagram, Facebook y TikTok con contenido estratégico, diseño y crecimiento de comunidad.",
      icon: <Share2 className="w-6 h-6 text-white" />,
      color: "from-purple-500 to-fuchsia-500",
      shadow: "shadow-purple-500/40",
      className: "md:col-span-1",
      href: "/servicios/redes-sociales",
    },
    {
      title: "Email Marketing",
      description: "Automatizaciones y campañas de email que nutren leads, fidelizan clientes y recuperan ventas en piloto automático.",
      icon: <Mail className="w-6 h-6 text-white" />,
      color: "from-sky-400 to-blue-600",
      shadow: "shadow-sky-500/40",
      className: "md:col-span-2",
      href: "/servicios/email-marketing",
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

        {/* ── Tecnología ────────────────────────────────────────────── */}
        <CategoryLabel label="Tecnología Web" gradient="from-blue-500 to-cyan-400" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 mb-16 md:mb-20">
          {techServices.map((service, index) => (
            <ServiceCard key={index} service={service} index={index} />
          ))}
        </div>

        {/* ── Marketing Digital ─────────────────────────────────────── */}
        <CategoryLabel label="Marketing Digital" gradient="from-pink-500 to-rose-400" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
          {marketingServices.map((service, index) => (
            <ServiceCard key={index} service={service} index={index + techServices.length} />
          ))}
        </div>
      </div>
    </section>
  );
};