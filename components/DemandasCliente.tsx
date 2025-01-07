'use client';

import { useState, useEffect } from 'react';
import ModalDetallesPago from '@/components/ModalDetallesPago';
import { deleteDemanda, getDemandasByCategoria } from '@/actions/demanda-actions';
import Search from './ui/search'; // Assuming Search component is in the 'ui' folder
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';

interface DemandasClienteProps {
  demandas: any[];
  userId: string | null;
  categorias: any[];
}

export default function DemandasCliente({ demandas, userId, categorias }: DemandasClienteProps) {
  const [demandasList, setDemandasList] = useState(demandas);
  const [filteredDemandas, setFilteredDemandas] = useState(demandas);
  const [modalOpen, setModalOpen] = useState(false);
  const [demandaSeleccionada, setDemandaSeleccionada] = useState<any | null>(null);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const searchParams = useSearchParams();

  const abrirModal = (demanda: any) => {
    setDemandaSeleccionada(demanda);
    setModalOpen(true);
  };

  const cerrarModal = () => {
    setModalOpen(false);
    setDemandaSeleccionada(null);
  };

  const handleDeleteDemanda = async (id: string | number) => {
    try {
      const idString = String(id); // Convert id to string
      await deleteDemanda(idString); // Use idString which is a string
      setDemandasList((prevDemandas) =>
        prevDemandas.filter((demanda) => demanda.id !== idString)
      );
      console.log('Demanda eliminada correctamente:', idString);
    } catch (error) {
      console.error('Error al borrar la demanda:', error);
    }
  };

  const handleCategoriaChange = async (idCategoria: string) => {
    if (categoriaSeleccionada === idCategoria) return; // Avoid unnecessary requests

    try {
      setCategoriaSeleccionada(idCategoria);
      const demandasFiltradas = idCategoria
        ? await getDemandasByCategoria(idCategoria)
        : demandas; // Show all if there's no filter
      setFilteredDemandas(demandasFiltradas);
    } catch (error) {
      console.error('Error al filtrar por categoría:', error);
    }
  };

  const reiniciarFiltro = () => {
    setCategoriaSeleccionada('');
    setFilteredDemandas(demandas);
  };

  // Handle Search
  const handleSearch = (term: string) => {
    setSearchQuery(term);
  };

  // Filter demands based on search query
  useEffect(() => {
    if (searchQuery === '') {
      setFilteredDemandas(demandas);
    } else {
      const filtered = demandas.filter((demanda) =>
        demanda.detalle.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredDemandas(filtered);
    }
  }, [searchQuery, demandas]);

  return (
    <div className="mb-4">
      {/* Filtros */}
      <div className="mb-4">
        {/* Search Component */}
        <div className="mb-2">
          <Search placeholder="Buscar Necesidades..." handleSearch={handleSearch} />
        </div>
        {/* Categoria Filter */}
        <select
          id="categoria"
          value={categoriaSeleccionada}
          onChange={(e) => handleCategoriaChange(e.target.value)}
          className="border border-gray-300 rounded-md py-2 px-3"
        >
          <option value="">Todas las categorías</option>
          {categorias.map((categoria) => (
            <option key={categoria.id} value={categoria.id}>
              {categoria.categoria}
            </option>
          ))}
        </select>

        <button
          className="ml-2 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-md"
          onClick={reiniciarFiltro}
          aria-label="Reiniciar filtro"
        >
          Reiniciar filtro
        </button>
      </div>

      {/* Lista de demandas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredDemandas.length > 0 ? (
          filteredDemandas.map((demanda) => (
            <div
              key={demanda.id}
              className="relative border border-gray-300 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{demanda.detalle}</h3>
                {demanda.pais && demanda.pais.bandera_url && (
                    <img
                      src={`${demanda.pais.bandera_url}`} // Concatenamos la URL base con el valor de la columna
                      alt={`Bandera de ${demanda.pais.nombre}`}
                      className="w-5 h-3 ml-2"
                    />
                  )}
              </div>
              <p className="text-gray-700 mt-2">
                <strong>Rubro:&nbsp;</strong> {demanda.rubro_demanda}
              </p>
              <p className="text-gray-700 mt-2">
                <strong>Fecha de inicio:&nbsp;</strong>{' '}
                {new Date(demanda.fecha_inicio).toLocaleDateString()}
              </p>
              <p className="text-gray-700 mt-2">
                <strong>Fecha de vencimiento:&nbsp;</strong>{' '}
                {new Date(demanda.fecha_vencimiento).toLocaleDateString()}
                {(() => {
                  const fechaVencimiento = new Date(demanda.fecha_vencimiento);
                  const fechaActual = new Date();
                  const diasRestantes = Math.ceil(
                    (fechaVencimiento.getTime() - fechaActual.getTime()) /
                      (1000 * 60 * 60 * 24)
                  );
                  return diasRestantes > 0
                    ? ` (Faltan ${diasRestantes} días)`
                    : ` (¡Venció hace ${Math.abs(diasRestantes)} días!)`;
                })()}
              </p>

              {/* Truncado elegante de la información adicional */}
              <div className="mt-4">
                <p className="text-gray-700">
                  <strong>Teléfono:&nbsp;</strong>{' '}
                  {demanda.telefono ? `${demanda.telefono.slice(0, 3)}****` : 'No disponible'}
                </p>
                <div className="flex items-center justify-center mt-auto">
                  <span className="flex-grow border-t border-gray-300 mr-2"></span>
                  <button
                    onClick={() => abrirModal(demanda)}
                    className="text-blue-500 font-medium px-2 transition-colors duration-300 hover:text-white hover:bg-blue-500 hover:shadow-md"
                    aria-label={`Ver más sobre ${demanda.detalle}`}
                  >
                    Saber más
                  </button>
                  <span className="flex-grow border-t border-gray-300 ml-2"></span>
                </div>
              </div>

              {demanda.profile_id && (
                <button
                  onClick={() => handleDeleteDemanda(Number(demanda.id))}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
                  aria-label={`Eliminar demanda ${demanda.detalle}`}
                >
                  <i className="fas fa-trash-alt"></i>
                </button>
              )}
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">No hay demandas disponibles.</p>
        )}
      </div>

      {/* Modal */}
      <ModalDetallesPago
        isOpen={modalOpen}
        onClose={cerrarModal}
        demanda={demandaSeleccionada}
      />
    </div>
  );
}

