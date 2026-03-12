"use client";
import { useEffect } from "react";
import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import { motion } from "framer-motion";
import { Mail, Zap, RefreshCw, BarChart3, Users, Check, ArrowRight } from "lucide-react";
import { trackViewContent } from "@/lib/fbPixel";
import Link from "next/link";

const features = [
  {
    icon: <Zap className="w-7 h-7 text-sky-400" />,
    title: "Automatizaciones Inteligentes",
    desc: "Flujos de bienvenida, nurturing, carritos abandonados y recuperación de clientes inactivos que funcionan 24/7 sin que hagas nada.",
  },
  {
    icon: <Users className="w-7 h-7 text-blue-400" />,
    title: "Segmentación de Listas",
    desc: "Dividimos tu base de contactos por comportamiento, intereses y etapa de compra para enviar el mensaje correcto a la persona correcta.",
  },
  {
    icon: <RefreshCw className="w-7 h-7 text-sky-400" />,
    title: "Campañas de Email Masivo",
    desc: "Newsletters, lanzamientos, promociones y anuncios de nuevos servicios diseñados para llegar a bandeja principal, no a spam.",
  },
  {
    icon: <BarChart3 className="w-7 h-7 text-blue-400" />,
    title: "Analytics & A/B Testing",
    desc: "Open rates, clicks, conversiones, ingresos generados por email. Probamos asuntos, horarios y contenidos para optimizar cada envío.",
  },
];

const metrics = [
  { value: "4200%", label: "ROI promedio del email marketing vs otros canales" },
  { value: "$1 → $42", label: "Retorno por cada dólar invertido en email" },
  { value: "6x", label: "Más conversiones que redes sociales orgánicas" },
  { value: "72h", label: "Para tener tu primera automatización activa" },
];

export default function EmailMarketingPage() {
  useEffect(() => { trackViewContent("Email Marketing", "Marketing Digital"); }, []);

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <Navbar />

      {/* ── HERO ───────────────────────────────────────────────────── */}
      <section className="relative min-h-[80vh] flex items-center pt-24 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-900/20 via-blue-900/5 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-sky-500/5 blur-3xl" />

        <div className="relative max-w-5xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-black tracking-[0.25em] uppercase mb-6">
              <Mail className="w-3.5 h-3.5" /> Marketing Digital · Email
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-6 leading-none">
              Email{" "}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-600">Marketing</span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              Automatizaciones y campañas de email que <strong className="text-white">nutren leads, fidelizan clientes y recuperan ventas</strong> en piloto automático mientras te enfocas en tu negocio.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/#contacto"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 text-white font-black text-sm tracking-widest uppercase shadow-2xl shadow-sky-500/30 hover:shadow-sky-500/50 hover:scale-105 transition-all"
              >
                Activar Email Marketing <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="https://wa.me/573138537261?text=Hola!%20Me%20interesa%20el%20servicio%20de%20email%20marketing%20y%20automatizaciones"
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

      {/* ── METRICS ────────────────────────────────────────────────── */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {metrics.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center p-6 rounded-3xl bg-[#080808] border border-white/8"
            >
              <p className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-600 mb-2">{m.value}</p>
              <p className="text-gray-500 text-xs leading-tight">{m.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ───────────────────────────────────────────────── */}
      <section className="py-20 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-center mb-14">
            Lo que hacemos por <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-600">tu negocio</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-3xl bg-[#080808] border border-white/8 hover:border-sky-500/30 transition-colors"
              >
                <div className="w-14 h-14 rounded-2xl bg-sky-500/10 flex items-center justify-center mb-5">{f.icon}</div>
                <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                <p className="text-gray-400 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LO QUE INCLUYE ─────────────────────────────────────────── */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center p-12 rounded-[40px] bg-gradient-to-br from-sky-900/30 to-blue-900/10 border border-sky-500/20">
          <Mail className="w-12 h-12 text-sky-400 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-black tracking-tighter mb-6">
            Tu bandeja de entrada,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-600">tu mejor vendedor</span>
          </h2>
          <ul className="text-left space-y-3 mb-8 max-w-sm mx-auto">
            {[
              "Secuencia de bienvenida automatizada",
              "Campaña de nurturing para nuevos leads",
              "Email de recuperación de clientes inactivos",
              "Newsletter mensual profesional",
              "Templates de diseño premium responsivos",
              "Reportes de open rate y conversiones",
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-gray-300 text-sm">
                <Check className="w-4 h-4 text-sky-400 flex-shrink-0" /> {item}
              </li>
            ))}
          </ul>
          <Link
            href="/#contacto"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 text-white font-black text-sm tracking-widest uppercase shadow-xl shadow-sky-500/30 hover:scale-105 transition-all"
          >
            Quiero activar esto <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
