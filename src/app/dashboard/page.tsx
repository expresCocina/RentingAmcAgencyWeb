"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    Globe, ShieldCheck, ShieldOff, Calendar, Package2,
    LogOut, Headphones, Bell, Copy, Check, AlertTriangle
} from "lucide-react";
import { authService } from "@/services/auth";
import { type WaasClient } from "@/services/waas";
import { getAuthHeaders } from "@/lib/auth-headers";

function StatCard({ icon, label, value, accent = false }: { icon: React.ReactNode; label: string; value: string; accent?: boolean }) {
    return (
        <div className={`p-5 rounded-[20px] border transition-all ${accent ? "bg-blue-500/10 border-blue-500/20" : "bg-white/[0.03] border-white/8"}`}>
            <div className="flex items-center gap-3 mb-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${accent ? "bg-blue-500/20" : "bg-white/5"}`}>
                    {icon}
                </div>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">{label}</p>
            </div>
            <p className="text-white font-black text-lg tracking-tight">{value}</p>
        </div>
    );
}

export default function DashboardPage() {
    const [client, setClient] = useState<WaasClient | null>(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const headers = await getAuthHeaders();
                const res = await fetch("/api/waas/my-client", { headers });
                if (res.status === 401) {
                    window.location.href = "/login";
                    return;
                }
                if (res.ok) {
                    const data = await res.json();
                    setClient(data);
                }
            } catch {
                // Si hay error de red, redirigir al login
                window.location.href = "/login";
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const handleSignOut = async () => {
        await authService.signOut();
        window.location.href = "/login";
    };

    const copyScript = () => {
        if (!client) return;
        const script = `<!-- AMC Agency WaaS Lock -->\n<script src="https://amcagencyweb.com/waas-lock.js?domain=https://${client.domain}/"></script>`;
        navigator.clipboard.writeText(script);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const planLabels: Record<string, string> = {
        renting_basico: "Renting Básico",
        renting_pro: "Renting Pro",
        renting_elite: "Renting Élite",
        sin_plan: "Sin plan asignado",
    };

    if (loading) {
        return (
            <main className="min-h-screen bg-[#050505] flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <span className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                    <p className="text-gray-500 text-sm">Cargando tu panel...</p>
                </div>
            </main>
        );
    }

    if (!client) {
        return (
            <main className="min-h-screen bg-[#050505] flex items-center justify-center px-4">
                <div className="text-center max-w-md">
                    <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto mb-4" />
                    <h2 className="text-xl font-black text-white mb-2">Perfil no encontrado</h2>
                    <p className="text-gray-400 text-sm mb-4">No encontramos tu perfil de cliente. Contacta al soporte.</p>
                    <button onClick={handleSignOut} className="px-6 py-2.5 bg-white/10 text-white font-bold rounded-full text-sm">
                        Cerrar Sesión
                    </button>
                </div>
            </main>
        );
    }

    const nextDate = client.next_payment_date
        ? new Date(client.next_payment_date).toLocaleDateString("es-CO", { day: "2-digit", month: "long", year: "numeric" })
        : "No definida";

    return (
        <main className="min-h-screen bg-[#050505] text-white">
            {/* NAVBAR */}
            <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 py-3 bg-[#050505]/90 backdrop-blur-md border-b border-white/5">
                <a href="/" className="text-sm font-black tracking-widest text-white">
                    AMC <span className="text-blue-500 text-[9px]">®</span>
                </a>
                <div className="flex items-center gap-3">
                    <span className="text-gray-400 text-xs font-semibold hidden sm:block">{client.business_name}</span>
                    <button
                        onClick={handleSignOut}
                        className="flex items-center gap-1.5 text-gray-400 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors"
                    >
                        <LogOut className="w-3.5 h-3.5" /> Salir
                    </button>
                </div>
            </nav>

            <div className="pt-20 max-w-5xl mx-auto px-4 sm:px-6 pb-20">
                {/* HEADER */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-[0.25em] mb-1">Panel del Cliente</p>
                    <h1 className="text-3xl font-black tracking-tighter text-white">
                        Hola, <span className="text-blue-500">{client.rep_name.split(" ")[0]}</span> 👋
                    </h1>
                </motion.div>

                {/* ESTADO DEL SITIO */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
                    className={`mb-6 p-6 rounded-[24px] border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${client.is_blocked
                        ? "bg-red-500/8 border-red-500/25"
                        : "bg-emerald-500/8 border-emerald-500/25"
                        }`}
                >
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${client.is_blocked ? "bg-red-500/20" : "bg-emerald-500/20"}`}>
                            {client.is_blocked ? <ShieldOff className="w-6 h-6 text-red-400" /> : <ShieldCheck className="w-6 h-6 text-emerald-400" />}
                        </div>
                        <div>
                            <p className="text-white font-black text-lg tracking-tight">
                                Tu sitio está{" "}
                                <span className={client.is_blocked ? "text-red-400" : "text-emerald-400"}>
                                    {client.is_blocked ? "Suspendido" : "Activo "}
                                </span>
                                {!client.is_blocked && "✓"}
                            </p>
                            <p className={`text-sm font-light ${client.is_blocked ? "text-red-300" : "text-emerald-300"}`}>
                                {client.is_blocked
                                    ? "Contacta a AMC Agency para reactivar tu servicio"
                                    : `Dominio: ${client.domain}`}
                            </p>
                        </div>
                    </div>
                    {client.is_blocked && (
                        <a
                            href="https://wa.me/573001234567"
                            target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-2 px-5 py-2.5 bg-red-500 hover:bg-red-400 text-white font-bold text-xs uppercase tracking-widest rounded-full transition-all flex-shrink-0"
                        >
                            Reactivar Sitio
                        </a>
                    )}
                </motion.div>

                {/* STATS */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <StatCard
                        icon={<Package2 className="w-4.5 h-4.5 text-blue-400" />}
                        label="Plan Activo"
                        value={planLabels[client.plan] ?? client.plan}
                        accent
                    />
                    <StatCard
                        icon={<Calendar className="w-4.5 h-4.5 text-amber-400" />}
                        label="Próximo Pago"
                        value={nextDate}
                    />
                    <StatCard
                        icon={<Globe className="w-4.5 h-4.5 text-violet-400" />}
                        label="Dominio"
                        value={client.domain}
                    />
                </div>

                {/* SOPORTE */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                    className="p-6 rounded-[24px] bg-gradient-to-br from-blue-500/10 to-indigo-500/5 border border-blue-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-2xl bg-blue-500/20 flex items-center justify-center">
                            <Headphones className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                            <p className="text-white font-bold">¿Necesitas ayuda?</p>
                            <p className="text-gray-400 text-sm">Soporte disponible 24/7 para clientes activos</p>
                        </div>
                    </div>
                    <a
                        href={`https://wa.me/573001234567?text=Hola%2C+soy+${encodeURIComponent(client.rep_name)}+de+${encodeURIComponent(client.business_name)}+y+necesito+ayuda`}
                        target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-widest rounded-full transition-all shadow-lg shadow-blue-500/20 flex-shrink-0"
                    >
                        <Bell className="w-3.5 h-3.5" /> Contactar Soporte
                    </a>
                </motion.div>
            </div>
        </main>
    );
}
