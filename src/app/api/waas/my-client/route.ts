import { NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/supabase/server-auth'

// GET /api/waas/my-client — devuelve el registro waas_clients del usuario autenticado
export async function GET() {
    try {
        const user = await getSessionUser()

        if (!user) {
            return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
        }

        const { createAdminClient } = await import('@/lib/supabase/admin')
        const supabase = createAdminClient()

        const { data, error } = await supabase
            .from('waas_clients')
            .select('*')
            .eq('user_id', user.id)
            .single()

        if (error || !data) {
            return NextResponse.json({ error: 'Cliente no encontrado' }, { status: 404 })
        }

        return NextResponse.json(data)
    } catch (err) {
        console.error('[my-client]', err)
        return NextResponse.json({ error: 'Error interno' }, { status: 500 })
    }
}
