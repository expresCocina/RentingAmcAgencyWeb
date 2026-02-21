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
    monthly_price: number
    payment_status: 'pending' | 'active' | 'overdue'
}

export type WaasLead = {
    id: string
    name: string
    email: string | null
    phone: string | null
    service: string | null
    message: string | null
    source: string
    status: 'new' | 'contacted' | 'converted' | 'lost'
    created_at: string
}

export type WaasMetrics = {
    total_clients: number
    active_clients: number
    suspended_clients: number
    paying_clients: number
    pending_clients: number
    overdue_clients: number
    new_this_month: number
    mrr: number
    total_leads: number
    new_leads: number
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

    // ── ADMIN: métricas del negocio ────────────────────────────────────────
    async getMetrics(): Promise<WaasMetrics> {
        const supabase = createAdminClient()

        const { data: clients } = await supabase
            .from('waas_clients')
            .select('is_blocked, payment_status, monthly_price, created_at')

        const { data: leads } = await supabase
            .from('waas_leads')
            .select('status, created_at')

        const allClients = clients ?? []
        const allLeads = leads ?? []

        const now = new Date()
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

        return {
            total_clients: allClients.length,
            active_clients: allClients.filter(c => !c.is_blocked).length,
            suspended_clients: allClients.filter(c => c.is_blocked).length,
            paying_clients: allClients.filter(c => c.payment_status === 'active').length,
            pending_clients: allClients.filter(c => c.payment_status === 'pending').length,
            overdue_clients: allClients.filter(c => c.payment_status === 'overdue').length,
            new_this_month: allClients.filter(c => c.created_at >= startOfMonth).length,
            mrr: allClients
                .filter(c => c.payment_status === 'active')
                .reduce((sum, c) => sum + (c.monthly_price ?? 0), 0),
            total_leads: allLeads.length,
            new_leads: allLeads.filter(l => l.status === 'new').length,
        }
    },

    // ── ADMIN: obtener todos los leads ─────────────────────────────────────
    async getLeads(): Promise<WaasLead[]> {
        const supabase = createAdminClient()
        const { data, error } = await supabase
            .from('waas_leads')
            .select('*')
            .order('created_at', { ascending: false })
        if (error) throw error
        return (data ?? []) as WaasLead[]
    },

    // ── ADMIN: actualizar un lead ──────────────────────────────────────────
    async updateLead(id: string, data: Partial<WaasLead>): Promise<void> {
        const supabase = createAdminClient()
        const { error } = await supabase
            .from('waas_leads')
            .update(data)
            .eq('id', id)
        if (error) throw error
    },

    // ── PÚBLICO: crear un lead desde formulario web ────────────────────────
    async createLead(data: Omit<WaasLead, 'id' | 'created_at' | 'status' | 'source'>): Promise<void> {
        const supabase = createAdminClient()
        const { error } = await supabase
            .from('waas_leads')
            .insert({ ...data, source: 'website_form', status: 'new' })
        if (error) throw error
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
