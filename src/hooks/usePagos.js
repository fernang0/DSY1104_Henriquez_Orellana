import { useState } from 'react';
import api from '../services/api';

export const usePagos = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const iniciarPago = async (pedidoId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/pagos/iniciar', { pedidoId });
      const { token, url } = response.data;

      // Crear formulario para redirigir a Transbank
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = url;

      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = 'token_ws';
      input.value = token;

      form.appendChild(input);
      document.body.appendChild(form);
      form.submit();

      return { success: true, token, url };
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Error al iniciar pago';
      setError(errorMsg);
      console.error('Error iniciando pago:', err);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const obtenerEstadoPago = async (token) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/pagos/estado/${token}`);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Error al obtener estado del pago';
      setError(errorMsg);
      console.error('Error obteniendo estado pago:', err);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    iniciarPago,
    obtenerEstadoPago
  };
};
