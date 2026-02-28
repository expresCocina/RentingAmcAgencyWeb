import { NextResponse, type NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { Resend } from 'resend'
import crypto from 'crypto'
import { newLeadAdminEmail, leadConfirmationEmail } from '@/services/email-templates'

const resend = new Resend(process.env.RESEND_API_KEY)
const ADMIN_EMAIL = 'salcristhi5411@gmail.com'
const FROM_EMAIL = 'AMC Agency <notificaciones@amcagencyweb.com>'

const FB_PIXEL_ID = '780457111253195'
const FB_CAPI_TOKEN =
    process.env.FB_CAPI_TOKEN ??
    'EAAWwrH7BiO8BQ0hCIkwAhGm5g4zv0mS8jI78DpUG8SmUYLrTK0dpaJaJOp3r1ZBAYKjKXTIFpBkInHtyQyh65CiZArmAFFyFWL6YrXzEvW9YtoaQDV06hQEHZB5CUdccPZB6mlZCuuRlZCsYMNgbVizqdFEBqx2TQM48zfZBU02LHEn18ZBHZAgARufbeifP30AQBIQZDZD'

function sha256(v: string) {
    return crypto.createHash('sha256').update(v.trim().toLowerCase()).digest('hex')
}

async function fireFbLeadEvent(email: string | null, phone: string | null) {
    try {
        const userData: Record<string, string> = {}
        if (email) userData.em = sha256(email)
        if (phone) userData.ph = sha256(phone.replace(/\D/g, ''))

        await fetch(
            `https://graph.facebook.com/v18.0/${FB_PIXEL_ID}/events?access_token=${FB_CAPI_TOKEN}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    data: [{
                        event_name: 'Lead',
                        event_time: Math.floor(Date.now() / 1000),
                        event_source_url: 'https://amcagencyweb.com',
                        action_source: 'website',
                        user_data: userData,
                    }],
                }),
            }
        )
    } catch (err) {
        console.error('[api/leads CAPI]', err)
    }
}

/**
 * POST /api/leads (endpoint PÚBLICO)
 * 1. Guarda el lead en Supabase
 * 2. Email al admin
 * 3. Email de confirmación al prospecto
 * 4. Evento Lead → Facebook CAPI
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

        // ── Disparar en paralelo: emails + CAPI ──────────────────────────────
        const tasks = [
            // 1. Notificación admin
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
            // 2. Facebook CAPI
            fireFbLeadEvent(email ? String(email) : null, phone ? String(phone) : null),
        ]

        if (email) {
            tasks.push(
                resend.emails.send({
                    from: FROM_EMAIL,
                    to: String(email),
                    subject: 'Recibimos tu solicitud — AMC Agency',
                    html: leadConfirmationEmail({
                        name: String(name),
                        service: service ? String(service) : null,
                        message: message ? String(message) : null,
                    }),
                })
            )
        }

        Promise.allSettled(tasks).catch((e) => console.error('[api/leads tasks]', e))

        return NextResponse.json({ ok: true }, { status: 201 })
    } catch (err) {
        console.error('[api/leads POST]', err)
        return NextResponse.json({ error: 'Error interno' }, { status: 500 })
    }
}
