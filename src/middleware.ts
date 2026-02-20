import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'contact@amcagency.com'

export async function middleware(req: NextRequest) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const pathname = req.nextUrl.pathname

    // ── Proteger /dashboard/* ─────────────────────────────────────────────
    if (pathname.startsWith('/dashboard')) {
        if (!user) {
            return NextResponse.redirect(new URL('/login?from=dashboard', req.url))
        }
    }

    // ── Proteger /admin/* ─────────────────────────────────────────────────
    if (pathname.startsWith('/admin')) {
        if (!user || user.email !== ADMIN_EMAIL) {
            return NextResponse.redirect(new URL('/login?from=admin', req.url))
        }
    }

    // ── Redirigir si ya está logueado y va a /login o /registro ──────────
    if ((pathname === '/login' || pathname === '/registro') && user) {
        if (user.email === ADMIN_EMAIL) {
            return NextResponse.redirect(new URL('/admin/clientes', req.url))
        }
        return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/dashboard/:path*', '/admin/:path*', '/login', '/registro'],
}
