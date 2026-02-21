import { NextResponse, type NextRequest } from 'next/server'
import { waasService } from '@/services/waas'
import { verifyAdminToken } from '@/lib/supabase/server-auth'

export async function GET(req: NextRequest) {
    if (!await verifyAdminToken(req)) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }
    try {
        const metrics = await waasService.getMetrics()
        return NextResponse.json(metrics)
    } catch (err) {
        console.error('[api/waas/admin/metrics]', err)
        return NextResponse.json({ error: 'Error al obtener métricas' }, { status: 500 })
    }
}
