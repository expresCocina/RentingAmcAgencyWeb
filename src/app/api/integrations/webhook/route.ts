import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

// ── Webhook para Meta (WhatsApp Business API / Instagram / Messenger) ─────
// Documentación: https://developers.facebook.com/docs/messenger-platform/webhooks

// GET: verificación del webhook por parte de Meta
export async function GET(req: NextRequest) {
    const mode = req.nextUrl.searchParams.get('hub.mode')
    const token = req.nextUrl.searchParams.get('hub.verify_token')
    const challenge = req.nextUrl.searchParams.get('hub.challenge')

    const supabase = createAdminClient()

    // Obtener token de verificación guardado en la BD para confirmar
    const { data } = await supabase
        .from('meta_integrations')
        .select('webhook_verify_token')
        .not('webhook_verify_token', 'is', null)
        .limit(1)
        .single()

    const savedToken = data?.webhook_verify_token

    if (mode === 'subscribe' && token && savedToken && token === savedToken) {
        console.log('[META WEBHOOK] Verificado correctamente')
        return new NextResponse(challenge, { status: 200 })
    }

    return NextResponse.json({ error: 'Verificación fallida' }, { status: 403 })
}

// POST: recibir mensajes entrantes de Meta
export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const supabase = createAdminClient()

        // Estructuras: WhatsApp, Messenger e Instagram usan formatos similares
        const entries = body?.entry ?? []

        for (const entry of entries) {
            // WhatsApp Business API
            if (entry.changes) {
                for (const change of entry.changes) {
                    const value = change.value
                    if (!value?.messages) continue

                    for (const msg of value.messages) {
                        const contact = value.contacts?.[0]
                        await supabase.from('meta_messages').insert({
                            channel: 'whatsapp',
                            sender_id: msg.from,
                            sender_name: contact?.profile?.name ?? null,
                            message_text: msg.text?.body ?? null,
                            message_type: msg.type ?? 'text',
                            media_url: msg.image?.link ?? msg.audio?.link ?? null,
                        })
                    }
                }
            }

            // Messenger / Instagram
            if (entry.messaging) {
                for (const event of entry.messaging) {
                    if (!event.message) continue
                    const channel = body.object === 'instagram' ? 'instagram' : 'messenger'
                    await supabase.from('meta_messages').insert({
                        channel,
                        sender_id: event.sender?.id ?? 'unknown',
                        sender_name: null,
                        message_text: event.message?.text ?? null,
                        message_type: event.message?.attachments ? 'media' : 'text',
                    })
                }
            }
        }

        // Meta requiere 200 OK inmediato
        return NextResponse.json({ status: 'ok' })
    } catch (err) {
        console.error('[META WEBHOOK]', err)
        return NextResponse.json({ error: 'Error procesando webhook' }, { status: 500 })
    }
}
