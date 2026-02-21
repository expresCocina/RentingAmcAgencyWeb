import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { createAdminClient } from '@/lib/supabase/admin'

// GET /api/waas/admin/clients — lista todos los clientes (solo admin)
export async function GET(req: NextRequest) {
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
        const { data, error } = await supabase
            .from('waas_clients')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) throw error

        return NextResponse.json(data ?? [])
    } catch (err) {
        console.error('[admin/clients]', err)
        return NextResponse.json({ error: 'Error interno' }, { status: 500 })
    }
}
