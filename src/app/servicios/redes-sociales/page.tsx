"use client";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import { ServiceModal } from "@/components/marketing/ServiceModal";
import { motion } from "framer-motion";
import { Share2, Calendar, Users, TrendingUp } from "lucide-react";
import { trackViewContent } from "@/lib/fbPixel";

const features = [
  { icon: <Calendar className="w-7 h-7 text-purple-400" />, title: "Calendario Editorial Estrategico", desc: "Planeacion mensual del contenido alineado a tus objetivos de negocio, temporadas y tendencias de cada plataforma." },
  { icon: <Users className="w-7 h-7 text-fuchsia-400" />, title: "Crecimiento de Comunidad", desc: "Estrategias organicas para aumentar seguidores reales, interaccion y alcance sin depender solo de publicidad pagada." },
  { icon: <Share2 className="w-7 h-7 text-purple-400" />, title: "Diseno de Contenido Profesional", desc: "Publicaciones, stories, reels y carruseles con diseno de marca que generan engagement real y comunican autoridad en tu sector." },
  { icon: <TrendingUp className="w-7 h-7 text-fuchsia-400" />, title: "Reportes de Rendimiento", desc: "Metricas claras cada mes: alcance, engagement, crecimiento de seguidores, trafico generado y conversiones atribuibles." },
];

const platforms = [
  { name: "Instagram", emoji: "📸", desc: "Feed, Stories, Reels y Lives con estrategia de marca" },
  { name: "Facebook", emoji: "👥", desc: "Publicaciones, grupos y campanias de alcance local" },
  { name: "TikTok", emoji: "🎵", desc: "Contenido viral de video corto para audiencias jovenes" },
  { name: "LinkedIn", emoji: "💼", desc: "Posicionamiento B2B y marca empleadora profesional" },
];

const plans = [
  { name: "Starter Social", price: "$320.000", period: "/mes", desc: "Para negocios que buscan presencia basica", features: ["1 red social", "12 publicaciones/mes", "Diseno de contenido", "Reporte mensual"] },
  { name: "Growth Social", price: "$580.000", period: "/mes", desc: "Para marcas que quieren crecer en multiples redes", features: ["3 redes sociales", "24 publicaciones/mes", "Stories y Reels", "Calendario editorial", "Reporte quincenal"], popular: true },
  { name: "Full Presence", price: "Personalizado", period: "", desc: "Para marcas con alta demanda de contenido", features: ["Todas las redes", "Contenido diario", "Community manager", "Estrategia de influencers", "Dashboard analitico"] },
];

export default function RedesSocialesPage() {
  useEffect(() => { trackViewContent("Gestion de Redes Sociales", "Marketing Digital"); }, []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("");
  const openModal = (planName: string) => { setSelectedPlan(planName); setIsModalOpen(true); };

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <Navbar />
      <section className="relative min-h-[80vh] flex items-center pt-24 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-fuchsia-900/5 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-purple-500/5 blur-3xl" />
        <div className="relative max-w-5xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-black tracking-[0.25em] uppercase mb-6">
              <Share2 className="w-3.5 h-3.5" /> Marketing Digital - Social Media
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-6 leading-none">
              Redes <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-fuchsia-500">Sociales</span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              Gestion profesional de <strong className="text-white">Instagram, Facebook, TikTok y LinkedIn</strong> con contenido estrategico y crecimiento real.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button onClick={() => openModal("Growth Social")} className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white font-black text-sm tracking-widest uppercase shadow-2xl shadow-purple-500/30 hover:scale-105 transition-all">
                Solicitar Propuesta
              </button>
              <a href="https://wa.me/573138537261?text=Hola!%20Me%20interesa%20gestion%20de%20redes%20sociales" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-bold text-sm uppercase hover:bg-white/10 transition-all">
                WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-gray-500 text-xs font-black tracking-[0.3em] uppercase mb-8">Plataformas que manejamos</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {platforms.map((p, i) => (<motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center p-6 rounded-3xl bg-[#080808] border border-white/8 hover:border-purple-500/30 transition-colors"><span className="text-3xl mb-3 block">{p.emoji}</span><p className="font-bold text-white mb-1">{p.name}</p><p className="text-gray-500 text-xs leading-tight">{p.desc}</p></motion.div>))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-center mb-14">Que incluye la <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-fuchsia-500">gestion</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((f, i) => (<motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="p-8 rounded-3xl bg-[#080808] border border-white/8 hover:border-purple-500/30 transition-colors"><div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-5">{f.icon}</div><h3 className="text-xl font-bold mb-3">{f.title}</h3><p className="text-gray-400 leading-relaxed">{f.desc}</p></motion.div>))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-center mb-14">Planes de <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-fuchsia-500">Redes Sociales</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan: any, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className={`relative p-8 rounded-3xl bg-[#080808] border border-white/10 ${plan.popular ? "ring-2 ring-purple-500/50" : ""}`}>
                {plan.popular && (<span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-black tracking-widest uppercase px-4 py-1 rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white">Mas popular</span>)}
                <p className="text-xs font-black tracking-widest uppercase text-purple-400 mb-2">{plan.name}</p>
                <div className="flex items-baseline gap-1 mb-2"><span className="text-4xl font-black text-white">{plan.price}</span><span className="text-gray-500 text-sm">{plan.period}</span></div>
                <p className="text-gray-400 text-sm mb-6">{plan.desc}</p>
                <ul className="space-y-3 mb-8">{plan.features.map((feat: string, j: number) => (<li key={j} className="flex items-center gap-2.5 text-sm text-gray-300"><Share2 className="w-4 h-4 text-purple-400 flex-shrink-0" /> {feat}</li>))}</ul>
                <button onClick={() => openModal(plan.name)} className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white font-black text-xs tracking-widest uppercase hover:opacity-90 transition-opacity">
                  Empezar ahora
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <ServiceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} serviceName="Redes Sociales" planName={selectedPlan} gradient="from-purple-500 to-fuchsia-500" accentClass="purple" />
    </main>
  );
}
