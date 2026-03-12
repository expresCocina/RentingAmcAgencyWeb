"use client";
import { useEffect } from "react";
import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import { ServiceLeadForm } from "@/components/marketing/ServiceLeadForm";
import { motion } from "framer-motion";
import { TrendingUp, Target, DollarSign, BarChart3, Zap, Check, ArrowRight } from "lucide-react";
import { trackViewContent } from "@/lib/fbPixel";
import Link from "next/link";

const features = [
  {
    icon: <Target className="w-7 h-7 text-pink-400" />,
    title: "Segmentación Ultra Precisa",
    desc: "Llegamos exactamente a tu cliente ideal usando datos de comportamiento, intereses, lookalike audiences y retargeting inteligente.",
  },
  {
    icon: <DollarSign className="w-7 h-7 text-rose-400" />,
    title: "ROI Medible desde el Día 1",
    desc: "Cada peso invertido es rastreado. Optimizamos constantemente para que tu costo por lead y costo por venta bajen cada semana.",
  },
  {
    icon: <BarChart3 className="w-7 h-7 text-pink-400" />,
    title: "Campañas en Ambas Plataformas",
    desc: "Manejamos simultáneamente Meta Ads (Facebook/Instagram) y Google Ads (Search, Display, YouTube) con una estrategia unificada.",
  },
  {
    icon: <Zap className="w-7 h-7 text-rose-400" />,
    title: "Resultados en 30 Días",
    desc: "Configuración completa de píxeles, eventos de conversión, audiencias y creatividades en semana 1. Resultados reportados semanalmente.",
  },
];

const plans = [
  {
    name: "Starter",
    price: "$350.000",
    period: "/mes",
    desc: "Para negocios que inician en publicidad digital",
    features: ["1 plataforma (Meta o Google)", "Hasta $500k presupuesto en pauta", "2 campañas activas", "Reporte mensual", "Soporte por WhatsApp"],
    color: "from-pink-500/20 to-rose-500/10",
    border: "border-pink-500/20",
  },
  {
    name: "Growth",
    price: "$650.000",
    period: "/mes",
    desc: "Para negocios que quieren escalar con ambas plataformas",
    features: ["Meta Ads + Google Ads", "Hasta $2M presupuesto en pauta", "Campañas ilimitadas", "Pixel y CAPI configurados", "Reporte semanal", "Reunión de estrategia mensual"],
    color: "from-pink-500/30 to-rose-600/20",
    border: "border-pink-500/40",
    popular: true,
  },
  {
    name: "Scale",
    price: "Personalizado",
    period: "",
    desc: "Para marcas con altos volúmenes de inversión",
    features: ["Presupuesto ilimitado", "Estrategia multicanal", "A/B testing avanzado", "Equipo dedicado", "Reporting en tiempo real", "Consultoría estratégica"],
    color: "from-rose-800/20 to-pink-900/10",
    border: "border-rose-500/20",
  },
];

export default function MetaGoogleAdsPage() {
  useEffect(() => { trackViewContent("Meta & Google Ads", "Marketing Digital"); }, []);

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <Navbar />

      {/* ── HERO ───────────────────────────────────────────────────── */}
      <section className="relative min-h-[80vh] flex items-center pt-24 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-900/20 via-rose-900/5 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-pink-500/5 blur-3xl" />

        <div className="relative max-w-5xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs font-black tracking-[0.25em] uppercase mb-6">
              <TrendingUp className="w-3.5 h-3.5" /> Marketing Digital · Publicidad Pagada
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-6 leading-none">
              Meta{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-400">&</span>
              {" "}Google{" "}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-400">Ads</span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              Campañas de publicidad pagada en <strong className="text-white">Facebook, Instagram y Google</strong> que generan leads calificados y ventas desde el primer día de pauta.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/#contacto"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black text-sm tracking-widest uppercase shadow-2xl shadow-pink-500/30 hover:shadow-pink-500/50 hover:scale-105 transition-all"
              >
                Solicitar Propuesta <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="https://wa.me/573138537261?text=Hola!%20Me%20interesa%20el%20servicio%20de%20Meta%20y%20Google%20Ads"
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

      {/* ── FEATURES ───────────────────────────────────────────────── */}
      <section className="py-20 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-center mb-14">
            Por qué funciona nuestro <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-400">método</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-3xl bg-[#080808] border border-white/8 hover:border-pink-500/30 transition-colors"
              >
                <div className="w-14 h-14 rounded-2xl bg-pink-500/10 flex items-center justify-center mb-5">{f.icon}</div>
                <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                <p className="text-gray-400 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PLANES ─────────────────────────────────────────────────── */}
      <section className="py-20 px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-center mb-14">
            Planes de <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-400">Publicidad Digital</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative p-8 rounded-3xl bg-gradient-to-br ${plan.color} border ${plan.border} ${plan.popular ? "ring-2 ring-pink-500/50" : ""}`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-black tracking-widest uppercase px-4 py-1 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white">
                    Más popular
                  </span>
                )}
                <p className="text-xs font-black tracking-widest uppercase text-pink-400 mb-2">{plan.name}</p>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-black text-white">{plan.price}</span>
                  <span className="text-gray-500 text-sm">{plan.period}</span>
                </div>
                <p className="text-gray-400 text-sm mb-6">{plan.desc}</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feat, j) => (
                    <li key={j} className="flex items-center gap-2.5 text-sm text-gray-300">
                      <Check className="w-4 h-4 text-pink-400 flex-shrink-0" /> {feat}
                    </li>
                  ))}
                </ul>
                <a
                  href="#solicitar"
                  className="block text-center py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black text-xs tracking-widest uppercase hover:opacity-90 transition-opacity"
                >
                  Empezar ahora
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <ServiceLeadForm
        serviceName="Meta & Google Ads"
        gradient="from-pink-500 to-rose-500"
        focusColor="focus:border-pink-500 focus:bg-pink-500/5"
        labelColor="text-pink-400"
      />

      <Footer />
    </main>
  );
}
