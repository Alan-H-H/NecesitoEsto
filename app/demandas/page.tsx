import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import DemandasCliente from "@/components/DemandasCliente";
import { getAllDemandas } from "@/actions/demanda-actions";

interface Demanda {
  id: number;
  empresa: string;
  responsable_solicitud: string;
  email_contacto: string;
  telefono: string;
  fecha_inicio: string;
  fecha_vencimiento: string;
  rubro_demanda: string;
  detalle: string;
  pais: { nombre: string; bandera_url: string } | { nombre: string; bandera_url: string }[]; // Pais can be either an object or an array
}

export default async function ProtectedPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Recuperar todas las demandas desde la base de datos
  const demandas = await getAllDemandas();

  // Comprobar en consola las demandas recuperadas
  console.log("Todas las demandas:", demandas);
  const { data: categorias } = await supabase.from("categorias").select("id, categoria");

  return (
    <main className="flex-1 flex flex-col gap-6 px-4 demandas">
      <div className="container">
        <h2 className="font-medium text-xl mb-4"></h2>
        {/* Renderizar todas las demandas */}
        <DemandasCliente demandas={demandas} categorias={categorias || []} userId={(user.id)} />
      </div>
    </main>
  );
}
