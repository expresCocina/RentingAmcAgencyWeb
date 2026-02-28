"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";
import { newLeadAdminEmail, leadConfirmationEmail } from "./email-templates";

const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_EMAIL = "salcristhi5411@gmail.com";
const FROM_EMAIL = "AMC Agency <notificaciones@amcagencyweb.com>";

function extractPhone(text: string): string | null {
  const match = text.match(/(\+?\d[\d\s\-().]{7,}\d)/);
  return match?.[1] ? match[1].replace(/\s+/g, " ").trim() : null;
}

/**
 * captureLead: Server Action que captura leads del sitio web.
 * 1. Guarda en Supabase waas_leads
 * 2. Envía email al admin con todos los datos
 * 3. Envía email de confirmación al prospecto
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

    // ── Emails en paralelo (no bloqueamos la respuesta si fallan) ──
    Promise.allSettled([
      // 1. Notificación al admin
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
    ]).then((results) => {
      results.forEach((r, i) => {
        if (r.status === "rejected") {
          console.error(`[captureLead] Email ${i} falló:`, r.reason);
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