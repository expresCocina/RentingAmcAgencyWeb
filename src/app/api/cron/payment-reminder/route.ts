import { NextRequest, NextResponse } from 'next/server'
import { waasService } from '@/services/waas'
import { paymentReminderEmail } from '@/services/email-templates'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const CRON_SECRET = process.env.CRON_SECRET ?? ''

// GET /api/cron/payment-reminder
// Llamado diariamente por Vercel Cron (vercel.json)
export async function GET(req: NextRequest) {
    // Seguridad: verificar header Authorization
    const authHeader = req.headers.get('authorization')
    if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const daysToCheck = [5, 3, 1] // días antes del corte para enviar recordatorio
    const results: { clientId: string; email: string; days: number; status: string }[] = []

    for (const days of daysToCheck) {
        const clients = await waasService.getClientsDueInDays(days)
        for (const client of clients) {
            const paymentDate = client.next_payment_date
                ? new Date(client.next_payment_date).toLocaleDateString('es-CO', {
                    day: '2-digit', month: 'long', year: 'numeric'
                })
                : 'pronto'

            try {
                const { error } = await resend.emails.send({
                    from: 'AMC Agency <noreply@amcagencyweb.com>',
                    to: client.email,
                    subject: `⏰ Tu pago vence en ${days} día${days > 1 ? 's' : ''} — ${client.domain}`,
                    html: paymentReminderEmail({
                        businessName: client.business_name,
                        repName: client.rep_name,
                        domain: client.domain,
                        paymentDate,
                        daysLeft: days,
                    }),
                })
                const status = error ? 'failed' : 'sent'
                await waasService.logEmail(client.id, 'payment_reminder', client.email, status)
                results.push({ clientId: client.id, email: client.email, days, status })
            } catch {
                await waasService.logEmail(client.id, 'payment_reminder', client.email, 'failed')
                results.push({ clientId: client.id, email: client.email, days, status: 'failed' })
            }
        }
    }

    return NextResponse.json({
        success: true,
        processed: results.length,
        results,
        timestamp: new Date().toISOString(),
    })
}
