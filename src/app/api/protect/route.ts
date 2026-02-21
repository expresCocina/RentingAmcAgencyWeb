import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

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

  // URL de WhatsApp con mensaje prellenado
  const waUrl = 'https://wa.me/573138537261?text=Hola%2C%20quisiera%20reactivar%20mi%20sitio%20web%20%F0%9F%99%8F'

  // JS generado — usa concatenación de strings simples para evitar problemas de escape
  const js = isBlocked ? buildBlockScript(waUrl) : '/* AMC Protection: OK */'

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

function buildBlockScript(waUrl: string): string {
  // Construimos el JS como string normal para evitar CUALQUIER problema de escape en template literals
  return [
    '(function(){',
    '  if(document.getElementById("__amc_block"))return;',
    '',
    '  // 1. Ocultar todo de forma inmediata antes de que exista el body',
    '  var s=document.createElement("style");',
    '  s.id="__amc_block_style";',
    '  s.textContent="html,body{visibility:hidden!important;overflow:hidden!important}";',
    '  (document.head||document.documentElement).appendChild(s);',
    '',
    '  // 2. Insertar overlay cuando el DOM esté listo',
    '  function render(){',
    '    if(document.getElementById("__amc_block"))return;',
    '    var prev=document.getElementById("__amc_block_style");',
    '    if(prev)prev.remove();',
    '',
    '    var d=document.createElement("div");',
    '    d.id="__amc_block";',
    '    d.setAttribute("style",',
    '      "position:fixed;top:0;left:0;width:100%;height:100%;z-index:2147483647;"',
    '      +"background:linear-gradient(135deg,#0a0a0f 0%,#0d0d1f 50%,#0a0a0f 100%);"',
    '      +"display:flex;flex-direction:column;align-items:center;justify-content:center;"',
    '      +"font-family:-apple-system,BlinkMacSystemFont,Segoe UI,system-ui,sans-serif;"',
    '      +"color:#fff;text-align:center;padding:32px;box-sizing:border-box;visibility:visible"',
    '    );',
    '',
    '    // Icono candado',
    '    var icon=document.createElement("div");',
    '    icon.setAttribute("style",',
    '      "width:72px;height:72px;border-radius:20px;"',
    '      +"background:linear-gradient(135deg,#1e40af,#3b82f6);"',
    '      +"display:flex;align-items:center;justify-content:center;"',
    '      +"margin-bottom:24px;box-shadow:0 20px 60px rgba(59,130,246,0.3)"',
    '    );',
    '    icon.innerHTML=\'<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>\';',
    '',
    '    // Textos',
    '    var eyebrow=document.createElement("p");',
    '    eyebrow.setAttribute("style","font-size:11px;font-weight:700;letter-spacing:0.2em;color:#6b7280;text-transform:uppercase;margin:0 0 10px");',
    '    eyebrow.textContent="AMC Agency Web";',
    '',
    '    var title=document.createElement("h1");',
    '    title.setAttribute("style","font-size:28px;font-weight:900;letter-spacing:-0.5px;margin:0 0 14px;color:#fff");',
    '    title.textContent="Sitio en Pausa \uD83D\uDD12";',
    '',
    '    var desc=document.createElement("p");',
    '    desc.setAttribute("style","color:#9ca3af;font-size:15px;margin:0 0 8px;max-width:360px;line-height:1.7");',
    '    desc.innerHTML="Hola \uD83D\uDC4B Notamos que hay un pendiente con tu plan.<br>¡No te preocupes! Podemos solucionarlo muy rápido.";',
    '',
    '    var desc2=document.createElement("p");',
    '    desc2.setAttribute("style","color:#6b7280;font-size:13px;margin:0 0 32px;max-width:320px;line-height:1.6");',
    '    desc2.textContent="Escríbenos por WhatsApp y en minutos te reactivamos el sitio.";',
    '',
    '    // Botón WhatsApp',
    `    var btn=document.createElement("a");`,
    `    btn.href="${waUrl}";`,
    '    btn.target="_blank";',
    '    btn.rel="noopener noreferrer";',
    '    btn.setAttribute("style",',
    '      "display:inline-flex;align-items:center;gap:10px;background:#25d366;color:#fff;"',
    '      +"text-decoration:none;padding:14px 28px;border-radius:999px;font-size:15px;"',
    '      +"font-weight:700;box-shadow:0 10px 40px rgba(37,211,102,0.35);cursor:pointer"',
    '    );',
    '    btn.innerHTML=\'<svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.304-1.654a11.882 11.882 0 0 0 5.684 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.82 11.82 0 0 0 23.878 3.6 11.815 11.815 0 0 0 12.05 0zm0 21.785h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.981.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884z"/></svg>Hablar por WhatsApp\';',
    '',
    '    // Footer',
    '    var footer=document.createElement("p");',
    '    footer.setAttribute("style","color:#374151;font-size:12px;margin:28px 0 0");',
    '    footer.textContent="amcagencyweb.com · Soporte 24/7";',
    '',
    '    // Ensamblar',
    '    d.appendChild(icon);',
    '    d.appendChild(eyebrow);',
    '    d.appendChild(title);',
    '    d.appendChild(desc);',
    '    d.appendChild(desc2);',
    '    d.appendChild(btn);',
    '    d.appendChild(footer);',
    '    (document.body||document.documentElement).appendChild(d);',
    '    document.documentElement.style.overflow="hidden";',
    '    if(document.body)document.body.style.overflow="hidden";',
    '  }',
    '',
    '  if(document.readyState==="loading"){',
    '    document.addEventListener("DOMContentLoaded",render);',
    '  } else {',
    '    render();',
    '  }',
    '})();',
  ].join('\n')
}
