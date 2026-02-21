"use client";
import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Users, Globe, ShieldOff, ShieldCheck, LogOut,
    Search, RefreshCw, ExternalLink, Calendar, Phone, Plus, X
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

export default function AdminClientesPage() {
    const [clients, setClients] = useState<WaasClient[]>([]);
    const [filtered, setFiltered] = useState<WaasClient[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [blocking, setBlocking] = useState<string | null>(null);
    const [showCreate, setShowCreate] = useState(false);
    const [creating, setCreating] = useState(false);
    const [createError, setCreateError] = useState("");
    const [form, setForm] = useState({
        businessName: "", repName: "", email: "",
        domain: "", whatsapp: "", plan: "sin_plan",
        billingDay: new Date().getDate(), notes: "",
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
            setForm({ businessName: "", repName: "", email: "", domain: "", whatsapp: "", plan: "sin_plan", billingDay: new Date().getDate(), notes: "" });
            await fetchClients();
        } else {
            const d = await res.json();
            setCreateError(d.error ?? "Error al crear cliente");
        }
        setCreating(false);
    };

    const activeCount = clients.filter(c => !c.is_blocked).length;
    const blockedCount = clients.filter(c => c.is_blocked).length;

    return (
        <>
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
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1.5">Día de facturación</label>
                                        <input
                                            type="number" min={1} max={28}
                                            value={form.billingDay}
                                            onChange={e => setForm(prev => ({ ...prev, billingDay: Number(e.target.value) }))}
                                            className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500/60 transition-colors"
                                        />
                                    </div>
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
