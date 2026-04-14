import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// ── GET /api/app/client/profile ────────────────────────────────────────────
// Devuelve el perfil del cliente autenticado (su plan, estado de pago, etc.)
// Requiere: Authorization: Bearer <supabase_jwt>

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 });
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    // Verificar el JWT de Supabase para obtener el user_id
    const { data: { user }, error: authError } = await createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    ).auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ success: false, error: 'Token inválido o expirado' }, { status: 401 });
    }

    // Buscar el cliente por user_id en waas_clients
    const { data: client, error: clientError } = await supabase
      .from('waas_clients')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (clientError || !client) {
      // El usuario está autenticado pero no es un cliente registrado → puede ser admin o prospect
      return NextResponse.json(
        {
          success: false,
          error: 'No tienes un plan activo registrado. Contacta a AMC Agency.',
          code: 'NO_CLIENT_PROFILE',
        },
        { status: 404 }
      );
    }

    // Construir respuesta del portal del cliente
    const profile = {
      id: client.id,
      businessName: client.business_name,
      repName: client.rep_name,
      email: client.email,
      whatsapp: client.whatsapp,
      domain: client.domain,
      plan: client.plan,
      planLabel: getPlanLabel(client.plan),
      paymentStatus: client.payment_status,
      paymentStatusLabel: getPaymentLabel(client.payment_status),
      billingDay: client.billing_day,
      nextPaymentDate: client.next_payment_date,
      monthlyPrice: client.monthly_price,
      isBlocked: client.is_blocked,
      notes: client.notes,
      createdAt: client.created_at,
    };

    return NextResponse.json({ success: true, data: profile });
  } catch (err) {
    console.error('[API /app/client/profile]', err);
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 });
  }
}

function getPlanLabel(plan: string): string {
  const labels: Record<string, string> = {
    renting_basico: 'Renting Básico',
    renting_pro: 'Renting Pro',
    renting_elite: 'Renting Elite',
  };
  return labels[plan] ?? plan;
}

function getPaymentLabel(status: string): string {
  const labels: Record<string, string> = {
    active: 'Al día ✅',
    pending: 'Pendiente ⏳',
    overdue: 'Vencido ⚠️',
  };
  return labels[status] ?? status;
}
