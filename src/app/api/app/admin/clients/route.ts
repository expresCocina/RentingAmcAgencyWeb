import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// ── GET /api/app/admin/clients ─────────────────────────────────────────────
// Lista todos los clientes para la vista admin de la app móvil.
// Requiere: Authorization: Bearer <supabase_jwt> + rol admin

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const ADMIN_EMAILS = [
    process.env.ADMIN_EMAIL ?? 'contact@amcagencyweb.com',
    'info@amcagencyweb.com',
    'admin@amcagencyweb.com',
]

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 });
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    const { data: { user }, error: authError } = await createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    ).auth.getUser(token);

    if (authError || !user || !ADMIN_EMAILS.includes(user.email ?? '')) {
      return NextResponse.json({ success: false, error: 'Acceso denegado' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') ?? '50');

    let query = supabase
      .from('waas_clients')
      .select('id, business_name, rep_name, email, whatsapp, domain, plan, payment_status, monthly_price, next_payment_date, is_blocked, created_at')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (status) query = query.eq('payment_status', status);

    const { data: clients, error } = await query;

    if (error) {
      return NextResponse.json({ success: false, error: 'Error al obtener clientes' }, { status: 500 });
    }

    const formatted = (clients ?? []).map((c) => ({
      id: c.id,
      businessName: c.business_name,
      repName: c.rep_name,
      email: c.email,
      whatsapp: c.whatsapp,
      domain: c.domain,
      plan: c.plan,
      planLabel: getPlanLabel(c.plan),
      paymentStatus: c.payment_status,
      paymentStatusLabel: getPaymentLabel(c.payment_status),
      monthlyPrice: c.monthly_price,
      nextPaymentDate: c.next_payment_date,
      isBlocked: c.is_blocked,
      createdAt: c.created_at,
    }));

    return NextResponse.json({ success: true, data: formatted, total: formatted.length });
  } catch (err) {
    console.error('[API /app/admin/clients]', err);
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 });
  }
}

function getPlanLabel(plan: string): string {
  const labels: Record<string, string> = {
    renting_basico: 'Básico',
    renting_pro: 'Pro',
    renting_elite: 'Elite',
  };
  return labels[plan] ?? plan;
}

function getPaymentLabel(status: string): string {
  const labels: Record<string, string> = {
    active: 'Activo',
    pending: 'Pendiente',
    overdue: 'Vencido',
  };
  return labels[status] ?? status;
}
