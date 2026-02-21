import { NextResponse, type NextRequest } from 'next/server'
import { waasService } from '@/services/waas'
import { verifyAdminToken } from '@/lib/supabase/server-auth'

// GET: listar todos los leads
export async function GET(req: NextRequest) {
    if (!await verifyAdminToken(req)) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }
    try {
        const leads = await waasService.getLeads()
        return NextResponse.json(leads)
    } catch (err) {
        console.error('[api/waas/admin/leads GET]', err)
        return NextResponse.json({ error: 'Error al obtener leads' }, { status: 500 })
    }
}

// PATCH: actualizar status de un lead
export async function PATCH(req: NextRequest) {
    if (!await verifyAdminToken(req)) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }
    try {
        const { id, ...data } = await req.json()
        if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 })
        await waasService.updateLead(id, data)
        return NextResponse.json({ ok: true })
    } catch (err) {
        console.error('[api/waas/admin/leads PATCH]', err)
        return NextResponse.json({ error: 'Error al actualizar lead' }, { status: 500 })
    }
}
