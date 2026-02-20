"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    MessageCircle, Instagram, Facebook, Save, CheckCircle2,
    ArrowLeft, Link2, Key, Hash, RefreshCw, Info
} from "lucide-react";

type Channel = "whatsapp" | "instagram" | "messenger";

type Integration = {
    id: string;
    channel: Channel;
    is_active: boolean;
    phone_number_id: string | null;
    waba_id: string | null;
    access_token: string | null;
    page_id: string | null;
    instagram_account_id: string | null;
    webhook_verify_token: string | null;
};

const CHANNEL_CONFIG: Record<Channel, {
    label: string;
    icon: React.ReactNode;
    color: string;
    bg: string;
    border: string;
    fields: { key: keyof Integration; label: string; placeholder: string; icon: React.ReactNode; hint?: string }[];
}> = {
    whatsapp: {
        label: "WhatsApp Business API",
        icon: <MessageCircle className="w-5 h-5" />,
        color: "text-green-400",
        bg: "bg-green-500/10",
        border: "border-green-500/20",
        fields: [
            { key: "phone_number_id", label: "Phone Number ID", placeholder: "123456789012345", icon: <Hash className="w-4 h-4" />, hint: "Encontrar en Meta Developer Console → WhatsApp → Configuration" },
            { key: "waba_id", label: "WhatsApp Business Account ID", placeholder: "987654321098765", icon: <Hash className="w-4 h-4" /> },
            { key: "access_token", label: "Access Token (Permanent)", placeholder: "EAABxxx...", icon: <Key className="w-4 h-4" />, hint: "Generar token permanente en System Users" },
            { key: "webhook_verify_token", label: "Webhook Verify Token", placeholder: "mi_token_secreto_waas", icon: <Key className="w-4 h-4" />, hint: "Crea un token único que usarás en Meta para verificar el webhook" },
        ],
    },
    instagram: {
        label: "Instagram Messaging",
        icon: <Instagram className="w-5 h-5" />,
        color: "text-pink-400",
        bg: "bg-pink-500/10",
        border: "border-pink-500/20",
        fields: [
            { key: "page_id", label: "Facebook Page ID", placeholder: "123456789...", icon: <Hash className="w-4 h-4" />, hint: "El Facebook Page vinculado a la cuenta de Instagram" },
            { key: "instagram_account_id", label: "Instagram Business Account ID", placeholder: "17841400...", icon: <Hash className="w-4 h-4" /> },
            { key: "access_token", label: "Page Access Token", placeholder: "EAABxxx...", icon: <Key className="w-4 h-4" />, hint: "Token permanente de la página de Facebook" },
            { key: "webhook_verify_token", label: "Webhook Verify Token", placeholder: "mi_token_ig", icon: <Key className="w-4 h-4" /> },
        ],
    },
    messenger: {
        label: "Facebook Messenger",
        icon: <Facebook className="w-5 h-5" />,
        color: "text-blue-400",
        bg: "bg-blue-500/10",
        border: "border-blue-500/20",
        fields: [
            { key: "page_id", label: "Facebook Page ID", placeholder: "123456789...", icon: <Hash className="w-4 h-4" /> },
            { key: "access_token", label: "Page Access Token", placeholder: "EAABxxx...", icon: <Key className="w-4 h-4" />, hint: "Token permanente de la página para responder mensajes" },
            { key: "webhook_verify_token", label: "Webhook Verify Token", placeholder: "mi_token_messenger", icon: <Key className="w-4 h-4" /> },
        ],
    },
};

