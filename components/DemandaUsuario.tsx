import React, { useState, useEffect } from "react";
import { deleteDemanda, fetchDemandas } from "@/actions/demanda-actions"; // Función para obtener las demandas del usuario
import ModalDemandaUsuario from "./ModalDemandaUsuario"; // Modal para editar la demanda
import Link from "next/link";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";

interface Demanda {
  id: number;
  detalle: string;
  rubro_demanda: string;
  empresa: string;
  telefono: string;
  fecha_inicio: Date;
  fecha_vencimiento: Date;
}

interface DemandaUsuarioProps {
  userId: string; // Recibimos el userId como prop
}

const DemandaUsuario: React.FC<DemandaUsuarioProps> = ({ userId }) => {
  const [demandas, setDemandas] = useState<Demanda[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // Controla la apertura del modal
  const [selectedDemanda, setSelectedDemanda] = useState<Demanda | null>(null); // Demanda seleccionada para editar

  useEffect(() => {
    // Obtener demandas del usuario
    const loadDemandas = async () => {
      const data = await fetchDemandas(userId); // Pasar userId a la función de obtención de demandas
      setDemandas(data); // Establecer las demandas en el estado
    };

    if (userId) {
      loadDemandas();
    }
  }, [userId]); // Recargar las demandas si el userId cambia

  const handleEdit = (demanda: Demanda) => {
    setSelectedDemanda(demanda); // Establecer la demanda seleccionada
    setIsModalOpen(true); // Abrir el modal
  };

  {/*const handleDelete = async (demandaId) => {
    try {
      const result = await deleteDemanda(demandaId.toString()); // Eliminar demanda usando el ID
      console.log(result.message); // Opcional, loguea el mensaje de éxito
    } catch (error) {
      console.error("Error al eliminar demanda:", error); // Maneja el error si ocurre
    }
  };*/}

  return (
    <div className="flex justify-center flex-col">
      {/*<h2 className="font-bold text-2xl mb-4">Demandas del Usuario</h2>*/}
      {demandas.length === 0 ? (
        <div className="text-center d-flex justify-center">
          <p className="text-lg">No tienes demandas creadas aún.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 justify-center text-center">
          {demandas.map((demanda) => (
            <div
              key={demanda.id}
              className="border border-slate-950 rounded-lg m-1 h-[150px] p-4 rounded-lg shadow-md d-flex self-center"
            >
              <h3 className="font-bold text-xl">{demanda.detalle}</h3>
              <p className="text-gray-600">{demanda.rubro_demanda}</p>
              <button
                className="flex items-center mt-3 p-2 bg-blue-600 text-white rounded float-left"
                onClick={() => handleEdit(demanda)} // Al hacer clic, se abre el modal
              >
                <PencilIcon className="h-5 w-5 mr-2" /> Editar
              </button>
              <button
                className="flex items-center mt-3 p-2 bg-red-600 text-white rounded float-right"
              >
                <TrashIcon className="h-5 w-5 mr-2" /> Eliminar
              </button>
            </div>
          ))}
        </div>
      )}
      <Link href="/demandas/new" className="self-center">
        <h3 className="bg-blue-500 text-center text-white w-[200px] mt-2 p-2 rounded-lg hover:bg-blue-600 mt-6">
          Crear nueva demanda
        </h3>
      </Link>
      {/* Modal de edición */}
      {isModalOpen && selectedDemanda && (
        <ModalDemandaUsuario
          demanda={selectedDemanda}
          closeModal={() => setIsModalOpen(false)} // Cerrar modal
        />
      )}
    </div>
  );
};

export default DemandaUsuario;
