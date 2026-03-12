/**
 * fbPixel.ts — Utilidad browser-side para disparar eventos de Facebook Pixel.
 * Siempre dispara fbq (browser) y también llama a /api/fb-event (CAPI server-side)
 * para máxima deduplicación y calidad de señal.
 */

type FbqFunction = (
  command: string,
  eventName: string,
  params?: Record<string, unknown>
) => void;

declare global {
  interface Window {
    fbq?: FbqFunction;
  }
}

// ── Helper: dispara el pixel en el browser ──────────────────────────────────
function pixelTrack(eventName: string, params?: Record<string, unknown>) {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq("track", eventName, params ?? {});
  }
}

// ── Helper: envía a CAPI via nuestra API route (server-side) ────────────────
async function capiTrack(
  eventName: string,
  extra?: { email?: string; phone?: string; url?: string; contentName?: string }
) {
  try {
    const body: Record<string, string> = { eventName };
    if (extra?.email) body.email = extra.email;
    if (extra?.phone) body.phone = extra.phone;
    if (extra?.url) body.url = extra.url;
    if (extra?.contentName) body.contentName = extra.contentName;
    if (!body.url && typeof window !== "undefined") body.url = window.location.href;

    await fetch("/api/fb-event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    // Silencioso — no bloquear la UX por un fallo de tracking
  }
}

// ── Eventos públicos ────────────────────────────────────────────────────────

/** PageView: cada vez que el usuario navega a una nueva ruta */
export function trackPageView(url?: string) {
  pixelTrack("PageView");
  capiTrack("PageView", { url: url ?? window.location.href });
}

/** ViewContent: cuando el usuario ve la página de un plan/servicio */
export function trackViewContent(contentName: string, contentCategory?: string) {
  pixelTrack("ViewContent", {
    content_name: contentName,
    content_category: contentCategory ?? "Servicios",
  });
  capiTrack("ViewContent", {
    url: window.location.href,
    contentName,
  });
}

/** Lead: cuando alguien envía un formulario de contacto */
export function trackLead(email?: string, phone?: string) {
  pixelTrack("Lead");
  const extra: { url: string; email?: string; phone?: string } = { url: window.location.href };
  if (email) extra.email = email;
  if (phone) extra.phone = phone;
  capiTrack("Lead", extra);
}

/** Contact: cuando el usuario hace clic en el botón de WhatsApp */
export function trackContact() {
  pixelTrack("Contact");
  capiTrack("Contact", { url: window.location.href });
}
