// ── Plantillas de email para AMC Agency WaaS ──────────────────────────────

const BASE_STYLE = `
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #050505;
  color: #ffffff;
  margin: 0; padding: 0;
`

const containerStyle = `
  max-width: 560px;
  margin: 0 auto;
  padding: 40px 24px;
`

const logoHtml = `
  <div style="text-align:center;margin-bottom:32px;">
    <span style="font-size:22px;font-weight:900;letter-spacing:4px;color:#fff;">
      AMC <span style="color:#3b82f6;">®</span>
    </span>
  </div>
`

const footerHtml = `
  <div style="margin-top:40px;padding-top:24px;border-top:1px solid rgba(255,255,255,0.08);text-align:center;">
    <p style="color:#4b5563;font-size:11px;margin:0;">
      AMC Agency · amcagencyweb.com · contacto@amcagencyweb.com
    </p>
    <p style="color:#4b5563;font-size:10px;margin:6px 0 0;">
      Este email fue enviado automáticamente. No responder.
    </p>
  </div>
`

export function welcomeEmail(data: { businessName: string; repName: string; domain: string; plan: string }): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="${BASE_STYLE}">
  <div style="${containerStyle}">
    ${logoHtml}
    <div style="background:linear-gradient(135deg,rgba(59,130,246,0.15),rgba(99,102,241,0.08));border:1px solid rgba(59,130,246,0.25);border-radius:20px;padding:32px;">
      <p style="font-size:12px;font-weight:800;letter-spacing:0.3em;text-transform:uppercase;color:#3b82f6;margin:0 0 12px;">Bienvenido a AMC Agency</p>
      <h1 style="font-size:28px;font-weight:900;color:#fff;margin:0 0 16px;line-height:1.2;">
        ¡Tu sitio web está <span style="color:#3b82f6;">en marcha!</span> 🚀
      </h1>
      <p style="color:#9ca3af;font-size:15px;line-height:1.6;margin:0 0 24px;">
        Hola <strong style="color:#fff;">${data.repName}</strong>, tu cuenta para <strong style="color:#fff;">${data.businessName}</strong> ha sido creada exitosamente.
      </p>
      <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:20px;margin-bottom:24px;">
        <p style="margin:0 0 8px;font-size:12px;color:#6b7280;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;">Detalles de tu cuenta</p>
        <p style="margin:4px 0;color:#e5e7eb;font-size:14px;">📌 <strong>Negocio:</strong> ${data.businessName}</p>
        <p style="margin:4px 0;color:#e5e7eb;font-size:14px;">🌐 <strong>Dominio:</strong> ${data.domain}</p>
        <p style="margin:4px 0;color:#e5e7eb;font-size:14px;">📦 <strong>Plan:</strong> ${data.plan}</p>
      </div>
      <a href="https://amcagencyweb.com/dashboard" style="display:block;text-align:center;background:#3b82f6;color:#fff;font-weight:800;font-size:13px;letter-spacing:0.2em;text-transform:uppercase;padding:16px 32px;border-radius:100px;text-decoration:none;">
        Ver mi Dashboard →
      </a>
    </div>
    <div style="margin-top:20px;text-align:center;">
      <p style="color:#6b7280;font-size:13px;">¿Necesitas ayuda? <a href="https://wa.me/573138537261" style="color:#3b82f6;">Escríbenos por WhatsApp</a></p>
    </div>
    ${footerHtml}
  </div>
