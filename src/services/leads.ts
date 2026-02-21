"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

/**
 * Extrae un número de teléfono de un texto si existe.
 * Funciona con formatos como +57 300..., 300..., (300)..., etc.
 */
function extractPhone(text: string): string | null {
  const match = text.match(/(\+?\d[\d\s\-().]{7,}\d)/);
  return match?.[1] ? match[1].replace(/\s+/g, " ").trim() : null;
}

/**
 * captureLead: Server Action que captura leads del sitio web.
 * Todos los formularios (ContactForm, Pricing, renting-tecnologico, etc.)
 * llaman a esta función → los datos llegan a /admin/leads
 */
export async function captureLead(formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const service = (formData.get("service") as string)?.trim() || null;
  const message = (formData.get("message") as string)?.trim() || null;
  // Algunos formularios pasan el teléfono en un campo separado
  const phoneField = (formData.get("phone") as string)?.trim() || null;

  if (!name || !email) {
    return { success: false, message: "Nombre y Email son obligatorios." };
  }

  // Si no viene phone explícito, intentamos extraerlo del mensaje
  const phone = phoneField ?? (message ? extractPhone(message) : null);

  // Identificar el origen según el servicio
  let source = "website_form";
  if (service?.includes("[VIP APP]")) source = "pricing_vip";
  else if (service?.includes("renting") || service?.toLowerCase().includes("renting")) source = "renting_page";

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
      console.error("[captureLead] Supabase error:", error.message, error.details);
      return { success: false, message: "Error técnico al guardar el lead." };
    }

    // Actualizar el panel de admin
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