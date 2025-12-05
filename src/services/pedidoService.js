import api from './api';

/**
 * Servicio para operaciones de pedidos
 * Endpoints: /api/v1/pedidos
 */

export const pedidoService = {
  /**
   * Crea un pedido desde el carrito activo
   * IMPORTANTE: Backend vacía el carrito automáticamente
   * Endpoint: POST /api/v1/pedidos
   * Body: { "direccionEnvio": "string" }
   */
  createFromCart: async (direccionEnvio) => {
    console.log('Enviando direccion:', direccionEnvio);
    const response = await api.post('/pedidos', { direccionEnvio });
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
