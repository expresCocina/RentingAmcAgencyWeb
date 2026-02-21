import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * GET /api/protect?domain=tusitio.com
 *
 * Devuelve JavaScript que el sitio del cliente ejecuta.
 * Si el dominio está bloqueado → inyecta un overlay que cubre todo el sitio.
 * Si está activo → no hace nada.
 *
 * Importante: las cabeceras CORS permiten que cualquier dominio cargue este script.
 */
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const domain = (searchParams.get('domain') ?? '').toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, '')

    let isBlocked = false

    if (domain) {
        try {
            const supabase = createAdminClient()
            const { data } = await supabase
                .from('waas_clients')
                .select('is_blocked')
                .or(`domain.eq.${domain},domain.eq.www.${domain}`)
                .maybeSingle()

            isBlocked = data?.is_blocked === true
        } catch (err) {
            console.error('[/api/protect]', err)
        }
    }

    // Generamos el JavaScript a devolver
    const js = isBlocked
        ? `
(function() {
  // Overlay de bloqueo AMC Agency
  if (document.getElementById('__amc_blocked')) return;
  var overlay = document.createElement('div');
  overlay.id = '__amc_blocked';
  overlay.style.cssText = [
    'position:fixed','top:0','left:0','width:100%','height:100%',
    'background:#050505','z-index:2147483647','display:flex',
    'flex-direction:column','align-items:center','justify-content:center',
    'font-family:system-ui,sans-serif','color:#fff','text-align:center','padding:24px'
  ].join(';');
  overlay.innerHTML = \`
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom:20px">
      <circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
    </svg>
    <h1 style="font-size:22px;font-weight:900;letter-spacing:-0.5px;margin:0 0 8px">Sitio Suspendido</h1>
    <p style="color:#6b7280;font-size:14px;margin:0 0 24px;max-width:340px;line-height:1.5">
      Este sitio web ha sido suspendido temporalmente por falta de pago.
      Contacta con tu proveedor para reactivarlo.
    </p>
    <a href="mailto:contact@amcagency.com"
       style="background:#3b82f6;color:#fff;text-decoration:none;padding:10px 22px;border-radius:999px;font-size:13px;font-weight:700;letter-spacing:.05em">
      Contactar AMC Agency
    </a>
  \`;
  document.documentElement.appendChild(overlay);
  // Prevenir scroll
  document.documentElement.style.overflow = 'hidden';
})();
`.trim()
        : '/* AMC Agency Protection: active */'

    return new NextResponse(js, {
        status: 200,
        headers: {
            'Content-Type': 'application/javascript; charset=utf-8',
            'Cache-Control': 'no-store, no-cache, must-revalidate',
            'Access-Control-Allow-Origin': '*',
        },
    })
}
