import { NextResponse, type NextRequest } from 'next/server'
import crypto from 'crypto'

const PIXEL_ID = '780457111253195'
const CAPI_TOKEN = process.env.FB_CAPI_TOKEN ?? 'EAAWwrH7BiO8BQ0hCIkwAhGm5g4zv0mS8jI78DpUG8SmUYLrTK0dpaJaJOp3r1ZBAYKjKXTIFpBkInHtyQyh65CiZArmAFFyFWL6YrXzEvW9YtoaQDV06hQEHZB5CUdccPZB6mlZCuuRlZCsYMNgbVizqdFEBqx2TQM48zfZBU02LHEn18ZBHZAgARufbeifP30AQBIQZDZD'

function sha256(value: string) {
    return crypto.createHash('sha256').update(value.trim().toLowerCase()).digest('hex')
}

/**
 * POST /api/fb-event
 * Envía un evento a la Conversions API (CAPI) de Facebook de forma server-side.
 * Uso desde el cliente: fetch('/api/fb-event', { method:'POST', body: JSON.stringify({ eventName, email, phone, url }) })
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { eventName = 'Lead', email, phone, url } = body

        const userIp =
            req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
            req.headers.get('x-real-ip') ??
            '0.0.0.0'

        const userAgent = req.headers.get('user-agent') ?? ''

        const userData: Record<string, string> = {}
        if (email) userData.em = sha256(email)
        if (phone) userData.ph = sha256(phone.replace(/\D/g, ''))
        userData.client_ip_address = userIp
        userData.client_user_agent = userAgent

        const payload = {
            data: [
                {
                    event_name: eventName,
                    event_time: Math.floor(Date.now() / 1000),
                    event_source_url: url ?? 'https://amcagencyweb.com',
                    action_source: 'website',
                    user_data: userData,
                },
            ],
            // test_event_code: 'TEST12345', // descomentar para testing
        }

        const res = await fetch(
            `https://graph.facebook.com/v18.0/${PIXEL_ID}/events?access_token=${CAPI_TOKEN}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            }
        )

        const data = await res.json()
        if (!res.ok) {
            console.error('[CAPI] Error:', data)
            return NextResponse.json({ error: data }, { status: 500 })
        }

        return NextResponse.json({ success: true, events_received: data.events_received })
    } catch (err) {
        console.error('[CAPI] Exception:', err)
        return NextResponse.json({ error: 'Internal error' }, { status: 500 })
    }
}
