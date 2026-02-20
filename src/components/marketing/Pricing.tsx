"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Zap, TrendingUp, Globe, X, Loader2 } from "lucide-react";
import { Reveal } from "./Reveal";
import { captureLead } from "@/services/leads"; // Conexión directa a tu CRM

// Definición de planes
const plans = [
  {
    name: "Digital Core",
    price: { monthly: 499, annual: 399 },
    description: "Presencia profesional y autoridad de marca.",
    features: ["Desarrollo Web Next.js 15", "Hosting & Mantenimiento Pro", "SEO Técnico & Indexación Google", "Gestión Social (2 redes)", "Soporte 24/7"],
    icon: <Globe className="text-blue-400" size={24} />,
    color: "from-blue-500/20 to-cyan-500/20"
  },
  {
    name: "Growth & Ads",
    price: { monthly: 999, annual: 799 },
    description: "Escalabilidad agresiva y captura de leads.",
    highlight: true,
    features: ["Todo en Digital Core", "Gestión de Meta & Google Ads", "Estrategia de Funnels de Venta", "Creación de Contenido Viral", "Integración de CRM Vida Digital", "Dashboard de Analítica en Vivo"],
    icon: <TrendingUp className="text-blue-500" size={24} />,
    color: "from-blue-600/30 to-indigo-600/30"
  },
  {
    name: "Elite Partner",
    price: { monthly: 1999, annual: 1599 },
    description: "Departamento digital externo completo.",
    features: ["Todo en Growth & Ads", "Inbound Marketing & Emailing", "Automatización con IA", "Branding & Identidad Visual", "Software a Medida Ilimitado", "Consultoría Estratégica Semanal"],
    icon: <Zap className="text-amber-500" size={24} />,
    color: "from-amber-500/20 to-orange-500/20"
  }
];

