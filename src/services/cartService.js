import api from './api';

/**
 * Servicio para operaciones del carrito
 * Endpoints: /api/v1/carrito
 */

export const cartService = {
  /**
   * Obtiene el carrito activo del usuario
   */
  getCart: async () => {
    const response = await api.get('/carrito');
    return response.data;
  },

  /**
   * Agrega un item al carrito
   * Si el producto ya existe, incrementa la cantidad
   */
  addItem: async (productoId, cantidad = 1) => {
    const response = await api.post('/carrito/items', { productoId, cantidad });
    return response.data;
  },

  /**
   * Actualiza la cantidad de un item
   * Backend espera cantidad como query parameter
   */
  updateItem: async (itemId, cantidad) => {
    const response = await api.put(`/carrito/items/${itemId}?cantidad=${cantidad}`);
    return response.data;
  },

  /**
   * Elimina un item del carrito
   */
  removeItem: async (itemId) => {
    await api.delete(`/carrito/items/${itemId}`);
  },

  /**
   * Vacía todo el carrito
   */
  clearCart: async () => {
    await api.delete('/carrito');
  }
};
