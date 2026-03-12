"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CheckCircle2, Send } from "lucide-react";
import { trackLead } from "@/lib/fbPixel";

interface ServiceLeadFormProps {
  /** Nombre del servicio para el hidden input */
  serviceName: string;
  /** Clases de gradiente Tailwind del acento del servicio, ej: "from-pink-500 to-rose-500" */
  gradient: string;
  /** Color del ring en focus, ej: "focus:border-pink-500 focus:bg-pink-500/5" */
  focusColor: string;
  /** Color del label, ej: "text-pink-400" */
  labelColor: string;
}

export function ServiceLeadForm({ serviceName, gradient, focusColor, labelColor }: ServiceLeadFormProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const fd = new FormData(e.currentTarget);
    const email = fd.get("email") as string;
    const name = fd.get("name") as string;
    const phone = fd.get("phone") as string;
    const message = fd.get("message") as string;

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone: phone || undefined,
          service: `[Web] ${serviceName}`,
          message: message || `Interesado en ${serviceName}`,
        }),
      });

      if (res.ok) {
        setSuccess(true);
        trackLead(email, phone || undefined);
      } else {
        setError("Algo falló. Por favor intenta de nuevo o escríbenos al WhatsApp.");
      }
    } catch {
      setError("Error de conexión. Por favor intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 px-4 md:px-6">
      <div className="max-w-2xl mx-auto">
        <div className={`p-8 md:p-12 rounded-[40px] bg-[#080808] border border-white/8 relative overflow-hidden`}>
          {/* Glow decorativo */}
          <div className={`absolute -top-20 -right-20 w-64 h-64 rounded-full bg-gradient-to-br ${gradient} opacity-[0.07] blur-3xl pointer-events-none`} />

          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <CheckCircle2 className={`w-16 h-16 mx-auto mb-6 text-transparent bg-clip-text`}
                  style={{ color: "transparent", filter: "drop-shadow(0 0 20px rgba(34,197,94,0.6))" }}
                />
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-2xl font-black text-white mb-3">¡Mensaje recibido! 🎉</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Un estratega de AMC Agency se pondrá en contacto contigo en las próximas <strong className="text-white">24 horas hábiles</strong>.
                </p>
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="mb-8">
                  <span className={`text-xs font-black tracking-[0.25em] uppercase ${labelColor}`}>
                    Solicitar información
                  </span>
                  <h2 className="text-2xl md:text-3xl font-black tracking-tighter text-white mt-2">
                    ¿Listo para empezar?
                    <span className={`block text-transparent bg-clip-text bg-gradient-to-r ${gradient}`}>
                      Cuéntanos tu proyecto
                    </span>
                  </h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-[10px] font-bold tracking-widest uppercase ${labelColor} ml-1 mb-1.5`}>
                        Nombre *
                      </label>
                      <input
                        name="name" required type="text"
                        placeholder="Tu nombre completo"
                        className={`w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-white placeholder-gray-600 text-sm outline-none ${focusColor} transition-all`}
                      />
                    </div>
                    <div>
                      <label className={`block text-[10px] font-bold tracking-widest uppercase ${labelColor} ml-1 mb-1.5`}>
                        Email *
                      </label>
                      <input
                        name="email" required type="email"
                        placeholder="tu@empresa.com"
                        className={`w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-white placeholder-gray-600 text-sm outline-none ${focusColor} transition-all`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-[10px] font-bold tracking-widest uppercase ${labelColor} ml-1 mb-1.5`}>
                      WhatsApp / Teléfono
                    </label>
                    <input
                      name="phone" type="tel"
                      placeholder="+57 300 000 0000"
                      className={`w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-white placeholder-gray-600 text-sm outline-none ${focusColor} transition-all`}
                    />
                  </div>

                  <div>
                    <label className={`block text-[10px] font-bold tracking-widest uppercase ${labelColor} ml-1 mb-1.5`}>
                      Tu proyecto / visión
                    </label>
                    <textarea
                      name="message" rows={3}
                      placeholder={`Cuéntanos qué quieres lograr con ${serviceName}...`}
                      className={`w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-white placeholder-gray-600 text-sm outline-none ${focusColor} transition-all resize-none`}
                    />
                  </div>

                  {error && (
                    <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-2xl px-4 py-3">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-4 rounded-2xl bg-gradient-to-r ${gradient} text-white font-black text-sm tracking-widest uppercase flex items-center justify-center gap-2.5 disabled:opacity-60 hover:opacity-90 transition-all shadow-xl`}
                  >
                    {loading ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Enviando...</>
                    ) : (
                      <><Send className="w-4 h-4" /> Enviar solicitud</>
                    )}
                  </button>

                  <p className="text-center text-gray-600 text-[10px] tracking-wider">
                    Sin compromiso · Respuesta en menos de 24h hábiles
                  </p>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
