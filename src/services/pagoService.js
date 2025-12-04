import api from './api';

/**
 * Servicio para operaciones de pago con Transbank
 * Endpoints: /api/v1/pagos
 */

export const pagoService = {
  /**
   * Inicia el proceso de pago con Webpay
   * Retorna token y URL para redireccionar
   */
  initPayment: async (pedidoId) => {
    const response = await api.post('/pagos/iniciar', { pedidoId });
    return response.data;
  },

  /**
   * Obtiene el estado de un pago
   */
  getPaymentStatus: async (token) => {
    const response = await api.get(`/pagos/estado?token=${token}`);
    return response.data;
  }
};

/**
 * Redirige al usuario a Transbank para completar el pago
 */
export const redirectToTransbank = (token, url) => {
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
};