export default function IntegracionesPage() {
    const [integrations, setIntegrations] = useState<Record<Channel, Integration | null>>({
        whatsapp: null, instagram: null, messenger: null,
    });
    const [forms, setForms] = useState<Record<Channel, Record<string, string>>>({
        whatsapp: {}, instagram: {}, messenger: {},
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState<Channel | null>(null);
    const [saved, setSaved] = useState<Channel | null>(null);
    const [activeTab, setActiveTab] = useState<Channel>("whatsapp");

    useEffect(() => {
        (async () => {
            const res = await fetch("/api/integrations/config");
            if (res.ok) {
                const data = await res.json();
                const intMap: Record<Channel, Integration | null> = { whatsapp: null, instagram: null, messenger: null };
                const formMap: Record<Channel, Record<string, string>> = { whatsapp: {}, instagram: {}, messenger: {} };
                for (const item of (data.integrations ?? []) as Integration[]) {
                    intMap[item.channel] = item;
                    formMap[item.channel] = {
                        phone_number_id: item.phone_number_id ?? "",
                        waba_id: item.waba_id ?? "",
                        access_token: item.access_token ?? "",
                        page_id: item.page_id ?? "",
                        instagram_account_id: item.instagram_account_id ?? "",
                        webhook_verify_token: item.webhook_verify_token ?? "",
                        is_active: item.is_active ? "true" : "false",
                    };
                }
                setIntegrations(intMap);
                setForms(formMap);
            }
            setLoading(false);
        })();
    }, []);

    const handleSave = async (channel: Channel) => {
        setSaving(channel);
        const res = await fetch("/api/integrations/config", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ channel, ...forms[channel] }),
        });
        if (res.ok) {
            setSaved(channel);
            setTimeout(() => setSaved(null), 2000);
        }
        setSaving(null);
    };

    const webhookUrl = typeof window !== "undefined"
        ? `${window.location.origin}/api/integrations/webhook`
        : "https://amcagencyweb.com/api/integrations/webhook";

    const cfg = CHANNEL_CONFIG[activeTab];

    return (
        <main className="min-h-screen bg-[#050505] text-white">
            <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 py-3 bg-[#050505]/95 border-b border-white/5 backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <a href="/admin/clientes" className="flex items-center gap-1.5 text-gray-500 hover:text-white text-sm transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Clientes
                    </a>
                    <span className="text-gray-800">/</span>
                    <span className="text-white text-sm font-bold">Integraciones</span>
                </div>
                <a href="/admin/clientes" className="text-xs text-gray-500 hover:text-white transition-colors uppercase tracking-wider font-bold">
                    AMC <span className="text-blue-500">®</span>
                </a>
            </nav>

            <div className="pt-16 max-w-4xl mx-auto px-4 sm:px-6 pb-20">
                <div className="py-8">
                    <p className="text-xs text-gray-500 font-black uppercase tracking-[0.25em] mb-1">Meta Business</p>
                    <h1 className="text-3xl font-black tracking-tighter text-white">Integraciones de Mensajería</h1>
                    <p className="text-gray-500 text-sm mt-1">Conecta WhatsApp Business, Instagram y Messenger para recibir mensajes de clientes.</p>
                </div>

                {/* WEBHOOK URL */}
                <div className="mb-6 p-4 rounded-[18px] bg-violet-500/8 border border-violet-500/20">
                    <div className="flex items-start gap-3">
                        <Link2 className="w-4 h-4 text-violet-400 mt-0.5 flex-shrink-0" />
                        <div className="min-w-0">
                            <p className="text-xs font-black text-violet-400 uppercase tracking-wider mb-1">URL del Webhook (para todas las integraciones)</p>
                            <code className="text-white text-xs font-mono break-all">{webhookUrl}</code>
                            <p className="text-gray-600 text-xs mt-1.5">
                                Usa esta URL en el panel de Meta Developers para los 3 canales. El callback field debe ser <code className="text-gray-500">messages</code>.
                            </p>
                        </div>
                    </div>
                </div>

                {/* TABS */}
                <div className="flex gap-2 mb-6">
                    {(Object.keys(CHANNEL_CONFIG) as Channel[]).map((ch) => {
                        const c = CHANNEL_CONFIG[ch];
                        const isActive = activeTab === ch;
                        const int = integrations[ch];
                        return (
                            <button
                                key={ch}
                                onClick={() => setActiveTab(ch)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold transition-all border ${isActive ? `${c.bg} ${c.border} ${c.color}` : "bg-white/[0.03] border-white/8 text-gray-500 hover:text-white"
                                    }`}
                            >
                                {c.icon} {c.label.split(" ")[0]}
                                {int?.is_active && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                            </button>
                        );
                    })}
                </div>

                {/* PANEL */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <span className="w-6 h-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                    </div>
                ) : (
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-6 md:p-8 rounded-[24px] bg-white/[0.02] border border-white/8"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-2xl ${cfg.bg} ${cfg.border} border flex items-center justify-center ${cfg.color}`}>
                                    {cfg.icon}
                                </div>
                                <div>
                                    <h2 className="text-white font-black">{cfg.label}</h2>
                                    <p className={`text-xs font-bold ${integrations[activeTab]?.is_active ? "text-emerald-400" : "text-gray-600"}`}>
                                        {integrations[activeTab]?.is_active ? "● Conectado" : "○ Sin conectar"}
                                    </p>
                                </div>
                            </div>

                            {/* Toggle activo */}
                            <label className="flex items-center gap-2 cursor-pointer">
                                <span className="text-xs text-gray-500 font-bold">Activo</span>
                                <div
                                    onClick={() => setForms(prev => ({
                                        ...prev,
                                        [activeTab]: { ...prev[activeTab], is_active: prev[activeTab].is_active === "true" ? "false" : "true" }
                                    }))}
                                    className={`w-10 h-5 rounded-full border transition-all cursor-pointer relative ${forms[activeTab].is_active === "true" ? "bg-emerald-500 border-emerald-500" : "bg-white/10 border-white/20"
                                        }`}
                                >
                                    <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${forms[activeTab].is_active === "true" ? "left-5" : "left-0.5"}`} />
                                </div>
                            </label>
                        </div>

                        <div className="space-y-4">
                            {cfg.fields.map((field) => (
                                <div key={String(field.key)}>
                                    <div className="flex items-center gap-1.5 mb-1.5">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">{field.label}</label>
                                        {field.hint && (
                                            <div className="relative group">
                                                <Info className="w-3 h-3 text-gray-700 cursor-help" />
                                                <div className="absolute bottom-full left-0 mb-1.5 w-56 p-2.5 rounded-lg bg-[#1a1a1a] border border-white/10 text-gray-400 text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                                    {field.hint}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="relative">
                                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600">{field.icon}</div>
                                        <input
                                            type={String(field.key).includes("token") || String(field.key).includes("Token") ? "password" : "text"}
                                            value={forms[activeTab][String(field.key)] ?? ""}
                                            onChange={(e) => setForms(prev => ({
                                                ...prev,
                                                [activeTab]: { ...prev[activeTab], [field.key]: e.target.value }
                                            }))}
                                            placeholder={field.placeholder}
                                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm placeholder:text-gray-700 focus:outline-none focus:border-blue-500 transition-colors font-mono"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 flex items-center gap-3">
                            <button
                                onClick={() => handleSave(activeTab)}
                                disabled={saving === activeTab}
                                className={`flex items-center gap-2 px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${saved === activeTab ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" :
                                        "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20"
                                    }`}
                            >
                                {saving === activeTab ? (
                                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                ) : saved === activeTab ? (
                                    <><CheckCircle2 className="w-3.5 h-3.5" /> Guardado</>
                                ) : (
                                    <><Save className="w-3.5 h-3.5" /> Guardar {cfg.label.split(" ")[0]}</>
                                )}
                            </button>
                        </div>
                    </motion.div>
                )}
            </div>
        </main>
    );
}
