"use client";
import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { createDemandAction } from "@/actions/demanda-actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Acción para crear una demanda

export default function CreateDemandPage(){
 {/* searchParams,
}: {
  searchParams: Message;
}) {*/}
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [demand, setDemand] = useState<any>({
    empresa: "",
    responsable_solicitud: "",
    email_contacto: "",
    telefono: "",
    fecha_inicio: "",
    fecha_vencimiento: "",
    rubro_demanda: [],
    detalle: "",
    profile_id: "",
    id_categoria: "",
    pais_id: ""
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        return (
          <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
            {error.message}
          </div>
        );
      }

      if (user) {
        const { data: profileData, error: profileError } = await supabase
          .from("profile")
          .select("*")
          .eq("id", user.id)
          .single(); // single() se usa para obtener un solo registro

        if (profileError) {
          console.error("Error fetching profile:", profileError);
        } else {
          setProfile(profileData || {});
        }
        setUser(user);
        setDemand((prev: any) => ({
          ...prev,
          profile_id: user.id, // Asocia la demanda al usuario actual
        }));
      }

      setLoading(false);
    };

    fetchUser();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  {/*if ("message" in searchParams) {
    return (
      <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
        <FormMessage message={searchParams} />
      </div>
    );
  }*/}

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
  
    setDemand({
      ...demand,
      [name]: name === "id_categoria" ? parseInt(value) : value, // Convert id_categoria to an integer
    });
  };

  const handleRubroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rubros = e.target.value.split(","); // Dividir rubros por comas
    setDemand({
      ...demand,
      rubro_demanda: rubros,
    });
  };

  return (
    <>
      <form
        className="flex flex-col max-w-3xl mx-auto"
        style={{ width: "700px" }}
        method="post"
      >
        <h1 className="text-2xl font-medium">Crear una Demanda</h1>
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
          <Label htmlFor="empresa">Empresa</Label>
          <Input
            name="empresa"
            placeholder="Nombre de la empresa"
            required
            value={demand.empresa}
            onChange={handleChange}
          /> 
          <select
            name="pais_id"
            required
            value={demand.pais} 
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="" disabled>Seleccione un pais</option>
            <option value="1">Argentina</option>
            <option value="2">Brasil</option>
            <option value="3">Chile</option>
            <option value="4">Mexico</option>
          </select>
          <Label htmlFor="responsable_solicitud">
            Responsable de la solicitud
          </Label>
          <Input
            name="responsable_solicitud"
            placeholder="Nombre del responsable"
            required
            value={profile.nombre}
            onChange={handleChange}
          />

          <Label htmlFor="email_contacto">Email de contacto</Label>
          <Input
            name="email_contacto"
            placeholder="email@ejemplo.com"
            type="email"
            required
            value={profile.email}
            onChange={handleChange}
          />

          <Label htmlFor="telefono">Teléfono de contacto</Label>
          <Input
            name="telefono"
            placeholder="Número de teléfono"
            type="tel"
            required
            value={demand.telefono}
            onChange={handleChange}
          />

          <Label htmlFor="fecha_inicio">Fecha de inicio</Label>
          <Input
            name="fecha_inicio"
            type="date"
            required
            value={demand.fecha_inicio}
            onChange={handleChange}
          />

          <Label htmlFor="fecha_vencimiento">Fecha de vencimiento</Label>
          <Input
            name="fecha_vencimiento"
            type="date"
            required
            value={demand.fecha_vencimiento}
            onChange={handleChange}
          />

          <Label htmlFor="id_categoria">Categoria</Label>
          <select
            name="id_categoria"
            required
            value={demand.id_categoria} 
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="" disabled>Seleccione una categoría</option>
            <option value="1">Marketing</option>
            <option value="2">Tecnología</option>
            <option value="3">Administración</option>
            <option value="4">Ventas</option>
            <option value="5">Mantenimiento</option>
          </select>


          <Label htmlFor="rubro_demanda">
            Rubro de la demanda (separado por comas)
          </Label>
          <Input
            name="rubro_demanda"
            placeholder="Rubro1, Rubro2, Rubro3"
            required
            value={demand.rubro_demanda.join(",")}
            onChange={handleRubroChange}
          />

          <Label htmlFor="detalle">Detalle</Label>
          <textarea
            name="detalle"
            placeholder="Describa el detalle de la demanda"
            required
            value={demand.detalle}
            onChange={handleChange}
            className="border p-2 rounded"
            rows={4}
          />

          <SubmitButton
            className="bg-blue-500 text-white text-center mt-2 p-2 rounded-lg hover:bg-blue-600"
            pendingText="Creando..."
            formAction={createDemandAction}
          >
            Crear Demanda
          </SubmitButton>

        {/*<FormMessage message={searchParams} />*/}
        </div>
      </form>
    </>
  );
}
