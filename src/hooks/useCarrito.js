import { useState, useEffect } from 'react';
import { cartService } from '../services/cartService';
import { useAuth } from '../context/AuthContext';

/**
 * Hook para gestionar el carrito de compras
 * Comunicación directa con backend mediante cartService
 */
export const useCarrito = () => {
  const [carrito, setCarrito] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  /**
   * Obtiene el carrito activo desde el backend
   */
  const fetchCarrito = async () => {
    if (!isAuthenticated()) {
      setCarrito(null);
      return null;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await cartService.getCart();
      setCarrito(data);
      return data;
    } catch (err) {
      // 404 = no tiene carrito aún (se crea al agregar primer producto)
      if (err.response?.status === 404) {
        setCarrito(null);
        return null;
      }
      const msg = err.response?.data?.message || 'Error al cargar carrito';
      setError(msg);
      console.error('Error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Agrega un producto al carrito
   */
  const agregarItem = async (productoId, cantidad = 1) => {
    if (!isAuthenticated()) {
      throw new Error('Debes iniciar sesión para agregar productos');
    }

    setLoading(true);
    setError(null);
    try {
      await cartService.addItem(productoId, cantidad);
      await fetchCarrito();
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al agregar producto';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Actualiza la cantidad de un item
   */
  const actualizarItem = async (itemId, cantidad) => {
    setLoading(true);
    setError(null);
    try {
      await cartService.updateItem(itemId, cantidad);
      await fetchCarrito();
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al actualizar';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Elimina un item del carrito
   */
  const eliminarItem = async (itemId) => {
    setLoading(true);
    setError(null);
    try {
      await cartService.removeItem(itemId);
      await fetchCarrito();
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al eliminar';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Vacía el carrito completo
   */
  const vaciarCarrito = async () => {
    setLoading(true);
    setError(null);
    try {
      await cartService.clearCart();
      setCarrito(null);
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al vaciar carrito';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Cargar carrito al montar y cuando cambia autenticación
  useEffect(() => {
    const auth = isAuthenticated();
    if (auth) {
      fetchCarrito();
    } else {
      setCarrito(null);
    }
  }, [isAuthenticated]);

  return {
    carrito,
    loading,
    error,
    agregarItem,
    actualizarItem,
    eliminarItem,
    vaciarCarrito,
    fetchCarrito
  };
};
