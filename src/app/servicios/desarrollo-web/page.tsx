"use client";
import { useState, useEffect, useRef } from "react";
// IMPORTANTE: Asegúrate de importar Image de next/image
import Image from "next/image";
import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import { Reveal } from "@/components/marketing/Reveal";
import { useLanguage } from "@/context/LanguageContext";
import { motion, AnimatePresence, useInView, useMotionValue, useSpring } from "framer-motion";
import { Code2, Zap, Search, ShieldCheck, ArrowRight, X, Loader2, TrendingUp, Check, Activity } from "lucide-react";
import { captureLead } from "@/services/leads";

const getFeatures = (t: any) => [
  {
    title: t.webDev.feature1Title,
    description: t.webDev.feature1Desc,
    icon: <Zap className="text-blue-500 w-8 h-8" />
  },
  {
    title: t.webDev.feature2Title,
    description: t.webDev.feature2Desc,
    icon: <Search className="text-cyan-500 w-8 h-8" />
  },
  {
    title: t.webDev.feature3Title,
    description: t.webDev.feature3Desc,
    icon: <Code2 className="text-indigo-500 w-8 h-8" />
  },
  {
    title: t.webDev.feature4Title,
    description: t.webDev.feature4Desc,
    icon: <ShieldCheck className="text-emerald-500 w-8 h-8" />
  }
];

// --- COMPONENTE DE CONTEO ANIMADO ---
const AnimatedCounter = ({ value }: { value: number }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { damping: 40, stiffness: 50 });
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [isInView, value, motionValue]);

  useEffect(() => {
    springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = Math.round(latest).toString();
      }
    });
  }, [springValue]);

  return <span ref={ref}>0</span>;
};

