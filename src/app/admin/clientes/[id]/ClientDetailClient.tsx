"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import {
    ArrowLeft, Globe, Mail, Phone, Calendar, Package2,
    ShieldCheck, ShieldOff, Clock3, FileText, Save, Copy, Check,
    User, Building2, Hash
} from "lucide-react";
import { getAuthHeaders } from "@/lib/auth-headers";

interface WaasClient {
    id: string;
    user_id: string;
    business_name: string;
    rep_name: string;
    email: string;
    domain: string;
    plan: string;
    billing_day: number;
    next_payment_date: string | null;
    notes: string | null;
    whatsapp: string | null;
    is_blocked: boolean;
    created_at: string;
}

interface EmailLog {
    id: string;
    email_type: string;
    sent_to: string;
    status: string;
    sent_at: string;
}

const planLabels: Record<string, string> = {
    renting_basico: "Renting Básico",
    renting_pro: "Renting Pro",
    renting_elite: "Renting Élite",
    sin_plan: "Sin plan asignado",
};

const emailTypeLabels: Record<string, { label: string; color: string }> = {
    welcome: { label: "Bienvenida", color: "text-blue-400" },
    payment_reminder: { label: "Recordatorio", color: "text-amber-400" },
    blocked: { label: "Suspensión", color: "text-red-400" },
    unblocked: { label: "Reactivación", color: "text-emerald-400" },
};

