/**
 * AMC Agency — WaaS Lock Script
 * Instalar en el sitio del cliente:
 * <script src="https://amcagencyweb.com/waas-lock.js?domain=https://www.tuclienteweb.com/"></script>
 *
 * El script lee su propio parámetro "domain", consulta el estado en la API
 * y si el sitio está bloqueado, muestra una pantalla de bloqueo.
 */
(function () {
    'use strict';

    // 1. Leer parámetro domain= del atributo src del script
    var currentScript = document.currentScript ||
        Array.prototype.slice.call(document.getElementsByTagName('script')).pop();

    if (!currentScript) return;

    var src = currentScript.getAttribute('src') || '';
    var domainMatch = src.match(/[?&]domain=([^&]+)/);
    if (!domainMatch) return;

    var rawDomain = decodeURIComponent(domainMatch[1]);
    var cleanDomain = rawDomain.replace(/^https?:\/\//, '').replace(/\/$/, '');

    // 2. Consultar el estado en la API de AMC Agency
    var API_URL = 'https://amcagencyweb.com/api/waas/status?domain=' + encodeURIComponent(cleanDomain);

    fetch(API_URL, { cache: 'no-store' })
        .then(function (res) { return res.json(); })
        .then(function (data) {
            if (data && data.blocked === true) {
                showBlockOverlay(cleanDomain);
            }
        })
        .catch(function () {
            // Red no disponible → no bloquear (fail-open)
        });

    // 3. Función que inyecta el overlay de bloqueo
    function showBlockOverlay(domain) {
        // Prevenir scroll
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';

        var overlay = document.createElement('div');
        overlay.id = 'waas-lock-overlay';
        overlay.style.cssText = [
            'position:fixed',
            'top:0',
            'left:0',
            'width:100vw',
            'height:100vh',
            'background:#050505',
            'z-index:2147483647',
            'display:flex',
            'align-items:center',
            'justify-content:center',
            'flex-direction:column',
            'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif',
            'text-align:center',
            'padding:24px',
            'box-sizing:border-box',
        ].join(';');

        overlay.innerHTML = [
            // Fondo decorativo
            '<div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);',
            'width:500px;height:500px;background:radial-gradient(circle,rgba(239,68,68,0.12),transparent 70%);',
            'border-radius:50%;pointer-events:none;"></div>',

            // Contenido
            '<div style="position:relative;max-width:440px;width:100%;">',

            // Logo AMC
            '<div style="margin-bottom:32px;">',
            '<span style="font-size:20px;font-weight:900;letter-spacing:4px;color:#fff;">',
            'AMC <span style="color:#3b82f6;">®</span></span>',
            '</div>',

            // Ícono de candado
            '<div style="width:72px;height:72px;margin:0 auto 24px;border-radius:50%;',
            'background:rgba(239,68,68,0.15);border:1px solid rgba(239,68,68,0.3);',
            'display:flex;align-items:center;justify-content:center;">',
            '<svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="#ef4444" stroke-width="2">',
            '<path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>',
            '</svg></div>',

            // Título
            '<h1 style="font-size:28px;font-weight:900;color:#fff;margin:0 0 12px;line-height:1.2;',
            'letter-spacing:-0.03em;">Sitio Suspendido</h1>',

            // Subtítulo
            '<p style="color:#9ca3af;font-size:15px;line-height:1.6;margin:0 0 8px;">',
            'Este sitio web ha sido suspendido por AMC Agency</p>',
            '<p style="color:#6b7280;font-size:13px;margin:0 0 32px;">',
            'por falta de pago del servicio de renting.</p>',

            // Separador dominio
            '<div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);',
            'border-radius:12px;padding:12px 20px;margin-bottom:32px;display:inline-block;">',
            '<p style="margin:0;color:#4b5563;font-size:11px;text-transform:uppercase;',
            'letter-spacing:0.2em;font-weight:700;margin-bottom:4px;">Dominio</p>',
            '<p style="margin:0;color:#9ca3af;font-size:14px;font-weight:600;">' + escapeHtml(domain) + '</p>',
            '</div>',

            // Botón
            '<a href="https://wa.me/573001234567?text=Hola%2C+necesito+reactivar+mi+sitio+' + encodeURIComponent(domain) + '" ',
            'style="display:inline-flex;align-items:center;gap:8px;background:#25d366;color:#fff;',
            'font-weight:800;font-size:13px;letter-spacing:0.15em;text-transform:uppercase;',
            'padding:14px 28px;border-radius:100px;text-decoration:none;",>',
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="#fff">',
            '<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>',
            '<path d="M12.05 2C6.495 2 2 6.495 2 12.05c0 1.86.502 3.605 1.38 5.108L2 22l4.843-1.38A10.014 10.014 0 0012.05 22C17.604 22 22 17.505 22 11.95 22 6.495 17.605 2 12.05 2z"/>',
            '</svg>',
            'Contactar a AMC Agency</a>',
            '</div>',
        ].join('');

        document.body.appendChild(overlay);
    }

    function escapeHtml(str) {
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
})();