</body>
</html>`
}

export function paymentReminderEmail(data: { businessName: string; repName: string; domain: string; paymentDate: string; daysLeft: number }): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="${BASE_STYLE}">
  <div style="${containerStyle}">
    ${logoHtml}
    <div style="background:linear-gradient(135deg,rgba(245,158,11,0.15),rgba(234,88,12,0.08));border:1px solid rgba(245,158,11,0.3);border-radius:20px;padding:32px;">
      <p style="font-size:12px;font-weight:800;letter-spacing:0.3em;text-transform:uppercase;color:#f59e0b;margin:0 0 12px;">⏰ Recordatorio de Pago</p>
      <h1 style="font-size:26px;font-weight:900;color:#fff;margin:0 0 16px;line-height:1.2;">
        Tu pago vence en <span style="color:#f59e0b;">${data.daysLeft} ${data.daysLeft === 1 ? 'día' : 'días'}</span>
      </h1>
      <p style="color:#9ca3af;font-size:15px;line-height:1.6;margin:0 0 24px;">
        Hola <strong style="color:#fff;">${data.repName}</strong>, te recordamos que el servicio de <strong style="color:#fff;">${data.businessName}</strong> vence el <strong style="color:#f59e0b;">${data.paymentDate}</strong>. Realiza tu pago a tiempo para evitar la suspensión de tu sitio.
      </p>

      <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:20px;margin-bottom:28px;">
        <p style="margin:0 0 8px;font-size:11px;color:#6b7280;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;">Detalles del servicio</p>
        <p style="margin:4px 0;color:#e5e7eb;font-size:14px;">🌐 <strong>Dominio:</strong> ${data.domain}</p>
        <p style="margin:4px 0;color:#fbbf24;font-size:14px;">📅 <strong>Fecha límite de pago:</strong> ${data.paymentDate}</p>
        <p style="margin:4px 0;color:#fca5a5;font-size:14px;">⚠️ Si no pagas, tu sitio será suspendido automáticamente</p>
      </div>

      <!-- BOTÓN PAGO PRINCIPAL -->
      <a href="https://checkout.nequi.wompi.co/l/NzE29a"
         style="display:block;text-align:center;background:linear-gradient(135deg,#f59e0b,#ea580c);color:#fff;font-weight:900;font-size:14px;letter-spacing:0.15em;text-transform:uppercase;padding:18px 32px;border-radius:100px;text-decoration:none;margin-bottom:14px;box-shadow:0 8px 24px rgba(245,158,11,0.35);">
        💳 Pagar Ahora con Nequi / Wompi
      </a>

      <!-- BOTÓN SECUNDARIO DASHBOARD -->
      <a href="https://amcagencyweb.com/dashboard"
         style="display:block;text-align:center;background:rgba(255,255,255,0.07);color:#d1d5db;font-weight:700;font-size:12px;letter-spacing:0.15em;text-transform:uppercase;padding:13px 28px;border-radius:100px;text-decoration:none;border:1px solid rgba(255,255,255,0.12);">
        Ver mi Panel →
      </a>
    </div>

    <div style="margin-top:20px;text-align:center;">
      <p style="color:#6b7280;font-size:12px;">¿Tienes dudas sobre tu pago? <a href="https://wa.me/573138537261?text=Hola!%20Tengo%20una%20duda%20sobre%20mi%20pago" style="color:#25d366;">Escríbenos por WhatsApp</a></p>
    </div>
    ${footerHtml}
  </div>
</body>
</html>`
}

export function siteBlockedEmail(data: { businessName: string; repName: string; domain: string }): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="${BASE_STYLE}">
  <div style="${containerStyle}">
    ${logoHtml}
    <div style="background:linear-gradient(135deg,rgba(239,68,68,0.15),rgba(220,38,38,0.08));border:1px solid rgba(239,68,68,0.3);border-radius:20px;padding:32px;">
      <p style="font-size:12px;font-weight:800;letter-spacing:0.3em;text-transform:uppercase;color:#ef4444;margin:0 0 12px;">🔒 Sitio Suspendido</p>
      <h1 style="font-size:26px;font-weight:900;color:#fff;margin:0 0 16px;line-height:1.2;">
        Tu sitio ha sido <span style="color:#ef4444;">suspendido</span> temporalmente
      </h1>
      <p style="color:#9ca3af;font-size:15px;line-height:1.6;margin:0 0 24px;">
        Hola <strong style="color:#fff;">${data.repName}</strong>, el sitio web de <strong style="color:#fff;">${data.businessName}</strong> ha sido suspendido por falta de pago. <strong style="color:#fca5a5;">Tu sitio se reactivará automáticamente</strong> en minutos después de confirmar tu pago.
      </p>

      <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:20px;margin-bottom:28px;">
        <p style="margin:0 0 8px;font-size:11px;color:#6b7280;font-weight:700;text-transform:uppercase;">Detalles</p>
        <p style="margin:4px 0;color:#fca5a5;font-size:14px;">🌐 Dominio suspendido: ${data.domain}</p>
        <p style="margin:4px 0;color:#e5e7eb;font-size:14px;">✅ Al pagar, notifícanos por WhatsApp para reactivación inmediata</p>
      </div>

      <!-- BOTÓN PAGO PRINCIPAL -->
      <a href="https://checkout.nequi.wompi.co/l/NzE29a"
         style="display:block;text-align:center;background:linear-gradient(135deg,#ef4444,#dc2626);color:#fff;font-weight:900;font-size:14px;letter-spacing:0.15em;text-transform:uppercase;padding:18px 32px;border-radius:100px;text-decoration:none;margin-bottom:14px;box-shadow:0 8px 24px rgba(239,68,68,0.4);">
        💳 Pagar Ahora — Reactivar Sitio
      </a>

      <!-- BOTÓN WHATSAPP -->
      <a href="https://wa.me/573138537261?text=Hola!%20Acabo%20de%20realizar%20el%20pago%20de%20${encodeURIComponent(data.businessName)}%20y%20necesito%20reactivar%20mi%20sitio%20${encodeURIComponent(data.domain)}"
         style="display:block;text-align:center;background:#25d366;color:#fff;font-weight:800;font-size:12px;letter-spacing:0.15em;text-transform:uppercase;padding:13px 28px;border-radius:100px;text-decoration:none;">
        💬 Notificar Pago por WhatsApp
      </a>
    </div>
    ${footerHtml}
  </div>
