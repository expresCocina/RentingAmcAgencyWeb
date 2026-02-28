"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";
import crypto from "crypto";
import { newLeadAdminEmail, leadConfirmationEmail } from "./email-templates";

const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_EMAIL = "salcristhi5411@gmail.com";
const FROM_EMAIL = "AMC Agency <notificaciones@amcagencyweb.com>";

const FB_PIXEL_ID = "780457111253195";
const FB_CAPI_TOKEN =
  process.env.FB_CAPI_TOKEN ??
  "EAAWwrH7BiO8BQ0hCIkwAhGm5g4zv0mS8jI78DpUG8SmUYLrTK0dpaJaJOp3r1ZBAYKjKXTIFpBkInHtyQyh65CiZArmAFFyFWL6YrXzEvW9YtoaQDV06hQEHZB5CUdccPZB6mlZCuuRlZCsYMNgbVizqdFEBqx2TQM48zfZBU02LHEn18ZBHZAgARufbeifP30AQBIQZDZD";

function sha256(value: string) {
  return crypto.createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

function extractPhone(text: string): string | null {
  const match = text.match(/(\+?\d[\d\s\-().]{7,}\d)/);
  return match?.[1] ? match[1].replace(/\s+/g, " ").trim() : null;
}

/**
 * Dispara un evento Lead a la Facebook Conversions API (server-side).
 * Hashea email y teléfono con SHA-256 antes de enviarlos a Meta.
 */
async function fireFbLeadEvent(data: {
  email: string | null;
  phone: string | null;
  sourceUrl?: string;
}) {
  try {
    const userData: Record<string, string> = {};
    if (data.email) userData.em = sha256(data.email);
    if (data.phone) userData.ph = sha256(data.phone.replace(/\D/g, ""));

    const payload = {
      data: [
        {
          event_name: "Lead",
          event_time: Math.floor(Date.now() / 1000),
          event_source_url: data.sourceUrl ?? "https://amcagencyweb.com",
          action_source: "website",
          user_data: userData,
        },
      ],
    };

    const res = await fetch(
      `https://graph.facebook.com/v18.0/${FB_PIXEL_ID}/events?access_token=${FB_CAPI_TOKEN}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );
    const result = await res.json();
    if (!res.ok) console.error("[CAPI Lead] Error:", result);
    else console.log("[CAPI Lead] Evento enviado:", result.events_received, "eventos");
  } catch (err) {
    console.error("[CAPI Lead] Exception:", err);
  }
}

/**
 * captureLead: Server Action que captura leads del sitio web.
 * 1. Guarda en Supabase waas_leads
 * 2. Envía email al admin con todos los datos
 * 3. Envía email de confirmación al prospecto
 * 4. Dispara evento Lead a Facebook Conversions API (CAPI)
 */
export async function captureLead(formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const service = (formData.get("service") as string)?.trim() || null;
  const message = (formData.get("message") as string)?.trim() || null;
  const phoneField = (formData.get("phone") as string)?.trim() || null;

  if (!name || !email) {
    return { success: false, message: "Nombre y Email son obligatorios." };
  }

  const phone = phoneField ?? (message ? extractPhone(message) : null);

  let source = "website_form";
  if (service?.includes("[VIP APP]")) source = "pricing_vip";
  else if (service?.toLowerCase().includes("renting")) source = "renting_page";

  // URL de origen para el evento CAPI
  const sourceUrl =
    source === "pricing_vip"
      ? "https://amcagencyweb.com/#renting"
      : source === "renting_page"
        ? "https://amcagencyweb.com/servicios/renting-tecnologico"
        : "https://amcagencyweb.com/#contacto";

  try {
    const supabase = createAdminClient();

    const { error } = await supabase.from("waas_leads").insert({
      name,
      email,
      phone,
      service,
      message,
      source,
      status: "new",
    });

    if (error) {
      console.error("[captureLead] Supabase error:", error.message);
      return { success: false, message: "Error técnico al guardar el lead." };
    }

    // ── Disparar en paralelo: emails + Facebook CAPI ──────────────────────
    Promise.allSettled([
      // 1. Email al admin
      resend.emails.send({
        from: FROM_EMAIL,
        to: ADMIN_EMAIL,
        subject: `🔔 Nuevo Lead: ${name}`,
        html: newLeadAdminEmail({ name, email, phone, service, message, source }),
      }),
      // 2. Confirmación al prospecto
      resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: "Recibimos tu solicitud — AMC Agency",
        html: leadConfirmationEmail({ name, service, message }),
      }),
      // 3. Evento Lead → Facebook CAPI
      fireFbLeadEvent({ email, phone, sourceUrl }),
    ]).then((results) => {
      results.forEach((r, i) => {
        if (r.status === "rejected") {
          console.error(`[captureLead] Task ${i} falló:`, r.reason);
        }
      });
    });

    revalidatePath("/admin/leads");
    revalidatePath("/admin/metricas");

    return {
      success: true,
      message: "¡Visión recibida! Un estratega de AMC se pondrá en contacto contigo.",
    };
  } catch (err) {
    console.error("[captureLead] Error inesperado:", err);
    return { success: false, message: "Error de conexión. Intenta de nuevo." };
  }
}