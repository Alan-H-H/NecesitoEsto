import React, { useState, useEffect } from 'react';
import { Wallet, initMercadoPago } from '@mercadopago/sdk-react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'; // Import PayPal
import axios from 'axios';
import { createClient } from '@/utils/supabase/client';
import { ShareIcon } from '@heroicons/react/24/solid';

interface Demanda {
  id: string;
  detalle: string;
  rubro_demanda: string;
  fecha_inicio: string;
  fecha_vencimiento: string;
  precio: number;  // Ensure the type is correct
  pais: {
    nombre: string;  // Ensure 'nombre' is the field for country name
    bandera_url: string;  // Ensure 'bandera_url' is the flag URL
  };
}

interface ModalDetallesPagoProps {
  isOpen: boolean;
  onClose: () => void;
  demanda: Demanda;  // Use the correct type for demanda
}

const ModalDetallesPago: React.FC<ModalDetallesPagoProps> = ({ isOpen, onClose, demanda }) => {
  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  const [isCreatingPreference, setIsCreatingPreference] = useState(false);
  const [error, setError] = useState<string | null>(null); // For error handling
  const [nombrePagador, setNombrePagador] = useState<string>('');
  const [correoPagador, setCorreoPagador] = useState<string>('');
  const supabase = createClient();

  // Initialize Mercado Pago on component mount
  useEffect(() => {
    const publicKey = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY as string;
    if (publicKey) {
      initMercadoPago(publicKey, {
        locale: 'es-AR',
      });
    }

    // Fetch user profile from Supabase
    const fetchUserProfile = async () => {
      const { data, error } = await supabase
        .from('profile')
        .select('nombre, email') // Ensure correct table name
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return;
      }

      if (data) {
        setNombrePagador(data.nombre || '');
        setCorreoPagador(data.email || '');
      }
    };

    fetchUserProfile();
  }, []);

  // Function to create the payment preference on the server
  const createPreference = async () => {
    try {
      console.log('Demanda to create preference:', {
        id: demanda.id,
        detalle: demanda.detalle,
        precio: demanda.precio,
        nombre_pagador: nombrePagador,
        correo_pagador: correoPagador,
      });

      // Check that all required data is present
      if (!demanda.id || !demanda.detalle || !nombrePagador || !correoPagador) {
        setError('Missing necessary data to create the preference.');
        return null;
      }

      setIsCreatingPreference(true);
      const response = await axios.post('/api/create_preference', {
        id: demanda.id,
        title: demanda.detalle,
        quantity: 1,  // Adjust quantity as needed
        price: demanda.precio,  // Use the actual price of the demanda
        nombre_pagador: nombrePagador,
        correo_pagador: correoPagador,
      });

      return response.data.id;
    } catch (error) {
      console.error('Error creating preference:', error);
      setError('Error creating preference :(');  // Error handling
      return null;
    } finally {
      setIsCreatingPreference(false);
    }
  };

  // Handle payment click and create the preference
  const handlePagarClick = async () => {
    const id = await createPreference();
    if (id) {
      setPreferenceId(id);  // Store the preference ID for Wallet component
    }
  };

  if (!isOpen) return null;  // Do not render the modal if it's not open

  return (
    <div className={`fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-60 backdrop-blur-sm`}>
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-3xl w-full relative">
        {/* Close button */}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-lg">
          ✕
        </button>

        {/* Modal content */}
        <h2 className="text-2xl font-bold mb-6 text-black">Detalles de la Demanda</h2>

        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg text-black">{demanda.detalle}</h3>
          {demanda.pais?.bandera_url && (
            <img
              src={demanda.pais.bandera_url}
              alt={`Bandera de ${demanda.pais.nombre}`}
              className="w-8 h-5 ml-4"
            />
          )}
        </div>

        <p className="text-black"><strong>Rubro:</strong> {demanda.rubro_demanda}</p>
        <p className="text-black"><strong>Fecha de inicio:</strong> {new Date(demanda.fecha_inicio).toLocaleDateString()}</p>
        <p className="text-black"><strong>Fecha de vencimiento:</strong> {new Date(demanda.fecha_vencimiento).toLocaleDateString()}</p>

        {/* Share button */}
        <div className="mt-4">
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded-lg flex items-center"
            onClick={() => {
              navigator.clipboard.writeText(window.location.origin + window.location.pathname);
              alert('¡Enlace copiado al portapapeles!');
            }}
          >
            <ShareIcon className="h-5 w-5 mr-2" />
            Compartir
          </button>
        </div>

        {/* Payment buttons */}
        <div className="mt-6 space-y-4">
          {!preferenceId && (
            <button
              className="bg-green-500 text-white py-2 px-4 rounded-lg w-full"
              onClick={handlePagarClick}
              disabled={isCreatingPreference}
              aria-label="Crear preferencia de pago"
            >
              {isCreatingPreference ? 'Creando preferencia...' : 'Pagar para obtener más detalles'}
            </button>
          )}
          {preferenceId && <Wallet initialization={{ preferenceId }} />}

          {/* PayPal button */}
          <PayPalScriptProvider
            options={{
              clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '',
              currency: 'USD',
            }}
          >
            <PayPalButtons
              createOrder={async (data, actions) => {
                // Create the order
                return actions.order.create({
                  intent: 'CAPTURE',
                  purchase_units: [
                    {
                      amount: {
                        value: `${demanda.precio}`, // Use the price from demanda
                        currency_code: 'USD',
                      },
                      description: demanda.detalle, // Description of the order
                    },
                  ],
                });
              }}
              onApprove={async (data, actions) => {
                if (actions.order) {
                  const details = await actions.order.capture();
                  try {
                    await axios.post('/api/guardar_pago', {
                      demanda_id: demanda.id, // Replace with actual ID
                      detalle_demanda: demanda.detalle, // Example
                      nombre_pagador: nombrePagador,
                      correo_pagador: correoPagador,
                      numero_pago: details.id,
                      monto: demanda.precio,
                      fecha_pago: new Date().toISOString(),
                      estado_pago: 'aprobado', // Adjust as necessary
                      id_transaccion: details.id,
                      moneda: 'USD',
                    });

                    window.location.href = '/success'; // Redirect to success page
                    onClose(); // Close the modal after successful payment
                  } catch (error) {
                    console.error('Error registering payment:', error);
                  }
                }
              }}
              onError={(err) => {
                console.error('Error with PayPal payment:', err);
                alert(`Hubo un error con PayPal: ${err.message || 'Intente de nuevo más tarde.'}`);
              }}
              onCancel={() => {
                alert('Pago cancelado.');
              }}
            />
          </PayPalScriptProvider>
        </div>
      </div>
    </div>
  );
};

export default ModalDetallesPago;

