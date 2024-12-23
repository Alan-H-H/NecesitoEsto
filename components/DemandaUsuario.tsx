// components/DemandaUsuario.tsx

import React, { useState, useEffect } from "react";
import { fetchDemandas } from "@/actions/demanda-actions"; // Función para obtener las demandas del usuario
import ModalDemandaUsuario from "./ModalDemandaUsuario"; // Modal para editar la demanda
import Link from "next/link";
import { PencilIcon } from "@heroicons/react/24/solid";

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

  return (
    <div>
      <h2 className="font-bold text-2xl mb-4">Demandas del Usuario</h2>
      {demandas.length === 0 ? (
        <div className="text-center">
          <p className="text-lg">No tienes demandas creadas aún.</p>
          <Link href="/demandas/new">
            <h3 className="mt-4 bg-blue-600 text-white py-2 px-6 rounded">
              Crear nueva demanda
            </h3>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {demandas.map((demanda) => (
            <div key={demanda.id} className="border p-4 rounded-lg shadow-md">
              <h3 className="font-bold text-xl">{demanda.detalle}</h3>
              <p className="text-gray-600">{demanda.rubro_demanda}</p>
              <button
                className="flex items-center p-2 bg-blue-600 text-white rounded"
                onClick={() => handleEdit(demanda)} // Al hacer clic, se abre el modal
              >
                <PencilIcon className="h-5 w-5 mr-2" /> Editar
              </button>
            </div>
          ))}
        </div>
      )}

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
