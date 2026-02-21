import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { verifyAdminToken } from '@/lib/supabase/server-auth'

// GET /api/waas/admin/client/[id]
export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params

        if (!(await verifyAdminToken(req))) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
        }

        const supabase = createAdminClient()

        const { data: client, error: clientError } = await supabase
            .from('waas_clients')
            .select('*')
            .eq('id', id)
            .single()

        if (clientError || !client) {
            return NextResponse.json({ error: 'Cliente no encontrado' }, { status: 404 })
        }

        const { data: logs } = await supabase
            .from('waas_email_logs')
            .select('*')
            .eq('client_id', id)
            .order('sent_at', { ascending: false })
            .limit(10)

        return NextResponse.json({ client, logs: logs ?? [] })
    } catch (err) {
        console.error('[admin/client/id GET]', err)
        return NextResponse.json({ error: 'Error interno' }, { status: 500 })
    }
}

// PATCH /api/waas/admin/client/[id]
export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params

        if (!(await verifyAdminToken(req))) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
        }

        const body = await req.json()
        const supabase = createAdminClient()

        const { error } = await supabase
            .from('waas_clients')
            .update(body)
            .eq('id', id)

        if (error) throw error

        return NextResponse.json({ success: true })
    } catch (err) {
        console.error('[admin/client/id PATCH]', err)
        return NextResponse.json({ error: 'Error al guardar' }, { status: 500 })
    }
}
