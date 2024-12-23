"use client"; // Esto marca el archivo como un componente de cliente

import { useState, useEffect } from "react";
import { fetchProfile } from "@/actions/profile-actions"; // Lógica de obtención de perfil
import DatosGenerales from "@/components/DatosGenerales";
import { createClient } from "@/utils/supabase/client"; // Importa el cliente de Supabase
import Seguridad from "@/components/Seguridad";
import DemandaUsuario from "@/components/DemandaUsuario";

interface Profile {
  nombre: string;
  apellido: string;
  provincia: string;
  municipio: string;
  localidad: string;
  direccion: string;
  codigo_postal: string;
  fecha_creacion: string;
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("datosGenerales");
  const [profileData, setProfileData] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null); // Estado para almacenar el usuario

  useEffect(() => {
    // Obtener la sesión de usuario cuando el componente se monta
    const fetchUserSession = async () => {
      const supabase = createClient(); // Crear cliente de Supabase

      const { data, error } = await supabase.auth.getSession(); // Obtener la sesión

      if (error) {
        console.error("Error al obtener sesión:", error.message);
      }

      if (data?.session?.user) {
        setUser(data.session.user); // Establecer el usuario si la sesión es válida
      } else {
        console.error("No se encontró un usuario autenticado.");
      }
    };

    fetchUserSession();
  }, []);

  useEffect(() => {
    // Si hay un usuario, obtener el perfil
    const fetchUserProfile = async () => {
      if (user?.id) {
        try {
          const data = await fetchProfile(user.id); // Obtener el perfil con el ID de usuario
          setProfileData(data); // Establecer los datos del perfil
        } catch (err: any) {
          console.error("Error al obtener perfil:", err.message);
        } finally {
          setLoading(false); // Dejar de cargar
        }
      }
    };

    if (user) {
      fetchUserProfile(); // Si hay un usuario autenticado, obtener el perfil
    }
  }, [user]); // Solo se vuelve a ejecutar si 'user' cambia

  if (loading) return <div>Cargando perfil...</div>; // Cargar mientras se obtiene la información

  return (
    <main className="flex-1 space-x-6">
      <div className="flex w-full min-h-screen">
        <aside className="w-1/3 p-4 shadow-md">
          <h2 className="font-bold text-xl mb-4">Configuración de Perfil</h2>
          <ul className="flex flex-col">
            <li
              className={`py-2 cursor-pointer ${
                activeTab === "datosGenerales" ? "bg-gray-200 text-black" : "hover:bg-gray-200 hover:text-black"
              }`}
              onClick={() => setActiveTab("datosGenerales")}
            >
              Datos Generales
            </li>
            <li
              className={`py-2 cursor-pointer ${
                activeTab === "seguridad" ? "bg-gray-200 text-black" : "hover:bg-gray-200 hover:text-black"
              }`}
              onClick={() => setActiveTab("seguridad")}
            >
              Seguridad
            </li>
            <li
              className={`py-2 cursor-pointer ${
                activeTab === "demandas" ? "bg-gray-200 text-black" : "hover:bg-gray-200 hover:text-black"
              }`}
              onClick={() => setActiveTab("demandas")}
            >
              Demandas
            </li>
        </ul>
        </aside>
        <div className="w-2/3 p-4">
          {activeTab === "datosGenerales" && (
              loading ? (
                <div>Cargando datos del perfil...</div>
              ) : profileData ? (
                <DatosGenerales data={profileData} />
              ) : (
                <div>No se encontraron datos del perfil.</div>
              )
          )}

          {activeTab === "seguridad" && (
            loading ? <div>Cargando seguridad...</div> : <Seguridad />
          )}
          {activeTab === "demandas" && (
            loading ? <div>Cargando demandas...</div> : <DemandaUsuario userId={user.id} />
          )}
        </div>
      </div>
    </main>
  );
}
