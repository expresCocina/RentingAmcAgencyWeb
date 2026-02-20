"use client";
import { useState } from "react";
import Image from "next/image";
import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import { Reveal } from "@/components/marketing/Reveal";
import { useLanguage } from "@/context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { Server, Shield, Globe, Cpu, ArrowRight, X, Loader2, TrendingUp, Check, Activity } from "lucide-react";
import { captureLead } from "@/services/leads";

const getFeatures = (t: any) => [
  {
    title: t.cloudInfra.feature1Title,
    description: t.cloudInfra.feature1Desc,
    icon: <Cpu className="text-amber-500 w-8 h-8" />
  },
  {
    title: t.cloudInfra.feature2Title,
    description: t.cloudInfra.feature2Desc,
    icon: <Globe className="text-blue-500 w-8 h-8" />
  },
  {
    title: t.cloudInfra.feature3Title,
    description: t.cloudInfra.feature3Desc,
    icon: <Shield className="text-emerald-500 w-8 h-8" />
  },
  {
    title: t.cloudInfra.feature4Title,
    description: t.cloudInfra.feature4Desc,
    icon: <Server className="text-cyan-500 w-8 h-8" />
  }
];

// --- COMPONENTE VISUAL: RACK DE SERVIDORES ANIMADO ---
const ServerRackVisual = (props: { t?: any }) => {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center perspective-1000 pt-10">
      {/* Resplandor de fondo (Ámbar/Naranja para simular Cloud/AWS) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[400px] bg-amber-600/20 blur-[100px] rounded-full pointer-events-none" />

      {/* Etiqueta Flotante de Estado */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="relative z-20 mb-8 flex items-center gap-3 px-5 py-2.5 bg-black/80 border border-white/10 rounded-full backdrop-blur-md shadow-2xl"
      >
        <div className="w-2 h-2 rounded-full bg-green-500 animate-ping absolute" />
        <div className="w-2 h-2 rounded-full bg-green-500 relative z-10" />
        <span className="text-gray-300 text-[10px] font-bold tracking-widest uppercase ml-2">
          {props.t?.cloudInfra?.clusterStatus} <span className="text-green-400">{props.t?.cloudInfra?.clusterHealthy || "Óptimo (99.99% Uptime)"}</span>
        </span>
      </motion.div>

      {/* Contenedor del Rack */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10 w-full max-w-sm flex flex-col gap-4"
      >
        {/* Generamos 3 "Blades" (Cuchillas) de servidor */}
        {[1, 2, 3].map((server, i) => (
          <div key={i} className="relative bg-[#0a0a0a] border border-white/10 rounded-xl p-4 shadow-2xl shadow-black overflow-hidden group">
            {/* Brillo interno del servidor */}
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-transparent pointer-events-none z-0" />

            <div className="relative z-10 flex items-center justify-between">
              {/* Parte izquierda: Rejilla de ventilación y nombre */}
              <div className="flex items-center gap-4">
                <div className="flex flex-col gap-1 opacity-50">
                  {[...Array(4)].map((_, j) => (
                    <div key={j} className="w-8 h-1 bg-gray-600 rounded-full" />
                  ))}
                </div>
                <div className="text-left">
                  <p className="text-[9px] text-gray-500 font-bold tracking-widest uppercase mb-1">Nodo Cloud 0{i + 1}</p>
                  <p className="text-xs text-amber-400 font-black tracking-wider uppercase">Enrutando...</p>
                </div>
              </div>

              {/* Parte derecha: Luces LED parpadeantes simulando tráfico */}
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: Math.random() * 2 + 0.5, repeat: Infinity }}
                  className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]"
                />
                <motion.div
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: Math.random() * 2 + 0.5, repeat: Infinity, delay: 0.2 }}
                  className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]"
                />
                <motion.div
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: Math.random() * 2 + 0.5, repeat: Infinity, delay: 0.4 }}
                  className="w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.8)]"
                />
              </div>
            </div>

            {/* Efecto de "Escaneo" o procesamiento de datos cruzando el servidor */}
            <motion.div
              animate={{ left: ["-100%", "200%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: i * 0.5 }}
              className="absolute top-0 bottom-0 w-20 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 z-20"
            />
          </div>
        ))}

        {/* Base del Rack */}
        <div className="h-2 mt-2 bg-gradient-to-r from-gray-800 via-gray-600 to-gray-800 rounded-full mx-4 shadow-[0_10px_30px_rgba(0,0,0,0.8)]" />
      </motion.div>
    </div>
  );
};

