"use client";
import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
    Users, Globe, ShieldOff, ShieldCheck, LogOut,
    Search, RefreshCw, ExternalLink, Calendar, Phone
} from "lucide-react";
import { type WaasClient } from "@/services/waas";

const planLabels: Record<string, string> = {
    renting_basico: "Básico",
    renting_pro: "Pro",
    renting_elite: "Élite",
    sin_plan: "Sin plan",
};

const planColors: Record<string, string> = {
    renting_basico: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    renting_pro: "text-violet-400 bg-violet-500/10 border-violet-500/20",
    renting_elite: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    sin_plan: "text-gray-500 bg-white/5 border-white/10",
};

export default function AdminClientesPage() {
    const [clients, setClients] = useState<WaasClient[]>([]);
    const [filtered, setFiltered] = useState<WaasClient[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [blocking, setBlocking] = useState<string | null>(null);

    const fetchClients = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/waas/admin/clients");
            if (res.ok) {
                const data = await res.json();
                setClients(data);
                setFiltered(data);
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchClients(); }, [fetchClients]);

    useEffect(() => {
        const q = search.toLowerCase();
        setFiltered(
            clients.filter(c =>
                c.business_name.toLowerCase().includes(q) ||
                c.email.toLowerCase().includes(q) ||
                c.domain.toLowerCase().includes(q)
            )
        );
    }, [search, clients]);

    const handleBlock = async (client: WaasClient) => {
        setBlocking(client.id);
        try {
            const res = await fetch("/api/waas/admin/block", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ clientId: client.id, block: !client.is_blocked }),
            });
            if (res.ok) {
                setClients(prev =>
                    prev.map(c => c.id === client.id ? { ...c, is_blocked: !c.is_blocked } : c)
                );
            }
        } finally {
            setBlocking(null);
        }
    };

    const handleSignOut = async () => {
        await fetch("/api/auth/logout", { method: "POST" }).catch(() => { });
        window.location.href = "/login";
    };

    const activeCount = clients.filter(c => !c.is_blocked).length;
    const blockedCount = clients.filter(c => c.is_blocked).length;

    return (
        <main className="min-h-screen bg-[#050505] text-white">
            {/* NAVBAR ADMIN */}
            <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 py-3 bg-[#050505]/95 border-b border-white/5 backdrop-blur-md">
                <div className="flex items-center gap-4">
                    <a href="/" className="text-sm font-black tracking-widest text-white">
                        AMC <span className="text-blue-500 text-[9px]">®</span>
                    </a>
                    <span className="text-gray-800 text-sm hidden sm:block">|</span>
                    <span className="text-gray-400 text-xs font-bold uppercase tracking-wider hidden sm:block">Panel Admin</span>
                </div>
                <nav className="flex items-center gap-1">
                    <a href="/admin/clientes" className="px-3 py-1.5 rounded-full text-xs font-bold text-blue-400 bg-blue-500/10">
                        Clientes
                    </a>
                    <a href="/admin/integraciones" className="px-3 py-1.5 rounded-full text-xs font-bold text-gray-500 hover:text-white transition-colors">
                        Integraciones
                    </a>
                    <button
                        onClick={handleSignOut}
                        className="ml-2 flex items-center gap-1.5 text-gray-500 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors"
                    >
                        <LogOut className="w-3.5 h-3.5" />
                    </button>
                </nav>
            </nav>

            <div className="pt-16 max-w-7xl mx-auto px-4 sm:px-6 pb-20">
                {/* HEADER */}
                <div className="py-8">
                    <p className="text-xs text-gray-500 font-black uppercase tracking-[0.25em] mb-1">Panel de Control</p>
                    <h1 className="text-3xl font-black tracking-tighter text-white">Clientes WaaS</h1>
                </div>

                {/* STATS CARDS */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: "Total Clientes", value: clients.length, icon: <Users className="w-5 h-5 text-blue-400" />, color: "blue" },
                        { label: "Sitios Activos", value: activeCount, icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />, color: "emerald" },
                        { label: "Suspendidos", value: blockedCount, icon: <ShieldOff className="w-5 h-5 text-red-400" />, color: "red" },
                        { label: "Dominios", value: clients.length, icon: <Globe className="w-5 h-5 text-violet-400" />, color: "violet" },
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.04 }}
                            className="p-5 rounded-[20px] bg-white/[0.03] border border-white/8"
                        >
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center">
                                    {stat.icon}
                                </div>
                                <p className="text-xs text-gray-500 font-bold uppercase tracking-wide">{stat.label}</p>
                            </div>
                            <p className="text-3xl font-black text-white">{stat.value}</p>
                        </motion.div>
                    ))}
                </div>

                {/* TABLA */}
                <div className="rounded-[24px] bg-white/[0.02] border border-white/8 overflow-hidden">
                    {/* Toolbar */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 border-b border-white/5">
                        <div className="relative w-full sm:w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                            <input
                                type="text" value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Buscar negocio, email o dominio..."
                                className="w-full pl-9 pr-4 py-2.5 bg-white/[0.04] border border-white/8 rounded-xl text-white text-sm placeholder:text-gray-700 focus:outline-none focus:border-blue-500/50 transition-colors"
                            />
                        </div>
                        <button
                            onClick={fetchClients}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/8 text-gray-400 hover:text-white text-xs font-bold transition-all"
                        >
                            <RefreshCw className="w-3.5 h-3.5" /> Actualizar
                        </button>
                    </div>

                    {/* Tabla desktop */}
                    <div className="overflow-x-auto">
                        {loading ? (
                            <div className="flex items-center justify-center py-16">
                                <span className="w-6 h-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                            </div>
                        ) : filtered.length === 0 ? (
                            <div className="text-center py-16 text-gray-600">
                                <Users className="w-8 h-8 mx-auto mb-3 opacity-40" />
                                <p className="text-sm">No se encontraron clientes</p>
                            </div>
                        ) : (
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-white/5">
                                        <th className="text-left px-5 py-3 text-xs font-black text-gray-600 uppercase tracking-wider">Negocio</th>
                                        <th className="text-left px-5 py-3 text-xs font-black text-gray-600 uppercase tracking-wider hidden md:table-cell">Dominio</th>
                                        <th className="text-left px-5 py-3 text-xs font-black text-gray-600 uppercase tracking-wider hidden lg:table-cell">Plan</th>
                                        <th className="text-left px-5 py-3 text-xs font-black text-gray-600 uppercase tracking-wider hidden lg:table-cell">Próx. Pago</th>
                                        <th className="text-center px-5 py-3 text-xs font-black text-gray-600 uppercase tracking-wider">Estado</th>
                                        <th className="text-right px-5 py-3 text-xs font-black text-gray-600 uppercase tracking-wider">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/[0.04]">
                                    {filtered.map((client, i) => (
                                        <motion.tr
                                            key={client.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: i * 0.03 }}
                                            className="hover:bg-white/[0.02] transition-colors"
                                        >
                                            {/* Negocio */}
                                            <td className="px-5 py-4">
                                                <div>
                                                    <p className="font-bold text-white">{client.business_name}</p>
                                                    <p className="text-gray-600 text-xs flex items-center gap-1">
                                                        <Phone className="w-3 h-3" />
                                                        {client.whatsapp ?? client.email}
                                                    </p>
                                                </div>
                                            </td>

                                            {/* Dominio */}
                                            <td className="px-5 py-4 hidden md:table-cell">
                                                <a
                                                    href={`https://${client.domain}`} target="_blank" rel="noopener noreferrer"
                                                    className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 transition-colors font-mono text-xs"
                                                >
                                                    {client.domain} <ExternalLink className="w-3 h-3" />
                                                </a>
                                            </td>

                                            {/* Plan */}
                                            <td className="px-5 py-4 hidden lg:table-cell">
                                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black border ${planColors[client.plan] ?? "text-gray-400 bg-white/5 border-white/10"}`}>
                                                    {planLabels[client.plan] ?? client.plan}
                                                </span>
                                            </td>

                                            {/* Fecha pago */}
                                            <td className="px-5 py-4 hidden lg:table-cell">
                                                <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                                                    <Calendar className="w-3 h-3" />
                                                    {client.next_payment_date
                                                        ? new Date(client.next_payment_date).toLocaleDateString("es-CO", { day: "2-digit", month: "short" })
                                                        : "—"}
                                                </div>
                                            </td>

                                            {/* Estado */}
                                            <td className="px-5 py-4 text-center">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black border ${client.is_blocked
                                                    ? "text-red-400 bg-red-500/10 border-red-500/20"
                                                    : "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                                                    }`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${client.is_blocked ? "bg-red-400" : "bg-emerald-400 animate-pulse"}`} />
                                                    {client.is_blocked ? "Suspendido" : "Activo"}
                                                </span>
                                            </td>

                                            {/* Acciones */}
                                            <td className="px-5 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <a
                                                        href={`/admin/clientes/${client.id}`}
                                                        className="px-3 py-1.5 rounded-full text-xs font-bold text-gray-400 border border-white/10 hover:border-white/20 hover:text-white transition-all"
                                                    >
                                                        Ver
                                                    </a>
                                                    <button
                                                        onClick={() => handleBlock(client)}
                                                        disabled={blocking === client.id}
                                                        className={`px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider transition-all disabled:opacity-40 ${client.is_blocked
                                                            ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 hover:bg-emerald-500/25"
                                                            : "bg-red-500/15 text-red-400 border border-red-500/25 hover:bg-red-500/25"
                                                            }`}
                                                    >
                                                        {blocking === client.id ? (
                                                            <span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin inline-block" />
                                                        ) : client.is_blocked ? "Activar" : "Bloquear"}
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
