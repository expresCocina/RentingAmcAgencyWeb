"use client";
import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    MessageSquare, Phone, Mail, RefreshCw, LogOut,
    User, Tag, Clock, CheckCircle, XCircle, ArrowRight, Filter
} from "lucide-react";
import { getAuthHeaders } from "@/lib/auth-headers";
import type { WaasLead } from "@/services/waas";

const statusConfig = {
    new: { label: "Nuevo", color: "text-blue-400 bg-blue-500/10 border-blue-500/20", icon: "🆕" },
    contacted: { label: "Contactado", color: "text-amber-400 bg-amber-500/10 border-amber-500/20", icon: "📞" },
    converted: { label: "Convertido", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20", icon: "✅" },
    lost: { label: "Perdido", color: "text-gray-500 bg-white/5 border-white/10", icon: "❌" },
};

const statusFlow: Record<WaasLead["status"], WaasLead["status"] | null> = {
    new: "contacted",
    contacted: "converted",
    converted: null,
    lost: null,
};

export default function LeadsPage() {
    const [leads, setLeads] = useState<WaasLead[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<WaasLead["status"] | "all">("all");
    const [updating, setUpdating] = useState<string | null>(null);

    const fetchLeads = useCallback(async () => {
        setLoading(true);
        try {
            const headers = await getAuthHeaders();
            const res = await fetch("/api/waas/admin/leads", { headers });
            if (res.ok) setLeads(await res.json());
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchLeads(); }, [fetchLeads]);

    const updateStatus = async (id: string, status: WaasLead["status"]) => {
        setUpdating(id);
        try {
            const headers = await getAuthHeaders();
            await fetch("/api/waas/admin/leads", {
                method: "PATCH",
                headers: { ...headers, "Content-Type": "application/json" },
                body: JSON.stringify({ id, status }),
            });
            setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
        } finally {
            setUpdating(null);
        }
    };

    const markLost = async (id: string) => updateStatus(id, "lost");

    const filtered = filter === "all" ? leads : leads.filter(l => l.status === filter);

    const counts = {
        all: leads.length,
        new: leads.filter(l => l.status === "new").length,
        contacted: leads.filter(l => l.status === "contacted").length,
        converted: leads.filter(l => l.status === "converted").length,
        lost: leads.filter(l => l.status === "lost").length,
    };

    return (
        <main className="min-h-screen bg-[#050508] px-6 py-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <header className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <nav className="flex items-center gap-1 text-xs">
                            <a href="/admin/clientes" className="text-gray-500 hover:text-white transition px-3 py-1.5 rounded-lg hover:bg-white/5">Clientes</a>
                            <a href="/admin/metricas" className="text-gray-500 hover:text-white transition px-3 py-1.5 rounded-lg hover:bg-white/5">Métricas</a>
                            <a href="/admin/leads" className="text-white bg-white/8 px-3 py-1.5 rounded-lg font-semibold">Leads</a>
                        </nav>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={fetchLeads} className="text-gray-500 hover:text-white transition p-2 rounded-lg hover:bg-white/5">
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

                <div className="flex items-center justify-between mb-6">
                    <div>
                        <p className="text-gray-500 text-sm font-semibold uppercase tracking-widest mb-1">Panel de control</p>
                        <h1 className="text-3xl font-black text-white tracking-tight">Leads & Prospectos</h1>
                    </div>
                    <span className="text-xs text-gray-600 bg-white/5 border border-white/8 px-3 py-1.5 rounded-lg">
                        {leads.filter(l => l.status === "new").length} nuevo(s) sin atender
                    </span>
                </div>

                {/* Filtros */}
                <div className="flex items-center gap-2 mb-6 flex-wrap">
                    {(["all", "new", "contacted", "converted", "lost"] as const).map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition border ${filter === f
                                    ? "bg-white/10 border-white/20 text-white"
                                    : "border-white/5 text-gray-500 hover:text-white hover:bg-white/5"
                                }`}
                        >
                            {f === "all" ? <Filter className="w-3 h-3" /> : statusConfig[f].icon}
                            {f === "all" ? "Todos" : statusConfig[f].label}
                            <span className="ml-0.5 text-[10px] opacity-60">{counts[f]}</span>
                        </button>
                    ))}
                </div>

                {/* Lista de leads */}
                {loading ? (
                    <div className="flex items-center justify-center h-48">
                        <div className="w-6 h-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-20">
                        <MessageSquare className="w-10 h-10 text-gray-700 mx-auto mb-3" />
                        <p className="text-gray-600 text-sm">No hay leads en esta categoría</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <AnimatePresence>
                            {filtered.map(lead => {
                                const status = statusConfig[lead.status];
                                const next = statusFlow[lead.status];
                                return (
                                    <motion.div
                                        key={lead.id}
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.97 }}
                                        className="bg-white/[0.03] border border-white/8 rounded-2xl p-5 hover:border-white/15 transition"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex items-start gap-4 flex-1 min-w-0">
                                                {/* Avatar */}
                                                <div className="w-10 h-10 rounded-full bg-blue-600/15 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                                                    <User className="w-4 h-4 text-blue-400" />
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 flex-wrap mb-1">
                                                        <span className="text-white font-bold text-sm">{lead.name}</span>
                                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${status.color}`}>
                                                            {status.icon} {status.label}
                                                        </span>
                                                        {lead.service && (
                                                            <span className="flex items-center gap-1 text-[10px] text-gray-500 bg-white/5 px-2 py-0.5 rounded-full">
                                                                <Tag className="w-2.5 h-2.5" /> {lead.service}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="flex items-center gap-4 flex-wrap mb-2">
                                                        {lead.email && (
                                                            <a href={`mailto:${lead.email}`} className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-400 transition">
                                                                <Mail className="w-3 h-3" /> {lead.email}
                                                            </a>
                                                        )}
                                                        {lead.phone && (
                                                            <a
                                                                href={`https://wa.me/${lead.phone.replace(/\D/g, "")}?text=${encodeURIComponent("Hola " + lead.name + ", gracias por contactarnos. ¿Cómo podemos ayudarte?")}`}
                                                                target="_blank"
                                                                className="flex items-center gap-1 text-xs text-gray-500 hover:text-emerald-400 transition"
                                                            >
                                                                <Phone className="w-3 h-3" /> {lead.phone}
                                                            </a>
                                                        )}
                                                        <span className="flex items-center gap-1 text-xs text-gray-600">
                                                            <Clock className="w-3 h-3" />
                                                            {new Date(lead.created_at).toLocaleDateString("es-CO", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                                                        </span>
                                                    </div>

                                                    {lead.message && (
                                                        <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">"{lead.message}"</p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Acciones */}
                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                {lead.phone && (
                                                    <a
                                                        href={`https://wa.me/${lead.phone.replace(/\D/g, "")}?text=${encodeURIComponent("Hola " + lead.name + ", gracias por contactarnos desde AMC Agency. ¿En qué podemos ayudarte?")}`}
                                                        target="_blank"
                                                        className="w-8 h-8 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-400 hover:bg-emerald-500/20 transition"
                                                        title="WhatsApp"
                                                    >
                                                        <Phone className="w-3.5 h-3.5" />
                                                    </a>
                                                )}
                                                {lead.status === "converted" ? (
                                                    <span className="flex items-center gap-1 text-emerald-400 text-xs font-bold">
                                                        <CheckCircle className="w-4 h-4" /> Convertido
                                                    </span>
                                                ) : lead.status === "lost" ? (
                                                    <span className="flex items-center gap-1 text-gray-600 text-xs">
                                                        <XCircle className="w-4 h-4" /> Perdido
                                                    </span>
                                                ) : (
                                                    <>
                                                        {next && (
                                                            <button
                                                                onClick={() => updateStatus(lead.id, next)}
                                                                disabled={updating === lead.id}
                                                                className="flex items-center gap-1.5 bg-blue-600/15 hover:bg-blue-600/25 border border-blue-500/20 text-blue-400 text-xs font-bold px-3 py-1.5 rounded-lg transition disabled:opacity-50"
                                                            >
                                                                {updating === lead.id ? (
                                                                    <div className="w-3 h-3 border border-blue-400/30 border-t-blue-400 rounded-full animate-spin" />
                                                                ) : (
                                                                    <>
                                                                        {statusConfig[next].icon} {statusConfig[next].label}
                                                                        <ArrowRight className="w-3 h-3" />
                                                                    </>
                                                                )}
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => markLost(lead.id)}
                                                            disabled={updating === lead.id}
                                                            className="w-8 h-8 text-gray-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg flex items-center justify-center transition"
                                                            title="Marcar como perdido"
                                                        >
                                                            <XCircle className="w-4 h-4" />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </main>
    );
}
