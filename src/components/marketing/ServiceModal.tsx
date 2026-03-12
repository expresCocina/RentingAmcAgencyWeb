"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Check, Send } from "lucide-react";
import { trackLead } from "@/lib/fbPixel";

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceName: string;
  planName?: string;
  /** Clases de gradiente Tailwind, ej: "from-pink-500 to-rose-500" */
  gradient: string;
  /** Color del acento, ej: "emerald" */
  accentClass: string;
}

export function ServiceModal({ isOpen, onClose, serviceName, planName, gradient, accentClass }: ServiceModalProps) {
  const [isPending, setIsPending] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const borderColor = `border-${accentClass}-500/30`;
  const focusColor = `focus:border-${accentClass}-500 focus:bg-${accentClass}-500/5`;
  const labelColor = `text-${accentClass}-500/70`;
  const btnGlow = `shadow-[0_0_30px_rgba(0,0,0,0.3)]`;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsPending(true);
    setFeedback(null);
    const form = e.currentTarget;
    const fd = new FormData(form);
    const email = fd.get("email") as string;
    const phone = fd.get("phone") as string;

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fd.get("name"),
          email,
          phone: phone || undefined,
          service: planName ? `[${planName}] ${serviceName}` : `[Web] ${serviceName}`,
          message: fd.get("message") || `Interesado en ${planName ?? serviceName}`,
        }),
      });

      if (res.ok) {
        setFeedback({ type: "success", text: "¡Vision recibida! Un estratega de AMC se pondra en contacto contigo pronto." });
        trackLead(email, phone || undefined);
        setTimeout(() => { onClose(); setFeedback(null); }, 3000);
      } else {
        setFeedback({ type: "error", text: "Algo fallo. Por favor intenta de nuevo o escribenos al WhatsApp." });
      }
    } catch {
      setFeedback({ type: "error", text: "Error de conexion. Por favor intenta de nuevo." });
    } finally {
      setIsPending(false);
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.25 }}
            className={`relative w-full max-w-lg bg-[#050505] border ${borderColor} rounded-[40px] shadow-2xl overflow-hidden`}
          >
            {/* Barra superior decorativa */}
            <div className={`absolute top-0 left-1/2 -translate-x-1/2 bg-gradient-to-r ${gradient} opacity-20 blur-2xl w-64 h-12 pointer-events-none`} />
            <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${gradient} opacity-60`} />

            <div className="p-8 md:p-10 relative">
              {/* Badge plan */}
              {planName && (
                <div className={`inline-flex items-center gap-2 px-4 py-1 rounded-full bg-gradient-to-r ${gradient} opacity-90 mb-6`}>
                  <span className="text-white text-[10px] font-black tracking-[0.25em] uppercase">{planName}</span>
                </div>
              )}

              {/* Close btn */}
              <button onClick={onClose} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors z-10">
                <X size={22} />
              </button>

              {/* Header */}
              <div className="mb-7">
                <p className={`text-[10px] font-black tracking-widest uppercase ${labelColor} mb-1`}>
                  {serviceName}
                </p>
                <h3 className="text-3xl font-black tracking-tighter text-white">
                  Activar{" "}
                  <span className={`text-transparent bg-clip-text bg-gradient-to-r ${gradient}`}>
                    {planName ?? "plan"}
                  </span>
                </h3>
                <p className="text-gray-400 text-sm mt-2 leading-relaxed font-light">
                  Completa tus datos y un estratega te contactara en menos de 24h habiles.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div className="space-y-1.5">
                  <label className={`text-[10px] font-bold tracking-widest uppercase ${labelColor} ml-4 block`}>
                    Nombre completo *
                  </label>
                  <input
                    name="name" required type="text"
                    placeholder="Tu nombre"
                    className={`w-full bg-white/5 border border-white/10 rounded-2xl p-4 ${focusColor} outline-none text-white placeholder-gray-600 text-sm transition-all`}
                  />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className={`text-[10px] font-bold tracking-widest uppercase ${labelColor} ml-4 block`}>
                    Email corporativo *
                  </label>
                  <input
                    name="email" required type="email"
                    placeholder="tu@empresa.com"
                    className={`w-full bg-white/5 border border-white/10 rounded-2xl p-4 ${focusColor} outline-none text-white placeholder-gray-600 text-sm transition-all`}
                  />
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label className={`text-[10px] font-bold tracking-widest uppercase ${labelColor} ml-4 block`}>
                    WhatsApp / Telefono
                  </label>
                  <input
                    name="phone" type="tel"
                    placeholder="+57 300 000 0000"
                    className={`w-full bg-white/5 border border-white/10 rounded-2xl p-4 ${focusColor} outline-none text-white placeholder-gray-600 text-sm transition-all`}
                  />
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label className={`text-[10px] font-bold tracking-widest uppercase ${labelColor} ml-4 block`}>
                    Tu vision / objetivo
                  </label>
                  <textarea
                    name="message" rows={2}
                    placeholder={`Cuentanos que quieres lograr con ${serviceName}...`}
                    className={`w-full bg-white/5 border border-white/10 rounded-2xl p-4 ${focusColor} outline-none text-white placeholder-gray-600 text-sm transition-all resize-none`}
                  />
                </div>

                {/* Submit */}
                <motion.button
                  type="submit"
                  disabled={isPending}
                  whileHover={{ scale: isPending ? 1 : 1.02 }}
                  whileTap={{ scale: isPending ? 1 : 0.98 }}
                  className={`w-full mt-2 bg-gradient-to-r ${gradient} text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 disabled:opacity-50 transition-all ${btnGlow} uppercase tracking-widest text-xs`}
                >
                  {isPending
                    ? <><Loader2 className="animate-spin" size={18} /> Enviando...</>
                    : <><Send size={16} /> Activar mi plan ahora</>
                  }
                </motion.button>

                <p className="text-center text-[10px] text-gray-500 uppercase tracking-widest flex items-center justify-center gap-2 mt-3">
                  <Check size={11} className="text-green-500" /> Sin compromiso · Respuesta en 24h habiles
                </p>

                {feedback && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    className={`mt-3 p-4 rounded-xl text-center text-sm font-bold border ${feedback.type === "success" ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}`}
                  >
                    {feedback.text}
                  </motion.div>
                )}
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
