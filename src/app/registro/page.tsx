"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import {
    Rocket, Building2, User, Mail, Lock, Phone, Globe,
    Eye, EyeOff, CheckCircle2, ArrowRight, ShieldCheck
} from "lucide-react";

const plans = [
    { id: "renting_basico", label: "Renting Básico", price: "$299k/mes", desc: "Sitio profesional + hosting" },
    { id: "renting_pro", label: "Renting Pro", price: "$499k/mes", desc: "Sitio pro + CRM + SEO" },
    { id: "renting_elite", label: "Renting Élite", price: "$899k/mes", desc: "Suite digital completa" },
];

const perks = [
    "Sitio web profesional en 48 horas",
    "Hosting incluido y gestionado",
    "SSL y optimización SEO",
    "Soporte técnico 24/7",
    "Panel de administración",
];

export default function RegistroPage() {
    const [form, setForm] = useState({
        businessName: "",
        repName: "",
        email: "",
        password: "",
        confirmPassword: "",
        whatsapp: "",
        domain: "",
        plan: "renting_basico",
    });
    const [showPw, setShowPw] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (form.password !== form.confirmPassword) {
            setError("Las contraseñas no coinciden.");
            return;
        }
        if (form.password.length < 8) {
            setError("La contraseña debe tener al menos 8 caracteres.");
            return;
        }
        setLoading(true);
        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    businessName: form.businessName,
                    repName: form.repName,
                    email: form.email,
                    password: form.password,
                    whatsapp: form.whatsapp,
                    domain: form.domain,
                    plan: form.plan,
                }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error ?? "Error al registrarse. Inténtalo de nuevo.");
            } else {
                setSuccess(true);
            }
        } catch {
            setError("Error de conexión. Verifica tu internet.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <main className="min-h-screen bg-[#050505] flex items-center justify-center px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center max-w-md"
                >
                    <div className="w-20 h-20 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tighter mb-4">
                        ¡Cuenta <span className="text-emerald-400">creada!</span>
                    </h1>
                    <p className="text-gray-400 leading-relaxed mb-6">
                        Te enviamos un correo de bienvenida a <strong className="text-white">{form.email}</strong>.
                        Ya puedes iniciar sesión en tu panel de cliente.
                    </p>
                    <a
                        href="/login"
                        className="inline-flex items-center gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-full transition-all text-sm uppercase tracking-widest"
                    >
                        Iniciar Sesión <ArrowRight className="w-4 h-4" />
                    </a>
                </motion.div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#050505] flex">
            {/* PANEL LATERAL IZQUIERDO */}
            <div className="hidden lg:flex lg:w-[420px] xl:w-[480px] flex-col justify-between p-12 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 relative overflow-hidden flex-shrink-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent_60%)]" />
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />

                <div className="relative">
                    <a href="/" className="flex items-center gap-2 mb-12">
                        <span className="text-xl font-black tracking-widest text-white">
                            AMC <span className="text-white/60 text-[10px] tracking-normal">®</span>
                        </span>
                    </a>
                    <div className="mb-8">
                        <Rocket className="w-10 h-10 text-white/80 mb-4" />
                        <h2 className="text-3xl font-black text-white leading-tight tracking-tighter mb-3">
                            ¡Bienvenido a<br />Renting AMC Agency!
                        </h2>
                        <p className="text-blue-200 text-sm leading-relaxed">
                            Estás a un paso de tener tu presencia digital profesional. Regístrate ahora y comienza tu transformación digital.
                        </p>
                    </div>
                    <ul className="space-y-3">
                        {perks.map((perk, i) => (
                            <li key={i} className="flex items-center gap-3 text-sm text-blue-100">
                                <CheckCircle2 className="w-4 h-4 text-white/70 flex-shrink-0" />
                                {perk}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="relative">
                    <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
                        <ShieldCheck className="w-5 h-5 text-white/70 mb-2" />
                        <p className="text-white/80 text-xs leading-relaxed">
                            Tus datos están protegidos con encriptación SSL. Revisamos tu solicitud en menos de 24 horas.
                        </p>
                    </div>
                </div>
            </div>

            {/* FORMULARIO DERECHO */}
            <div className="flex-1 flex items-center justify-center px-4 sm:px-8 py-12 overflow-y-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-lg"
                >
                    {/* Mobile logo */}
                    <div className="lg:hidden text-center mb-8">
                        <a href="/" className="text-xl font-black tracking-widest text-white">
                            AMC <span className="text-blue-500 text-[10px]">®</span>
                        </a>
                    </div>

                    {/* Plan seleccionado (badge) */}
                    <div className="mb-6 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                            <Rocket className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <p className="text-blue-400 text-[10px] font-black uppercase tracking-widest">Plan seleccionado</p>
                            <p className="text-white text-sm font-bold">
                                {plans.find(p => p.id === form.plan)?.label} — {plans.find(p => p.id === form.plan)?.price}
                            </p>
                        </div>
                    </div>

                    <h1 className="text-3xl font-black text-white tracking-tighter mb-1">Crear Cuenta</h1>
                    <p className="text-gray-500 text-sm mb-8">Completa tus datos para comenzar</p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Plan */}
                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Plan *</label>
                            <select
                                name="plan"
                                value={form.plan}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors appearance-none"
                            >
                                {plans.map(p => (
                                    <option key={p.id} value={p.id} className="bg-[#0a0a0a]">
                                        {p.label} — {p.price}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Nombre del Negocio */}
                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Nombre del Negocio *</label>
                            <div className="relative">
                                <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                                <input
                                    type="text" name="businessName" required
                                    value={form.businessName} onChange={handleChange}
                                    placeholder="Ej. Restaurante El Sabor"
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm placeholder:text-gray-700 focus:outline-none focus:border-blue-500 transition-colors"
                                />
                            </div>
                        </div>

                        {/* Representante */}
                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Nombre del Representante *</label>
                            <div className="relative">
                                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                                <input
                                    type="text" name="repName" required
                                    value={form.repName} onChange={handleChange}
                                    placeholder="Ej. Carlos Mendoza"
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm placeholder:text-gray-700 focus:outline-none focus:border-blue-500 transition-colors"
                                />
                            </div>
                        </div>

                        {/* Email y Contraseña */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Correo Electrónico *</label>
                                <div className="relative">
                                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                                    <input
                                        type="email" name="email" required
                                        value={form.email} onChange={handleChange}
                                        placeholder="info@tunegocio.com"
                                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm placeholder:text-gray-700 focus:outline-none focus:border-blue-500 transition-colors"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Contraseña *</label>
                                <div className="relative">
                                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                                    <input
                                        type={showPw ? "text" : "password"} name="password" required minLength={8}
                                        value={form.password} onChange={handleChange}
                                        placeholder="Mínimo 8 caracteres"
                                        className="w-full pl-10 pr-10 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm placeholder:text-gray-700 focus:outline-none focus:border-blue-500 transition-colors"
                                    />
                                    <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400">
                                        {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Confirmar Contraseña y WhatsApp */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Confirmar Contraseña *</label>
                                <div className="relative">
                                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                                    <input
                                        type={showConfirm ? "text" : "password"} name="confirmPassword" required
                                        value={form.confirmPassword} onChange={handleChange}
                                        placeholder="Repite tu contraseña"
                                        className="w-full pl-10 pr-10 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm placeholder:text-gray-700 focus:outline-none focus:border-blue-500 transition-colors"
                                    />
                                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400">
                                        {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider">WhatsApp *</label>
                                <div className="relative">
                                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                                    <input
                                        type="tel" name="whatsapp" required
                                        value={form.whatsapp} onChange={handleChange}
                                        placeholder="Ej. 3001234567"
                                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm placeholder:text-gray-700 focus:outline-none focus:border-blue-500 transition-colors"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Dominio */}
                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Dominio del Sitio Web *</label>
                            <div className="relative">
                                <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                                <input
                                    type="text" name="domain" required
                                    value={form.domain} onChange={handleChange}
                                    placeholder="Ej. www.tunegocio.com"
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm placeholder:text-gray-700 focus:outline-none focus:border-blue-500 transition-colors"
                                />
                            </div>
                            <p className="text-gray-600 text-xs mt-1.5">
                                Es obligatorio para activar la protección de tu sitio.{" "}
                                <a href="/contacto" className="text-blue-500 hover:underline">¿No tienes dominio?</a>{" "}
                                Contáctanos para asignarte uno temporal.
                            </p>
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
                            className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black text-sm uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creando cuenta...</>
                            ) : (
                                <><Rocket className="w-4 h-4" /> Registrarse</>
                            )}
                        </button>

                        <p className="text-center text-gray-600 text-sm">
                            ¿Ya tienes cuenta?{" "}
                            <a href="/login" className="text-blue-500 hover:text-blue-400 font-bold transition-colors">
                                Iniciar Sesión
                            </a>
                        </p>
                    </form>
                </motion.div>
            </div>
        </main>
    );
}
