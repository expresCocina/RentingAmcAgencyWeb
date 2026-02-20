"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { Reveal } from "./Reveal";

const faqs = [
  {
    q: "¿Por qué un modelo de Renting en lugar de un desarrollo de pago único?",
    a: "El ecosistema digital cambia a diario. Con un pago único, tu web queda obsoleta en meses y terminas pagando mantenimientos sorpresa. Con nuestro Renting, tu plataforma evoluciona constantemente: incluye alojamiento premium, seguridad al día y actualizaciones tecnológicas continuas sin inyecciones de capital imprevistas.",
  },
  {
    q: "Ya tengo web, pero necesito ventas. ¿Incluyen captación de clientes?",
    a: "Absolutamente. No solo construimos infraestructuras, construimos negocios. A partir de nuestro plan 'Growth & Ads', nos hacemos cargo de tus campañas en Meta y Google Ads, diseñamos embudos de conversión (funnels) y conectamos todo a nuestro CRM para transformar clics en facturación real.",
  },
  {
    q: "¿Qué pasa si mi marca se vuelve viral y recibo picos masivos de tráfico?",
    a: "No te caerás. Utilizamos arquitectura 'Serverless' respaldada por AWS y Vercel (la misma tecnología que usan gigantes tecnológicos). Tu plataforma escalará automáticamente en milisegundos para soportar desde 100 hasta 100,000 visitas simultáneas sin perder un segundo de velocidad.",
  },
  {
    q: "¿Quién es el propietario de la información, el dominio y el código?",
    a: "Tú eres el dueño absoluto de tus dominios, bases de datos de clientes y cuentas publicitarias desde el día uno. Durante el renting nosotros gestionamos el código; si en el futuro decides independizarte, ofrecemos una cláusula de 'Buy-Out' (compra) transparente para transferirte la propiedad total del software.",
  },
  {
    q: "¿Existen costos ocultos de servidores o licencias de software?",
    a: "Cero costos ocultos. Tu cuota mensual de Renting o Partner cubre absolutamente todo: costos de servidor (hosting), certificados SSL de seguridad, bases de datos Supabase, y el mantenimiento técnico. Solo inviertes tu presupuesto adicional directamente en tus pautas publicitarias.",
  },
];

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-20 md:py-32 px-4 md:px-6 bg-[#050505] relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />

      <div className="max-w-4xl mx-auto relative z-10">
        <Reveal>
          <div className="text-center mb-12 md:mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter italic mb-4 md:mb-6">
              RESOLUCIÓN DE <span className="text-blue-500">DUDAS</span>
            </h2>
            <p className="text-gray-400 font-light italic text-base md:text-lg">
              Transparencia total. Respuestas claras para decisiones estratégicas.
            </p>
          </div>
        </Reveal>

        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <Reveal key={i} width="100%">
                <div
                  className={`border transition-all duration-500 rounded-2xl md:rounded-3xl overflow-hidden ${isOpen
                      ? "bg-blue-900/10 border-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.05)]"
                      : "bg-white/[0.02] border-white/5 hover:border-white/10"
                    }`}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="w-full px-5 md:px-8 py-4 md:py-6 flex justify-between items-start md:items-center text-left gap-4"
                  >
                    <span className={`text-sm md:text-lg font-bold transition-colors leading-snug ${isOpen ? "text-blue-400" : "text-gray-200"}`}>
                      {faq.q}
                    </span>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      className={`p-1.5 md:p-2 rounded-full flex-shrink-0 transition-colors ${isOpen ? "bg-blue-500 text-white" : "bg-white/5 text-gray-400"
                        }`}
                    >
                      {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 md:px-8 pb-5 md:pb-8 pt-1 md:pt-2">
                          <div className="w-10 md:w-12 h-[2px] bg-blue-500 mb-4 md:mb-6 opacity-50" />
                          <p className="text-gray-400 font-light leading-relaxed text-sm md:text-base">
                            {faq.a}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};