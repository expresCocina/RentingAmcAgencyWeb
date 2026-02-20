"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import { Reveal } from "@/components/marketing/Reveal";
import { useLanguage } from "@/context/LanguageContext";
import { motion, AnimatePresence, useInView, useMotionValue, useSpring } from "framer-motion";
import { TrendingUp, DollarSign, RefreshCw, ShieldCheck, ArrowRight, X, Loader2, Check, BarChart3 } from "lucide-react";
import { captureLead } from "@/services/leads";

const getFeatures = (t: any) => [
  {
    title: t.renting.feature1Title,
    description: t.renting.feature1Desc,
    icon: <DollarSign className="text-emerald-500 w-8 h-8" />
  },
  {
    title: t.renting.feature2Title,
    description: t.renting.feature2Desc,
    icon: <RefreshCw className="text-blue-500 w-8 h-8" />
  },
  {
    title: t.renting.feature3Title,
    description: t.renting.feature3Desc,
    icon: <ShieldCheck className="text-indigo-500 w-8 h-8" />
  },
  {
    title: t.renting.feature4Title,
    description: t.renting.feature4Desc,
    icon: <TrendingUp className="text-amber-500 w-8 h-8" />
  }
];

// --- COMPONENTE DE CONTEO ANIMADO PARA ROI ---
const AnimatedCounter = ({ value, prefix = "", suffix = "" }: { value: number, prefix?: string, suffix?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { damping: 50, stiffness: 40 });
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView) motionValue.set(value);
  }, [isInView, value, motionValue]);

  useEffect(() => {
    springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = `${prefix}${Math.round(latest).toLocaleString()}${suffix}`;
      }
    });
  }, [springValue, prefix, suffix]);

  return <span ref={ref}>0</span>;
};

// --- COMPONENTE VISUAL: GRÁFICA DE CRECIMIENTO FINANCIERO ---
const FinancialGrowthVisual = (props: { t?: any }) => {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center perspective-1000 pt-10">
      {/* Resplandor Esmeralda (Dinero/Crecimiento) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[400px] bg-emerald-600/20 blur-[120px] rounded-full pointer-events-none" />

      {/* Etiqueta Flotante de Estado */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="relative z-20 mb-8 flex items-center gap-3 px-5 py-2.5 bg-black/80 border border-emerald-500/20 rounded-full backdrop-blur-md shadow-2xl"
      >
        <BarChart3 className="text-emerald-500 w-4 h-4" />
        <span className="text-gray-300 text-[10px] font-bold tracking-widest uppercase">
          {props.t?.renting?.chartLabel} <span className="text-emerald-400">{props.t?.renting?.chartStatus}</span>
        </span>
      </motion.div>

      {/* Contenedor del Dashboard Financiero */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10 w-full max-w-sm flex flex-col gap-4 bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 shadow-2xl shadow-emerald-500/10 overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.1),transparent_50%)] pointer-events-none" />

        <div className="flex justify-between items-end mb-4 border-b border-white/10 pb-4">
          <div>
            <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase mb-1">Costo de Oportunidad</p>
            <p className="text-2xl font-black text-white tracking-tighter">
              <AnimatedCounter value={350} prefix="+" suffix="%" />
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase mb-1">Ahorro en CAPEX</p>
            <p className="text-xl font-bold text-emerald-400 tracking-tighter">
              <AnimatedCounter value={45000} prefix="$" />
            </p>
          </div>
        </div>

        {/* Gráfica Animada de Barras */}
        <div className="h-32 flex items-end justify-between gap-2 mt-4">
          {[40, 55, 45, 70, 60, 85, 100].map((height, i) => (
            <div key={i} className="relative w-full flex flex-col justify-end h-full group">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ duration: 1.5, delay: i * 0.1 + 1, ease: "easeOut" }}
                className={`w-full rounded-t-sm ${i === 6 ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-white/10 group-hover:bg-white/20'} transition-colors relative overflow-hidden`}
              >
                {i === 6 && (
                  <motion.div
                    animate={{ top: ["100%", "-100%"] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 bg-gradient-to-t from-transparent via-white/50 to-transparent"
                  />
                )}
              </motion.div>
            </div>
          ))}
        </div>

        {/* Línea de Crecimiento simulada encima de las barras */}
        <motion.svg
          className="absolute bottom-[24px] left-6 right-6 h-32 pointer-events-none drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]"
          preserveAspectRatio="none"
          viewBox="0 0 100 100"
        >
          <motion.path
            d="M 0 60 Q 15 45 30 55 T 60 30 T 100 0"
            fill="transparent"
            stroke="#10b981"
            strokeWidth="3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 1.5, ease: "easeInOut" }}
          />
        </motion.svg>
      </motion.div>

      {/* Sombra base */}
      <div className="w-48 h-2 mt-8 bg-black blur-xl rounded-full opacity-50" />
    </div>
  );
};

