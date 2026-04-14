import { NextRequest, NextResponse } from 'next/server';

/**
 * Proxy transparente para mostrar sitios externos en iframes.
 * Elimina X-Frame-Options y CSP frame-ancestors del sitio destino,
 * inyecta <base href> para que los recursos relativos resuelvan correctamente.
 *
 * Uso: /api/site-preview?url=https://ventas.emision.co
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const targetUrl = searchParams.get('url');

  if (!targetUrl) {
    return new NextResponse('Missing url parameter', { status: 400 });
  }

  // Whitelist de dominios permitidos
  const allowedDomains = [
    'ventas.emision.co',
    'www.turbobrandcol.com',
    'turbobrandcol.com',
    'www.cycrelojeria.com',
    'cycrelojeria.com',
    'www.italiatelier.com',
    'italiatelier.com',
    'crmopticalyonvision.vercel.app',
    'crm-vida-digitalcol.vercel.app',
  ];

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(targetUrl);
  } catch {
    return new NextResponse('Invalid URL', { status: 400 });
  }

  const hostname = parsedUrl.hostname;
  if (!allowedDomains.some((d) => hostname === d || hostname.endsWith(`.${d}`))) {
    return new NextResponse('Domain not allowed', { status: 403 });
  }

  try {
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'es-CO,es;q=0.9,en;q=0.8',
        'Cache-Control': 'no-cache',
      },
      signal: AbortSignal.timeout(10_000),
    });

    const contentType = response.headers.get('content-type') ?? 'text/html';

    if (!contentType.includes('text/html')) {
      // Para recursos no-HTML (CSS, imágenes, JS) no los proxiamos aquí
      return new NextResponse('Only HTML is proxied', { status: 415 });
    }

    let html = await response.text();

    // Construye la base URL del sitio original para resolver recursos relativos
    const baseOrigin = `${parsedUrl.protocol}//${parsedUrl.host}`;
    const baseTag = `<base href="${baseOrigin}/" target="_top">`;

    // Inyecta <base> justo después de <head> (o al inicio si no hay <head>)
    if (html.includes('<head>')) {
      html = html.replace('<head>', `<head>${baseTag}`);
    } else if (html.includes('<HEAD>')) {
      html = html.replace('<HEAD>', `<HEAD>${baseTag}`);
    } else {
      html = baseTag + html;
    }

    // Elimina meta refresh para evitar redireccionamientos no deseados
    html = html.replace(/<meta[^>]*http-equiv=["']?refresh["']?[^>]*>/gi, '');

    // Respuesta sin cabeceras de bloqueo de frames
    return new NextResponse(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
        // ✅ NO seteamos X-Frame-Options ni CSP con frame-ancestors
        // para que sea embebible en nuestro propio iframe
      },
    });
  } catch (err) {
    console.error('[site-preview proxy] Error:', err);
    return new NextResponse('Failed to fetch site', { status: 502 });
  }
}
