import { useState } from 'react';
import api from '../services/api';

export const usePedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPedidos = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/pedidos');
      setPedidos(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar pedidos');
      console.error('Error fetching pedidos:', err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchPedidoById = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/pedidos/${id}`);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar pedido');
      console.error('Error fetching pedido:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const crearPedidoDesdeCarrito = async (direccionEnvio) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/pedidos/desde-carrito', { direccionEnvio });
      return { success: true, data: response.data };
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Error al crear pedido';
      setError(errorMsg);
      console.error('Error creando pedido:', err);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const crearPedido = async (pedidoData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/pedidos', pedidoData);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Error al crear pedido';
      setError(errorMsg);
      console.error('Error creando pedido:', err);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const cancelarPedido = async (pedidoId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.put(`/pedidos/${pedidoId}/cancelar`);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Error al cancelar pedido';
      setError(errorMsg);
      console.error('Error cancelando pedido:', err);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  return {
    pedidos,
    loading,
    error,
    fetchPedidos,
    fetchPedidoById,
    crearPedidoDesdeCarrito,
    crearPedido,
    cancelarPedido
  };
};
