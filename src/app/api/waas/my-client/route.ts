import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { createAdminClient } from '@/lib/supabase/admin'

// GET /api/waas/my-client
// Devuelve el registro waas_clients del usuario autenticado (se llama desde el dashboard)
export async function GET(req: NextRequest) {
    try {
        // 1. Obtener sesión del usuario desde cookies
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

        const { data: { user }, error: userError } = await supabaseAuth.auth.getUser()

        if (userError || !user) {
            return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
        }

        // 2. Buscar su registro en waas_clients usando el admin client (server-side)
        const adminSupabase = createAdminClient()
        const { data, error } = await adminSupabase
            .from('waas_clients')
            .select('*')
            .eq('user_id', user.id)
            .single()

        if (error || !data) {
            return NextResponse.json({ error: 'Cliente no encontrado' }, { status: 404 })
        }

        return NextResponse.json(data)
    } catch (err) {
        console.error('[my-client]', err)
        return NextResponse.json({ error: 'Error interno' }, { status: 500 })
    }
}
