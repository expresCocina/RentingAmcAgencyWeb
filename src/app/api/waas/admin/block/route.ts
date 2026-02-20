import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { waasService } from '@/services/waas';
import { siteBlockedEmail, siteUnblockedEmail } from '@/services/email-templates';
import { Resend } from 'resend';

// 1. Aseguramos que Resend tenga la API Key (evita crasheos si la variable no carga a tiempo)
const resend = new Resend(process.env.RESEND_API_KEY || '');
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'contact@amcagency.com';

export async function POST(req: NextRequest) {
    try {
        // 2. Autenticación robusta (añadimos la captura del 'error' de Supabase)
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user || user.email !== ADMIN_EMAIL) {
            return NextResponse.json({ error: 'No autorizado o sesión expirada' }, { status: 401 });
        }

        // 3. Extracción de body con protección contra JSON vacíos
        let body;
        try {
            body = await req.json();
        } catch (e) {
            return NextResponse.json({ error: 'Formato JSON inválido' }, { status: 400 });
        }

        const { clientId, block } = body;

        // 4. Validación estricta (ahora acepta booleanos reales o strings "true"/"false")
        const isBlocked = typeof block === 'string' ? block === 'true' : Boolean(block);

        if (!clientId) {
            return NextResponse.json({ error: 'Falta el ID del cliente' }, { status: 400 });
        }

        // 5. Obtener datos del cliente
        const client = await waasService.getClientById(clientId);
        if (!client) {
            return NextResponse.json({ error: 'Cliente no encontrado' }, { status: 404 });
        }

        // 6. Actualizar estado en Supabase
        await waasService.setBlocked(clientId, isBlocked);

        // 7. Enviar email correspondiente con manejo de excepciones tipado
        try {
            const emailHtml = isBlocked
                ? siteBlockedEmail({ businessName: client.business_name, repName: client.rep_name, domain: client.domain })
                : siteUnblockedEmail({ businessName: client.business_name, repName: client.rep_name, domain: client.domain });

            const subject = isBlocked
                ? `⚠️ Tu sitio ${client.domain} ha sido suspendido`
                : `✅ Tu sitio ${client.domain} ha sido reactivado`;

            const { error: emailError } = await resend.emails.send({
                from: 'AMC Agency <noreply@amcagencyweb.com>',
                to: client.email,
                subject,
                html: emailHtml, // Nota: Si tus templates son componentes React, esto debería ser `react: emailHtml`
            });

            // Registrar en logs (aseguramos enviar el string correcto)
            await waasService.logEmail(
                clientId,
                isBlocked ? 'blocked' : 'unblocked',
                client.email,
                emailError ? 'failed' : 'sent'
            );

            if (emailError) {
                console.error('[Resend Error]', emailError);
            }
        } catch (emailException) {
            // Email falla (ej. caída de red) → no bloquea la operación de la base de datos
            console.error('[Email Exception]', emailException);
        }

        // 8. Respuesta exitosa estructurada
        return NextResponse.json({
            success: true,
            clientId,
            is_blocked: isBlocked,
            message: isBlocked ? 'Sitio bloqueado y cliente notificado' : 'Sitio desbloqueado y cliente notificado',
        });

    } catch (err: any) {
        // Captura de errores de servidor (Evita que el servidor crashee en consola)
        console.error('[admin/block] Error crítico:', err.message || err);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}
