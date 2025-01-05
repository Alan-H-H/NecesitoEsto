'use client'
import { useState, useEffect, useRef } from 'react';
import ModalDetallesPago from '@/components/ModalDetallesPago';
import { deleteDemanda, getDemandasByCategoria } from '@/actions/demanda-actions';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Search from './ui/search';

type Pais = {
  nombre: string;
  bandera_url: string;
};

type Demanda = {
  id: any; // or 'number' if 'id' is a number
  empresa: any; // Update 'any' to a specific type if you know its structure
  responsable_solicitud: any; // Update 'any' to a specific type if needed
  email_contacto: any; // Update 'any' to a specific type if needed
  telefono: any; // Update 'any' to a specific type if needed
  fecha_inicio: any; // Update 'any' to a specific type (e.g., 'string' or 'Date') if needed
  fecha_vencimiento: any; // Update 'any' to a specific type (e.g., 'string' or 'Date') if needed
  rubro_demanda: any; // Update 'any' to a specific type (e.g., 'string')
  detalle: any; // Update 'any' to a specific type (e.g., 'string')
  pais: Pais[]; // The 'pais' field is an array of 'Pais' objects
};

type Categoria = {
  id: string;
  categoria: string;
};

type DemandasClienteProps = {
  demandas: Demanda[];
  userId: string | number;
  categorias: Categoria[];
};


export default function DemandasCliente({ demandas, userId, categorias }: DemandasClienteProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [demandasList, setDemandasList] = useState<Demanda[]>(demandas);
  const [filteredDemandas, setFilteredDemandas] = useState<Demanda[]>(demandas);
  const [modalOpen, setModalOpen] = useState(false);
  const [demandaSeleccionada, setDemandaSeleccionada] = useState<Demanda | null>(null);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [searchQuery, setSearchQuery] = useState<string>(searchParams.get('query') || '');
  const [loading, setLoading] = useState(false);  // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const abrirModal = (demanda: Demanda) => {
    setDemandaSeleccionada(demanda);
    setModalOpen(true);
  };

  const cerrarModal = () => {
    setModalOpen(false);
    setDemandaSeleccionada(null);
  };

  const handleDeleteDemanda = async (id: number) => {
    try {
      setLoading(true);
      await deleteDemanda(String(id)); // Convert ID to string if necessary
      setDemandasList(prev => prev.filter(d => d.id !== id));
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError('Error al borrar la demanda');
      console.error('Error al borrar la demanda:', error);
    }
  };

  const handleCategoriaChange = async (idCategoria: string) => {
    if (categoriaSeleccionada === idCategoria) return;

    try {
      setCategoriaSeleccionada(idCategoria);
      setLoading(true);
      const demandasFiltradas: Demanda[] = idCategoria
        ? await getDemandasByCategoria(idCategoria)
        : demandas;
      setFilteredDemandas(demandasFiltradas);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError('Error al filtrar por categoría');
      console.error('Error al filtrar por categoría:', error);
    }
  };

  const reiniciarFiltro = () => {
    setCategoriaSeleccionada('');
    setFilteredDemandas(demandas);
  };

  const filterDemandas = () => {
    let result = demandas;
    if (categoriaSeleccionada) {
      result = result.filter((demanda) => demanda.categoria === categoriaSeleccionada);
    }
    if (searchQuery) {
      result = result.filter((demanda) =>
        demanda.detalle.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredDemandas(result);
  };

  const handleSearch = (term: string) => {
    clearTimeout(timeoutRef.current as NodeJS.Timeout); // Clear any existing timeout
    timeoutRef.current = setTimeout(() => {
      setSearchQuery(term);
      const params = new URLSearchParams(searchParams.toString());
      if (term) {
        params.set('query', term); // Set the query param
      } else {
        params.delete('query'); // Remove the query param if empty
      }
      replace(`${pathname}?${params.toString()}`); // Update URL
    }, 500); // Adjust debounce delay (500ms)
  };

  useEffect(() => {
    filterDemandas();
  }, [searchQuery, categoriaSeleccionada, demandas]);

  return (
    <div>
      {/* Search Input */}
      <div className="relative flex flex-1 flex-shrink-0 mb-4">
        <label htmlFor="search" className="sr-only">Search</label>
        <Search placeholder="Buscar Necesidades..." onChange={(e) => handleSearch(e.target.value)} />
      </div>

      {/* Category Filter */}
      <div className="mb-4">
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

      {/* Loading State */}
      {loading && <p>Loading...</p>}

      {/* Error State */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Demandas List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-center">
        {filteredDemandas.length > 0 ? (
          filteredDemandas.map((demanda) => (
            <div
              key={demanda.id}
              className="relative border h-[350px] border-solid border-slate-950 rounded-lg p-6 flex flex-col gap-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg">{demanda.detalle}</h3>
                {demanda.pais?.bandera_url && (
                  <img
                    src={demanda.pais.bandera_url}
                    alt={`Bandera de ${demanda.pais.nombre}`}
                    className="w-5 h-3 ml-2"
                  />
                )}
              </div>
              <p className="flex flex-start">
                <strong>Rubro:&nbsp; </strong> {demanda.rubro_demanda}
              </p>
              <p className="flex flex-start">
                <strong>Fecha de inicio:&nbsp; </strong>
                {new Date(demanda.fecha_inicio).toLocaleDateString()}
              </p>
              <p className="flex flex-start">
                <strong>Fecha de vencimiento:&nbsp; </strong>
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
              <button
                onClick={() => abrirModal(demanda)}
                className="top-[300px] bg-blue-500 flex flex-start bottom-4 left-2 w-auto h-9 absolute text-white text-center p-4 items-center rounded-lg hover:bg-blue-600"
                aria-label={`Ver más sobre ${demanda.detalle}`}
              >
                Saber más
              </button>
              {demanda.profile_id && (
                <button
                  onClick={() => handleDeleteDemanda(demanda.id)}
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
