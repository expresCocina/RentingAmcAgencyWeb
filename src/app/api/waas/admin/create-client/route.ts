import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { verifyAdminToken } from '@/lib/supabase/server-auth'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY || '')

// POST /api/waas/admin/create-client — crea un cliente directamente desde el admin
export async function POST(req: NextRequest) {
    try {
        if (!(await verifyAdminToken(req))) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
        }

        const { businessName, repName, email, domain, plan, billingDay, whatsapp, notes, password } = await req.json()

        if (!businessName || !repName || !email || !domain) {
            return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 })
        }

        const supabase = createAdminClient()

        // 1. Crear usuario en Auth
        const userPassword = password || Math.random().toString(36).slice(-10) + 'A1!'
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email,
            password: userPassword,
            email_confirm: true, // auto-confirmar
        })
        if (authError) {
            // Si ya existe, intenta obtenerlo
            if (authError.message.includes('already') || authError.message.includes('exists')) {
                return NextResponse.json({ error: 'El email ya está registrado' }, { status: 409 })
            }
            throw authError
        }

        const userId = authData.user.id

        // 2. Calcular fecha de próximo pago
        const today = new Date()
        const day = billingDay || today.getDate()
        let nextPaymentDate = new Date(today.getFullYear(), today.getMonth() + 1, day)

        // 3. Crear registro en waas_clients
        const cleanDomain = (domain as string).replace(/^https?:\/\//, '').replace(/\/$/, '')
        const { data: clientData, error: clientError } = await supabase
            .from('waas_clients')
            .insert([{
                user_id: userId,
                business_name: businessName,
                rep_name: repName,
                email,
                domain: cleanDomain,
                plan: plan || 'sin_plan',
                billing_day: day,
                next_payment_date: nextPaymentDate.toISOString().split('T')[0],
                whatsapp: whatsapp || null,
                notes: notes || null,
            }])
            .select('id')

        if (clientError) {
            await supabase.auth.admin.deleteUser(userId)
            throw clientError
        }

        const clientId = clientData?.[0]?.id ?? ''

        // 4. Enviar email de contraseña al cliente
        await resend.emails.send({
            from: 'AMC Agency <noreply@amcagencyweb.com>',
            to: email,
            subject: '¡Bienvenido a AMC Agency! Tus datos de acceso',
            html: `
                <div style="background:#050505;color:#fff;font-family:system-ui;padding:40px;border-radius:20px;max-width:560px;margin:0 auto;">
                    <h2 style="color:#3b82f6;">¡Hola ${repName}!</h2>
                    <p>Tu cuenta para <strong>${businessName}</strong> ha sido creada.</p>
                    <p>Datos de acceso a tu panel:</p>
                    <p><strong>Email:</strong> ${email}<br/>
                    <strong>Contraseña temporal:</strong> <code>${userPassword}</code></p>
                    <p>Ingresa en: <a href="https://amcagencyweb.com/login" style="color:#3b82f6;">Panel de Clientes</a></p>
                    <p style="color:#666;font-size:12px;">Cambia tu contraseña al ingresar.</p>
                </div>
            `,
        }).catch(err => console.error('Email error:', err))

        try {
            await supabase.from('waas_email_logs').insert([{
                client_id: clientId,
                email_type: 'welcome',
                sent_to: email,
                status: 'sent',
            }])
        } catch { /* ignore */ }

        return NextResponse.json({ message: 'Cliente creado exitosamente', clientId }, { status: 201 })
    } catch (err) {
        console.error('[admin/create-client]', err)
        return NextResponse.json({ error: 'Error interno al crear cliente' }, { status: 500 })
    }
}
