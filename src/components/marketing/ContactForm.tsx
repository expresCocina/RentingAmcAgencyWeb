"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Loader2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { captureLead } from "@/services/leads";

export const ContactForm = () => {
  const { t } = useLanguage();
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    setMessage(null);
    const result = await captureLead(formData);
    if (result.success) {
      setMessage({ type: "success", text: result.message });
    } else {
      setMessage({ type: "error", text: result.message });
    }
    setIsPending(false);
  }

  return (
    <section id="contacto" className="py-16 md:py-24 px-4 md:px-6 relative overflow-hidden bg-[#050505]">
      <div className="max-w-4xl mx-auto bg-[#0a0a0a] border border-white/5 rounded-[30px] md:rounded-[40px] p-6 sm:p-10 md:p-16 relative z-10 shadow-2xl">

        <div className="text-center mb-8 md:mb-12">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-blue-500 text-xs font-bold tracking-[0.2em] uppercase"
          >
            {t.contact.badge}
          </motion.span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-3 md:mt-4 mb-4 md:mb-6 tracking-tighter">
            {t.contact.title} <span className="text-blue-500">{t.contact.titleHighlight}</span>
          </h2>
          <p className="text-gray-500 text-sm md:text-lg font-light">
            {t.contact.description}
          </p>
        </div>

        <form action={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">

          <div className="space-y-2">
            <label className="text-[11px] font-medium text-gray-400 ml-2">{t.contact.fullName}</label>
            <input
              name="name"
              required
              type="text"
              placeholder={t.contact.fullNamePlaceholder}
              className="w-full bg-black border border-white/10 rounded-xl md:rounded-2xl p-3 md:p-4 focus:border-blue-500 outline-none transition-all text-white text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-medium text-gray-400 ml-2">{t.contact.email}</label>
            <input
              name="email"
              required
              type="email"
              placeholder={t.contact.emailPlaceholder}
              className="w-full bg-black border border-white/10 rounded-xl md:rounded-2xl p-3 md:p-4 focus:border-blue-500 outline-none transition-all text-white text-sm"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-[11px] font-medium text-gray-400 ml-2">{t.contact.service}</label>
            <select name="service" className="w-full bg-black border border-white/10 rounded-xl md:rounded-2xl p-3 md:p-4 focus:border-blue-500 outline-none transition-all text-gray-400 text-sm">
              <option value="renting_web">Renting Web de Élite (Suscripción)</option>
              <option value="infrastructure">Infraestructura Cloud y Software</option>
              <option value="marketing">Estrategia de Marketing Global</option>
            </select>
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-[11px] font-medium text-gray-400 ml-2">Tu visión</label>
            <textarea
              name="message"
              rows={4}
              placeholder="¿Qué objetivos quieres alcanzar?"
              className="w-full bg-black border border-white/10 rounded-xl md:rounded-2xl p-3 md:p-4 focus:border-blue-500 outline-none transition-all text-white resize-none text-sm"
            />
          </div>

          <motion.button
            disabled={isPending}
            whileHover={{ scale: isPending ? 1 : 1.02 }}
            whileTap={{ scale: isPending ? 1 : 0.98 }}
            className="md:col-span-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 md:py-5 rounded-xl md:rounded-2xl transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {isPending ? (
              <>Procesando... <Loader2 className="animate-spin" size={18} /></>
            ) : (
              <>Enviar Solicitud <Send size={18} /></>
            )}
          </motion.button>

          {message && (
            <div className={`md:col-span-2 p-4 rounded-xl text-center text-sm font-medium ${message.type === "success"
                ? "bg-green-500/10 text-green-500 border border-green-500/20"
                : "bg-red-500/10 text-red-500 border border-red-500/20"
              }`}>
              {message.text}
            </div>
          )}
        </form>
      </div>
    </section>
  );
};