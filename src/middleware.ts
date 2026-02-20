import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'contact@amcagency.com'

export async function middleware(req: NextRequest) {
    const res = NextResponse.next()
    const pathname = req.nextUrl.pathname

    // Crear cliente Supabase compatible con Edge Runtime
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return req.cookies.get(name)?.value
                },
                set(name: string, value: string, options: Record<string, unknown>) {
                    req.cookies.set({ name, value, ...options } as Parameters<typeof req.cookies.set>[0])
                    res.cookies.set({ name, value, ...options } as Parameters<typeof res.cookies.set>[0])
                },
                remove(name: string, options: Record<string, unknown>) {
                    req.cookies.set({ name, value: '', ...options } as Parameters<typeof req.cookies.set>[0])
                    res.cookies.set({ name, value: '', ...options } as Parameters<typeof res.cookies.set>[0])
                },
            },
        }
    )

    const { data: { user } } = await supabase.auth.getUser()

    // ── Proteger /dashboard/* ──────────────────────────────────────────────
    if (pathname.startsWith('/dashboard')) {
        if (!user) {
            return NextResponse.redirect(new URL('/login?from=dashboard', req.url))
        }
    }

    // ── Proteger /admin/* ──────────────────────────────────────────────────
    if (pathname.startsWith('/admin')) {
        if (!user || user.email !== ADMIN_EMAIL) {
            return NextResponse.redirect(new URL('/login?from=admin', req.url))
        }
    }

    // ── Redirigir si ya está logueado y va a /login o /registro ───────────
    if ((pathname === '/login' || pathname === '/registro') && user) {
        if (user.email === ADMIN_EMAIL) {
            return NextResponse.redirect(new URL('/admin/clientes', req.url))
        }
        return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    return res
}

export const config = {
    matcher: ['/dashboard/:path*', '/admin/:path*', '/login', '/registro'],
}

