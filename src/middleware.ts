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
                    // Actualizamos tanto la request (para que Supabase lo lea ahora)
                    // como la response (para que el navegador lo guarde)
                    request.cookies.set({ name, value, ...options })
                    response.cookies.set({ name, value, ...options })
                },
                remove(name: string, options: CookieOptions) {
                    request.cookies.set({ name, value: '', ...options })
                    export async function middleware(req: NextRequest) {
                        let res = NextResponse.next({
                            request: {
                                headers: req.headers,
                            },
                        })

                        const pathname = req.nextUrl.pathname

                        const supabase = createServerClient(
                            process.env.NEXT_PUBLIC_SUPABASE_URL!,
                            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                            {
                                cookies: {
                                    get(name: string) {
                                        return req.cookies.get(name)?.value
                                    },
                                    set(name: string, value: string, options: CookieOptions) {
                                        req.cookies.set({ name, value, ...options })
                                        res = NextResponse.next({
                                            request: {
                                                headers: req.headers,
                                            },
                                        })
                                        res.cookies.set({ name, value, ...options })
                                    },
                                    remove(name: string, options: CookieOptions) {
                                        req.cookies.set({ name, value: '', ...options })
                                        res = NextResponse.next({
                                            request: {
                                                headers: req.headers,
                                            },
                                        })
                                        res.cookies.set({ name, value: '', ...options })
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
                        // Asegúrate de incluir aquí las rutas que quieres proteger
                        matcher: ['/dashboard/:path*', '/admin/:path*', '/crm/:path*', '/login', '/registro'],
                    }
