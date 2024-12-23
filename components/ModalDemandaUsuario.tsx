// components/ModalDemandaUsuario.tsx

import React, { useState } from "react";
import { updateDemanda } from "@/actions/demanda-actions"; // Función para actualizar demanda

export interface Demanda {
  id: number;
  detalle: string;
  rubro_demanda: string;
  empresa: string;
  telefono: string;
  fecha_inicio: Date;
  fecha_vencimiento: Date;
}

interface ModalProps {
  demanda: Demanda;
  closeModal: () => void;
}

const ModalDemandaUsuario: React.FC<ModalProps> = ({ demanda, closeModal }) => {
  const [detalle, setDetalle] = useState(demanda.detalle);
  const [rubro_demanda, setRubro] = useState(demanda.rubro_demanda);
  const [empresa, setEmpresa] = useState(demanda.empresa);
  const [telefono, setTelefono] = useState(demanda.telefono);
  const [fechaInicio, setFechaInicio] = useState(demanda.fecha_inicio.toString().slice(0, 10)); // Formatear a yyyy-MM-dd
  const [fechaVencimiento, setFechaVencimiento] = useState(demanda.fecha_vencimiento.toString().slice(0, 10));

  const handleSave = async () => {
    const updatedDemanda = { ...demanda, detalle, rubro_demanda, empresa, telefono, fecha_inicio: new Date(fechaInicio), fecha_vencimiento: new Date(fechaVencimiento) };
    await updateDemanda(updatedDemanda); // Actualizar la demanda
    closeModal(); // Cerrar el modal
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-60 backdrop-blur-sm">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-3xl w-full relative">
        <h2 className="text-2xl font-bold mb-4 text-black">Editar Demanda</h2>
        <div className="mb-4">
          <label htmlFor="detalle" className="block text-sm font-medium text-black">Detalle</label>
          <input
            id="detalle"
            type="text"
            value={detalle}
            onChange={(e) => setDetalle(e.target.value)}
            className="mt-2 p-2 border rounded w-full"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="rubro" className="block text-sm font-medium text-black">Rubro</label>
          <input
            id="rubro"
            type="text"
            value={rubro_demanda}
            onChange={(e) => setRubro(e.target.value)}
            className="mt-2 p-2 border rounded w-full"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="empresa" className="block text-sm font-medium text-black">Empresa</label>
          <input
            id="empresa"
            type="text"
            value={empresa}
            onChange={(e) => setEmpresa(e.target.value)}
            className="mt-2 p-2 border rounded w-full"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="telefono" className="block text-sm font-medium text-black">Telefono</label>
          <input
            id="telefono"
            type="text"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            className="mt-2 p-2 border rounded w-full"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="fecha_inicio" className="block text-sm font-medium text-black">Fecha de Inicio</label>
          <input
            id="fecha_inicio"
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            className="mt-2 p-2 border rounded w-full"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="fecha_vencimiento" className="block text-sm font-medium text-black">Fecha de Vencimiento</label>
          <input
            id="fecha_vencimiento"
            type="date"
            value={fechaVencimiento}
            onChange={(e) => setFechaVencimiento(e.target.value)}
            className="mt-2 p-2 border rounded w-full"
          />
        </div>
        <div className="flex justify-between">
          <button
            onClick={closeModal}
            className="bg-gray-400 text-white py-2 px-4 rounded"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white py-2 px-4 rounded"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalDemandaUsuario;
