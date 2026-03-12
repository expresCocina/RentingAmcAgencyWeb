"use client";
import { useEffect } from "react";
import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import { motion } from "framer-motion";
import { Search, Globe, BarChart3, TrendingUp, Check, ArrowRight, FileText } from "lucide-react";
import { trackViewContent } from "@/lib/fbPixel";
import Link from "next/link";

const features = [
  {
    icon: <Search className="w-7 h-7 text-lime-400" />,
    title: "Auditoría SEO Completa",
    desc: "Analizamos tu sitio actual: velocidad, arquitectura, palabras clave, backlinks y competencia. Identificamos exactamente qué frena tu posicionamiento.",
  },
  {
    icon: <FileText className="w-7 h-7 text-green-400" />,
    title: "Contenido que Posiciona",
    desc: "Creamos artículos, páginas de servicio y landing pages optimizadas para las keywords que busca tu cliente ideal en Google.",
  },
  {
    icon: <Globe className="w-7 h-7 text-lime-400" />,
    title: "SEO Técnico Avanzado",
    desc: "Core Web Vitals, schema markup, sitemap, canonicals, velocidad de carga — todo lo técnico que Google exige para ranquear en el top 3.",
  },
  {
    icon: <BarChart3 className="w-7 h-7 text-green-400" />,
    title: "Resultados a Largo Plazo",
    desc: "A diferencia de los Ads, el SEO genera tráfico orgánico compuesto. Cada mes que pasa, tu visibilidad crece sin pagar por cada visita.",
  },
];

const results = [
  { metric: "+300%", label: "Tráfico orgánico promedio en 6 meses" },
  { metric: "Top 3", label: "Posición en Google para keywords objetivo" },
  { metric: "0 CPC", label: "Costo por visita orgánica una vez posicionado" },
  { metric: "24/7", label: "Tu sitio trabajando sin parar por ti" },
];

export default function SeoPage() {
  useEffect(() => { trackViewContent("SEO & Posicionamiento", "Marketing Digital"); }, []);

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <Navbar />

      {/* ── HERO ───────────────────────────────────────────────────── */}
      <section className="relative min-h-[80vh] flex items-center pt-24 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-lime-900/20 via-green-900/5 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-lime-500/5 blur-3xl" />

        <div className="relative max-w-5xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-lime-500/10 border border-lime-500/20 text-lime-400 text-xs font-black tracking-[0.25em] uppercase mb-6">
              <Search className="w-3.5 h-3.5" /> Marketing Digital · SEO
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-6 leading-none">
              SEO{" "}&{" "}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-green-500">
                Posicionamiento
              </span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              Estrategia para que <strong className="text-white">aparezcas primero en Google</strong> y atraigas clientes que ya están buscando lo que ofreces — sin pagar por cada clic.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/#contacto"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-lime-500 to-green-500 text-white font-black text-sm tracking-widest uppercase shadow-2xl shadow-lime-500/30 hover:shadow-lime-500/50 hover:scale-105 transition-all"
              >
                Solicitar Auditoría Gratis <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="https://wa.me/573138537261?text=Hola!%20Me%20interesa%20el%20servicio%20de%20SEO%20y%20posicionamiento%20para%20mi%20negocio"
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
          {results.map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center p-6 rounded-3xl bg-[#080808] border border-white/8"
            >
              <p className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-green-500 mb-2">{r.metric}</p>
              <p className="text-gray-500 text-xs leading-tight">{r.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ───────────────────────────────────────────────── */}
      <section className="py-20 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-center mb-14">
            Nuestro proceso <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-green-500">SEO</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-3xl bg-[#080808] border border-white/8 hover:border-lime-500/30 transition-colors"
              >
                <div className="w-14 h-14 rounded-2xl bg-lime-500/10 flex items-center justify-center mb-5">{f.icon}</div>
                <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                <p className="text-gray-400 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────── */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center p-12 rounded-[40px] bg-gradient-to-br from-lime-900/30 to-green-900/10 border border-lime-500/20">
          <TrendingUp className="w-12 h-12 text-lime-400 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-black tracking-tighter mb-4">
            Empieza a crecer en Google <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-green-500">hoy</span>
          </h2>
          <p className="text-gray-400 mb-8">Solicita una auditoría gratuita de tu sitio y te decimos exactamente qué posiciones puedes alcanzar.</p>
          <Link
            href="/#contacto"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-lime-500 to-green-500 text-white font-black text-sm tracking-widest uppercase shadow-xl shadow-lime-500/30 hover:scale-105 transition-all"
          >
            Quiero mi auditoría gratis <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
