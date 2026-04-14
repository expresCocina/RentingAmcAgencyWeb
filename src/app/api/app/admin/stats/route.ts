import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// ── GET /api/app/admin/stats ───────────────────────────────────────────────
// Dashboard de métricas del negocio para el admin en la app móvil.
// Requiere: Authorization: Bearer <supabase_jwt> + rol admin

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Emails de administradores autorizados
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
    // Verificar JWT y obtener user
    const { data: { user }, error: authError } = await createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    ).auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ success: false, error: 'Token inválido' }, { status: 401 });
    }

    // Verificar que es admin
    if (!ADMIN_EMAILS.includes(user.email ?? '')) {
      return NextResponse.json({ success: false, error: 'Acceso denegado' }, { status: 403 });
    }

    // ── Obtener métricas en paralelo ──────────────────────────
    const [
      { count: totalClients },
      { count: activeClients },
      { count: overdueClients },
      { count: totalLeads },
      { count: newLeads },
      { count: appLeads },
      { data: revenueData },
    ] = await Promise.all([
      supabase.from('waas_clients').select('*', { count: 'exact', head: true }),
      supabase.from('waas_clients').select('*', { count: 'exact', head: true }).eq('payment_status', 'active'),
      supabase.from('waas_clients').select('*', { count: 'exact', head: true }).eq('payment_status', 'overdue'),
      supabase.from('waas_leads').select('*', { count: 'exact', head: true }),
      supabase.from('waas_leads').select('*', { count: 'exact', head: true }).eq('status', 'new'),
      supabase.from('waas_leads').select('*', { count: 'exact', head: true }).eq('source', 'app_mobile'),
      supabase.from('waas_clients').select('monthly_price, payment_status').eq('payment_status', 'active'),
    ]);

    // Calcular ingresos mensuales
    const monthlyRevenue = (revenueData ?? []).reduce(
      (sum: number, c: { monthly_price: number }) => sum + (c.monthly_price || 0),
      0
    );

    // Leads de esta semana
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const { count: weeklyLeads } = await supabase
      .from('waas_leads')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', oneWeekAgo.toISOString());

    const stats = {
      clients: {
        total: totalClients ?? 0,
        active: activeClients ?? 0,
        overdue: overdueClients ?? 0,
        pending: (totalClients ?? 0) - (activeClients ?? 0) - (overdueClients ?? 0),
      },
      leads: {
        total: totalLeads ?? 0,
        new: newLeads ?? 0,
        thisWeek: weeklyLeads ?? 0,
        fromApp: appLeads ?? 0,
      },
      revenue: {
        monthly: monthlyRevenue,
        monthlyFormatted: new Intl.NumberFormat('es-CO', {
          style: 'currency',
          currency: 'COP',
          minimumFractionDigits: 0,
        }).format(monthlyRevenue),
      },
      generatedAt: new Date().toISOString(),
    };

    return NextResponse.json({ success: true, data: stats });
  } catch (err) {
    console.error('[API /app/admin/stats]', err);
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 });
  }
}
