"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Zap, Clock, Tag } from "lucide-react";

const STORAGE_KEY = "amc_discount_dismissed";
const DISCOUNT_CODE = "AMC20";

/**
 * DiscountPopup — Popup de descuento del 20% que aparece después de 8 segundos.
 * Captura el email del usuario, lo guarda como lead en Supabase y muestra el código.
 * Se muestra solo una vez por sesión (localStorage).
 */
export function DiscountPopup() {
    const [visible, setVisible] = useState(false);
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [timeLeft, setTimeLeft] = useState(24 * 60 * 60); // 24h en segundos
    const [copied, setCopied] = useState(false);

    // Mostrar el popup después de 8s si no fue cerrado previamente
    useEffect(() => {
        const dismissed = sessionStorage.getItem(STORAGE_KEY);
        if (dismissed) return;

        const timer = setTimeout(() => setVisible(true), 8000);
        return () => clearTimeout(timer);
    }, []);

    // Countdown de 24 horas
    useEffect(() => {
        if (!visible || success) return;
        const interval = setInterval(() => {
            setTimeLeft((t) => (t > 0 ? t - 1 : 0));
        }, 1000);
        return () => clearInterval(interval);
    }, [visible, success]);

    const formatTime = (secs: number) => {
        const h = Math.floor(secs / 3600).toString().padStart(2, "0");
        const m = Math.floor((secs % 3600) / 60).toString().padStart(2, "0");
        const s = (secs % 60).toString().padStart(2, "0");
        return { h, m, s };
    };

    const { h, m, s } = formatTime(timeLeft);

    const handleDismiss = () => {
        setVisible(false);
        sessionStorage.setItem(STORAGE_KEY, "1");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || loading) return;
        setLoading(true);
        try {
            await fetch("/api/leads", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: email.split("@")[0],
                    email,
                    service: "[DESCUENTO 20%] Código AMC20",
                    message: `Usuario solicitó código de descuento 20% con email: ${email}`,
                    source: "discount_popup",
                }),
            });
            setSuccess(true);
            sessionStorage.setItem(STORAGE_KEY, "1");
        } catch {
            // Mostrar éxito igual (no bloquear por errores de red)
            setSuccess(true);
        } finally {
            setLoading(false);
        }
    };

    const copyCode = () => {
        navigator.clipboard.writeText(DISCOUNT_CODE);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <AnimatePresence>
            {visible && (
                <>
                    {/* Overlay */}
                    <motion.div
                        key="overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]"
                        onClick={handleDismiss}
                    />

                    {/* Modal */}
                    <motion.div
                        key="modal"
                        initial={{ opacity: 0, scale: 0.85, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
                        className="fixed inset-0 z-[201] flex items-center justify-center p-4 pointer-events-none"
                    >
                        <div className="relative w-full max-w-md bg-[#0a0a0f] border border-white/10 rounded-[32px] shadow-2xl shadow-blue-500/10 overflow-hidden pointer-events-auto">

                            {/* Fondo decorativo */}
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-indigo-600/5 to-transparent" />
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />

                            {/* Botón cerrar */}
                            <button
                                onClick={handleDismiss}
                                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-500 hover:text-white transition-all"
                            >
                                <X className="w-4 h-4" />
                            </button>

                            <div className="relative p-8">
                                {!success ? (
                                    <>
                                        {/* Badge */}
                                        <div className="flex items-center gap-2 mb-5">
                                            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400 text-[10px] font-black tracking-[0.2em] uppercase">
                                                <Zap className="w-3 h-3" /> Oferta Exclusiva
                                            </span>
                                            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-black tracking-[0.2em] uppercase">
                                                <Clock className="w-3 h-3" /> Tiempo limitado
                                            </span>
                                        </div>

                                        {/* Título */}
                                        <h2 className="text-4xl font-black tracking-tighter text-white mb-1">
                                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
                                                20% OFF
                                            </span>{" "}
                                            en tu plan
                                        </h2>
                                        <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                                            Suscríbete ahora y obtén un <strong className="text-white">20% de descuento</strong> en cualquier plan de renting web. Solo por las próximas:
                                        </p>

                                        {/* Countdown */}
                                        <div className="flex gap-3 justify-center mb-7">
                                            {[
                                                { val: h, label: "Horas" },
                                                { val: m, label: "Min" },
                                                { val: s, label: "Seg" },
                                            ].map(({ val, label }) => (
                                                <div key={label} className="flex flex-col items-center">
                                                    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                                                        <span className="text-2xl font-black text-white tabular-nums">{val}</span>
                                                    </div>
                                                    <span className="text-gray-600 text-[10px] font-bold tracking-widest uppercase mt-1">
                                                        {label}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Form */}
                                        <form onSubmit={handleSubmit} className="space-y-3">
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="tu@email.com"
                                                required
                                                className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-600 text-sm focus:outline-none focus:border-blue-500/50 focus:bg-white/8 transition-all"
                                            />
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-sm tracking-widest uppercase transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 disabled:opacity-60"
                                            >
                                                {loading ? "Procesando..." : "🎁 Reclamar mi 20% de Descuento"}
                                            </button>
                                        </form>

                                        <p className="text-gray-700 text-[10px] text-center mt-4">
                                            Sin compromisos. Aplica a cualquier plan de renting digital.
                                        </p>
                                    </>
                                ) : (
                                    /* Estado éxito */
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="text-center py-4"
                                    >
                                        <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto mb-5">
                                            <span className="text-3xl">🎉</span>
                                        </div>
                                        <h3 className="text-2xl font-black text-white mb-2">¡Tu descuento está listo!</h3>
                                        <p className="text-gray-400 text-sm mb-6">
                                            Comparte este código al contratar tu plan y obtén el <strong className="text-white">20% de descuento</strong>.
                                        </p>

                                        {/* Código */}
                                        <div className="flex items-center gap-3 bg-white/5 border border-blue-500/30 rounded-2xl p-4 mb-6">
                                            <Tag className="w-5 h-5 text-blue-400 flex-shrink-0" />
                                            <span className="text-2xl font-black tracking-[0.3em] text-blue-400 flex-1 text-left">
                                                {DISCOUNT_CODE}
                                            </span>
                                            <button
                                                onClick={copyCode}
                                                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all"
                                            >
                                                {copied ? "✓ Copiado" : "Copiar"}
                                            </button>
                                        </div>

                                        <a
                                            href="#renting"
                                            onClick={handleDismiss}
                                            className="block w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-sm tracking-widest uppercase transition-all shadow-lg shadow-blue-500/25"
                                        >
                                            Ver Planes →
                                        </a>
                                        <p className="text-gray-700 text-[10px] mt-3">
                                            Válido por 24 horas. Comunica el código al contratar.
                                        </p>
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
