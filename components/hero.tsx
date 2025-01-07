// components/Hero.js
import React from 'react';


export default function Hero() {
  return (
    <div className="relative w-full">
      {/* Contenedor con imagen que ocupa todo el ancho */}
      <img
        src="/banner.jpg"  // Ruta de la imagen
        alt="Hero"
        className="w-full h-[500px] object-cover opacity-95" // Se ajusta el ancho y controlas la altura
      />

      {/* Opcional: Puedes agregar tu search aquí */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white font-bold text-center transition-transform transform hover:scale-105">
        <br></br>
        <h1 className='text-3xl'>¡El Momento es Ahora!</h1>
        <br></br>
        <p>Publica lo que estas necesitando y encuentra la mejor solución. Más de 20.000 usuarios conocerán tu demanda.</p>
        <br></br>
        {/*<input
          type="text"
          placeholder="Buscar..."
          className="p-2 text-black rounded-lg"
        />*/}
      </div>
    </div>
  );
}
