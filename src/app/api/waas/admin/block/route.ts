import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { waasService } from '@/services/waas'
import { siteBlockedEmail, siteUnblockedEmail } from '@/services/email-templates'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'contact@amcagency.com'

// POST /api/waas/admin/block
// Body: { clientId: string, block: boolean }
export async function POST(req: NextRequest) {
    // Verificar que el usuario es admin
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || user.email !== ADMIN_EMAIL) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    try {
        const { clientId, block } = await req.json()
        if (!clientId || typeof block !== 'boolean') {
            return NextResponse.json({ error: 'Parámetros inválidos' }, { status: 400 })
        }

        // Obtener datos del cliente
        const client = await waasService.getClientById(clientId)
        if (!client) {
            return NextResponse.json({ error: 'Cliente no encontrado' }, { status: 404 })
        }

        // Actualizar estado en Supabase
        await waasService.setBlocked(clientId, block)

        // Enviar email correspondiente
        try {
            const emailHtml = block
                ? siteBlockedEmail({ businessName: client.business_name, repName: client.rep_name, domain: client.domain })
                : siteUnblockedEmail({ businessName: client.business_name, repName: client.rep_name, domain: client.domain })

            const subject = block
                ? `⚠️ Tu sitio ${client.domain} ha sido suspendido`
                : `✅ Tu sitio ${client.domain} ha sido reactivado`

            const { error: emailError } = await resend.emails.send({
                from: 'AMC Agency <noreply@amcagencyweb.com>',
                to: client.email,
                subject,
                html: emailHtml,
            })

            await waasService.logEmail(clientId, block ? 'blocked' : 'unblocked', client.email, emailError ? 'failed' : 'sent')
        } catch {
            // Email falla → no bloquear la operación de bloqueo
        }

        return NextResponse.json({
            success: true,
            clientId,
            is_blocked: block,
            message: block ? 'Sitio bloqueado y cliente notificado' : 'Sitio desbloqueado y cliente notificado',
        })
    } catch (err) {
        console.error('[admin/block]', err)
        return NextResponse.json({ error: 'Error interno' }, { status: 500 })
    }
}
