"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    ArrowLeft, Globe, Mail, Phone, Calendar, Package2,
    ShieldCheck, ShieldOff, Clock3, FileText, Save, Copy, Check
} from "lucide-react";
import { waasService, type WaasClient, type EmailLog } from "@/services/waas";

const planLabels: Record<string, string> = {
    renting_basico: "Renting Básico", renting_pro: "Renting Pro", renting_elite: "Renting Élite",
    sin_plan: "Sin plan asignado",
};

export default function ClientDetailPage({ params }: { params: { id: string } }) {
    const [client, setClient] = useState<WaasClient | null>(null);
    const [logs, setLogs] = useState<EmailLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [notes, setNotes] = useState("");
    const [billingDay, setBillingDay] = useState(1);
    const [plan, setPlan] = useState("renting_basico");
    const [saving, setSaving] = useState(false);
    const [blocking, setBlocking] = useState(false);
    const [saved, setSaved] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        (async () => {
            const res = await fetch(`/api/waas/admin/client/${params.id}`);
            if (!res.ok) { setLoading(false); return; }
            const { client: c, logs: l } = await res.json();
            setClient(c);
            setNotes(c.notes ?? "");
            setBillingDay(c.billing_day);
            setPlan(c.plan);
            setLogs(l);
            setLoading(false);
        })();
    }, [params.id]);

    const handleSave = async () => {
        if (!client) return;
        setSaving(true);
        const res = await fetch(`/api/waas/admin/client/${client.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ notes, billing_day: billingDay, plan }),
        });
        if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 2000); }
        setSaving(false);
    };

    const handleBlock = async () => {
        if (!client) return;
        setBlocking(true);
        const res = await fetch("/api/waas/admin/block", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ clientId: client.id, block: !client.is_blocked }),
        });
        if (res.ok) {
            setClient(prev => prev ? { ...prev, is_blocked: !prev.is_blocked } : null);
        }
        setBlocking(false);
    };

    const emailTypeLabels: Record<string, { label: string; color: string }> = {
        welcome: { label: "Bienvenida", color: "text-blue-400" },
        payment_reminder: { label: "Recordatorio", color: "text-amber-400" },
        blocked: { label: "Suspensión", color: "text-red-400" },
        unblocked: { label: "Reactivación", color: "text-emerald-400" },
    };

    if (loading) return (
        <main className="min-h-screen bg-[#050505] flex items-center justify-center">
            <span className="w-6 h-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
        </main>
    );

    if (!client) return (
        <main className="min-h-screen bg-[#050505] flex items-center justify-center">
            <p className="text-gray-500">Cliente no encontrado</p>
        </main>
    );

    return (
        <main className="min-h-screen bg-[#050505] text-white">
            <nav className="fixed top-0 left-0 right-0 z-50 flex items-center gap-3 px-5 py-3 bg-[#050505]/95 border-b border-white/5 backdrop-blur-md">
                <a href="/admin/clientes" className="flex items-center gap-1.5 text-gray-500 hover:text-white text-sm transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Clientes
                </a>
                <span className="text-gray-800">/</span>
                <span className="text-white text-sm font-bold">{client.business_name}</span>
            </nav>

            <div className="pt-16 max-w-4xl mx-auto px-4 sm:px-6 pb-20">
                <div className="py-8 flex items-start justify-between gap-4 flex-wrap">
                    <div>
                        <p className="text-xs text-gray-500 font-black uppercase tracking-[0.25em] mb-1">Detalle de Cliente</p>
                        <h1 className="text-2xl font-black tracking-tighter text-white">{client.business_name}</h1>
                        <p className="text-gray-500 text-sm">{client.email}</p>
                    </div>
                    <button
                        onClick={handleBlock} disabled={blocking}
                        className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all disabled:opacity-40 ${client.is_blocked
                            ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 hover:bg-emerald-500/25"
                            : "bg-red-500/15 text-red-400 border border-red-500/25 hover:bg-red-500/25"
                            }`}
                    >
                        {blocking ? <span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin inline-block" /> :
                            client.is_blocked ? <><ShieldCheck className="w-3.5 h-3.5 inline mr-1.5" />Activar Sitio</> :
                                <><ShieldOff className="w-3.5 h-3.5 inline mr-1.5" />Suspender Sitio</>}
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {/* INFO */}
                    <div className="p-6 rounded-[24px] bg-white/[0.02] border border-white/8 space-y-4">
                        <p className="text-xs font-black text-gray-500 uppercase tracking-[0.25em]">Información</p>
                        {[
                            { icon: <Globe className="w-4 h-4 text-blue-400" />, label: "Dominio", value: client.domain },
                            { icon: <Mail className="w-4 h-4 text-violet-400" />, label: "Email", value: client.email },
                            { icon: <Phone className="w-4 h-4 text-emerald-400" />, label: "WhatsApp", value: client.whatsapp ?? "—" },
                            { icon: <Package2 className="w-4 h-4 text-amber-400" />, label: "Plan actual", value: planLabels[client.plan] ?? client.plan },
                            { icon: <Calendar className="w-4 h-4 text-cyan-400" />, label: "Próx. pago", value: client.next_payment_date ?? "—" },
                            { icon: <Clock3 className="w-4 h-4 text-pink-400" />, label: "Registrado", value: new Date(client.created_at).toLocaleDateString("es-CO") },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">{item.icon}</div>
                                <div>
                                    <p className="text-[10px] text-gray-600 font-bold uppercase tracking-wider">{item.label}</p>
                                    <p className="text-white text-sm font-semibold">{item.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* EDITAR */}
                    <div className="p-6 rounded-[24px] bg-white/[0.02] border border-white/8 space-y-4">
                        <p className="text-xs font-black text-gray-500 uppercase tracking-[0.25em]">Editar</p>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Plan</label>
                            <select
                                value={plan} onChange={(e) => setPlan(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors appearance-none"
                            >
                                <option value="sin_plan" className="bg-[#0a0a0a]">Sin plan asignado</option>
                                <option value="renting_basico" className="bg-[#0a0a0a]">Renting Básico — $299k/mes</option>
                                <option value="renting_pro" className="bg-[#0a0a0a]">Renting Pro — $499k/mes</option>
                                <option value="renting_elite" className="bg-[#0a0a0a]">Renting Élite — $899k/mes</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Día de Corte</label>
                            <input
                                type="number" min={1} max={28} value={billingDay}
                                onChange={(e) => setBillingDay(parseInt(e.target.value) || 1)}
                                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Notas Internas</label>
                            <textarea
                                value={notes} onChange={(e) => setNotes(e.target.value)}
                                rows={4} placeholder="Observaciones, acuerdos, historial de contacto..."
                                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors resize-none placeholder:text-gray-700"
                            />
                        </div>
                        <button
                            onClick={handleSave} disabled={saving}
                            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm uppercase tracking-wider transition-all ${saved ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-blue-600 hover:bg-blue-500 text-white"
                                }`}
                        >
                            <Save className="w-4 h-4" /> {saved ? "¡Guardado!" : saving ? "Guardando..." : "Guardar Cambios"}
                        </button>
                    </div>

                    {/* SCRIPT DE INSTALACIÓN */}
                    <div className="lg:col-span-2 p-6 rounded-[24px] bg-white/[0.02] border border-white/8">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="text-xs font-black text-gray-500 uppercase tracking-[0.25em] mb-0.5">Script de Protección</p>
                                <p className="text-white font-bold">Código a instalar en el sitio del cliente</p>
                            </div>
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(`<!-- AMC Agency WaaS Lock -->\n<script src="https://amcagencyweb.com/waas-lock.js?domain=https://${client.domain}/"></script>`);
                                    setCopied(true);
                                    setTimeout(() => setCopied(false), 2000);
                                }}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${copied ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 border" : "bg-white/5 text-gray-400 border border-white/10 hover:border-white/20"
                                    }`}
                            >
                                {copied ? <><Check className="w-3 h-3" /> Copiado</> : <><Copy className="w-3 h-3" /> Copiar</>}
                            </button>
                        </div>
                        <div className="p-4 rounded-xl bg-black/40 border border-white/5 font-mono text-xs text-green-400 overflow-x-auto">
                            {`<!-- AMC Agency WaaS Lock -->`}<br />
                            {`<script src="https://amcagencyweb.com/waas-lock.js?domain=https://${client.domain}/"></script>`}
                        </div>
                        <p className="text-gray-600 text-xs mt-3">
                            Agrega este script antes del cierre de <code className="text-gray-500">&lt;/body&gt;</code> en el sitio web del cliente.
                        </p>
                    </div>

                    {/* HISTORIAL DE EMAILS */}
                    <div className="lg:col-span-2 p-6 rounded-[24px] bg-white/[0.02] border border-white/8">
                        <p className="text-xs font-black text-gray-500 uppercase tracking-[0.25em] mb-4">
                            <FileText className="w-3.5 h-3.5 inline mr-1.5" />Historial de Emails
                        </p>
                        {logs.length === 0 ? (
                            <p className="text-gray-600 text-sm text-center py-4">Sin emails enviados aún</p>
                        ) : (
                            <div className="space-y-2">
                                {logs.map((log, i) => {
                                    const et = emailTypeLabels[log.email_type] ?? { label: log.email_type, color: "text-gray-400" };
                                    return (
                                        <motion.div
                                            key={log.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                                            className="flex items-center justify-between py-2.5 px-4 rounded-xl bg-white/[0.02] border border-white/5"
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className={`text-xs font-bold ${et.color}`}>{et.label}</span>
                                                <span className="text-gray-600 text-xs">{log.recipient_email}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${log.status === "sent" ? "text-emerald-400 bg-emerald-500/10" : "text-red-400 bg-red-500/10"
                                                    }`}>{log.status}</span>
                                                <span className="text-gray-700 text-xs">{new Date(log.sent_at).toLocaleDateString("es-CO")}</span>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
