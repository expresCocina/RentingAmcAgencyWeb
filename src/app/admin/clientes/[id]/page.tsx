import { createAdminClient } from '@/lib/supabase/admin'
import { notFound } from 'next/navigation'
import ClientDetailClient from './ClientDetailClient'

// Server Component — fetchea directamente con el admin client (sin Bearer tokens)
export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = createAdminClient()

    const { data: client } = await supabase
        .from('waas_clients')
        .select('*')
        .eq('id', id)
        .single()

    if (!client) {
        notFound()
    }

    const { data: logs } = await supabase
        .from('waas_email_logs')
        .select('*')
        .eq('client_id', id)
        .order('sent_at', { ascending: false })
        .limit(10)

    return <ClientDetailClient initialClient={client} initialLogs={logs ?? []} />
}
