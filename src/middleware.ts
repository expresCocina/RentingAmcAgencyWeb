import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'contact@amcagency.com'

export async function middleware(request: NextRequest) {
    // 1. Creamos una respuesta base que podremos modificar
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    // 2. Creamos el cliente Supabase usando los tipos correctos (CookieOptions)
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value
                },
                set(name: string, value: string, options: CookieOptions) {
                    request.cookies.set({ name, value, ...options })
                    response.cookies.set({ name, value, ...options })
                },
                remove(name: string, options: CookieOptions) {
                    request.cookies.set({ name, value: '', ...options })
                    response.cookies.set({ name, value: '', ...options })
                },
            },
        }
    )

    // 3. Obtenemos el usuario (Esto puede disparar los métodos set/remove de arriba)
    const { data: { user } } = await supabase.auth.getUser()
    const pathname = request.nextUrl.pathname

    // 4. FUNCIÓN CLAVE: Redirigir SIN perder las cookies de sesión
    const redirectWithCookies = (url: URL) => {
        const redirectResponse = NextResponse.redirect(url)
        response.cookies.getAll().forEach((cookie) => {
            redirectResponse.cookies.set(cookie.name, cookie.value)
        })
        return redirectResponse
    }

    // ── Proteger /dashboard/* (Para los Clientes) ──────────────────────────
    if (pathname.startsWith('/dashboard')) {
        if (!user) {
            return redirectWithCookies(new URL('/login?from=dashboard', request.url))
        }
    }

    // ── Proteger /admin/* o /crm/* (Para ti, el Administrador) ─────────────
    if (pathname.startsWith('/admin') || pathname.startsWith('/crm')) {
        if (!user || user.email !== ADMIN_EMAIL) {
            return redirectWithCookies(new URL('/login?from=admin', request.url))
        }
    }

    // ── Redirigir si ya está logueado y va a /login o /registro ───────────
    if ((pathname === '/login' || pathname === '/registro') && user) {
        if (user.email === ADMIN_EMAIL) {
            return redirectWithCookies(new URL('/crm', request.url)) // Te enviamos al panel WaaS
        }
        return redirectWithCookies(new URL('/dashboard', request.url)) // Enviamos al cliente a su panel
    }

    return response
}

export const config = {
    matcher: ['/dashboard/:path*', '/admin/:path*', '/crm/:path*', '/login', '/registro'],
}