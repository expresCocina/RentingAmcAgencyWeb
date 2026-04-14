import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// ── GET /api/app/admin/leads ───────────────────────────────────────────────
// Lista todos los leads para la vista admin de la app móvil.
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
    const source = searchParams.get('source');
    const limit = parseInt(searchParams.get('limit') ?? '50');

    let query = supabase
      .from('waas_leads')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (status) query = query.eq('status', status);
    if (source) query = query.eq('source', source);

    const { data: leads, error } = await query;

    if (error) {
      return NextResponse.json({ success: false, error: 'Error al obtener leads' }, { status: 500 });
    }

    const formatted = (leads ?? []).map((l) => ({
      id: l.id,
      name: l.name,
      email: l.email,
      phone: l.phone,
      service: l.service,
      message: l.message,
      source: l.source,
      sourceLabel: getSourceLabel(l.source),
      status: l.status,
      statusLabel: getStatusLabel(l.status),
      appVersion: l.app_version,
      createdAt: l.created_at,
    }));

    return NextResponse.json({ success: true, data: formatted, total: formatted.length });
  } catch (err) {
    console.error('[API /app/admin/leads]', err);
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 });
  }
}

// ── PATCH /api/app/admin/leads ─────────────────────────────────────────────
// Actualizar el status de un lead desde la app móvil
export async function PATCH(req: NextRequest) {
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

    const { id, status } = await req.json();
    const validStatuses = ['new', 'contacted', 'converted', 'lost'];

    if (!id || !status || !validStatuses.includes(status)) {
      return NextResponse.json({ success: false, error: 'Datos inválidos' }, { status: 400 });
    }

    const { error } = await supabase
      .from('waas_leads')
      .update({ status })
      .eq('id', id);

    if (error) {
      return NextResponse.json({ success: false, error: 'Error al actualizar lead' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Lead actualizado' });
  } catch (err) {
    console.error('[API /app/admin/leads PATCH]', err);
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 });
  }
}

function getSourceLabel(source: string): string {
  const labels: Record<string, string> = {
    website_form: 'Sitio web',
    app_mobile: 'App móvil',
    pricing_vip: 'Pricing VIP',
    renting_page: 'Página Renting',
  };
  return labels[source] ?? source;
}

function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    new: 'Nuevo',
    contacted: 'Contactado',
    converted: 'Convertido',
    lost: 'Perdido',
  };
  return labels[status] ?? status;
}
