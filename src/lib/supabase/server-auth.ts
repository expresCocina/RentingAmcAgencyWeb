import { createAdminClient } from '@/lib/supabase/admin'

// Lista de emails con acceso admin
const ADMIN_EMAILS = [
    process.env.ADMIN_EMAIL ?? 'contact@amcagencyweb.com',
    'contact@amcagencyweb.com',
    'info@amcagencyweb.com',
    'admin@amcagencyweb.com',
]

/**
 * Verifica el Bearer token del header Authorization.
 * Usa el admin client que no depende de cookies — más confiable en API routes.
 */
export async function verifyBearerToken(req: Request) {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) return null

    const token = authHeader.replace('Bearer ', '').trim()
    if (!token) return null

    const supabase = createAdminClient()
    const { data: { user } } = await supabase.auth.getUser(token)
    return user
}

/**
 * Verifica si el usuario del Bearer token es el administrador.
 * Acepta cualquier email de la lista ADMIN_EMAILS.
 */
export async function verifyAdminToken(req: Request): Promise<boolean> {
    const user = await verifyBearerToken(req)
    if (!user?.email) return false
    return ADMIN_EMAILS.includes(user.email)
}

/**
 * Verifica si el usuario del Bearer token está autenticado (cualquier usuario).
 */
export async function verifyAuthToken(req: Request) {
    return verifyBearerToken(req)
}
