"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

/**
 * captureLead: Recibe los datos del formulario de contacto
 * y los inserta en la tabla 'waas_leads' del admin.
 */
export async function captureLead(formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const service = (formData.get("service") as string)?.trim();
  const message = (formData.get("message") as string)?.trim();

  if (!name || !email) {
    return { success: false, message: "Nombre y Email son obligatorios." };
  }

  try {
    const supabase = createAdminClient();

    const { error } = await supabase.from("waas_leads").insert({
      name,
      email,
      phone: null,
      service: service ?? null,
      message: message ?? null,
      source: "website_form",
      status: "new",
    });

    if (error) {
      console.error("[captureLead] Supabase error:", error.message);
      return { success: false, message: "Error técnico al guardar el lead." };
    }

    // Revalidar la página de leads del admin
    revalidatePath("/admin/leads");

    return {
      success: true,
      message: "¡Visión recibida! Un estratega de AMC se pondrá en contacto contigo.",
    };
  } catch (err) {
    console.error("[captureLead] Error:", err);
    return { success: false, message: "Error de conexión. Intenta de nuevo." };
  }
}