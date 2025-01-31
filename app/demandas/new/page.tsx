"use client";
import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { createDemandAction, getCategorias, getPaises, getRubros  } from "@/actions/demanda-actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Select from "react-select";



type Demand = {
  empresa: string;
  responsable_solicitud: string;
  email_contacto: string;
  telefono: string;
  fecha_inicio: string;
  fecha_vencimiento: string;
  detalle: string;
  profile_id: string;
  id_categoria: number;
  pais_id: number;
  rubro: string
};

type Rubro = {
  id: number;
  nombre: string;
};



// Acción para crear una demanda

export default function CreateDemandPage(){
 {/* searchParams,
}: {
  searchParams: Message;
}) {*/}
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [paises, setPaises] = useState<any[]>([]);
  const [rubros, setRubros] = useState<Rubro[]>([]);
  const [demand, setDemand] = useState<any>({
    empresa: "",
    responsable_solicitud: "",
    email_contacto: "",
    telefono: "",
    fecha_inicio: "",
    fecha_vencimiento: "",
    detalle: "",
    profile_id: "",
    id_categoria: "",
    pais_id: "",
    rubro: "",
  });
  const [loading, setLoading] = useState(true);

  // Para manejar el rubro personalizado
  const [customRubro, setCustomRubro] = useState("");
  const [isCustomRubro, setIsCustomRubro] = useState(false);

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

    const fetchPaises = async () => {
      const paisesData = await getPaises();
      setPaises(paisesData);

    };

    const fetchCategorias = async () => {
      const categoriasData = await getCategorias();
      setCategorias(categoriasData);

    };

    const fetchRubros = async () => {
      const rubrosData = await getRubros();
      setRubros(rubrosData);

    };

    

    fetchRubros();
    fetchPaises();
    fetchCategorias();
    fetchUser();
  }, []);

  if (loading) {
    return <p className="text-2xl font-bold mb-4 text-black text-center">Cargando Formulario de Crear Necesidad...</p>;
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
      [name]: name === "id_categoria" || name === "pais_id" ? parseInt(value) : value, // Convert id_categoria to an integer
    });
  };

  const handleDemandChange = (key: keyof Demand, value: any) => {
    setDemand((prev: Demand) => ({
      ...prev,
      [key]: value,
    }));

  
  
  
};

  return (
    <>
      <form
        className="flex flex-col max-w-3xl mx-auto"
        method="post"
      >
        {/*<h1 className="text-2xl font-medium">Crear una Demanda</h1>*/}
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">


          <Label htmlFor="empresa">Empresa</Label>
          <Input
            className="border border-solid border-slate-950"
            name="empresa"
            placeholder="Nombre de la empresa"
            required
            value={demand.empresa}
            onChange={handleChange}
          /> 


          <Label htmlFor="pais_id">Paises</Label>
          <select
            name="pais_id"
            required
            value={demand.pais_id} 
            onChange={handleChange}
            className="border p-2 rounded mb-2 border-solid border-slate-950"
          >
            <option value="" disabled>Selecciona un Pais</option>
            {paises.map((pais) => (
              <option key={pais.id} value={pais.id}>
                {pais.nombre}
              </option>
            ))}
          </select>

          <Label htmlFor="responsable_solicitud">
            Responsable de la solicitud
          </Label>
          <Input
            name="responsable_solicitud"
            placeholder="Nombre del responsable"
            required
            value={profile?.nombre || ""}
            onChange={handleChange}
            className="border border-solid border-slate-950"
          />

          <Label htmlFor="email_contacto">Email de contacto</Label>
          <Input
            name="email_contacto"
            placeholder="email@ejemplo.com"
            type="email"
            required
            value={profile?.email || ""}
            onChange={handleChange}
            className="border border-solid border-slate-950"
          />

          <Label htmlFor="telefono">Teléfono de contacto</Label>
          <Input
            name="telefono"
            placeholder="Número de teléfono"
            type="tel"
            required
            value={demand.telefono}
            onChange={handleChange}
            className="border border-solid border-slate-950"
          />

          <Label htmlFor="fecha_inicio">Fecha de inicio</Label>
          <Input
            name="fecha_inicio"
            type="date"
            required
            value={demand.fecha_inicio}
            onChange={handleChange}
            className="border border-solid border-slate-950"
          />

          <Label htmlFor="fecha_vencimiento">Fecha de vencimiento</Label>
          <Input
            name="fecha_vencimiento"
            type="date"
            required
            value={demand.fecha_vencimiento}
            onChange={handleChange}
            className="border border-solid border-slate-950"
          />

          <Label htmlFor="id_categoria">Categoria</Label>
          <select
            name="id_categoria"
            required
            value={demand.id_categoria} 
            onChange={handleChange}
            className="border p-2 rounded mb-2 border-solid border-slate-950"
          >
            <option value="" disabled>Selecciona una categoría</option>
            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.categoria}
              </option>
            ))}
          </select>


          <Label htmlFor="rubro">Rubro <strong className="text-gray-400 text-x">(Escribe tu rubro para buscar el adecuado)</strong></Label>
          <Select
            name="rubro"
            options={[
              ...rubros.map((rubro) => ({ value: rubro.id, label: rubro.nombre })),
              { value: "otro", label: "Otro (Agregar nuevo rubro)" },
            ]}
            onChange={(selectedOption) => {
              if (selectedOption?.value === "otro") {
                setIsCustomRubro(true);
                handleDemandChange("rubro", ""); // Borra el valor anterior
              } else {
                setIsCustomRubro(false);
                handleDemandChange("rubro", selectedOption?.value ?? "");
              }
            }}
            className="mb-2 border-solid border-slate-950"
            placeholder="Selecciona un rubro"
          />


          {isCustomRubro && (
            <input
              type="text"
              placeholder="Ingrese nuevo rubro"
              value={customRubro}
              onChange={(e) => {
                setCustomRubro(e.target.value);
                handleDemandChange("rubro", e.target.value); // Cambia el valor de rubro
              }}
              className="border p-2 rounded mb-2 border-solid border-slate-950"
            />
          )}





          <Label htmlFor="detalle">Detalle</Label>
          <textarea
            name="detalle"
            placeholder="Describa el detalle de la demanda"
            required
            value={demand.detalle}
            onChange={handleChange}
            className="border border-solid border-slate-950"
            rows={4}
          />

          <SubmitButton
            className="bg-blue-500 text-white text-center mt-2 mb-4 p-2 rounded-lg hover:bg-blue-600"
            pendingText="Creando Necesidad..."
            formAction={async () => {
              console.log("Datos de la demanda que se enviarán:", demand); 

              // Crear un objeto FormData
              const formData = new FormData();
              Object.keys(demand).forEach((key) => {
                formData.append(key, demand[key]);
              });

              // Llamar a la función con el FormData
              return createDemandAction(formData);
            }}
          >
            Crear Demanda
          </SubmitButton>



        {/*<FormMessage message={searchParams} />*/}
        </div>
      </form>
    </>
  );
}

