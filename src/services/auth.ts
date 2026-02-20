import { createClient } from '@/lib/supabase/client'

export const authService = {
    async signUp(email: string, password: string) {
        const supabase = createClient()
        return supabase.auth.signUp({ email, password })
    },

    async signIn(email: string, password: string) {
        const supabase = createClient()
        return supabase.auth.signInWithPassword({ email, password })
    },

    async signOut() {
        const supabase = createClient()
        return supabase.auth.signOut()
    },

    async getSession() {
        const supabase = createClient()
        const { data: { session } } = await supabase.auth.getSession()
        return session
    },

    async getUser() {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        return user
    },
}
