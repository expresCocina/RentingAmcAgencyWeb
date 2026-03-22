import { NextResponse, type NextRequest } from 'next/server'
import { waasService } from '@/services/waas'
import { verifyAdminToken } from '@/lib/supabase/server-auth'
import { createAdminClient } from '@/lib/supabase/admin'

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

// DELETE: eliminar un lead por ID
export async function DELETE(req: NextRequest) {
    if (!await verifyAdminToken(req)) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }
    try {
        const { id } = await req.json()
        if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 })
        const supabase = createAdminClient()
        const { error } = await supabase.from('waas_leads').delete().eq('id', id)
        if (error) throw error
        return NextResponse.json({ ok: true })
    } catch (err) {
        console.error('[api/waas/admin/leads DELETE]', err)
        return NextResponse.json({ error: 'Error al eliminar lead' }, { status: 500 })
    }
}
