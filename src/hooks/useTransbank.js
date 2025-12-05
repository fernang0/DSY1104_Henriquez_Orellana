import { useState } from 'react';

/**
 * Hook para manejar pagos con Transbank
 * Implementación directa según especificación
 */
export const useTransbank = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Inicia el proceso de pago con Transbank
   * @param {number} pedidoId - ID del pedido a pagar
   */
  const iniciarPago = async (pedidoId) => {
    setLoading(true);
    setError(null);

    try {
      console.log('Iniciando pago para pedido:', pedidoId);

      const response = await fetch('http://localhost:8080/api/v1/pagos/iniciar', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ pedidoId })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al iniciar pago');
      }

      const { token, url } = await response.json();
      
      console.log('Token recibido:', token);
      console.log('URL Transbank:', url);

      // Redirigir a Transbank
      redirectToTransbank(token, url);

    } catch (err) {
      console.error('Error al iniciar pago:', err);
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  /**
   * Redirige al usuario a Transbank mediante un formulario POST
   * @param {string} token - Token de Transbank (token_ws)
   * @param {string} url - URL de Transbank
   */
  const redirectToTransbank = (token, url) => {
    // Crear formulario
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = url;
    
    // Crear input hidden con el token
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'token_ws';  // IMPORTANTE: debe ser exactamente "token_ws"
    input.value = token;
    
    // Agregar input al form y enviarlo
    form.appendChild(input);
    document.body.appendChild(form);
    form.submit();
  };

  return {
    iniciarPago,
    loading,
    error
  };
};