export default function RentingTecnologicoPage() {
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
      setFeedback({ type: "success", text: t.renting.successMsg });
      setTimeout(() => {
        setIsModalOpen(false);
        setFeedback(null);
      }, 3000);
    } else {
      setFeedback({ type: "error", text: t.renting.errorMsg });
    }
    setIsPending(false);
  }

  return (
    <main className="min-h-screen bg-[#050505]">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <section className="relative min-h-[100svh] flex items-center pt-20 pb-12 overflow-hidden">

        {/* FONDO MÓVIL IMPRESIONANTE (Se oculta en desktop) */}
        <div className="absolute inset-0 z-0 lg:hidden pointer-events-none">
          <Image
            src="https://images.unsplash.com/photo-1642543492481-44e81e3914a7?q=80&w=2670&auto=format&fit=crop"
            alt="Financial Growth Mobile"
            fill
            className="object-cover object-center opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-[#050505]/80" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/60 to-[#050505]" />
        </div>

        <div className="container mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center h-full z-10 relative">

          {/* COLUMNA IZQUIERDA: Copy Financiero */}
          <div className="text-left space-y-6 md:space-y-8 pt-6 lg:pt-0">
            <Reveal>
              <>
                <span className="px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-bold tracking-[0.2em] uppercase inline-block mb-4 backdrop-blur-md">
                  {t.renting.badge}
                </span>
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[1.1] text-white drop-shadow-lg">
                  {t.renting.title} <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500 italic">
                    {t.renting.titleHighlight}
                  </span>
                </h1>
              </>
            </Reveal>

            <Reveal>
              <p className="text-gray-300 text-base md:text-lg lg:text-xl max-w-xl font-light leading-relaxed drop-shadow-md">
                {t.renting.description}
              </p>
            </Reveal>

            {/* BOTÓN VIP CON ESTILO ESMERALDA */}
            <Reveal>
              <div className="pt-6 pb-4">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 w-full md:w-auto font-black text-white transition-all duration-300 bg-[#0a0a0a] border border-emerald-500/50 rounded-full overflow-hidden shadow-[0_0_30px_rgba(16,185,129,0.2)] hover:shadow-[0_0_50px_rgba(16,185,129,0.4)] hover:scale-[1.02]"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <span className="relative z-10 tracking-widest uppercase text-xs md:text-sm drop-shadow-md">
                    Auditar Mi Negocio
                  </span>
                  <ArrowRight className="relative z-10 group-hover:translate-x-1 transition-transform duration-300" size={18} />
                </button>
              </div>
            </Reveal>
          </div>

          {/* COLUMNA DERECHA: Gráfica Financiera Animada */}
          <div className="w-full h-[350px] md:h-[450px] lg:h-[500px] relative mt-12 lg:mt-0">
            <FinancialGrowthVisual t={t} />
          </div>
        </div>
      </section>

      {/* --- GRID DE CARACTERÍSTICAS --- */}
      <section className="py-24 relative z-10 border-t border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-4">
              {t.renting.gridTitle} <span className="text-emerald-500 italic">{t.renting.gridHighlight}</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, i) => (
              <Reveal key={i} width="100%">
                <div className="p-10 rounded-[30px] bg-black border border-white/5 hover:border-emerald-500/30 transition-all group h-full shadow-2xl">
                  <div className="mb-6 p-4 rounded-2xl bg-white/5 border border-white/10 inline-block group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed font-light">{feature.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA FINAL --- */}
      <section className="py-32 relative border-t border-white/5 bg-gradient-to-b from-[#050505] to-emerald-950/10">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white mb-6">
            {t.renting.ctaTitle} <br />
            <span className="text-emerald-500 italic">{t.renting.ctaHighlight2}</span>
          </h2>
          <p className="text-gray-400 mb-10 text-lg">
            {t.renting.ctaDesc}
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-10 py-5 bg-white hover:bg-emerald-500 text-black hover:text-white font-black rounded-full transition-all shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-emerald-500/40 uppercase tracking-widest text-sm"
          >
            {t.renting.ctaButton}
          </button>
        </div>
      </section>

      <Footer />

      {/* === MODAL FLOTANTE PSICOLÓGICO (Enfoque Financiero) === */}
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
              className="relative w-full max-w-lg bg-[#050505] border border-emerald-500/30 rounded-[40px] shadow-[0_0_80px_rgba(16,185,129,0.15)] overflow-hidden"
            >
              <div className="p-8 md:p-10 relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-emerald-600/20 border-b border-x border-emerald-500/30 px-6 py-1 rounded-b-xl">
                  <span className="text-emerald-400 text-[9px] font-black uppercase tracking-widest">
                    {t.renting.modalBadge}
                  </span>
                </div>

                <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors z-10">
                  <X size={24} />
                </button>

                <div className="mb-8 mt-4">
                  <p className="text-gray-500 text-xs font-bold tracking-widest uppercase mb-2">{t.renting.modalSubtitle}</p>
                  <h3 className="text-3xl font-black tracking-tighter text-white">
                    {t.renting.modalTitle} <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">{t.renting.modalHighlight}</span>
                  </h3>
                  <p className="text-gray-400 font-light mt-3 text-sm leading-relaxed">
                    {t.renting.modalDesc}
                  </p>
                </div>

                <form action={handleCheckout} className="space-y-5">
                  <input type="hidden" name="service" value="[APP VIP] Servicio: Renting Tecnológico" />

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-emerald-500/70 ml-4 flex items-center gap-2">
                      {t.renting.fieldName}
                    </label>
                    <input name="name" required type="text" placeholder={t.renting.namePlaceholder} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:border-emerald-500 focus:bg-emerald-500/5 outline-none text-white transition-all" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-emerald-500/70 ml-4">
                      {t.renting.fieldEmail}
                    </label>
                    <input name="email" required type="email" placeholder={t.renting.emailPlaceholder} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:border-emerald-500 focus:bg-emerald-500/5 outline-none text-white transition-all" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-emerald-500/70 ml-4">
                      {t.renting.fieldOptional}
                    </label>
                    <textarea name="message" required rows={2} placeholder={t.renting.placeholderOptional} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:border-emerald-500 focus:bg-emerald-500/5 outline-none text-white transition-all resize-none" />
                  </div>

                  <motion.button
                    disabled={isPending}
                    whileHover={{ scale: isPending ? 1 : 1.02 }} whileTap={{ scale: isPending ? 1 : 0.98 }}
                    className="w-full mt-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 disabled:opacity-50 transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)] uppercase tracking-widest text-xs"
                  >
                    {isPending ? <><Loader2 className="animate-spin" size={20} /> {t.renting.btnSubmitting}</> : <><TrendingUp size={18} /> {t.renting.btnSubmit}</>}
                  </motion.button>

                  <p className="text-center text-[10px] text-gray-500 uppercase tracking-widest mt-4 flex items-center justify-center gap-2">
                    <Check size={12} className="text-emerald-500" /> Confidencialidad Asegurada
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