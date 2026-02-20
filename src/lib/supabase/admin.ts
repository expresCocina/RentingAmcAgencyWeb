import { createClient } from '@supabase/supabase-js'

// Cliente con service_role — bypasa RLS, solo usar en API routes del servidor
export const createAdminClient = () =>
    createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
    )
