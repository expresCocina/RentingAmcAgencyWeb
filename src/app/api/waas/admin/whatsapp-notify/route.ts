import { NextResponse, type NextRequest } from 'next/server'
import { waasService } from '@/services/waas'
import { verifyAdminToken } from '@/lib/supabase/server-auth'

/**
 * POST /api/waas/admin/whatsapp-notify
 * Genera un link de WhatsApp con mensaje prellenado para el cliente.
 * Devuelve la URL de wa.me para que el admin la abra.
 */
export async function POST(req: NextRequest) {
    if (!await verifyAdminToken(req)) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }
    try {
        const { clientId, message } = await req.json()
        if (!clientId || !message) {
            return NextResponse.json({ error: 'clientId y message son requeridos' }, { status: 400 })
        }

        const client = await waasService.getClientById(clientId)
        if (!client) {
            return NextResponse.json({ error: 'Cliente no encontrado' }, { status: 404 })
        }

        if (!client.whatsapp) {
            return NextResponse.json({ error: 'El cliente no tiene número de WhatsApp' }, { status: 400 })
        }

        // Limpiar el número: solo dígitos
        const number = client.whatsapp.replace(/\D/g, '')
        const encoded = encodeURIComponent(message)
        const waUrl = `https://wa.me/${number}?text=${encoded}`

        return NextResponse.json({ url: waUrl, number, client_name: client.business_name })
    } catch (err) {
        console.error('[api/waas/admin/whatsapp-notify]', err)
        return NextResponse.json({ error: 'Error interno' }, { status: 500 })
    }
}
