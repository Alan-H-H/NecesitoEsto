"use client";

import { useState } from "react";
import { updateProfileAction } from "@/actions/profile-actions";

interface Profile {
  id?: string; // Si tienes un campo ID, lo puedes excluir
  nombre: string;
  apellido: string;
  provincia: string;
  municipio: string;
  localidad: string;
  direccion: string;
  codigo_postal: string;
  fecha_creacion: string;
}

interface DatosGeneralesProps {
  data: Profile;
}

const DatosGenerales: React.FC<DatosGeneralesProps> = ({ data }) => {
  const [profile, setProfile] = useState<Profile>(data);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleSave = async () => {
    try {
      const formData = new FormData();
      // Se asegura de que 'fecha_creacion' no se envíe
      Object.entries(profile).forEach(([key, value]) => {
        if (key !== "fecha_creacion" && key !== "id") formData.append(key, value as string);
      });

      const result = await updateProfileAction(formData);
      if (result.success) {
        setSuccess(true);
        setError(null);
      }
    } catch (err: any) {
      setError(err.message);
      setSuccess(false);
    }
  };

  return (
    <div className="text-center">
      {/*<h4 className="font-bold text-3xl mb-6">Datos Generales</h4>*/}
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && <div className="text-green-500 mb-4">Perfil actualizado con éxito</div>}
      <div className="grid grid-cols-2 gap-x-6 gap-y-4">
        {Object.keys(profile).map((key) => {
          // No mostrar los campos que no deben ser editables (ID o fecha_creacion)
          if (key === "id") return null;
          
          return (
            <div key={key} className="flex flex-col mb-1">
              <label className="block mb-2 flex flex-start font-semibold capitalize">{key}</label>
              {key === "fecha_creacion" ? (
                // Mostrar 'fecha_creacion' pero no editable
                <input
                  type="text"
                  value={profile[key as keyof Profile] as string}
                  className="border border-gray-300 rounded-md p-3 shadow-sm focus:outline-none focus:ring focus:ring-blue-500 transition"
                  disabled
                />
              ) : (
                // Los demás campos sí son editables
                <input
                  type="text"
                  value={profile[key as keyof Profile] as string}
                  onChange={(e) =>
                    setProfile({ ...profile, [key]: e.target.value })
                  }
                  className="border border-gray-300 rounded-md p-3 shadow-sm focus:outline-none focus:ring focus:ring-blue-500 transition"
                />
              )}
            </div>
          );
        })}
      </div>
      <button
          onClick={handleSave}
          className="mt-6 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-500 transition"
        >
          Guardar Cambios
        </button>
    </div>
  );
};

export default DatosGenerales;