// --- COMPONENTE VISUAL: LA COMPUTADORA ---
const SpeedLaptopVisual = (props: { t?: any }) => {
  const metrics = [
    { label: "Performance", score: 99 },
    { label: "Accesibilidad", score: 100 },
    { label: "Prácticas", score: 100 },
    { label: "SEO Nativo", score: 100 },
  ];

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center perspective-1000 pt-10">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-600/20 blur-[100px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="relative z-20 mb-6 flex items-center gap-3 px-5 py-2.5 bg-black/60 border border-white/10 rounded-full backdrop-blur-md shadow-2xl"
      >
        <Activity className="text-green-500 w-4 h-4 animate-pulse" />
        <span className="text-gray-300 text-[10px] font-bold tracking-widest uppercase">
          {props.t?.webDev?.auditLabel || "Auditoría en Tiempo Real: Google Lighthouse Vitals"}
        </span>
      </motion.div>

      <motion.div
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10 w-full max-w-lg"
      >
        <div className="relative bg-[#0a0a0a] border border-white/20 rounded-t-3xl rounded-b-lg p-2 shadow-2xl shadow-blue-500/20 overflow-hidden aspect-[16/10]">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent pointer-events-none z-20" />

          <div className="bg-[#050505] w-full h-full rounded-2xl border border-white/5 relative overflow-hidden flex flex-col items-center justify-center">

            <motion.div
              animate={{ backgroundPosition: ["0% 0%", "0% 100%"] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 opacity-20 bg-[linear-gradient(to_bottom,#3b82f6_1px,transparent_1px)] bg-[size:100%_20px]"
            />

            <div className="relative z-10 flex gap-4 md:gap-6 mb-8 px-4">
              {metrics.map((m, i) => (
                <div key={i} className="flex flex-col items-center gap-3">
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: i * 0.2 + 0.8, type: "spring" }}
                    className="w-14 h-14 md:w-16 md:h-16 rounded-full border-[3px] border-green-500 flex items-center justify-center bg-black/80 shadow-[0_0_20px_rgba(34,197,94,0.4)] relative"
                  >
                    <span className="text-green-400 font-black text-lg md:text-xl drop-shadow-[0_0_8px_rgba(34,197,94,0.8)]">
                      <AnimatedCounter value={m.score} />
                    </span>
                  </motion.div>
                  <span className="text-[8px] md:text-[9px] text-gray-300 uppercase font-bold tracking-widest text-center max-w-[70px]">
                    {m.label}
                  </span>
                </div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2 }}
              className="relative z-10 px-6 py-2 bg-blue-600/20 border border-blue-500/50 rounded-full text-blue-400 font-bold tracking-widest text-xs uppercase shadow-[0_0_20px_rgba(59,130,246,0.5)]"
            >
              Next.js 15 Engine Active
            </motion.div>
          </div>
        </div>

        <div className="relative h-4 bg-gradient-to-b from-gray-300 to-gray-500 rounded-b-3xl mx-[-10px] shadow-2xl flex justify-center">
          <div className="w-20 h-1 bg-gray-400 rounded-b-md" />
        </div>
      </motion.div>
    </div>
  );
};

export default function DesarrolloWebPage() {
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
      setFeedback({ type: "success", text: t.webDev.successMsg });
      setTimeout(() => {
        setIsModalOpen(false);
        setFeedback(null);
      }, 3000);
    } else {
      setFeedback({ type: "error", text: t.webDev.errorMsg });
    }
    setIsPending(false);
  }

  return (
    <main className="min-h-screen bg-[#050505]">
      <Navbar />

      {/* --- HERO SECTION DIVIDIDO --- */}
      <section className="relative min-h-[100svh] flex items-center pt-20 pb-12 overflow-hidden">

        {/* === NUEVO: FONDO MÓVIL IMPRESIONANTE (Solo visible en móvil/tablet) === */}
        <div className="absolute inset-0 z-0 lg:hidden pointer-events-none">
          <Image
            src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2670&auto=format&fit=crop"
            alt="Tech Background Mobile"
            fill
            className="object-cover object-center opacity-60"
            priority // Carga prioritaria para móviles
          />
          <div className="absolute inset-0 bg-[#050505]/80 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/50 to-[#050505]" />
        </div>
        {/* =================================================================== */}

        <div className="container mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center h-full z-10 relative">

          {/* COLUMNA IZQUIERDA: Mensaje de Poder */}
          <div className="text-left space-y-6 md:space-y-8 pt-6 lg:pt-0">
            <Reveal>
              <>
                <span className="px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-bold tracking-[0.2em] uppercase inline-block mb-4 backdrop-blur-md">
                  {t.webDev.badge}
                </span>
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[1.1] text-white drop-shadow-lg">
                  {t.webDev.title} <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 italic">
                    {t.webDev.titleHighlight}
                  </span>
                </h1>
              </>
            </Reveal>

            <Reveal>
              <p className="text-gray-200 text-base md:text-lg lg:text-xl max-w-xl font-light leading-relaxed drop-shadow-md">
                {t.webDev.description}
              </p>
            </Reveal>

            {/* === NUEVO BOTÓN VIP DE ALTA CONVERSIÓN === */}
            <Reveal>
              <div className="pt-6 pb-4">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 w-full md:w-auto font-black text-white transition-all duration-300 bg-[#0a0a0a] border border-blue-500/50 rounded-full overflow-hidden shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:shadow-[0_0_50px_rgba(59,130,246,0.6)] hover:scale-[1.02]"
                >
                  {/* Resplandor de fondo que aparece al pasar el ratón */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Texto y Flecha */}
                  <span className="relative z-10 tracking-widest uppercase text-xs md:text-sm drop-shadow-md">
                    Solicitar Arquitectura VIP
                  </span>
                  <ArrowRight className="relative z-10 group-hover:translate-x-1 transition-transform duration-300" size={18} />
                </button>
              </div>
            </Reveal>
          </div>

          {/* COLUMNA DERECHA: Computadora Animada (Visible en móvil debajo del texto) */}
          <div className="w-full h-[350px] md:h-[450px] lg:h-[500px] relative mt-12 lg:mt-0">
            <SpeedLaptopVisual t={t} />
          </div>
        </div>
      </section>

      {/* --- GRID DE CARACTERÍSTICAS --- */}
      <section className="py-24 relative z-10 border-t border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-4">
              {t.webDev.gridTitle} <span className="text-blue-500 italic">{t.webDev.gridHighlight}</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, i) => (
              <Reveal key={i} width="100%">
                <div className="p-10 rounded-[30px] bg-black border border-white/5 hover:border-blue-500/30 transition-all group h-full shadow-2xl">
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

      {/* --- CTA FINAL (Abre el Modal) --- */}
      <section className="py-32 relative border-t border-white/5 bg-gradient-to-b from-[#050505] to-blue-950/20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white mb-6">
            {t.webDev.ctaTitle} <br />
            <span className="text-blue-500 italic">{t.webDev.ctaHighlight}</span>
          </h2>
          <p className="text-gray-400 mb-10 text-lg">
            {t.webDev.ctaDesc}
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-10 py-5 bg-white hover:bg-blue-500 text-black hover:text-white font-black rounded-full transition-all shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-blue-500/40 uppercase tracking-widest text-sm"
          >
            {t.webDev.ctaButton}
          </button>
        </div>
      </section>

      <Footer />

      {/* === MODAL FLOTANTE PSICOLÓGICO === */}
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
              className="relative w-full max-w-lg bg-[#050505] border border-blue-500/30 rounded-[40px] shadow-[0_0_80px_rgba(59,130,246,0.15)] overflow-hidden"
            >
              <div className="p-8 md:p-10 relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-blue-600/20 border-b border-x border-blue-500/30 px-6 py-1 rounded-b-xl">
                  <span className="text-blue-400 text-[9px] font-black uppercase tracking-widest">
                    {t.webDev.modalBadge}
                  </span>
                </div>

                <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors z-10">
                  <X size={24} />
                </button>

                <div className="mb-8 mt-4">
                  <p className="text-gray-500 text-xs font-bold tracking-widest uppercase mb-2">{t.webDev.modalSubtitle}</p>
                  <h3 className="text-3xl font-black tracking-tighter text-white">
                    {t.webDev.modalTitle} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">{t.webDev.modalHighlight}</span>
                  </h3>
                  <p className="text-gray-400 font-light mt-3 text-sm leading-relaxed">
                    {t.webDev.modalDesc}
                  </p>
                </div>

                <form action={handleCheckout} className="space-y-5">
                  <input type="hidden" name="service" value="[APP VIP] Servicio: Desarrollo Web Elite" />

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-blue-500/70 ml-4 flex items-center gap-2">
                      {t.webDev.fieldName}
                    </label>
                    <input name="name" required type="text" placeholder={t.webDev.namePlaceholder} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:border-blue-500 focus:bg-blue-500/5 outline-none text-white transition-all" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-blue-500/70 ml-4">
                      {t.webDev.fieldEmail}
                    </label>
                    <input name="email" required type="email" placeholder={t.webDev.emailPlaceholder} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:border-blue-500 focus:bg-blue-500/5 outline-none text-white transition-all" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-blue-500/70 ml-4">
                      {t.webDev.fieldOptional}
                    </label>
                    <textarea name="message" required rows={2} placeholder={t.webDev.placeholderOptional} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:border-blue-500 focus:bg-blue-500/5 outline-none text-white transition-all resize-none" />
                  </div>

                  <motion.button
                    disabled={isPending}
                    whileHover={{ scale: isPending ? 1 : 1.02 }} whileTap={{ scale: isPending ? 1 : 0.98 }}
                    className="w-full mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 disabled:opacity-50 transition-all shadow-[0_0_30px_rgba(59,130,246,0.3)] uppercase tracking-widest text-xs"
                  >
                    {isPending ? <><Loader2 className="animate-spin" size={20} /> {t.webDev.btnSubmitting}</> : <><TrendingUp size={18} /> {t.webDev.btnSubmit}</>}
                  </motion.button>

                  <p className="text-center text-[10px] text-gray-500 uppercase tracking-widest mt-4 flex items-center justify-center gap-2">
                    <Check size={12} className="text-green-500" /> Tus datos están encriptados
                  </p>

                  {feedback && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`mt-4 p-4 rounded-xl text-center text-sm font-bold border ${feedback.type === "success" ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}`}>
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