<<<<<<< HEAD
"use server";
import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function updateProfileAction(formData: FormData) {
  const supabase = await createClient();

  // Obtener el usuario actual desde la sesión
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    console.error("Error fetching user:", userError);
    throw new Error("Usuario no autenticado");
  }

  // Extraer los datos del formulario
  const updates = {
    nombre: formData.get("nombre") as string,
    apellido: formData.get("apellido") as string,
    provincia: formData.get("provincia") as string,
    municipio: formData.get("municipio") as string,
    localidad: formData.get("localidad") as string,
    codigo_postal: formData.get("codigo_postal") as string,
    direccion: formData.get("direccion") as string,
  };

  try {
    // Actualizar el perfil del usuario
    const { error } = await supabase
      .from("profile")
      .update(updates)
      .eq("id", user?.id);

    if (error) throw error;

    console.log("Perfil actualizado con éxito");
    return { success: true };
  } catch (error) {
    console.error("Error al actualizar perfil:", error);
    throw new Error("No se pudo actualizar el perfil");
  }
}


export const fetchProfile = async (userId: string) => {
  // Usa await para resolver el Promise y obtener el cliente de Supabase
  const supabase = await createClient();

  try {
    // Obtener los datos del perfil
    const { data, error } = await supabase
      .from("profile")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error al obtener perfil:", error);
    throw new Error("No se pudo obtener el perfil");
  }
};

=======
"use server";
import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function updateProfileAction(formData: FormData) {
  const supabase = await createClient();

  // Obtener el usuario actual desde la sesión
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    console.error("Error fetching user:", userError);
    return encodedRedirect("error", "/update-profile", userError.message);
  }

  // Extraer los datos del formulario
  const email = formData.get("email") as string;
  const nombre = formData.get("nombre") as string;
  const apellido = formData.get("apellido") as string;
  const provincia = formData.get("provincia") as string;
  const municipio = formData.get("municipio") as string;
  const localidad = formData.get("localidad") as string;
  const codigo_postal = formData.get("codigo_postal") as string;
  const direccion = formData.get("direccion") as string;

  // Actualizar el perfil del usuario en la base de datos
  const { error } = await supabase
    .from("profile") // Asegúrate que esta es la tabla correcta
    .update({
    //   email,
      nombre,
      apellido,
      provincia,
      municipio,
      localidad,
      codigo_postal,
      direccion,
    })
    .eq("id", user?.id); // Usamos el ID del usuario obtenido desde la sesión

  if (error) {
    console.error("Error updating profile:", error);
    return encodedRedirect("error", "/update-profile", error.message);
    // Redirigir o mostrar un mensaje de error apropiado
  }
  console.log('UPDATE EXITOSO');
  

  // Redirigir a una página de éxito o perfil actualizado
  return redirect("/protected");
}
>>>>>>> 50780173b91e58668064ad6568de3b3cee595ab0
