"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * captureLead: Recibe los datos del formulario de contacto
 * y los inserta en la tabla 'leads' de Supabase.
 */
export async function captureLead(formData: FormData) {
  const supabase = await createClient();
  
  // Extraemos los valores del FormData con seguridad
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const serviceInterest = formData.get("service") as string;
  const message = formData.get("message") as string;

  // Validación básica del lado del servidor
  if (!name || !email) {
    return { success: false, message: "Nombre y Email son obligatorios." };
  }

  // Insertamos en la base de datos
  const { error } = await supabase.from("leads").insert([
    {
      name: name,
      email: email,
      service_interest: serviceInterest,
      message: message,
      source: "web_principal_v1",
      status: "NEW"
    }
  ]);

  if (error) {
    console.error("Supabase Error:", error.message);
    return { success: false, message: "Error técnico al guardar el lead." };
  }

  // Revalidamos el dashboard para que el admin vea el lead nuevo al entrar
  revalidatePath("/dashboard");

  return { 
    success: true, 
    message: "¡Visión recibida! Un estratega de AMC se pondrá en contacto contigo." 
  };
}