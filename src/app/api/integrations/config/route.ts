import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'contact@amcagencyweb.com'

// GET — cargar configuración de integraciones
export async function GET() {
    const supabase = createAdminClient()
    const { data, error } = await supabase
        .from('meta_integrations')
        .select('*')
        .order('channel')

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ integrations: data })
}

// POST — guardar configuración de un canal
export async function POST(req: NextRequest) {
    const server = await createClient()
    const { data: { user } } = await server.auth.getUser()

    if (!user || user.email !== ADMIN_EMAIL) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await req.json()
    const { channel, is_active, phone_number_id, waba_id, access_token, page_id, instagram_account_id, webhook_verify_token } = body

    if (!['whatsapp', 'instagram', 'messenger'].includes(channel)) {
        return NextResponse.json({ error: 'Canal inválido' }, { status: 400 })
    }

    const supabase = createAdminClient()
    const { error } = await supabase
        .from('meta_integrations')
        .update({
            is_active: is_active === 'true' || is_active === true,
            phone_number_id: phone_number_id || null,
            waba_id: waba_id || null,
            access_token: access_token || null,
            page_id: page_id || null,
            instagram_account_id: instagram_account_id || null,
            webhook_verify_token: webhook_verify_token || null,
        })
        .eq('channel', channel)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
}
