"use client";
import { useEffect } from "react";
import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import { ServiceLeadForm } from "@/components/marketing/ServiceLeadForm";
import { motion } from "framer-motion";
import { Share2, Image, Calendar, Users, TrendingUp, Check, ArrowRight } from "lucide-react";
import { trackViewContent } from "@/lib/fbPixel";
import Link from "next/link";

const features = [
  {
    icon: <Image className="w-7 h-7 text-purple-400" />,
    title: "Contenido & Diseño Profesional",
    desc: "Publicaciones, stories, reels y carruseles con diseño de marca que generan engagement real y comunican autoridad en tu sector.",
  },
  {
    icon: <Calendar className="w-7 h-7 text-fuchsia-400" />,
    title: "Calendario Editorial Estratégico",
    desc: "Planeación mensual del contenido alineado a tus objetivos de negocio, temporadas y tendencias de cada plataforma.",
  },
  {
    icon: <Users className="w-7 h-7 text-purple-400" />,
    title: "Crecimiento de Comunidad",
    desc: "Estrategias orgánicas para aumentar seguidores reales, interacción y alcance sin depender solo de publicidad pagada.",
  },
  {
    icon: <TrendingUp className="w-7 h-7 text-fuchsia-400" />,
    title: "Reportes de Rendimiento",
    desc: "Métricas claras cada mes: alcance, engagement, crecimiento de seguidores, tráfico generado y conversiones atribuibles.",
  },
];

const platforms = [
  { name: "Instagram", emoji: "📸", desc: "Feed, Stories, Reels y Lives con estrategia de marca" },
  { name: "Facebook", emoji: "👥", desc: "Publicaciones, grupos y campañas de alcance local" },
  { name: "TikTok", emoji: "🎵", desc: "Contenido viral de video corto para audiencias jóvenes" },
  { name: "LinkedIn", emoji: "💼", desc: "Posicionamiento B2B y marca empleadora profesional" },
];

export default function RedesSocialesPage() {
  useEffect(() => { trackViewContent("Gestión de Redes Sociales", "Marketing Digital"); }, []);

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <Navbar />

      {/* ── HERO ───────────────────────────────────────────────────── */}
      <section className="relative min-h-[80vh] flex items-center pt-24 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-fuchsia-900/5 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-purple-500/5 blur-3xl" />

        <div className="relative max-w-5xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-black tracking-[0.25em] uppercase mb-6">
              <Share2 className="w-3.5 h-3.5" /> Marketing Digital · Social Media
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-6 leading-none">
              Redes{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-fuchsia-500">Sociales</span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              Gestión profesional de <strong className="text-white">Instagram, Facebook, TikTok y LinkedIn</strong> con contenido estratégico, diseño de marca y crecimiento real de comunidad.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/#contacto"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white font-black text-sm tracking-widest uppercase shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 transition-all"
              >
                Solicitar Propuesta <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="https://wa.me/573138537261?text=Hola!%20Me%20interesa%20el%20servicio%20de%20gesti%C3%B3n%20de%20redes%20sociales"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-bold text-sm tracking-wider uppercase hover:bg-white/10 transition-all"
              >
                💬 WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── PLATAFORMAS ────────────────────────────────────────────── */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-gray-500 text-xs font-black tracking-[0.3em] uppercase mb-8">Plataformas que manejamos</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {platforms.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-6 rounded-3xl bg-[#080808] border border-white/8 hover:border-purple-500/30 transition-colors"
              >
                <span className="text-3xl mb-3 block">{p.emoji}</span>
                <p className="font-bold text-white mb-1">{p.name}</p>
                <p className="text-gray-500 text-xs leading-tight">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ───────────────────────────────────────────────── */}
      <section className="py-20 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-center mb-14">
            Qué incluye la <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-fuchsia-500">gestión</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-3xl bg-[#080808] border border-white/8 hover:border-purple-500/30 transition-colors"
              >
                <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-5">{f.icon}</div>
                <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                <p className="text-gray-400 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────── */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center p-12 rounded-[40px] bg-gradient-to-br from-purple-900/30 to-fuchsia-900/10 border border-purple-500/20">
          <Share2 className="w-12 h-12 text-purple-400 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-black tracking-tighter mb-4">
            Haz crecer tu presencia en <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-fuchsia-500">redes</span>
          </h2>
          <p className="text-gray-400 mb-8">Cuéntanos sobre tu negocio y te diseñamos una estrategia de contenido que conecta con tu audiencia ideal.</p>
          <Link
            href="/#contacto"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white font-black text-sm tracking-widest uppercase shadow-xl shadow-purple-500/30 hover:scale-105 transition-all"
          >
            Comenzar ahora <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <ServiceLeadForm serviceName="Redes Sociales" gradient="from-purple-500 to-fuchsia-500" focusColor="focus:border-purple-500 focus:bg-purple-500/5" labelColor="text-purple-400" />
      <Footer />
    </main>
  );
}