</body>
</html>`
}

export function siteUnblockedEmail(data: { businessName: string; repName: string; domain: string }): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="${BASE_STYLE}">
  <div style="${containerStyle}">
    ${logoHtml}
    <div style="background:linear-gradient(135deg,rgba(16,185,129,0.15),rgba(5,150,105,0.08));border:1px solid rgba(16,185,129,0.3);border-radius:20px;padding:32px;">
      <p style="font-size:12px;font-weight:800;letter-spacing:0.3em;text-transform:uppercase;color:#10b981;margin:0 0 12px;">Sitio Reactivado</p>
      <h1 style="font-size:26px;font-weight:900;color:#fff;margin:0 0 16px;line-height:1.2;">
        ¡Tu sitio está <span style="color:#10b981;">activo</span> nuevamente! 🎉
      </h1>
      <p style="color:#9ca3af;font-size:15px;line-height:1.6;margin:0 0 24px;">
        Hola <strong style="color:#fff;">${data.repName}</strong>, el sitio web de <strong style="color:#fff;">${data.businessName}</strong> ha sido reactivado exitosamente. ¡Ya está visible para todos!
      </p>
      <a href="https://${data.domain}" style="display:block;text-align:center;background:#10b981;color:#fff;font-weight:900;font-size:13px;letter-spacing:0.2em;text-transform:uppercase;padding:16px 32px;border-radius:100px;text-decoration:none;">
        Ver mi sitio web →
      </a>
    </div>
    ${footerHtml}
  </div>
</body>
</html>`
}

// ─── PLANTILLA: Notificación al ADMIN cuando llega un nuevo lead ─────────────
export function newLeadAdminEmail(data: {
  name: string
  email: string | null
  phone: string | null
  service: string | null
  message: string | null
  source: string
}): string {
  const fecha = new Date().toLocaleString('es-CO', {
    timeZone: 'America/Bogota',
    dateStyle: 'full',
    timeStyle: 'short',
  })
  return `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="${BASE_STYLE}">
  <div style="${containerStyle}">
    ${logoHtml}
    <div style="background:linear-gradient(135deg,rgba(59,130,246,0.15),rgba(99,102,241,0.08));border:1px solid rgba(59,130,246,0.3);border-radius:20px;padding:32px;">
      <p style="font-size:11px;font-weight:800;letter-spacing:0.3em;text-transform:uppercase;color:#3b82f6;margin:0 0 10px;">🔔 Nuevo Lead Recibido</p>
      <h1 style="font-size:24px;font-weight:900;color:#fff;margin:0 0 20px;line-height:1.2;">${data.name} quiere saber más</h1>
      <div style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:20px;margin-bottom:20px;">
        <p style="margin:0 0 8px;font-size:11px;color:#6b7280;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;">Datos del prospecto</p>
        <p style="margin:6px 0;color:#e5e7eb;font-size:14px;">👤 <strong>Nombre:</strong> ${data.name}</p>
        ${data.email ? `<p style="margin:6px 0;color:#e5e7eb;font-size:14px;">📧 <strong>Email:</strong> <a href="mailto:${data.email}" style="color:#3b82f6;">${data.email}</a></p>` : ''}
        ${data.phone ? `<p style="margin:6px 0;color:#e5e7eb;font-size:14px;">📱 <strong>WhatsApp:</strong> <a href="https://wa.me/${data.phone.replace(/\D/g, '')}" style="color:#25d366;">${data.phone}</a></p>` : ''}
        ${data.service ? `<p style="margin:6px 0;color:#e5e7eb;font-size:14px;">📦 <strong>Servicio:</strong> ${data.service}</p>` : ''}
        ${data.message ? `<p style="margin:6px 0;color:#e5e7eb;font-size:14px;">💬 <strong>Mensaje:</strong><br><span style="color:#9ca3af;">${data.message}</span></p>` : ''}
        <p style="margin:10px 0 0;color:#6b7280;font-size:11px;">🕐 ${fecha} · Origen: ${data.source}</p>
      </div>
      <a href="https://amcagencyweb.com/admin/leads" style="display:block;text-align:center;background:#3b82f6;color:#fff;font-weight:800;font-size:12px;letter-spacing:0.2em;text-transform:uppercase;padding:14px 28px;border-radius:100px;text-decoration:none;">Ver en Panel Admin →</a>
    </div>
    ${footerHtml}
  </div>
</body>
</html>`
}

