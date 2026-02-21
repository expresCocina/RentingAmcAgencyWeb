import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { isAdmin } from '@/lib/supabase/server-auth'

// GET /api/waas/admin/clients — lista todos los clientes (solo admin)
export async function GET() {
    try {
        if (!(await isAdmin())) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
        }

        const supabase = createAdminClient()
        const { data, error } = await supabase
            .from('waas_clients')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) throw error

        return NextResponse.json(data ?? [])
    } catch (err) {
        console.error('[admin/clients]', err)
        return NextResponse.json({ error: 'Error interno' }, { status: 500 })
    }
}
