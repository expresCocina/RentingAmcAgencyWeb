"use client";
import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Users, Globe, ShieldOff, ShieldCheck, LogOut,
    Search, RefreshCw, ExternalLink, Calendar, Phone, Plus, X,
    MessageCircle, DollarSign, TrendingUp, Filter, Edit2, Check
} from "lucide-react";
import { type WaasClient } from "@/services/waas";
import { getAuthHeaders } from "@/lib/auth-headers";

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

const paymentStatusConfig = {
    active: { label: "Pagando ✅", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
    pending: { label: "Pendiente ⚠️", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
    overdue: { label: "Vencido 🔴", color: "text-red-400 bg-red-500/10 border-red-500/20" },
};

type FilterType = "all" | "active" | "blocked" | "overdue";

export default function AdminClientesPage() {
    const [clients, setClients] = useState<WaasClient[]>([]);
    const [filtered, setFiltered] = useState<WaasClient[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filterTab, setFilterTab] = useState<FilterType>("all");
    const [blocking, setBlocking] = useState<string | null>(null);
    const [showCreate, setShowCreate] = useState(false);
    const [creating, setCreating] = useState(false);
    const [createError, setCreateError] = useState("");

    // Estado para edición de precio
    const [editingPrice, setEditingPrice] = useState<string | null>(null);
    const [priceInput, setPriceInput] = useState("");
    const [savingPrice, setSavingPrice] = useState(false);

    // Estado para modal WhatsApp
    const [waModal, setWaModal] = useState<WaasClient | null>(null);
    const [waMessage, setWaMessage] = useState("");
    const [sendingWa, setSendingWa] = useState(false);

    const [form, setForm] = useState({
        businessName: "", repName: "", email: "",
        domain: "", whatsapp: "", plan: "sin_plan",
        billingDay: new Date().getDate(), notes: "",
        monthlyPrice: 0,
    });

    const fetchClients = useCallback(async () => {
        setLoading(true);
        try {
            const headers = await getAuthHeaders();
            const res = await fetch("/api/waas/admin/clients", { headers });
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
        let base = clients;
        if (filterTab === "active") base = base.filter(c => !c.is_blocked);
        else if (filterTab === "blocked") base = base.filter(c => c.is_blocked);
        else if (filterTab === "overdue") base = base.filter(c => c.payment_status === "overdue");

        const q = search.toLowerCase();
        if (q) {
            base = base.filter(c =>
                c.business_name.toLowerCase().includes(q) ||
                c.email.toLowerCase().includes(q) ||
                c.domain.toLowerCase().includes(q)
            );
        }
        setFiltered(base);
    }, [search, clients, filterTab]);

    const handleBlock = async (client: WaasClient) => {
        setBlocking(client.id);
        try {
            const headers = await getAuthHeaders();
            const res = await fetch("/api/waas/admin/block", {
                method: "POST",
                headers: { "Content-Type": "application/json", ...headers },
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

    // Guardar precio mensual
    const savePrice = async (clientId: string) => {
        setSavingPrice(true);
        try {
            const headers = await getAuthHeaders();
            const price = parseInt(priceInput.replace(/\D/g, "")) || 0;
            await fetch("/api/waas/admin/update-client", {
                method: "PATCH",
                headers: { "Content-Type": "application/json", ...headers },
                body: JSON.stringify({ id: clientId, monthly_price: price }),
            });
            setClients(prev => prev.map(c => c.id === clientId ? { ...c, monthly_price: price } : c));
            setEditingPrice(null);
        } finally {
            setSavingPrice(false);
        }
    };

    // Cambiar estado de pago
    const updatePaymentStatus = async (clientId: string, status: WaasClient["payment_status"]) => {
        const headers = await getAuthHeaders();
        await fetch("/api/waas/admin/update-client", {
            method: "PATCH",
            headers: { "Content-Type": "application/json", ...headers },
            body: JSON.stringify({ id: clientId, payment_status: status }),
        });
        setClients(prev => prev.map(c => c.id === clientId ? { ...c, payment_status: status } : c));
    };

    // Enviar WhatsApp
    const handleSendWhatsApp = async () => {
        if (!waModal || !waMessage.trim()) return;
        setSendingWa(true);
        try {
            const headers = await getAuthHeaders();
            const res = await fetch("/api/waas/admin/whatsapp-notify", {
                method: "POST",
                headers: { "Content-Type": "application/json", ...headers },
                body: JSON.stringify({ clientId: waModal.id, message: waMessage }),
            });
            if (res.ok) {
                const { url } = await res.json();
                window.open(url, "_blank");
                setWaModal(null);
                setWaMessage("");
            }
        } finally {
            setSendingWa(false);
        }
    };

    const handleCreateClient = async () => {
        if (!form.businessName || !form.repName || !form.email || !form.domain) {
            setCreateError("Completa los campos requeridos"); return;
        }
        setCreating(true); setCreateError("");
        const headers = await getAuthHeaders();
        const res = await fetch("/api/waas/admin/create-client", {
            method: "POST",
            headers: { "Content-Type": "application/json", ...headers },
            body: JSON.stringify(form),
        });
        if (res.ok) {
            setShowCreate(false);
            setForm({ businessName: "", repName: "", email: "", domain: "", whatsapp: "", plan: "sin_plan", billingDay: new Date().getDate(), notes: "", monthlyPrice: 0 });
            await fetchClients();
        } else {
            const d = await res.json();
            setCreateError(d.error ?? "Error al crear cliente");
        }
        setCreating(false);
    };

    const activeCount = clients.filter(c => !c.is_blocked).length;
    const blockedCount = clients.filter(c => c.is_blocked).length;
    const payingCount = clients.filter(c => c.payment_status === "active").length;
    const mrr = clients.filter(c => c.payment_status === "active").reduce((s, c) => s + (c.monthly_price ?? 0), 0);

    const tabs: { id: FilterType; label: string; count: number }[] = [
        { id: "all", label: "Todos", count: clients.length },
        { id: "active", label: "Activos", count: activeCount },
        { id: "blocked", label: "Suspendidos", count: blockedCount },
        { id: "overdue", label: "Vencidos", count: clients.filter(c => c.payment_status === "overdue").length },
    ];

    const formatCOP = (n: number) =>
        n ? new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n) : "—";

    return (
        <>
            <main className="min-h-screen bg-[#050505] text-white">
                {/* NAVBAR */}
                <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 py-3 bg-[#050505]/95 border-b border-white/5 backdrop-blur-md">
                    <div className="flex items-center gap-4">
                        <a href="/" className="text-sm font-black tracking-widest text-white">
                            AMC <span className="text-blue-500 text-[9px]">®</span>
                        </a>
                        <span className="text-gray-800 text-sm hidden sm:block">|</span>
                        <span className="text-gray-400 text-xs font-bold uppercase tracking-wider hidden sm:block">Panel Admin</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <a href="/admin/clientes" className="px-3 py-1.5 rounded-full text-xs font-bold text-blue-400 bg-blue-500/10">
                            Clientes
                        </a>
                        <a href="/admin/metricas" className="px-3 py-1.5 rounded-full text-xs font-bold text-gray-500 hover:text-white transition-colors">
                            Métricas
                        </a>
                        <a href="/admin/leads" className="px-3 py-1.5 rounded-full text-xs font-bold text-gray-500 hover:text-white transition-colors">
                            Leads
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
                    </div>
                </nav>

                <div className="pt-16 max-w-7xl mx-auto px-4 sm:px-6 pb-20">
                    {/* HEADER */}
                    <div className="py-8 flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500 font-black uppercase tracking-[0.25em] mb-1">Panel de Control</p>
                            <h1 className="text-3xl font-black tracking-tighter text-white">Clientes WaaS</h1>
                        </div>
                        <button
                            onClick={() => setShowCreate(true)}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-500/20"
                        >
                            <Plus className="w-3.5 h-3.5" /> Nuevo cliente
                        </button>
                    </div>

                    {/* STATS CARDS */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        {[
                            { label: "Total Clientes", value: clients.length, icon: <Users className="w-5 h-5 text-blue-400" /> },
                            { label: "Sitios Activos", value: activeCount, icon: <ShieldCheck className="w-5 h-5 text-emerald-400" /> },
                            { label: "Suspendidos", value: blockedCount, icon: <ShieldOff className="w-5 h-5 text-red-400" /> },
                            { label: "Clientes Pagando", value: payingCount, icon: <DollarSign className="w-5 h-5 text-violet-400" /> },
                        ].map((stat, i) => (
                            <motion.div
                                key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.04 }}
                                className="p-5 rounded-[20px] bg-white/[0.03] border border-white/8"
                            >
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center">{stat.icon}</div>
                                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wide">{stat.label}</p>
                                </div>
                                <p className="text-3xl font-black text-white">{stat.value}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* MRR banner */}
                    {mrr > 0 && (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="mb-6 flex items-center gap-3 bg-emerald-500/5 border border-emerald-500/15 rounded-2xl px-5 py-3"
                        >
                            <TrendingUp className="w-4 h-4 text-emerald-400" />
                            <span className="text-emerald-400 text-sm font-bold">MRR actual:</span>
                            <span className="text-white font-black">{formatCOP(mrr)}</span>
                            <span className="text-gray-600 text-xs">/ mes de clientes activos</span>
                            <a href="/admin/metricas" className="ml-auto text-xs text-emerald-500 hover:text-emerald-400 transition">Ver métricas →</a>
                        </motion.div>
                    )}

                    {/* TABLA */}
                    <div className="rounded-[24px] bg-white/[0.02] border border-white/8 overflow-hidden">
                        {/* Toolbar */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 border-b border-white/5">
                            <div className="flex items-center gap-2 flex-wrap">
                                {/* Tabs filtro */}
                                {tabs.map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setFilterTab(tab.id)}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${filterTab === tab.id
                                            ? "bg-white/10 text-white"
                                            : "text-gray-600 hover:text-white hover:bg-white/5"
                                            }`}
                                    >
                                        <Filter className="w-3 h-3" />
                                        {tab.label}
                                        <span className="text-[10px] opacity-60">{tab.count}</span>
                                    </button>
                                ))}
                            </div>
                            <div className="flex items-center gap-2 w-full sm:w-auto">
                                <div className="relative flex-1 sm:w-64">
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
                                    className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-white/5 border border-white/8 text-gray-400 hover:text-white text-xs font-bold transition-all"
                                >
                                    <RefreshCw className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>

                        {/* Tabla */}
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
                                            <th className="text-left px-5 py-3 text-xs font-black text-gray-600 uppercase tracking-wider hidden lg:table-cell">Precio/mes</th>
                                            <th className="text-left px-5 py-3 text-xs font-black text-gray-600 uppercase tracking-wider hidden xl:table-cell">Próx. Pago</th>
                                            <th className="text-left px-5 py-3 text-xs font-black text-gray-600 uppercase tracking-wider hidden md:table-cell">Pago</th>
                                            <th className="text-center px-5 py-3 text-xs font-black text-gray-600 uppercase tracking-wider">Estado</th>
                                            <th className="text-right px-5 py-3 text-xs font-black text-gray-600 uppercase tracking-wider">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/[0.04]">
                                        {filtered.map((client, i) => (
                                            <motion.tr
                                                key={client.id}
                                                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
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

                                                {/* Precio editable */}
                                                <td className="px-5 py-4 hidden lg:table-cell">
                                                    {editingPrice === client.id ? (
                                                        <div className="flex items-center gap-1">
                                                            <input
                                                                autoFocus
                                                                type="text"
                                                                value={priceInput}
                                                                onChange={e => setPriceInput(e.target.value)}
                                                                onKeyDown={e => { if (e.key === "Enter") savePrice(client.id); if (e.key === "Escape") setEditingPrice(null); }}
                                                                className="w-24 px-2 py-1 bg-white/10 border border-blue-500/40 rounded-lg text-white text-xs focus:outline-none"
                                                                placeholder="0"
                                                            />
                                                            <button
                                                                onClick={() => savePrice(client.id)}
                                                                disabled={savingPrice}
                                                                className="w-6 h-6 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 rounded-md flex items-center justify-center text-emerald-400 transition"
                                                            >
                                                                {savingPrice ? <div className="w-3 h-3 border border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin" /> : <Check className="w-3 h-3" />}
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={() => { setEditingPrice(client.id); setPriceInput(String(client.monthly_price ?? 0)); }}
                                                            className="flex items-center gap-1.5 text-gray-400 hover:text-white text-xs group transition"
                                                        >
                                                            <span className="font-mono">{client.monthly_price ? formatCOP(client.monthly_price) : "—"}</span>
                                                            <Edit2 className="w-3 h-3 opacity-0 group-hover:opacity-60 transition" />
                                                        </button>
                                                    )}
                                                </td>

                                                {/* Fecha pago */}
                                                <td className="px-5 py-4 hidden xl:table-cell">
                                                    <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                                                        <Calendar className="w-3 h-3" />
                                                        {client.next_payment_date
                                                            ? new Date(client.next_payment_date).toLocaleDateString("es-CO", { day: "2-digit", month: "short" })
                                                            : "—"}
                                                    </div>
                                                </td>

                                                {/* Estado de pago (editable) */}
                                                <td className="px-5 py-4 hidden md:table-cell">
                                                    <select
                                                        value={client.payment_status ?? "pending"}
                                                        onChange={e => updatePaymentStatus(client.id, e.target.value as WaasClient["payment_status"])}
                                                        className={`text-[10px] font-black px-2 py-1 rounded-full border appearance-none cursor-pointer bg-transparent transition ${paymentStatusConfig[client.payment_status as keyof typeof paymentStatusConfig]?.color ?? paymentStatusConfig.pending.color}`}
                                                    >
                                                        <option value="active">Pagando ✅</option>
                                                        <option value="pending">Pendiente ⚠️</option>
                                                        <option value="overdue">Vencido 🔴</option>
                                                    </select>
                                                </td>

                                                {/* Estado activo/suspendido */}
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
                                                        {/* WhatsApp */}
                                                        {client.whatsapp && (
                                                            <button
                                                                onClick={() => {
                                                                    setWaModal(client);
                                                                    setWaMessage(`Hola ${client.business_name}, te escribimos desde AMC Agency.`);
                                                                }}
                                                                className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 hover:bg-emerald-500/20 transition"
                                                                title="Enviar WhatsApp"
                                                            >
                                                                <MessageCircle className="w-3.5 h-3.5" />
                                                            </button>
                                                        )}
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

            {/* MODAL WHATSAPP */}
            <AnimatePresence>
                {waModal && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                        onClick={(e) => { if (e.target === e.currentTarget) setWaModal(null); }}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-[28px] shadow-2xl overflow-hidden"
                        >
                            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                                <div>
                                    <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest">WhatsApp</p>
                                    <h2 className="text-white font-black text-lg">Notificar a {waModal.business_name}</h2>
                                </div>
                                <button onClick={() => setWaModal(null)} className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all">
                                    <X className="w-4 h-4 text-gray-400" />
                                </button>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="flex items-center gap-2 text-xs text-gray-500 bg-white/3 rounded-xl px-4 py-3 border border-white/5">
                                    <Phone className="w-3.5 h-3.5 text-emerald-500" />
                                    <span>Para:</span>
                                    <span className="text-white font-mono">{waModal.whatsapp}</span>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Mensaje</label>
                                    <textarea
                                        value={waMessage}
                                        onChange={e => setWaMessage(e.target.value)}
                                        rows={4}
                                        className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm placeholder:text-gray-700 focus:outline-none focus:border-emerald-500/60 transition resize-none"
                                        placeholder="Escribe tu mensaje..."
                                    />
                                </div>
                                <p className="text-[10px] text-gray-600">Se abrirá WhatsApp Web con el mensaje prellenado.</p>
                            </div>
                            <div className="px-6 py-4 border-t border-white/5 flex justify-end gap-3">
                                <button onClick={() => setWaModal(null)} className="px-4 py-2 text-gray-500 text-xs font-bold hover:text-white transition">Cancelar</button>
                                <button
                                    onClick={handleSendWhatsApp}
                                    disabled={sendingWa || !waMessage.trim()}
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-widest transition-all disabled:opacity-50"
                                >
                                    {sendingWa ? <span className="w-3.5 h-3.5 border border-white/40 border-t-white rounded-full animate-spin" /> : <MessageCircle className="w-3.5 h-3.5" />}
                                    Abrir WhatsApp
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* MODAL CREAR CLIENTE */}
            <AnimatePresence>
                {showCreate && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                        onClick={(e) => { if (e.target === e.currentTarget) setShowCreate(false); }}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-[28px] shadow-2xl overflow-hidden"
                        >
                            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                                <div>
                                    <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest">Admin</p>
                                    <h2 className="text-white font-black text-lg tracking-tight">Nuevo Cliente</h2>
                                </div>
                                <button onClick={() => setShowCreate(false)} className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all">
                                    <X className="w-4 h-4 text-gray-400" />
                                </button>
                            </div>
                            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                                {[
                                    { label: "Nombre del negocio *", key: "businessName", placeholder: "Blusas Majo" },
                                    { label: "Nombre del representante *", key: "repName", placeholder: "Juan Pérez" },
                                    { label: "Email *", key: "email", placeholder: "correo@negocio.com", type: "email" },
                                    { label: "Dominio *", key: "domain", placeholder: "tusitio.com" },
                                    { label: "WhatsApp", key: "whatsapp", placeholder: "+57 300 xxx xxxx" },
                                ].map(({ label, key, placeholder, type }) => (
                                    <div key={key}>
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1.5">{label}</label>
                                        <input
                                            type={type ?? "text"}
                                            autoComplete="off"
                                            name={`create_${key}`}
                                            value={(form as Record<string, string | number>)[key] as string}
                                            onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
                                            placeholder={placeholder}
                                            className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm placeholder:text-gray-700 focus:outline-none focus:border-blue-500/60 transition-colors"
                                        />
                                    </div>
                                ))}
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1.5">Plan</label>
                                        <select
                                            value={form.plan}
                                            onChange={e => setForm(prev => ({ ...prev, plan: e.target.value }))}
                                            className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e0e0e] border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500/60 transition-colors appearance-none"
                                        >
                                            <option value="sin_plan">Sin plan</option>
                                            <option value="renting_basico">Renting Básico</option>
                                            <option value="renting_pro">Renting Pro</option>
                                            <option value="renting_elite">Renting Élite</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1.5">Precio/mes (COP)</label>
                                        <input
                                            type="number" min={0}
                                            value={form.monthlyPrice}
                                            onChange={e => setForm(prev => ({ ...prev, monthlyPrice: Number(e.target.value) }))}
                                            placeholder="150000"
                                            className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500/60 transition-colors"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1.5">Día de facturación (1-28)</label>
                                    <input
                                        type="number" min={1} max={28}
                                        value={form.billingDay}
                                        onChange={e => setForm(prev => ({ ...prev, billingDay: Number(e.target.value) }))}
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500/60 transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1.5">Notas (opcional)</label>
                                    <textarea
                                        value={form.notes}
                                        onChange={e => setForm(prev => ({ ...prev, notes: e.target.value }))}
                                        rows={3}
                                        placeholder="Observaciones sobre el cliente..."
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm placeholder:text-gray-700 focus:outline-none focus:border-blue-500/60 transition-colors resize-none"
                                    />
                                </div>
                                {createError && (
                                    <p className="text-red-400 text-xs font-bold bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">{createError}</p>
                                )}
                            </div>
                            <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between">
                                <p className="text-[10px] text-gray-600">Se enviará email con contraseña temporal al cliente.</p>
                                <button
                                    onClick={handleCreateClient}
                                    disabled={creating}
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase tracking-widest transition-all disabled:opacity-50 shadow-lg shadow-blue-500/20"
                                >
                                    {creating ? <span className="w-3.5 h-3.5 border border-white/40 border-t-white rounded-full animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                                    {creating ? "Creando..." : "Crear cliente"}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
