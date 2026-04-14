import { NextRequest, NextResponse } from 'next/server';

/**
 * Proxy avanzado para sitios con X-Frame-Options.
 * - Descarga CSS de los sitios externos y lo inlinea en el HTML
 * - Inyecta <base href> para otros recursos
 * - Solo activo para dominios en whitelist
 */

const ALLOWED = [
  'ventas.emision.co',
  'www.turbobrandcol.com',
  'turbobrandcol.com',
];

const FETCH_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  Accept: 'text/html,application/xhtml+xml,*/*;q=0.8',
  'Accept-Language': 'es-CO,es;q=0.9,en;q=0.8',
  'Accept-Encoding': 'identity',
  'Cache-Control': 'no-cache',
};

async function fetchText(url: string): Promise<string | null> {
  try {
    const r = await fetch(url, {
      headers: { ...FETCH_HEADERS, Accept: 'text/css,*/*;q=0.1' },
      signal: AbortSignal.timeout(8_000),
    });
    if (!r.ok) return null;
    return await r.text();
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const targetUrl = searchParams.get('url');

  if (!targetUrl) return new NextResponse('Missing url', { status: 400 });

  let parsed: URL;
  try { parsed = new URL(targetUrl); }
  catch { return new NextResponse('Invalid URL', { status: 400 }); }

  if (!ALLOWED.includes(parsed.hostname)) {
    return new NextResponse('Domain not allowed', { status: 403 });
  }

  try {
    // 1. Descargar HTML principal
    const htmlRes = await fetch(targetUrl, {
      headers: FETCH_HEADERS,
      redirect: 'follow',
      signal: AbortSignal.timeout(12_000),
    });

    if (!htmlRes.ok) throw new Error(`HTTP ${htmlRes.status}`);

    let html = await htmlRes.text();

    const finalUrl = htmlRes.url || targetUrl;
    const finalOrigin = (() => {
      try { return new URL(finalUrl).origin; } catch { return parsed.origin; }
    })();

    // 2. Extraer todas las <link rel="stylesheet"> y sus hrefs
    const cssLinkRe = /<link[^>]+rel=["']stylesheet["'][^>]*href=["']([^"']+)["'][^>]*>/gi;
    const styleHrefs: string[] = [];
    let m: RegExpExecArray | null;
    while ((m = cssLinkRe.exec(html)) !== null) {
      styleHrefs.push(m[1]);
    }

    // 3. Descargar cada CSS en paralelo e inlinear
    const cssTexts = await Promise.all(
      styleHrefs.map(async (href) => {
        const absUrl = href.startsWith('http') ? href : `${finalOrigin}${href.startsWith('/') ? '' : '/'}${href}`;
        const css = await fetchText(absUrl);
        return css ? `/* ${href} */\n${css}` : null;
      })
    );

    // 4. Reemplazar <link stylesheet> con <style> inlineados
    let cssIndex = 0;
    html = html.replace(/<link[^>]+rel=["']stylesheet["'][^>]*>/gi, () => {
      const css = cssTexts[cssIndex++];
      return css ? `<style>${css}</style>` : '';
    });

    // 5. Inyectar <base href> para recursos no-CSS (imágenes, JS, fuentes)
    const baseTag = `<base href="${finalOrigin}/">`;
    if (!html.includes('<base ')) {
      html = html.replace(/<head[^>]*>/i, (match) => `${match}${baseTag}`);
      if (!html.includes('<base ')) html = baseTag + html;
    }

    // 6. Eliminar meta refresh
    html = html.replace(/<meta[^>]*http-equiv=["']?refresh["']?[^>]*>/gi, '');

    return new NextResponse(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=120, stale-while-revalidate=600',
      },
    });
  } catch (err) {
    console.error('[site-preview] Error:', targetUrl, err);
    // Devolver HTML de error que no dispara onError del iframe
    return new NextResponse(
      `<html><body style="background:#080B12;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;font-family:sans-serif">
        <div style="text-align:center;color:#3B556D">
          <div style="font-size:11px;letter-spacing:2px;text-transform:uppercase">Cargando preview...</div>
        </div>
      </body></html>`,
      { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    );
  }
}
