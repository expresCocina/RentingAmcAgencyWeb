import { NextResponse, type NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { Resend } from 'resend'
import { newLeadAdminEmail, leadConfirmationEmail } from '@/services/email-templates'

const resend = new Resend(process.env.RESEND_API_KEY)
const ADMIN_EMAIL = 'salcristhi5411@gmail.com'
const FROM_EMAIL = 'AMC Agency <notificaciones@amcagencyweb.com>'

/**
 * POST /api/leads (endpoint PÚBLICO)
 * Guarda el lead en Supabase y envía emails de notificación.
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { name, email, phone, service, message } = body

        if (!name) {
            return NextResponse.json({ error: 'El nombre es requerido' }, { status: 400 })
        }

        const supabase = createAdminClient()
        const { error } = await supabase.from('waas_leads').insert({
            name: String(name).slice(0, 200),
            email: email ? String(email).slice(0, 200) : null,
            phone: phone ? String(phone).slice(0, 50) : null,
            service: service ? String(service).slice(0, 100) : null,
            message: message ? String(message).slice(0, 2000) : null,
            source: 'website_form',
            status: 'new',
        })

        if (error) {
            console.error('[api/leads POST]', error)
            return NextResponse.json({ error: 'Error al guardar' }, { status: 500 })
        }

        // ── Emails en paralelo ──────────────────────────────────────────────
        if (email) {
            Promise.allSettled([
                resend.emails.send({
                    from: FROM_EMAIL,
                    to: ADMIN_EMAIL,
                    subject: `🔔 Nuevo Lead: ${name}`,
                    html: newLeadAdminEmail({
                        name: String(name),
                        email: email ? String(email) : null,
                        phone: phone ? String(phone) : null,
                        service: service ? String(service) : null,
                        message: message ? String(message) : null,
                        source: 'website_form',
                    }),
                }),
                resend.emails.send({
                    from: FROM_EMAIL,
                    to: String(email),
                    subject: 'Recibimos tu solicitud — AMC Agency',
                    html: leadConfirmationEmail({
                        name: String(name),
                        service: service ? String(service) : null,
                        message: message ? String(message) : null,
                    }),
                }),
            ]).catch((e) => console.error('[api/leads emails]', e))
        } else {
            // Sin email del cliente: solo notificar al admin
            resend.emails.send({
                from: FROM_EMAIL,
                to: ADMIN_EMAIL,
                subject: `🔔 Nuevo Lead: ${name}`,
                html: newLeadAdminEmail({
                    name: String(name),
                    email: null,
                    phone: phone ? String(phone) : null,
                    service: service ? String(service) : null,
                    message: message ? String(message) : null,
                    source: 'website_form',
                }),
            }).catch((e) => console.error('[api/leads admin email]', e))
        }

        return NextResponse.json({ ok: true }, { status: 201 })
    } catch (err) {
        console.error('[api/leads POST]', err)
        return NextResponse.json({ error: 'Error interno' }, { status: 500 })
    }
}
