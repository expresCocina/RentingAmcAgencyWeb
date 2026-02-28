import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /auth/confirm
 * Maneja la confirmación de email de Supabase (magic link, registro, recuperación).
 * Supabase redirige aquí con ?token_hash=...&type=...
 */
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const token_hash = searchParams.get('token_hash')
    const type = searchParams.get('type') as 'email' | 'recovery' | 'signup' | null
    const next = searchParams.get('next') ?? '/dashboard'

    if (token_hash && type) {
        const supabase = createAdminClient()
        const { error } = await supabase.auth.verifyOtp({ type, token_hash })

        if (!error) {
            return NextResponse.redirect(new URL(next, request.url))
        }
    }

    // Si falla, redirige a login con mensaje de error
    return NextResponse.redirect(new URL('/login?error=token_invalido', request.url))
}
