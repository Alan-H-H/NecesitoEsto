// pages/index.js
import Hero from "@/components/hero";
import Table from "@/components/categorias";
import Pais from "@/components/paises";
import SliderDemandas  from "@/components/SliderDemandas";
import { getAllDemandasLimit } from "@/actions/demanda-actions";
import { fetchCategorias } from "@/actions/categorias-actions";
import { fetchPaises } from "@/actions/paises-actions";
import Seccion from "@/components/seccionmain";
import FloatingButton from "@/components/FloatingButton";
import { Roboto } from 'next/font/google'
 
const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
})

export default async function Index() {
  
  const demandas = await getAllDemandasLimit();
  const categorias = await fetchCategorias();
  const paises = await fetchPaises();

  return (
    <>
      
      <main className={roboto.className}>
        <Hero />
        <div className="container">
          <div className="flex flex-col justify-center h-auto md:h-[500px] md:text-base text-lg mt-[25px] md:mt-[-70px]">
              <h1 className="text-2xl font-bold text-center hover:underline mb-3">Nuevas Publicaciones</h1>
              <SliderDemandas demandas={demandas} />     
          </div>

          <div className="flex flex-col justify-center h-auto md:h-[500px] md:text-base text-lg mt-[40px] md:mt-[-70px]">
            <h1 className="text-2xl font-bold text-center hover:underline">Categorías</h1>
            <Table categorias={categorias || []} />
          </div>
        </div>
        <Seccion />
        <FloatingButton /> {/* Aquí se incluye el botón flotante */}
        <Pais paises={paises || []} /> 
      </main>
      
      
    </>
  );
}