export default function ClientDetailClient({
    initialClient,
    initialLogs,
}: {
    initialClient: WaasClient;
    initialLogs: EmailLog[];
}) {
    const [client, setClient] = useState<WaasClient>(initialClient);
    const [logs] = useState<EmailLog[]>(initialLogs);
    const [saving, setSaving] = useState(false);
    const [blocking, setBlocking] = useState(false);
    const [saved, setSaved] = useState(false);
    const [copied, setCopied] = useState(false);

    // Form state
    const [businessName, setBusinessName] = useState(initialClient.business_name);
    const [repName, setRepName] = useState(initialClient.rep_name);
    const [email, setEmail] = useState(initialClient.email);
    const [domain, setDomain] = useState(initialClient.domain);
    const [whatsapp, setWhatsapp] = useState(initialClient.whatsapp ?? "");
    const [plan, setPlan] = useState(initialClient.plan);
    const [billingDay, setBillingDay] = useState(initialClient.billing_day);
    const [notes, setNotes] = useState(initialClient.notes ?? "");

    const handleSave = async () => {
        setSaving(true);
        const headers = await getAuthHeaders();
        const res = await fetch(`/api/waas/admin/client/${client.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json", ...headers },
            body: JSON.stringify({
                business_name: businessName,
                rep_name: repName,
                email,
                domain: domain.replace(/^https?:\/\//, "").replace(/\/$/, ""),
                whatsapp: whatsapp || null,
                plan,
                billing_day: billingDay,
                notes: notes || null,
            }),
        });
        if (res.ok) {
            setSaved(true);
            setClient(prev => ({ ...prev, business_name: businessName, rep_name: repName, email, domain, whatsapp: whatsapp || null, plan, billing_day: billingDay, notes }));
            setTimeout(() => setSaved(false), 2500);
        }
        setSaving(false);
    };

    const handleBlock = async () => {
        setBlocking(true);
        const headers = await getAuthHeaders();
        const res = await fetch("/api/waas/admin/block", {
            method: "POST",
            headers: { "Content-Type": "application/json", ...headers },
            body: JSON.stringify({ clientId: client.id, block: !client.is_blocked }),
        });
        if (res.ok) {
            setClient(prev => ({ ...prev, is_blocked: !prev.is_blocked }));
        }
        setBlocking(false);
    };

    const installScript = `<!-- AMC Agency Web Protection -->\n<script src="https://renting-amc-agency-web.vercel.app/api/protect?domain=${client.domain}"></script>`;

    const copyScript = () => {
        navigator.clipboard.writeText(installScript);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const inputClass = "w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm placeholder:text-gray-700 focus:outline-none focus:border-blue-500/60 transition-colors";

    return (
        <main className="min-h-screen bg-[#050505] text-white">
            {/* NAVBAR */}
            <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 py-3 bg-[#050505]/95 border-b border-white/5 backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <a href="/admin/clientes" className="flex items-center gap-1.5 text-gray-500 hover:text-white text-sm transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Clientes
                    </a>
                    <span className="text-gray-800">/</span>
                    <span className="text-white text-sm font-bold truncate max-w-[180px]">{client.business_name}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${client.is_blocked ? "text-red-400 bg-red-500/10 border-red-500/20" : "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"}`}>
                        {client.is_blocked ? "Suspendido" : "Activo"}
                    </span>
                </div>
            </nav>

            <div className="pt-16 max-w-5xl mx-auto px-4 sm:px-6 pb-24">
                <div className="py-7">
                    <p className="text-xs text-gray-500 font-black uppercase tracking-[0.25em] mb-1">Detalle del Cliente</p>
                    <h1 className="text-3xl font-black tracking-tighter text-white">{client.business_name}</h1>
                    <p className="text-gray-600 text-sm mt-1">{client.email}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* COLUMNA PRINCIPAL */}
                    <div className="lg:col-span-2 space-y-5">

                        {/* DATOS PRINCIPALES */}
                        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-[24px] bg-white/[0.02] border border-white/8">
                            <div className="flex items-center gap-2 mb-5">
                                <Building2 className="w-4 h-4 text-blue-400" />
                                <h2 className="text-sm font-black text-white uppercase tracking-wider">Información del Negocio</h2>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1.5">Nombre del Negocio</label>
                                    <input value={businessName} onChange={e => setBusinessName(e.target.value)} className={inputClass} placeholder="Blusas Majo" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1.5">Representante</label>
                                    <input value={repName} onChange={e => setRepName(e.target.value)} className={inputClass} placeholder="Juan Pérez" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1.5">Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-600" />
                                        <input value={email} onChange={e => setEmail(e.target.value)} className={`${inputClass} pl-9`} placeholder="correo@ejemplo.com" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1.5">WhatsApp</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-600" />
                                        <input value={whatsapp} onChange={e => setWhatsapp(e.target.value)} className={`${inputClass} pl-9`} placeholder="+57 300 xxx xxxx" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1.5">Dominio</label>
                                    <div className="relative">
                                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-600" />
                                        <input value={domain} onChange={e => setDomain(e.target.value)} className={`${inputClass} pl-9 font-mono`} placeholder="tusitio.com" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1.5">Plan</label>
                                    <div className="relative">
                                        <Package2 className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-600" />
                                        <select value={plan} onChange={e => setPlan(e.target.value)} className={`${inputClass} pl-9 appearance-none bg-[#0a0a0a]`}>
                                            <option value="sin_plan">Sin plan asignado</option>
                                            <option value="renting_basico">Renting Básico</option>
                                            <option value="renting_pro">Renting Pro</option>
                                            <option value="renting_elite">Renting Élite</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1.5">Día de Facturación</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-600" />
                                        <input type="number" min={1} max={28} value={billingDay} onChange={e => setBillingDay(Number(e.target.value))} className={`${inputClass} pl-9`} />
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* NOTAS */}
                        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="p-6 rounded-[24px] bg-white/[0.02] border border-white/8">
                            <div className="flex items-center gap-2 mb-4">
                                <FileText className="w-4 h-4 text-violet-400" />
                                <h2 className="text-sm font-black text-white uppercase tracking-wider">Notas Internas</h2>
                            </div>
                            <textarea
                                value={notes}
                                onChange={e => setNotes(e.target.value)}
                                rows={4}
                                placeholder="Agregar notas sobre el cliente, detalles del contrato, observaciones..."
                                className={`${inputClass} resize-none`}
                            />
                        </motion.div>

                        {/* BOTONES */}
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className={`flex items-center gap-2 px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all disabled:opacity-50 ${saved ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20"}`}
                            >
                                {saving ? <span className="w-3.5 h-3.5 border border-white/40 border-t-white rounded-full animate-spin" /> : saved ? <><Check className="w-3.5 h-3.5" /> Guardado</> : <><Save className="w-3.5 h-3.5" /> Guardar cambios</>}
                            </button>
                            <button
                                onClick={handleBlock}
                                disabled={blocking}
                                className={`flex items-center gap-2 px-5 py-3 rounded-full text-xs font-black uppercase tracking-widest border transition-all disabled:opacity-40 ${client.is_blocked ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/25 hover:bg-emerald-500/25" : "bg-red-500/15 text-red-400 border-red-500/25 hover:bg-red-500/25"}`}
                            >
                                {blocking ? <span className="w-3.5 h-3.5 border border-current border-t-transparent rounded-full animate-spin" /> : client.is_blocked ? <><ShieldCheck className="w-3.5 h-3.5" /> Reactivar</> : <><ShieldOff className="w-3.5 h-3.5" /> Suspender</>}
                            </button>
                        </div>

                        {/* HISTORIAL DE EMAILS */}
                        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="p-6 rounded-[24px] bg-white/[0.02] border border-white/8">
                            <div className="flex items-center gap-2 mb-4">
                                <Mail className="w-4 h-4 text-gray-400" />
                                <h2 className="text-sm font-black text-white uppercase tracking-wider">Historial de Emails</h2>
                            </div>
                            {logs.length === 0 ? (
                                <p className="text-gray-600 text-sm">Sin emails registrados</p>
                            ) : (
                                <div className="space-y-2">
                                    {logs.map((log) => {
                                        const t = emailTypeLabels[log.email_type] ?? { label: log.email_type, color: "text-gray-400" };
                                        return (
                                            <div key={log.id} className="flex items-center justify-between py-2.5 border-b border-white/[0.04] last:border-0">
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-xs font-bold ${t.color}`}>{t.label}</span>
                                                    <span className="text-gray-700 text-xs">→ {log.sent_to}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-right">
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${log.status === "sent" ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" : "text-red-400 bg-red-500/10 border-red-500/20"}`}>{log.status}</span>
                                                    <span className="text-gray-600 text-xs hidden sm:block">{new Date(log.sent_at).toLocaleDateString("es-CO")}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </motion.div>
                    </div>

                    {/* COLUMNA LATERAL */}
                    <div className="space-y-5">
                        {/* STATS */}
                        <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} className="p-5 rounded-[24px] bg-white/[0.02] border border-white/8 space-y-4">
                            <h2 className="text-xs font-black text-gray-500 uppercase tracking-wider">Resumen</h2>
                            {[
                                { icon: <Globe className="w-4 h-4 text-blue-400" />, label: "Dominio", value: client.domain },
                                { icon: <Package2 className="w-4 h-4 text-violet-400" />, label: "Plan", value: planLabels[client.plan] ?? client.plan },
                                { icon: <Calendar className="w-4 h-4 text-amber-400" />, label: "Próx. pago", value: client.next_payment_date ? new Date(client.next_payment_date).toLocaleDateString("es-CO", { day: "2-digit", month: "short" }) : "—" },
                                { icon: <Clock3 className="w-4 h-4 text-gray-400" />, label: "Registrado", value: new Date(client.created_at).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" }) },
                            ].map((stat, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">{stat.icon}</div>
                                    <div className="min-w-0">
                                        <p className="text-[10px] text-gray-600 font-bold uppercase">{stat.label}</p>
                                        <p className="text-white text-xs font-bold truncate">{stat.value}</p>
                                    </div>
                                </div>
                            ))}
                        </motion.div>

                        {/* SCRIPT */}
                        <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.06 }} className="p-5 rounded-[24px] bg-white/[0.02] border border-white/8">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <Hash className="w-4 h-4 text-amber-400" />
                                    <h2 className="text-xs font-black text-white uppercase tracking-wider">Script Protección</h2>
                                </div>
                                <button onClick={copyScript} className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black border transition-all ${copied ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" : "text-gray-400 border-white/10 hover:border-white/20"}`}>
                                    {copied ? <><Check className="w-3 h-3" /> Copiado</> : <><Copy className="w-3 h-3" /> Copiar</>}
                                </button>
                            </div>
                            <pre className="text-[10px] text-gray-500 font-mono bg-black/40 rounded-xl p-3 overflow-x-auto whitespace-pre-wrap break-all">
                                {installScript}
                            </pre>
                            <p className="text-[10px] text-gray-700 mt-2">Instalar en el <code className="text-gray-600">&lt;head&gt;</code> del sitio del cliente.</p>
                        </motion.div>

                        {/* ACCESO SUPABASE */}
                        <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.08 }} className="p-5 rounded-[24px] bg-white/[0.02] border border-white/8">
                            <div className="flex items-center gap-2 mb-3">
                                <User className="w-4 h-4 text-gray-400" />
                                <h2 className="text-xs font-black text-gray-500 uppercase tracking-wider">Referencia</h2>
                            </div>
                            <p className="text-[10px] text-gray-700">User ID (Supabase)</p>
                            <p className="text-[9px] text-gray-600 font-mono mt-0.5 break-all">{client.user_id}</p>
                        </motion.div>
                    </div>
                </div>
            </div>
        </main>
    );
}
