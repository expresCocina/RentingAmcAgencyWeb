import { createAdminClient } from '@/lib/supabase/admin'

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
 */
export async function verifyAdminToken(req: Request): Promise<boolean> {
    const user = await verifyBearerToken(req)
    const adminEmail = process.env.ADMIN_EMAIL
    return !!(user && adminEmail && user.email === adminEmail)
}

/**
 * Verifica si el usuario del Bearer token está autenticado (cualquier usuario).
 */
export async function verifyAuthToken(req: Request) {
    return verifyBearerToken(req)
}
