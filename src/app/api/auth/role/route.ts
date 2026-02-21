import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * GET /api/auth/role
 * Lee la sesión desde las cookies del browser y determina el rol:
 *  - 'admin'  → email coincide con ADMIN_EMAIL env var
 *  - 'client' → tiene registro en waas_clients
 *  - 'unknown'→ usuario sin perfil (no debería pasar)
 */
export async function GET(req: NextRequest) {
    try {
        // Leer sesión desde cookies (igual que el middleware)
        const response = NextResponse.next()
        const supabaseBrowser = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get(name: string) {
                        return req.cookies.get(name)?.value
                    },
                    set(name: string, value: string, options: CookieOptions) {
                        response.cookies.set({ name, value, ...options })
                    },
                    remove(name: string, options: CookieOptions) {
                        response.cookies.set({ name, value: '', ...options })
                    },
                },
            }
        )

        const { data: { user } } = await supabaseBrowser.auth.getUser()

        if (!user) {
            return NextResponse.json({ role: 'guest' }, { status: 401 })
        }

        // Verificar por email de admin (variable de entorno server-side)
        const adminEmail = process.env.ADMIN_EMAIL ?? ''
        if (adminEmail && user.email === adminEmail) {
            return NextResponse.json({ role: 'admin' })
        }

        // Verificar si tiene registro de cliente en DB
        const admin = createAdminClient()
        const { data: clientRecord } = await admin
            .from('waas_clients')
            .select('id')
            .eq('user_id', user.id)
            .maybeSingle()

        if (clientRecord) {
            return NextResponse.json({ role: 'client' })
        }

        // Si no tiene ADMIN_EMAIL configurado y no es cliente → tratar como admin
        if (!adminEmail) {
            return NextResponse.json({ role: 'admin' })
        }

        return NextResponse.json({ role: 'unknown' })
    } catch (err) {
        console.error('[api/auth/role]', err)
        return NextResponse.json({ role: 'unknown' }, { status: 500 })
    }
}
