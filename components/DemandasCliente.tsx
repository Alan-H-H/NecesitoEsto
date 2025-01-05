'use client';

import { useState, useEffect } from 'react';
import ModalDetallesPago from '@/components/ModalDetallesPago';
import { deleteDemanda, getDemandasByCategoria } from '@/actions/demanda-actions';
import Search from './ui/search'; // Assuming Search component is in the 'ui' folder
import { useSearchParams } from 'next/navigation';

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
    <div>
      {/* Filtros */}
      <div className="mb-4">
        {/* Search Component */}
        <Search placeholder="Buscar Necesidades..." handleSearch={handleSearch} />
        
        {/* Categoria Filter */}
        <select
          id="categoria"
          value={categoriaSeleccionada}
          onChange={(e) => handleCategoriaChange(e.target.value)}
          className="outline-0"
        >
          <option value="">Todas las categorías</option>
          {categorias.map((categoria) => (
            <option key={categoria.id} value={categoria.id}>
              {categoria.categoria}
            </option>
          ))}
        </select>

        <button
          className="border border-white p-2 ml-2 rounded-lg hover:border-slate-950"
          onClick={reiniciarFiltro}
          aria-label="Reiniciar filtro"
        >
          Reiniciar filtro
        </button>
      </div>

      {/* Lista de demandas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-center">
        {filteredDemandas.length > 0 ? (
          filteredDemandas.map((demanda) => (
            <div
              key={demanda.id}
              className="relative border h-[350px] border-solid border-slate-950 rounded-lg p-6 flex flex-col gap-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg">{demanda.detalle}</h3>
                {demanda.pais?.[0]?.bandera_url && (
                  <img
                    src={demanda.pais[0].bandera_url}
                    alt={`Bandera de ${demanda.pais[0].nombre}`}
                    className="w-5 h-3 ml-2"
                  />
                )}
              </div>
              <p className='flex flex-start'>
                <strong>Rubro:&nbsp;  </strong> {demanda.rubro_demanda}
              </p>
              <p className='flex flex-start'>
                <strong>Fecha de inicio:&nbsp;  </strong> {' '}{new Date(demanda.fecha_inicio).toLocaleDateString()}
              </p>
              <p className='flex flex-start'>
                <strong>Fecha de vencimiento:&nbsp;  </strong>{' '}{new Date(demanda.fecha_vencimiento).toLocaleDateString()}
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
              <button
                onClick={() => abrirModal(demanda)}
                className="top-[300px] bg-blue-500 flex flex-start bottom-4 left-2 w-auto h-9 absolute text-white text-center p-4 items-center rounded-lg hover:bg-blue-600"
                aria-label={`Ver más sobre ${demanda.detalle}`}
              >
                Saber más
              </button>
              {demanda.profile_id && (
                <button
                  onClick={() => handleDeleteDemanda(Number(demanda.id))}
                  className="bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
                  aria-label={`Eliminar demanda ${demanda.detalle}`}
                >
                  Borrar Demanda
                </button>
              )}
            </div>
          ))
        ) : (
          <p>No hay demandas disponibles.</p>
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

