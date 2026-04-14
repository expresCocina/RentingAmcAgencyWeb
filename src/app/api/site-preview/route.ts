import { NextRequest, NextResponse } from 'next/server';

/**
 * Proxy transparente para mostrar sitios externos en iframes.
 * SOLO se usa para sitios con X-Frame-Options (ventas.emision.co, turbobrandcol.com).
 * Los demás sitios usan iframe directo.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const targetUrl = searchParams.get('url');

  if (!targetUrl) {
    return new NextResponse('Missing url parameter', { status: 400 });
  }

  // Whitelist de dominios — solo los que bloquean iframes
  const allowedDomains = [
    'ventas.emision.co',
    'www.turbobrandcol.com',
    'turbobrandcol.com',
  ];

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(targetUrl);
  } catch {
    return new NextResponse('Invalid URL', { status: 400 });
  }

  const hostname = parsedUrl.hostname;
  if (!allowedDomains.includes(hostname)) {
    return new NextResponse('Domain not allowed', { status: 403 });
  }

  try {
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'es-CO,es;q=0.9,en;q=0.8',
        'Accept-Encoding': 'identity', // Sin gzip para poder manipular el HTML
        Referer: `https://${hostname}/`,
        'Cache-Control': 'no-cache',
      },
      redirect: 'follow', // Seguir redirects
      signal: AbortSignal.timeout(12_000),
    });

    const contentType = response.headers.get('content-type') ?? 'text/html';
    if (!contentType.includes('text/html')) {
      return new NextResponse('Only HTML is proxied', { status: 415 });
    }

    let html = await response.text();

    // Base URL del sitio para resolver recursos relativos
    const siteOrigin = `${parsedUrl.protocol}//${parsedUrl.host}`;
    const finalUrl = response.url || targetUrl;
    const finalOrigin = (() => {
      try { return new URL(finalUrl).origin; } catch { return siteOrigin; }
    })();
    const baseHref = `${finalOrigin}/`;

    const baseTag = `<base href="${baseHref}">`;

    // Inyectar <base> solo si no existe ya uno
    if (!html.includes('<base ') && !html.includes('<BASE ')) {
      // Intentar ponerlo después de <head> o <HEAD>
      if (html.includes('<head>')) {
        html = html.replace('<head>', `<head>${baseTag}`);
      } else if (html.includes('<head ')) {
        html = html.replace(/<head[^>]*>/, (match) => `${match}${baseTag}`);
      } else {
        // Si no hay head, añadir al principio del body
        html = baseTag + html;
      }
    }

    // Eliminar meta refresh para evitar redireccionamientos dentro del iframe
    html = html.replace(/<meta[^>]*http-equiv=["']?refresh["']?[^>]*>/gi, '');

    return new NextResponse(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=120, stale-while-revalidate=600',
        // ✅ Sin X-Frame-Options → nuestro servidor no bloquea el iframe
      },
    });
  } catch (err) {
    console.error('[site-preview proxy] Error fetching:', targetUrl, err);
    return new NextResponse(
      `<html><body style="background:#111;color:#666;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0">
        <p style="font-size:12px">No se pudo cargar la previsualización</p>
      </body></html>`,
      {
        status: 200, // 200 para que el iframe no dispare onError
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      }
    );
  }
}
