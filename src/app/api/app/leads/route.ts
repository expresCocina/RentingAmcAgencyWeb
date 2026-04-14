import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// ── POST /api/app/leads ────────────────────────────────────────────────────
// Recibe una cotización/lead desde la app móvil.
// Guarda en waas_leads con source='app_mobile' y dispara email al admin.

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, service, message, app_version, device_info } = body;

    // Validaciones básicas
    if (!name || name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'El nombre es requerido' },
        { status: 400 }
      );
    }
    if (!phone && !email) {
      return NextResponse.json(
        { success: false, error: 'Se requiere al menos un método de contacto (email o teléfono)' },
        { status: 400 }
      );
    }

    // Insertar lead en Supabase
    const { data, error } = await supabase
      .from('waas_leads')
      .insert({
        name: name.trim(),
        email: email?.trim() || null,
        phone: phone?.trim() || null,
        service: service || 'no especificado',
        message: message?.trim() || null,
        source: 'app_mobile',
        status: 'new',
        app_version: app_version || null,
        device_info: device_info || null,
      })
      .select()
      .single();

    if (error) {
      console.error('[API /app/leads] Supabase error:', error);
      return NextResponse.json(
        { success: false, error: 'Error al guardar la cotización' },
        { status: 500 }
      );
    }

    // Notificación al admin via Resend (si está configurado)
    try {
      await sendAdminNotification({ name, email, phone, service, message });
    } catch (emailErr) {
      // No fallar si el email falla — el lead ya se guardó
      console.warn('[API /app/leads] Email notification failed:', emailErr);
    }

    return NextResponse.json(
      {
        success: true,
        message: '¡Cotización recibida! Te contactaremos pronto.',
        data: { id: data?.id },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('[API /app/leads] Unexpected error:', err);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

async function sendAdminNotification({
  name,
  email,
  phone,
  service,
  message,
}: {
  name: string;
  email?: string;
  phone?: string;
  service?: string;
  message?: string;
}) {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) return;

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'AMC Agency App <noreply@amcagencyweb.com>',
      to: ['info@amcagencyweb.com'],
      subject: `📱 Nuevo lead desde la App — ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #6366f1;">📱 Nuevo lead desde la App Móvil</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px; font-weight: bold;">Nombre:</td><td style="padding: 8px;">${name}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Email:</td><td style="padding: 8px;">${email || 'No proporcionado'}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Teléfono:</td><td style="padding: 8px;">${phone || 'No proporcionado'}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Servicio:</td><td style="padding: 8px;">${service || 'No especificado'}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Mensaje:</td><td style="padding: 8px;">${message || 'Sin mensaje'}</td></tr>
          </table>
          <p style="color: #888; font-size: 12px; margin-top: 24px;">
            Este lead llegó desde la app móvil de AMC Agency.
            <a href="https://www.amcagencyweb.com/admin/leads">Ver en el CRM →</a>
          </p>
        </div>
      `,
    }),
  });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
