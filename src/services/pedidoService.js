import api from './api';

/**
 * Servicio para operaciones de pedidos
 * Endpoints: /api/v1/pedidos
 */

export const pedidoService = {
  /**
   * Crea un pedido desde el carrito activo
   * IMPORTANTE: Esto cambia el carrito a estado COMPRADO
   */
  createFromCart: async (direccionEnvio) => {
    const response = await api.post('/pedidos/desde-carrito', { direccionEnvio });
    return response.data;
  },

  /**
   * Obtiene todos los pedidos del usuario
   */
  getMyOrders: async () => {
    const response = await api.get('/pedidos');
    return response.data;
  },

  /**
   * Obtiene un pedido por ID
   */
  getOrderById: async (id) => {
    const response = await api.get(`/pedidos/${id}`);
    return response.data;
  },

  /**
   * Cancela un pedido
   */
  cancelOrder: async (id) => {
    const response = await api.put(`/pedidos/${id}/cancelar`);
    return response.data;
  }
};
