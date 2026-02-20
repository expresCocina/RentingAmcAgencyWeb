import { createAdminClient } from '@/lib/supabase/admin'

export type WaasClient = {
    id: string
    user_id: string
    business_name: string
    rep_name: string
    email: string
    whatsapp: string | null
    domain: string
    plan: string
    is_blocked: boolean
    billing_day: number
    next_payment_date: string | null
    notes: string | null
    created_at: string
    blocked_at: string | null
}

export type EmailLog = {
    id: string
    client_id: string
    email_type: string
    recipient_email: string
    sent_at: string
    status: string
}

export const waasService = {
    // ── ADMIN: obtener todos los clientes ──────────────────────────────────
    async getAllClients(): Promise<WaasClient[]> {
        const supabase = createAdminClient()
        const { data, error } = await supabase
            .from('waas_clients')
            .select('*')
            .order('created_at', { ascending: false })
        if (error) throw error
        return (data ?? []) as WaasClient[]
    },

    // ── ADMIN: obtener un cliente por ID ───────────────────────────────────
    async getClientById(id: string): Promise<WaasClient | null> {
        const supabase = createAdminClient()
        const { data, error } = await supabase
            .from('waas_clients')
            .select('*')
            .eq('id', id)
            .single()
        if (error) return null
        return data as WaasClient
    },

    // ── ADMIN: bloquear / desbloquear sitio ───────────────────────────────
    async setBlocked(clientId: string, blocked: boolean): Promise<void> {
        const supabase = createAdminClient()
        const updateData = blocked
            ? { is_blocked: true, blocked_at: new Date().toISOString() }
            : { is_blocked: false, unblocked_at: new Date().toISOString() }
        const { error } = await supabase
            .from('waas_clients')
            .update(updateData)
            .eq('id', clientId)
        if (error) throw error
    },

    // ── ADMIN: actualizar cliente ──────────────────────────────────────────
    async updateClient(id: string, data: Partial<WaasClient>): Promise<void> {
        const supabase = createAdminClient()
        const { error } = await supabase
            .from('waas_clients')
            .update(data)
            .eq('id', id)
        if (error) throw error
    },

    // ── CLIENTE: obtener su propio registro ───────────────────────────────
    async getMyClient(userId: string): Promise<WaasClient | null> {
        const supabase = createAdminClient()
        const { data, error } = await supabase
            .from('waas_clients')
            .select('*')
            .eq('user_id', userId)
            .single()
        if (error) return null
        return data as WaasClient
    },

    // ── Verificar estado por dominio (endpoint público) ────────────────────
    async getStatusByDomain(domain: string): Promise<{ blocked: boolean } | null> {
        const supabase = createAdminClient()
        const clean = domain.replace(/^https?:\/\//, '').replace(/\/$/, '')
        const { data, error } = await supabase
            .from('waas_clients')
            .select('is_blocked')
            .eq('domain', clean)
            .single()
        if (error || !data) return null
        return { blocked: data.is_blocked }
    },

    // ── LOG de email ──────────────────────────────────────────────────────
    async logEmail(clientId: string, type: string, email: string, status: 'sent' | 'failed'): Promise<void> {
        const supabase = createAdminClient()
        await supabase.from('waas_email_logs').insert({
            client_id: clientId,
            email_type: type,
            recipient_email: email,
            status,
        })
    },

    // ── Clientes con pago próximo (para cron) ─────────────────────────────
    async getClientsDueInDays(days: number): Promise<WaasClient[]> {
        const supabase = createAdminClient()
        const targetDate = new Date()
        targetDate.setDate(targetDate.getDate() + days)
        const isoDate = targetDate.toISOString().split('T')[0]
        const { data, error } = await supabase
            .from('waas_clients')
            .select('*')
            .eq('next_payment_date', isoDate)
            .eq('is_blocked', false)
        if (error) return []
        return (data ?? []) as WaasClient[]
    },
}
