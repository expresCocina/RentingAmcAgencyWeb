import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * GET /api/protect?domain=tusitio.com
 *
 * Devuelve JavaScript que el sitio del cliente ejecuta.
 * Estrategia de bloqueo en dos etapas:
 *   1. INMEDIATA: inyecta <style> que oculta <body> y <html> — corre sincrónicamente
 *      incluso antes de que exista <body>.
 *   2. OVERLAY: en DOMContentLoaded inserta el overlay visual y elimina el estilo oculto.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const raw = (searchParams.get('domain') ?? '').trim().toLowerCase()
  const domain = raw.replace(/^https?:\/\//, '').replace(/\/$/, '').replace(/^www\./, '')

  // Modo debug: devuelve JSON con el estado
  if (searchParams.get('debug') === '1') {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('waas_clients')
      .select('is_blocked, domain, id')
      .ilike('domain', `%${domain}%`)
    return NextResponse.json({ domain, data, error }, {
      headers: { 'Access-Control-Allow-Origin': '*' }
    })
  }

  let isBlocked = false

  if (domain) {
    try {
      const supabase = createAdminClient()
      // Busca por dominio exacto O con www. (sin/con prefijo)
      const withoutWww = domain.replace(/^www\./, '')
      const withWww = `www.${withoutWww}`

      const { data } = await supabase
        .from('waas_clients')
        .select('is_blocked')
        .or(`domain.eq.${withoutWww},domain.eq.${withWww}`)
        .limit(1)
        .maybeSingle()

      isBlocked = data?.is_blocked === true
    } catch (err) {
      console.error('[/api/protect]', err)
    }
  }

  const js = isBlocked
    ? `
(function(){
  if(document.getElementById('__amc_block'))return;

  /* 1. CSS inmediato — oculta TODO el contenido visual antes de que el DOM exista */
  var s=document.createElement('style');
  s.id='__amc_block_style';
  s.textContent='html,body{visibility:hidden!important;overflow:hidden!important}';
  (document.head||document.documentElement).appendChild(s);

  /* 2. Overlay visual — se renderiza en cuanto el DOM está listo */
  function render(){
    if(document.getElementById('__amc_block'))return;
    /* Restaurar visibilidad para mostrar el overlay */
    var prev=document.getElementById('__amc_block_style');
    if(prev)prev.remove();

    var d=document.createElement('div');
    d.id='__amc_block';
    d.style.cssText='position:fixed;top:0;left:0;width:100%;height:100%;'
      +'background:#050505;z-index:2147483647;display:flex;flex-direction:column;'
      +'align-items:center;justify-content:center;font-family:system-ui,sans-serif;'
      +'color:#fff;text-align:center;padding:24px;box-sizing:border-box;visibility:visible';
    d.innerHTML='<svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#ef4444"'
      +' stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"'
      +' style="margin-bottom:20px;flex-shrink:0">'
      +'<circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>'
      +'<h1 style="font-size:22px;font-weight:900;letter-spacing:-0.5px;margin:0 0 8px">Sitio Suspendido</h1>'
      +'<p style="color:#6b7280;font-size:14px;margin:0 0 24px;max-width:340px;line-height:1.5">'
      +'Este sitio ha sido suspendido temporalmente por falta de pago.<br>'
      +'Contacta con tu proveedor para reactivarlo.</p>'
      +'<a href="mailto:contact@amcagency.com"'
      +' style="background:#3b82f6;color:#fff;text-decoration:none;padding:10px 22px;'
      +'border-radius:999px;font-size:13px;font-weight:700">Contactar AMC Agency</a>';
    (document.body||document.documentElement).appendChild(d);
    document.documentElement.style.overflow='hidden';
    document.body&&(document.body.style.overflow='hidden');
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',render);
  } else {
    render();
  }
})();
`.trim()
    : '/* AMC Protection: OK */'

  return new NextResponse(js, {
    status: 200,
    headers: {
      'Content-Type': 'application/javascript; charset=utf-8',
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Access-Control-Allow-Origin': '*',
    },
  })
}
