"use client";
import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
    TrendingUp, Users, ShieldCheck, ShieldOff,
    CreditCard, Clock, AlertTriangle, UserPlus,
    MessageSquare, RefreshCw, LogOut,
    type LucideIcon
} from "lucide-react";
import { getAuthHeaders } from "@/lib/auth-headers";
import type { WaasMetrics } from "@/services/waas";

function StatCard({
    icon: Icon, label, value, color, sub
}: {
    icon: LucideIcon; label: string; value: string | number;
    color: string; sub?: string;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/[0.03] border border-white/8 rounded-2xl p-5 flex flex-col gap-3"
        >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
                <Icon className="w-5 h-5" />
            </div>
            <div>
                <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">{label}</p>
                <p className="text-2xl font-black text-white">{value}</p>
                {sub && <p className="text-gray-600 text-xs mt-1">{sub}</p>}
            </div>
        </motion.div>
    );
}

export default function MetricasPage() {
    const [metrics, setMetrics] = useState<WaasMetrics | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchMetrics = useCallback(async () => {
        setLoading(true);
        try {
            const headers = await getAuthHeaders();
            const res = await fetch("/api/waas/admin/metrics", { headers });
            if (res.ok) setMetrics(await res.json());
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchMetrics(); }, [fetchMetrics]);

    const formatCOP = (n: number) =>
        new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);

    return (
        <main className="min-h-screen bg-[#050508] px-6 py-8">
            {/* Header */}
            <div className="max-w-7xl mx-auto">
                <header className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <a href="/admin/clientes" className="text-gray-600 hover:text-white transition text-sm">← Clientes</a>
                        <span className="text-gray-700">·</span>
                        <nav className="flex items-center gap-1 text-xs">
                            <a href="/admin/clientes" className="text-gray-500 hover:text-white transition px-3 py-1.5 rounded-lg hover:bg-white/5">Clientes</a>
                            <a href="/admin/metricas" className="text-white bg-white/8 px-3 py-1.5 rounded-lg font-semibold">Métricas</a>
                            <a href="/admin/leads" className="text-gray-500 hover:text-white transition px-3 py-1.5 rounded-lg hover:bg-white/5">Leads</a>
                        </nav>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={fetchMetrics} className="text-gray-500 hover:text-white transition p-2 rounded-lg hover:bg-white/5">
                            <RefreshCw className="w-4 h-4" />
                        </button>
                        <button
                            onClick={async () => { const { createClient } = await import("@/lib/supabase/client"); await createClient().auth.signOut(); window.location.href = "/login"; }}
                            className="flex items-center gap-2 text-gray-600 hover:text-red-400 transition text-xs"
                        >
                            <LogOut className="w-4 h-4" /> Salir
                        </button>
                    </div>
                </header>

                <div className="mb-8">
                    <p className="text-gray-500 text-sm font-semibold uppercase tracking-widest mb-1">Panel de control</p>
                    <h1 className="text-3xl font-black text-white tracking-tight">Métricas del Negocio</h1>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="w-6 h-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                    </div>
                ) : metrics ? (
                    <>
                        {/* MRR destacado */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.97 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mb-6 bg-gradient-to-br from-blue-600/15 via-blue-500/5 to-transparent border border-blue-500/20 rounded-2xl p-6"
                        >
                            <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-2">💰 Ingreso Mensual Recurrente</p>
                            <p className="text-4xl font-black text-white">{formatCOP(metrics.mrr)}</p>
                            <p className="text-blue-400/60 text-sm mt-1">{metrics.paying_clients} clientes pagando activamente</p>
                        </motion.div>

                        {/* Grid de stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <StatCard icon={Users} label="Total Clientes" value={metrics.total_clients} color="bg-gray-500/10 text-gray-400" />
                            <StatCard icon={ShieldCheck} label="Sitios Activos" value={metrics.active_clients} color="bg-emerald-500/10 text-emerald-400" />
                            <StatCard icon={ShieldOff} label="Suspendidos" value={metrics.suspended_clients} color="bg-red-500/10 text-red-400" />
                            <StatCard icon={UserPlus} label="Nuevos este mes" value={metrics.new_this_month} color="bg-violet-500/10 text-violet-400" />
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <StatCard icon={CreditCard} label="Pagando" value={metrics.paying_clients} color="bg-emerald-500/10 text-emerald-400" sub="payment_status = active" />
                            <StatCard icon={Clock} label="Pendiente pago" value={metrics.pending_clients} color="bg-amber-500/10 text-amber-400" sub="payment_status = pending" />
                            <StatCard icon={AlertTriangle} label="Vencidos" value={metrics.overdue_clients} color="bg-red-500/10 text-red-400" sub="payment_status = overdue" />
                            <StatCard icon={MessageSquare} label="Leads nuevos" value={metrics.new_leads} color="bg-blue-500/10 text-blue-400" sub={`de ${metrics.total_leads} totales`} />
                        </div>

                        {/* Tabla de resumen */}
                        <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6">
                            <h2 className="text-sm font-bold text-white mb-4">Resumen de Cobranza</h2>
                            <div className="space-y-3">
                                {[
                                    { label: "Clientes pagando activamente", value: metrics.paying_clients, color: "bg-emerald-500" },
                                    { label: "Pendientes de pago", value: metrics.pending_clients, color: "bg-amber-500" },
                                    { label: "Pagos vencidos", value: metrics.overdue_clients, color: "bg-red-500" },
                                ].map(row => (
                                    <div key={row.label} className="flex items-center gap-3">
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-gray-400 text-xs">{row.label}</span>
                                                <span className="text-white text-xs font-bold">{row.value}</span>
                                            </div>
                                            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full ${row.color} rounded-full transition-all duration-700`}
                                                    style={{ width: metrics.total_clients ? `${(row.value / metrics.total_clients) * 100}%` : "0%" }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-20 text-gray-600">No se pudieron cargar las métricas</div>
                )}
            </div>
        </main>
    );
}