// ─── PLANTILLA: Confirmación al PROSPECTO que envió el formulario ─────────────
export function leadConfirmationEmail(data: {
  name: string
  service: string | null
  message: string | null
}): string {
  const servicioTexto = data.service
    ? `Hemos recibido tu solicitud sobre <strong style="color:#fff;">${data.service}</strong>.`
    : 'Hemos recibido tu mensaje con éxito.'
  return `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="${BASE_STYLE}">
  <div style="${containerStyle}">
    ${logoHtml}
    <div style="background:linear-gradient(135deg,rgba(59,130,246,0.12),rgba(99,102,241,0.06));border:1px solid rgba(59,130,246,0.2);border-radius:20px;padding:32px;">
      <p style="font-size:11px;font-weight:800;letter-spacing:0.3em;text-transform:uppercase;color:#3b82f6;margin:0 0 10px;">✅ Solicitud Recibida</p>
      <h1 style="font-size:26px;font-weight:900;color:#fff;margin:0 0 16px;line-height:1.2;">
        ¡Gracias, <span style="color:#3b82f6;">${data.name}!</span> 🚀
      </h1>
      <p style="color:#9ca3af;font-size:15px;line-height:1.7;margin:0 0 20px;">
        ${servicioTexto} Un estratega de <strong style="color:#fff;">AMC Agency</strong> revisará tu caso y se pondrá en contacto contigo en las próximas <strong style="color:#fff;">24 horas hábiles</strong>.
      </p>
      ${data.message ? `
      <div style="background:rgba(255,255,255,0.04);border-left:3px solid #3b82f6;border-radius:0 10px 10px 0;padding:16px 20px;margin-bottom:24px;">
        <p style="margin:0;font-size:11px;color:#6b7280;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;">Tu mensaje</p>
        <p style="margin:8px 0 0;color:#d1d5db;font-size:14px;line-height:1.6;">${data.message}</p>
      </div>` : ''}
      <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:14px;padding:20px;margin-bottom:24px;">
        <p style="margin:0 0 10px;font-size:12px;color:#6b7280;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;">¿Necesitas respuesta inmediata?</p>
        <a href="https://wa.me/573138537261?text=Hola!%20Acabo%20de%20enviar%20mi%20solicitud%20en%20amcagencyweb.com%20y%20quisiera%20m%C3%A1s%20informaci%C3%B3n." style="display:inline-flex;align-items:center;gap:8px;background:#25d366;color:#fff;font-weight:800;font-size:12px;letter-spacing:0.15em;text-transform:uppercase;padding:12px 24px;border-radius:100px;text-decoration:none;">💬 Escríbenos por WhatsApp</a>
      </div>
    </div>
    <div style="margin-top:20px;text-align:center;">
      <p style="color:#6b7280;font-size:12px;">Conoce más en <a href="https://amcagencyweb.com" style="color:#3b82f6;">amcagencyweb.com</a></p>
    </div>
    ${footerHtml}
  </div>
</body>
</html>`
}