export default function CloudInfrastructurePage() {
  const { t } = useLanguage();
  const features = getFeatures(t);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleCheckout(formData: FormData) {
    setIsPending(true);
    setFeedback(null);
    const result = await captureLead(formData);

    if (result.success) {
      setFeedback({ type: "success", text: t.cloudInfra.successMsg });
      setTimeout(() => {
        setIsModalOpen(false);
        setFeedback(null);
      }, 3000);
    } else {
      setFeedback({ type: "error", text: t.cloudInfra.errorMsg });
    }
    setIsPending(false);
  }

  return (
    <main className="min-h-screen bg-[#050505]">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <section className="relative min-h-[100svh] flex items-center pt-20 pb-12 overflow-hidden">

        {/* FONDO MÓVIL (Servidores reales, se oculta en desktop) */}
        <div className="absolute inset-0 z-0 lg:hidden pointer-events-none">
          <Image
            src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2000&auto=format&fit=crop"
            alt="Data Center Mobile"
            fill
            className="object-cover object-center opacity-60"
            priority
          />
          {/* Overlay oscuro elegante (quitamos el mix-blend-multiply que lo apagaba) */}
          <div className="absolute inset-0 bg-[#050505]/70" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/60 to-[#050505]" />
        </div>

        <div className="container mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center h-full z-10 relative">

          {/* COLUMNA IZQUIERDA: Copy de Poder */}
          <div className="text-left space-y-6 md:space-y-8 pt-6 lg:pt-0">
            <Reveal>
              <>
                <span className="px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-bold tracking-[0.2em] uppercase inline-block mb-4 backdrop-blur-md">
                  {t.cloudInfra.badge}
                </span>
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[1.1] text-white drop-shadow-lg">
                  {t.cloudInfra.title} <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 italic">
                    {t.cloudInfra.titleHighlight}
                  </span>
                </h1>
              </>
            </Reveal>

            <Reveal>
              <p className="text-gray-300 text-base md:text-lg lg:text-xl max-w-xl font-light leading-relaxed drop-shadow-md">
                {t.cloudInfra.description}
              </p>
            </Reveal>

            {/* BOTÓN VIP CON ESTILO ÁMBAR */}
            <Reveal>
              <div className="pt-6 pb-4">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 w-full md:w-auto font-black text-white transition-all duration-300 bg-[#0a0a0a] border border-amber-500/50 rounded-full overflow-hidden shadow-[0_0_30px_rgba(245,158,11,0.2)] hover:shadow-[0_0_50px_rgba(245,158,11,0.4)] hover:scale-[1.02]"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <span className="relative z-10 tracking-widest uppercase text-xs md:text-sm drop-shadow-md">
                    Evaluar Mi Infraestructura
                  </span>
                  <ArrowRight className="relative z-10 group-hover:translate-x-1 transition-transform duration-300" size={18} />
                </button>
              </div>
            </Reveal>
          </div>

          {/* COLUMNA DERECHA: Servidores Animados */}
          <div className="w-full h-[350px] md:h-[450px] lg:h-[500px] relative mt-12 lg:mt-0">
            <ServerRackVisual t={t} />
          </div>
        </div>
      </section>

      {/* --- GRID DE CARACTERÍSTICAS --- */}
      <section className="py-16 md:py-24 relative z-10 border-t border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-6xl font-black tracking-tighter text-white mb-4">
              {t.cloudInfra.gridTitle} <span className="text-amber-500 italic">{t.cloudInfra.gridHighlight}</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            {features.map((feature, i) => (
              <Reveal key={i} width="100%">
                <div className="p-6 md:p-10 rounded-[24px] md:rounded-[30px] bg-black border border-white/5 hover:border-amber-500/30 transition-all group h-full shadow-2xl">
                  <div className="mb-4 md:mb-6 p-3 md:p-4 rounded-2xl bg-white/5 border border-white/10 inline-block group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4 tracking-tight">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed font-light text-sm md:text-base">{feature.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA FINAL --- */}
      <section className="py-32 relative border-t border-white/5 bg-gradient-to-b from-[#050505] to-amber-950/10">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter text-white mb-4 md:mb-6">
            {t.cloudInfra.ctaTitle} <br />
            <span className="text-amber-500 italic">{t.cloudInfra.ctaHighlight2}</span>
          </h2>
          <p className="text-gray-400 mb-8 md:mb-10 text-base md:text-lg">
            {t.cloudInfra.ctaDesc}
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-10 py-5 bg-white hover:bg-amber-500 text-black hover:text-white font-black rounded-full transition-all shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-amber-500/40 uppercase tracking-widest text-sm"
          >
            {t.cloudInfra.ctaButton}
          </button>
        </div>
      </section>

      <Footer />

      {/* === MODAL FLOTANTE PSICOLÓGICO (Adaptado para Cloud) === */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-[#050505] border border-amber-500/30 rounded-[40px] shadow-[0_0_80px_rgba(245,158,11,0.15)] overflow-hidden"
            >
              <div className="p-8 md:p-10 relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-amber-600/20 border-b border-x border-amber-500/30 px-6 py-1 rounded-b-xl">
                  <span className="text-amber-400 text-[9px] font-black uppercase tracking-widest">
                    {t.cloudInfra.modalBadge}
                  </span>
                </div>

                <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors z-10">
                  <X size={24} />
                </button>

                <div className="mb-8 mt-4">
                  <p className="text-gray-500 text-xs font-bold tracking-widest uppercase mb-2">{t.cloudInfra.modalSubtitle}</p>
                  <h3 className="text-3xl font-black tracking-tighter text-white">
                    {t.cloudInfra.modalTitle} <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">{t.cloudInfra.modalHighlight}</span>
                  </h3>
                  <p className="text-gray-400 font-light mt-3 text-sm leading-relaxed">
                    {t.cloudInfra.modalDesc}
                  </p>
                </div>

                <form action={handleCheckout} className="space-y-5">
                  <input type="hidden" name="service" value="[APP VIP] Servicio: Cloud Infrastructure" />

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-amber-500/70 ml-4 flex items-center gap-2">
                      {t.cloudInfra.fieldName}
                    </label>
                    <input name="name" required type="text" placeholder={t.cloudInfra.namePlaceholder} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:border-amber-500 focus:bg-amber-500/5 outline-none text-white transition-all" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-amber-500/70 ml-4">
                      {t.cloudInfra.fieldEmail}
                    </label>
                    <input name="email" required type="email" placeholder={t.cloudInfra.emailPlaceholder} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:border-amber-500 focus:bg-amber-500/5 outline-none text-white transition-all" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-amber-500/70 ml-4">
                      {t.cloudInfra.fieldOptional}
                    </label>
                    <textarea name="message" required rows={2} placeholder={t.cloudInfra.placeholderOptional} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:border-amber-500 focus:bg-amber-500/5 outline-none text-white transition-all resize-none" />
                  </div>

                  <motion.button
                    disabled={isPending}
                    whileHover={{ scale: isPending ? 1 : 1.02 }} whileTap={{ scale: isPending ? 1 : 0.98 }}
                    className="w-full mt-6 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 disabled:opacity-50 transition-all shadow-[0_0_30px_rgba(245,158,11,0.3)] uppercase tracking-widest text-xs"
                  >
                    {isPending ? <><Loader2 className="animate-spin" size={20} /> {t.cloudInfra.btnSubmitting}</> : <><TrendingUp size={18} /> {t.cloudInfra.btnSubmit}</>}
                  </motion.button>

                  <p className="text-center text-[10px] text-gray-500 uppercase tracking-widest mt-4 flex items-center justify-center gap-2">
                    <Check size={12} className="text-emerald-500" /> Comunicación Segura
                  </p>

                  {feedback && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`mt-4 p-4 rounded-xl text-center text-sm font-bold border ${feedback.type === "success" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}`}>
                      {feedback.text}
                    </motion.div>
                  )}
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}