"use client";
import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import { Reveal } from "@/components/marketing/Reveal";
import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";
import {
  Globe, Shield, Rocket, Zap, Users, Award, TrendingUp, CheckCircle2,
} from "lucide-react";

const values = [
  {
    icon: <Rocket className="w-5 h-5 text-blue-400" />,
    title: "Innovación Constante",
    desc: "Adoptamos cada nueva tecnología con responsabilidad, asegurandonos de que impacte positivamente en el negocio de nuestros clientes.",
    color: "from-blue-500/10 to-indigo-500/10",
    border: "hover:border-blue-500/30",
  },
  {
    icon: <Shield className="w-5 h-5 text-emerald-400" />,
    title: "Seguridad de Élite",
    desc: "Cada arquitectura que diseñamos incluye múltiples capas de seguridad, desde el código hasta la infraestructura de servidores.",
    color: "from-emerald-500/10 to-teal-500/10",
    border: "hover:border-emerald-500/30",
  },
  {
    icon: <Globe className="w-5 h-5 text-cyan-400" />,
    title: "Escala Global",
    desc: "Nuestras plataformas están diseñadas para operar sin fricción en cualquier parte del mundo, con infraestructura distribuida globalmente.",
    color: "from-cyan-500/10 to-blue-500/10",
    border: "hover:border-cyan-500/30",
  },
  {
    icon: <Zap className="w-5 h-5 text-amber-400" />,
    title: "Velocidad Extrema",
    desc: "100/100 en Google Lighthouse no es un objetivo, es nuestro punto de partida. El rendimiento es una funcionalidad, no un extra.",
    color: "from-amber-500/10 to-orange-500/10",
    border: "hover:border-amber-500/30",
  },
];

const team = [
  {
    name: "Christian S.",
    role: "CEO & Lead Architect",
    avatar: "CS",
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    name: "Ana M.",
    role: "Head of Cloud Infrastructure",
    avatar: "AM",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    name: "Diego R.",
    role: "Senior Full-Stack Engineer",
    avatar: "DR",
    gradient: "from-violet-500 to-purple-600",
  },
  {
    name: "Laura V.",
    role: "UX & Brand Design Lead",
    avatar: "LV",
    gradient: "from-amber-500 to-orange-600",
  },
];

const stats = [
  { value: "150+", label: "Proyectos Entregados" },
  { value: "5", label: "Años de Trayectoria" },
  { value: "99.9%", label: "Uptime Garantizado" },
  { value: "3.5x", label: "ROI Promedio" },
];

export default function SobreNosotros() {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen bg-[#050505]">
      <Navbar />

      {/* ——— HERO ——— */}
      <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden">
        {/* Fondo decorativo */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <Reveal>
            <div className="text-center max-w-4xl mx-auto">
              <span className="inline-block px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-[10px] font-bold tracking-[0.3em] uppercase mb-6">
                {t.company.about.subtitle}
              </span>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tighter mb-6 leading-[1.05]">
                {t.company.about.title}
              </h1>
              <p className="text-gray-400 text-base md:text-xl font-light leading-relaxed max-w-3xl mx-auto">
                {t.company.about.desc}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ——— STATS ——— */}
      <section className="border-y border-white/5 bg-black/40 py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 text-center">
            {stats.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <p className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tighter">{s.value}</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-[0.3em] font-bold mt-1">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ——— MISIÓN / VISIÓN ——— */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            <Reveal width="100%">
              <div className="p-8 md:p-12 rounded-[28px] md:rounded-[40px] bg-gradient-to-br from-blue-500/10 to-indigo-500/5 border border-blue-500/20 h-full">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center mb-6">
                  <TrendingUp className="w-5 h-5 text-blue-400" />
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-white tracking-tighter mb-4">Nuestra Misión</h2>
                <p className="text-gray-400 leading-relaxed font-light text-sm md:text-base">
                  Democratizar la tecnología de élite para empresas latinoamericanas, construyendo infraestructura digital de clase mundial que antes solo estaba al alcance de las grandes multinacionales.
                </p>
              </div>
            </Reveal>
            <Reveal width="100%">
              <div className="p-8 md:p-12 rounded-[28px] md:rounded-[40px] bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/20 h-full">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mb-6">
                  <Globe className="w-5 h-5 text-emerald-400" />
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-white tracking-tighter mb-4">Nuestra Visión</h2>
                <p className="text-gray-400 leading-relaxed font-light text-sm md:text-base">
                  Ser el motor de transformación digital de las 1,000 empresas más innovadoras de Latinoamérica para 2030, posicionando a nuestros clientes como líderes tecnológicos en sus industrias.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ——— VALORES ——— */}
      <section className="py-12 md:py-20 bg-black/30">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <Reveal>
            <div className="text-center mb-10 md:mb-16">
              <p className="text-blue-500 text-[10px] font-black tracking-[0.3em] uppercase mb-3">ADN</p>
              <h2 className="text-3xl md:text-4xl lg:text-6xl font-black text-white tracking-tighter">
                Nuestros <span className="text-blue-500">Valores</span>
              </h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            {values.map((v, i) => (
              <Reveal key={i} width="100%">
                <motion.div
                  whileHover={{ y: -4 }}
                  className={`p-6 md:p-8 rounded-[24px] md:rounded-[32px] bg-gradient-to-br ${v.color} border border-white/5 ${v.border} transition-all group`}
                >
                  <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                    {v.icon}
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-white mb-2 tracking-tight">{v.title}</h3>
                  <p className="text-gray-400 font-light leading-relaxed text-sm md:text-base">{v.desc}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ——— EQUIPO ——— */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <Reveal>
            <div className="text-center mb-10 md:mb-16">
              <p className="text-blue-500 text-[10px] font-black tracking-[0.3em] uppercase mb-3">QUIÉNES SOMOS</p>
              <h2 className="text-3xl md:text-4xl lg:text-6xl font-black text-white tracking-tighter">
                El <span className="text-blue-500">Equipo</span>
              </h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {team.map((member, i) => (
              <Reveal key={i} width="100%">
                <motion.div
                  whileHover={{ y: -6 }}
                  className="text-center group"
                >
                  <div className={`w-full aspect-square rounded-[24px] md:rounded-[32px] bg-gradient-to-br ${member.gradient} flex items-center justify-center mb-4 text-3xl md:text-4xl font-black text-white shadow-2xl group-hover:scale-105 transition-transform duration-500`}>
                    {member.avatar}
                  </div>
                  <h3 className="text-sm md:text-base font-bold text-white">{member.name}</h3>
                  <p className="text-[10px] md:text-xs text-gray-500 tracking-wide mt-0.5 leading-tight">{member.role}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ——— CTA ——— */}
      <section className="py-16 md:py-24 bg-black/30 border-t border-white/5">
        <div className="max-w-3xl mx-auto px-4 md:px-6 text-center">
          <Reveal>
            <>
              <Award className="w-10 h-10 text-blue-500 mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tighter mb-4">
                ¿Listo para construir algo <span className="text-blue-500">extraordinario</span>?
              </h2>
              <p className="text-gray-400 font-light mb-8 text-sm md:text-base">
                Únete a las empresas que ya confían en AMC Agency para escalar su infraestructura digital.
              </p>
              <a
                href="/#contacto"
                className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-full transition-all shadow-lg shadow-blue-500/30 text-sm uppercase tracking-widest"
              >
                <CheckCircle2 className="w-4 h-4" />
                Hablar con el Equipo
              </a>
            </>
          </Reveal>
        </div>
      </section>

      <Footer />
    </main>
  );
}