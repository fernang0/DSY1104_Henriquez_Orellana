import React, { useState } from 'react';
import { Button, Spinner, Alert } from 'react-bootstrap';
import { API_BASE_URL } from '../../services/api';

/**
 * Ejemplo de botón de pago con Transbank
 * Implementación directa según especificación
 */
const PaymentButton = ({ pedidoId, disabled = false }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Inicia el pago con Transbank
   * Implementación exacta del prompt
   */
  const handlePagar = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('Iniciando pago para pedido:', pedidoId);

      // POST a /pagos/iniciar
      const response = await fetch(`${API_BASE_URL}/pagos/iniciar`, {
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
      
      console.log('Token:', token);
      console.log('URL:', url);

      // Redirigir a Transbank
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = url;
      
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = 'token_ws';  // IMPORTANTE: exactamente "token_ws"
      input.value = token;
      
      form.appendChild(input);
      document.body.appendChild(form);
      form.submit();

    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div>
      {error && (
        <Alert variant="danger" className="mb-3">
          {error}
        </Alert>
      )}
      
      <Button
        variant="success"
        size="lg"
        onClick={handlePagar}
        disabled={loading || disabled}
        className="w-100"
      >
        {loading ? (
          <>
            <Spinner animation="border" size="sm" className="me-2" />
            Procesando...
          </>
        ) : (
          <>
            <i className="bi bi-credit-card me-2"></i>
            Pagar con Transbank
          </>
        )}
      </Button>
    </div>
  );
};

export default PaymentButton;
