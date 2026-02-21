import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

/**
 * Crea un cliente Supabase Auth usando las cookies del servidor (next/headers).
 * ✅ Compatible con Next.js 15 App Router Route Handlers y Server Components.
 */
export async function createAuthClient() {
    const cookieStore = await cookies()

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        )
                    } catch {
                        // Las cookies no se pueden setear en Server Components, ignorar
                    }
                },
            },
        }
    )
}

/**
 * Obtiene el usuario autenticado desde la sesión actual.
 * Retorna null si no hay sesión válida.
 */
export async function getSessionUser() {
    const supabase = await createAuthClient()
    const { data: { user } } = await supabase.auth.getUser()
    return user
}

/**
 * Verifica si el usuario actual es el administrador.
 */
export async function isAdmin(): Promise<boolean> {
    const user = await getSessionUser()
    const adminEmail = process.env.ADMIN_EMAIL
    return !!(user && adminEmail && user.email === adminEmail)
}
