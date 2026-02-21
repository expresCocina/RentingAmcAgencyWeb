import { NextResponse, type NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * POST /api/leads (endpoint PÚBLICO)
 * Recibe submissions del formulario de contacto del sitio web
 * y crea un lead en waas_leads.
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

        return NextResponse.json({ ok: true }, { status: 201 })
    } catch (err) {
        console.error('[api/leads POST]', err)
        return NextResponse.json({ error: 'Error interno' }, { status: 500 })
    }
}
