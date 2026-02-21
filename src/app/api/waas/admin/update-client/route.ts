import { NextResponse, type NextRequest } from 'next/server'
import { waasService } from '@/services/waas'
import { verifyAdminToken } from '@/lib/supabase/server-auth'

/**
 * PATCH /api/waas/admin/update-client
 * Actualiza campos de un cliente: monthly_price, payment_status, plan, etc.
 */
export async function PATCH(req: NextRequest) {
    if (!await verifyAdminToken(req)) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }
    try {
        const { id, ...data } = await req.json()
        if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 })
        await waasService.updateClient(id, data)
        return NextResponse.json({ ok: true })
    } catch (err) {
        console.error('[api/waas/admin/update-client]', err)
        return NextResponse.json({ error: 'Error al actualizar' }, { status: 500 })
    }
}
