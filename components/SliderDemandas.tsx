'use client';
import { useTheme } from "next-themes";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useState } from "react";
import ModalDetallesPago from "@/components/ModalDetallesPago";
import { MoveRight } from "lucide-react";

export default function SliderDemandas({ demandas }: { demandas: any[] }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [demandaSeleccionada, setDemandaSeleccionada] = useState<any>(null);
  const { theme } = useTheme();

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    appendDots: (dots: React.ReactNode) => (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "15px",
        }}
        className={theme === "dark" ? "text-white" : "text-black"} // Cambiar color según el tema
      >
        {dots}
      </div>
    ),
    nextArrow: (
      <div
        className={`custom-arrow ${
          theme === "dark" ? "text-white" : "text-black"
        }`}
      >
        ➡
      </div>
    ),
    prevArrow: (
      <div
        className={`custom-arrow ${
          theme === "dark" ? "text-white" : "text-black"
        }`}
      >
        ⬅
      </div>
    ),
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 600,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  const abrirModal = (demanda: any) => {
    setDemandaSeleccionada(demanda);
    setModalOpen(true);
  };

  const cerrarModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      <Slider {...settings}
      className="gap-2 mr-4">
        {demandas.length > 0 ? (
          demandas.map((demanda) => (
            <div key={demanda.id} className="relative mb-4 shadow-md p-3 border border-solid border-slate-950 rounded-lg">         
              <div className="flex items-center justify-between p-4">
                <h3 className="font-bold text-lg">{demanda.detalle}</h3>
                {/* Verifica que la ruta y el archivo SVG sean correctos */}
                {demanda.pais && demanda.pais.bandera_url && (
                  <img
                    src={`${demanda.pais.bandera_url}`} // Concatenamos la URL base con el valor de la columna
                    alt={`Bandera de ${demanda.pais.nombre}`}
                    className="w-5 h-3 ml-2"
                  />
                )}
              </div>
              <p>
                <strong>Rubro:</strong> {demanda.rubro_demanda}
              </p>
              <p>
                <strong>Inicio:</strong>{" "}
                {new Date(demanda.fecha_inicio).toLocaleDateString()}
              </p>
              <p>
                <strong>Vencimiento:</strong>{" "}
                {new Date(demanda.fecha_vencimiento).toLocaleDateString()}
              </p>
              <button
                onClick={() => abrirModal(demanda)}
                className="bg-blue-500 text-white text-center py-2 rounded-lg hover:bg-blue-600"
              >
                Saber más
              </button>
              {/* Imagen superpuesta */}
              <img
                src="/nuevo.png"
                alt="Superposición"
                className="absolute bottom-2 right-2 w-9 h-9 opacity-80 pointer-events-none"
              />
            </div>
          ))
        ) : (
          <p>No hay demandas disponibles.</p>
        )}
      </Slider>

      {/* Renderizar el modal cuando sea necesario */}
      <ModalDetallesPago
        isOpen={modalOpen}
        onClose={cerrarModal}
        demanda={demandaSeleccionada}
      />
    </>
  );
}
