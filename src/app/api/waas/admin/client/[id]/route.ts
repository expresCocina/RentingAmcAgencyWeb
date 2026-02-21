import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { createAdminClient } from '@/lib/supabase/admin'

// GET /api/waas/admin/client/[id] — obtiene un cliente por ID (solo admin)
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const res = NextResponse.next()
        const supabaseAuth = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll: () => req.cookies.getAll(),
                    setAll: (cookiesToSet) => {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            res.cookies.set(name, value, options)
                        )
                    },
                },
            }
        )

        const { data: { user } } = await supabaseAuth.auth.getUser()
        const adminEmail = process.env.ADMIN_EMAIL

        if (!user || user.email !== adminEmail) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
        }

        const supabase = createAdminClient()

        // Cliente
        const { data: client, error: clientError } = await supabase
            .from('waas_clients')
            .select('*')
            .eq('id', params.id)
            .single()

        if (clientError || !client) {
            return NextResponse.json({ error: 'Cliente no encontrado' }, { status: 404 })
        }

        // Logs de email
        const { data: logs } = await supabase
            .from('waas_email_logs')
            .select('*')
            .eq('client_id', params.id)
            .order('sent_at', { ascending: false })
            .limit(10)

        return NextResponse.json({ client, logs: logs ?? [] })
    } catch (err) {
        console.error('[admin/client/id]', err)
        return NextResponse.json({ error: 'Error interno' }, { status: 500 })
    }
}

// PATCH /api/waas/admin/client/[id] — actualiza un cliente (solo admin)
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const res = NextResponse.next()
        const supabaseAuth = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll: () => req.cookies.getAll(),
                    setAll: (cookiesToSet) => {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            res.cookies.set(name, value, options)
                        )
                    },
                },
            }
        )

        const { data: { user } } = await supabaseAuth.auth.getUser()
        const adminEmail = process.env.ADMIN_EMAIL

        if (!user || user.email !== adminEmail) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
        }

        const body = await req.json()
        const supabase = createAdminClient()

        const { error } = await supabase
            .from('waas_clients')
            .update(body)
            .eq('id', params.id)

        if (error) throw error

        return NextResponse.json({ success: true })
    } catch (err) {
        console.error('[admin/client/id PATCH]', err)
        return NextResponse.json({ error: 'Error al guardar' }, { status: 500 })
    }
}