export const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  
  // --- ESTADOS PARA EL MODAL DE CONVERSIÓN ---
  const [selectedPlan, setSelectedPlan] = useState<typeof plans[0] | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // --- FUNCIÓN PARA ENVIAR EL LEAD ---
  async function handleCheckout(formData: FormData) {
    setIsPending(true);
    setFeedback(null);

    // Ejecutamos la Server Action que ya tienes conectada a Supabase
    const result = await captureLead(formData);

    if (result.success) {
      setFeedback({ type: "success", text: "¡Aplicación prioritaria recibida! Nos comunicaremos contigo en breve." });
      setTimeout(() => {
        setSelectedPlan(null); // Cerramos el modal tras 3 segundos de éxito
        setFeedback(null);
      }, 3000);
    } else {
      setFeedback({ type: "error", text: result.message });
    }
    setIsPending(false);
  }

  return (
    <section id="renting" className="py-32 px-6 relative overflow-hidden bg-black">
      <div className="max-w-7xl mx-auto relative z-10">
        <Reveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter italic mb-6">
              INVERSIÓN <span className="text-blue-500">ESTRATÉGICA</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto font-light italic">
              No vendemos servicios, construimos el motor de crecimiento de tu empresa.
            </p>
          </div>
        </Reveal>

        {/* TOGGLE MENSUAL/ANUAL */}
        <div className="flex justify-center items-center gap-4 mb-16">
          <span className={`text-sm ${!isAnnual ? 'text-white font-bold' : 'text-gray-500'}`}>Mensual</span>
          <button 
            onClick={() => setIsAnnual(!isAnnual)}
            className="w-16 h-8 rounded-full bg-white/5 border border-white/10 p-1 flex items-center transition-colors"
          >
            <motion.div animate={{ x: isAnnual ? 32 : 0 }} className="w-6 h-6 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50" />
          </button>
          <span className={`text-sm ${isAnnual ? 'text-white font-bold' : 'text-gray-500'}`}>Anual (-20%)</span>
        </div>

        {/* GRID DE PLANES */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <Reveal key={i} width="100%">
              <div className={`relative p-1 bg-[#0a0a0a] rounded-[40px] border ${plan.highlight ? 'border-blue-500' : 'border-white/10'} h-full group hover:scale-[1.02] transition-transform duration-500`}>
                
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-500 text-black text-[10px] font-black px-6 py-1 rounded-full shadow-xl shadow-blue-500/20 uppercase tracking-widest z-20">
                    Recomendado
                  </div>
                )}

                <div className="p-8 md:p-10 h-full flex flex-col relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 rounded-2xl bg-white/5 border border-white/10">{plan.icon}</div>
                    <div>
                      <h3 className="text-2xl font-black tracking-tight">{plan.name}</h3>
                      <p className="text-xs text-gray-500 italic">{plan.description}</p>
                    </div>
                  </div>

                  <div className="mb-8">
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl font-black">${isAnnual ? plan.price.annual : plan.price.monthly}</span>
                      <span className="text-gray-500 text-sm font-medium">/mes</span>
                    </div>
                  </div>

                  <ul className="space-y-4 mb-10 flex-grow">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-gray-400 group-hover:text-gray-200 transition-colors">
                        <Check size={16} className="text-blue-500 mt-1 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* BOTÓN QUE ABRE EL MODAL */}
                  <button 
                    onClick={() => setSelectedPlan(plan)}
                    className={`w-full py-5 rounded-2xl font-black tracking-widest uppercase text-xs transition-all ${
                    plan.highlight ? 'bg-blue-600 text-white shadow-2xl shadow-blue-500/40 hover:bg-blue-500' : 'bg-white text-black hover:bg-blue-500 hover:text-white'
                  }`}>
                    Seleccionar Plan
                  </button>
                </div>
                <div className={`absolute inset-0 bg-gradient-to-br ${plan.color} opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-[40px] z-0`} />
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* === MODAL FLOTANTE PSICOLÓGICO === */}
      <AnimatePresence>
        {selectedPlan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6">
            {/* Fondo oscuro con desenfoque */}
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedPlan(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
            />
            
            {/* Tarjeta del Formulario (Efecto Cristal y Neón) */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-[#050505] border border-blue-500/30 rounded-[40px] shadow-[0_0_80px_rgba(59,130,246,0.15)] overflow-hidden"
            >
              <div className="p-8 md:p-10 relative">
                
                {/* Etiqueta de Escasez */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-blue-600/20 border-b border-x border-blue-500/30 px-6 py-1 rounded-b-xl">
                  <span className="text-blue-400 text-[9px] font-black uppercase tracking-widest">
                    🔥 Solo 3 cupos disponibles este mes
                  </span>
                </div>

                {/* Botón de Cierre */}
                <button onClick={() => setSelectedPlan(null)} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors z-10">
                  <X size={24} />
                </button>

                <div className="mb-8 mt-4">
                  <p className="text-gray-500 text-xs font-bold tracking-widest uppercase mb-2">Aplicación Estratégica</p>
                  <h3 className="text-3xl font-black tracking-tighter text-white">
                    Escala a <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">{selectedPlan.name}</span>
                  </h3>
                  <p className="text-gray-400 font-light mt-3 text-sm leading-relaxed">
                    No trabajamos con cualquiera. Cuéntanos sobre tu negocio y evaluaremos si tenemos la infraestructura para multiplicar tu facturación.
                  </p>
                </div>

                <form action={handleCheckout} className="space-y-5">
                  <input type="hidden" name="service" value={`[VIP APP] Plan: ${selectedPlan.name} (${isAnnual ? 'Anual' : 'Mensual'})`} />
                  
                  {/* Juega con el ego: "Nombre del CEO / Fundador" */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-blue-500/70 ml-4 flex items-center gap-2">
                      Nombre del CEO / Fundador
                    </label>
                    <input name="name" required type="text" placeholder="Ej. Christian S." className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:border-blue-500 focus:bg-blue-500/5 outline-none text-white transition-all" />
                  </div>

                  {/* Filtro psicológico: "Email corporativo" */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-blue-500/70 ml-4">
                      Email Corporativo
                    </label>
                    <input name="email" required type="email" placeholder="ceo@tuempresa.com" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:border-blue-500 focus:bg-blue-500/5 outline-none text-white transition-all" />
                  </div>

                  {/* Pregunta de dolor y contacto rápido */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-blue-500/70 ml-4">
                      WhatsApp + Mayor Desafío Actual
                    </label>
                    <textarea name="message" required rows={2} placeholder="Mi WhatsApp es... y mi cuello de botella en ventas es..." className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:border-blue-500 focus:bg-blue-500/5 outline-none text-white transition-all resize-none" />
                  </div>

                  {/* Botón de alto valor percibido */}
                  <motion.button 
                    disabled={isPending}
                    whileHover={{ scale: isPending ? 1 : 1.02 }} whileTap={{ scale: isPending ? 1 : 0.98 }}
                    className="w-full mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 disabled:opacity-50 transition-all shadow-[0_0_30px_rgba(59,130,246,0.3)] uppercase tracking-widest text-xs"
                  >
                    {isPending ? <><Loader2 className="animate-spin" size={20} /> Evaluando Perfil...</> : <><TrendingUp size={18} /> Enviar Aplicación VIP</>}
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
    </section>
  );
};