"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, LogIn } from "lucide-react";
import { authService } from "@/services/auth";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPw, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const { error: authError } = await authService.signIn(email, password);
            if (authError) {
                setError("Correo o contraseña incorrectos. Verifica tus datos.");
            } else {
                // Consultar al servidor qué rol tiene el usuario
                const roleRes = await fetch("/api/auth/role");
                const { role } = await roleRes.json();
                if (role === "admin") {
                    window.location.href = "/admin/clientes";
                } else {
                    window.location.href = "/dashboard";
                }
            }
        } catch {
            setError("Error de conexión. Verifica tu internet.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#050505] flex items-center justify-center px-4">
            {/* Fondo decorativo */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/6 rounded-full blur-[120px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative"
            >
                {/* Logo */}
                <div className="text-center mb-8">
                    <a href="/" className="inline-block text-xl font-black tracking-widest text-white mb-6">
                        AMC <span className="text-blue-500 text-[10px]">®</span>
                    </a>
                    <div className="w-14 h-14 rounded-2xl bg-blue-600/15 border border-blue-500/25 flex items-center justify-center mx-auto mb-4">
                        <LogIn className="w-6 h-6 text-blue-400" />
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tighter mb-1">Iniciar Sesión</h1>
                    <p className="text-gray-500 text-sm">Accede a tu panel de cliente AMC Agency</p>
                </div>

                {/* Tarjeta */}
                <div className="p-8 rounded-[28px] bg-white/[0.03] border border-white/8 backdrop-blur-sm">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">
                                Correo Electrónico
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                                <input
                                    type="email" required value={email}
                                    onChange={(e) => { setEmail(e.target.value); setError(""); }}
                                    placeholder="tu@empresa.com"
                                    className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm placeholder:text-gray-700 focus:outline-none focus:border-blue-500 transition-colors"
                                />
                            </div>
                        </div>

                        {/* Contraseña */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Contraseña</label>
                                <a href="/forgot-password" className="text-xs text-blue-500 hover:text-blue-400 transition-colors">
                                    ¿Olvidaste tu contraseña?
                                </a>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                                <input
                                    type={showPw ? "text" : "password"} required value={password}
                                    onChange={(e) => { setPassword(e.target.value); setError(""); }}
                                    placeholder="Tu contraseña"
                                    className="w-full pl-10 pr-10 py-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm placeholder:text-gray-700 focus:outline-none focus:border-blue-500 transition-colors"
                                />
                                <button
                                    type="button" onClick={() => setShowPw(!showPw)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-colors"
                                >
                                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm"
                            >
                                {error}
                            </motion.div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit" disabled={loading}
                            className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black text-sm uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Entrando...</>
                            ) : (
                                <>Iniciar Sesión <ArrowRight className="w-4 h-4" /></>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-white/5 text-center">
                        <p className="text-gray-600 text-sm">
                            ¿No tienes cuenta?{" "}
                            <a href="/registro" className="text-blue-500 hover:text-blue-400 font-bold transition-colors">
                                Registrarse gratis
                            </a>
                        </p>
                    </div>
                </div>

                {/* Badge */}
                <div className="mt-6 flex items-center justify-center gap-2 text-gray-600 text-xs">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Conexión cifrada SSL · tus datos están seguros</span>
                </div>
            </motion.div>
        </main>
    );
}
