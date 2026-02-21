import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { waasService } from '@/services/waas'
import { welcomeEmail } from '@/services/email-templates'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

// POST /api/auth/register
export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { businessName, repName, email, password, whatsapp, domain, plan, billingDay } = body

        if (!businessName || !repName || !email || !password || !domain) {
            return NextResponse.json({ error: 'Campos requeridos incompletos' }, { status: 400 })
        }

        const supabase = createAdminClient()

        // 1. Crear usuario en Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
        })

        if (authError || !authData.user) {
            const msg = authError?.message ?? 'Error al crear cuenta'
            console.error('[register] Auth error:', authError)
            if (msg.toLowerCase().includes('already registered') || msg.toLowerCase().includes('already exists')) {
                return NextResponse.json({ error: 'Este email ya está registrado' }, { status: 400 })
            }
            return NextResponse.json({ error: msg }, { status: 400 })
        }

        // 2. Calcular próxima fecha de pago
        const today = new Date()
        const day = billingDay ?? 1
        let nextPayment = new Date(today.getFullYear(), today.getMonth(), day)
        if (nextPayment <= today) {
            nextPayment = new Date(today.getFullYear(), today.getMonth() + 1, day)
        }

        // 3. Insertar en waas_clients
        const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/$/, '')
        // plan vacío o ausente se guarda como 'sin_plan' (la BD no permite null)
        const planValue = (plan && plan.trim() !== '') ? plan.trim() : 'sin_plan'

        const { data: clientData, error: clientError } = await supabase
            .from('waas_clients')
            .insert({
                user_id: authData.user.id,
                business_name: businessName,
                rep_name: repName,
                email,
                whatsapp: whatsapp ?? null,
                domain: cleanDomain,
                plan: planValue,
                billing_day: day,
                next_payment_date: nextPayment.toISOString().split('T')[0],
            })
            .select()
            .single()

        if (clientError) {
            console.error('[register] Client insert error:', clientError)
            // Rollback: eliminar el usuario creado
            await supabase.auth.admin.deleteUser(authData.user.id)
            if (clientError.code === '23505') {
                return NextResponse.json({ error: 'Este dominio ya está registrado' }, { status: 400 })
            }
            if (clientError.code === '42P01') {
                return NextResponse.json({ error: 'Base de datos no configurada. El administrador debe ejecutar el schema SQL.' }, { status: 500 })
            }
            return NextResponse.json({ error: `Error al crear perfil: ${clientError.message}` }, { status: 500 })
        }

        // 4. Enviar email de bienvenida (no bloquea el registro si falla)
        try {
            const planLabel = planValue
                ? planValue.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())
                : 'Por asignar'
            const { error: emailError } = await resend.emails.send({
                from: 'AMC Agency <noreply@amcagencyweb.com>',
                to: email,
                subject: `¡Bienvenido a AMC Agency, ${repName}! 🚀`,
                html: welcomeEmail({ businessName, repName, domain: cleanDomain, plan: planLabel }),
            })
            await waasService.logEmail(clientData.id, 'welcome', email, emailError ? 'failed' : 'sent')
        } catch (emailErr) {
            console.warn('[register] Email send failed (non-blocking):', emailErr)
        }

        return NextResponse.json({ success: true, userId: authData.user.id }, { status: 201 })
    } catch (err) {
        console.error('[register] Unexpected error:', err)
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
    }
}

