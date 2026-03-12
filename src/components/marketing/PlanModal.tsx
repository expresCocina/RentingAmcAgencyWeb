"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, TrendingUp, Check } from "lucide-react";
import { captureLead } from "@/services/leads";
import { trackLead } from "@/lib/fbPixel";

interface PlanModalProps {
    isOpen: boolean;
    onClose: () => void;
    planName: string;
    serviceName: string;
    colorClasses: {
        bg: string;
        border: string;
        text: string;
        btn: string;
    };
}

export function PlanModal({ isOpen, onClose, planName, serviceName, colorClasses }: PlanModalProps) {
    const [isPending, setIsPending] = useState(false);
    const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

    async function handleCheckout(formData: FormData) {
        setIsPending(true);
        setFeedback(null);
        const result = await captureLead(formData);

        if (result.success) {
            setFeedback({ type: "success", text: "¡Solicitud enviada! Nos pondremos en contacto pronto." });
            const email = (formData.get("email") as string) || undefined;
            const phone = (formData.get("phone") as string) || undefined;
            trackLead(email, phone);
            
            setTimeout(() => {
                onClose();
                setFeedback(null);
            }, 3000);
        } else {
            setFeedback({ type: "error", text: "Hubo un error al enviar. Intenta de nuevo." });
        }
        setIsPending(false);
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className={`relative w-full max-w-lg bg-[#050505] border ${colorClasses.border} rounded-[40px] shadow-[0_0_80px_rgba(0,0,0,0.5)] overflow-hidden`}
                    >
                        <div className="p-8 md:p-10 relative">
                            <div className={`absolute top-0 left-1/2 -translate-x-1/2 ${colorClasses.bg} border-b border-x ${colorClasses.border} px-6 py-1 rounded-b-xl`}>
                                <span className={`${colorClasses.text} text-[9px] font-black uppercase tracking-widest`}>
                                    Solicitud de Servicio
                                </span>
                            </div>

                            <button onClick={onClose} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors z-10 block cursor-pointer">
                                <X size={24} />
                            </button>

                            <div className="mb-8 mt-4">
                                <p className="text-gray-500 text-xs font-bold tracking-widest uppercase mb-2">{serviceName}</p>
                                <h3 className="text-3xl font-black tracking-tighter text-white">
                                    Plan <span className={colorClasses.text}>{planName}</span>
                                </h3>
                                <p className="text-gray-400 font-light mt-3 text-sm leading-relaxed">
                                    Déjanos tus datos y un especialista se pondrá en contacto contigo para comenzar.
                                </p>
                            </div>

                            <form action={handleCheckout} className="space-y-5">
                                <input type="hidden" name="service" value={`[MARKETING] ${serviceName} - Plan ${planName}`} />

                                <div className="space-y-1.5">
                                    <label className={`text-[10px] font-bold tracking-widest uppercase ${colorClasses.text} opacity-70 ml-4`}>
                                        Tu Nombre Completo
                                    </label>
                                    <input name="name" required type="text" placeholder="Ej. Juan Pérez" className={`w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:${colorClasses.border.replace('border-', 'focus:border-')} outline-none text-white transition-all`} />
                                </div>

                                <div className="space-y-1.5">
                                    <label className={`text-[10px] font-bold tracking-widest uppercase ${colorClasses.text} opacity-70 ml-4`}>
                                        Correo Corporativo
                                    </label>
                                    <input name="email" required type="email" placeholder="tu@empresa.com" className={`w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:${colorClasses.border.replace('border-', 'focus:border-')} outline-none text-white transition-all`} />
                                </div>

                                <div className="space-y-1.5">
                                    <label className={`text-[10px] font-bold tracking-widest uppercase ${colorClasses.text} opacity-70 ml-4`}>
                                        WhatsApp o Teléfono
                                    </label>
                                    <input name="phone" required type="tel" placeholder="+57 300 000 0000" className={`w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:${colorClasses.border.replace('border-', 'focus:border-')} outline-none text-white transition-all`} />
                                </div>

                                <div className="space-y-1.5">
                                    <label className={`text-[10px] font-bold tracking-widest uppercase ${colorClasses.text} opacity-70 ml-4`}>
                                        ¿Qué objetivo deseas alcanzar? (Opcional)
                                    </label>
                                    <textarea name="message" rows={2} placeholder="Escribe aquí brevemente..." className={`w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:${colorClasses.border.replace('border-', 'focus:border-')} outline-none text-white transition-all resize-none`} />
                                </div>

                                <motion.button
                                    disabled={isPending}
                                    whileHover={{ scale: isPending ? 1 : 1.02 }} whileTap={{ scale: isPending ? 1 : 0.98 }}
                                    className={`w-full mt-6 ${colorClasses.btn} text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 disabled:opacity-50 transition-all uppercase tracking-widest text-xs`}
                                >
                                    {isPending ? <><Loader2 className="animate-spin" size={20} /> ENVIANDO...</> : <><TrendingUp size={18} /> ENVIAR SOLICITUD</>}
                                </motion.button>

                                <p className="text-center text-[10px] text-gray-500 uppercase tracking-widest mt-4 flex items-center justify-center gap-2">
                                    <Check size={12} className={colorClasses.text} /> Tu información está segura
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
    );
}
