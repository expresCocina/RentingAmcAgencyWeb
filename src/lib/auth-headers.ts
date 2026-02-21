import { createClient } from '@/lib/supabase/client'

/**
 * Obtiene el access_token de la sesión actual para enviarlo como Bearer header
 * en fetch requests a las API routes protegidas.
 */
export async function getAuthHeaders(): Promise<Record<string, string>> {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.access_token) return {}
    return { Authorization: `Bearer ${session.access_token}` }
}
