import React, { useEffect, useState } from 'react';
import { Container, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { usePagos } from '../hooks/usePagos';
import '../styles/components/pago-resultado.css';

function PagoResultado() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { obtenerEstadoPago, loading } = usePagos();
  const [estadoPago, setEstadoPago] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    verificarPago();
  }, []);

  const verificarPago = async () => {
    try {
      // Obtener token_ws de los parámetros de URL (retorno de Transbank)
      const token = searchParams.get('token_ws');
      
      if (!token) {
        setError('No se recibió el token de pago');
        return;
      }

      // Verificar estado del pago con el backend
      const resultado = await obtenerEstadoPago(token);
      setEstadoPago(resultado);
    } catch (err) {
      setError(err.message || 'Error al verificar el pago');
    }
  };

  const formatCLP = (precio) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(precio);
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Verificando pago...</span>
        </Spinner>
        <p className="mt-3">Verificando tu pago con Transbank...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Card className="text-center error-card">
          <Card.Body>
            <div className="error-icon">❌</div>
            <h2 className="text-danger">Error en el Pago</h2>
            <p>{error}</p>
            <Button variant="primary" onClick={() => navigate('/productos')}>
              Volver a la Tienda
            </Button>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  if (!estadoPago) {
    return null;
  }

  const esPagoExitoso = estadoPago.estado === 'APPROVED' || 
                         estadoPago.responseCode === 0 || 
                         estadoPago.vci === 'TSY';

  return (
    <div className="pago-resultado-page">
      <Container className="py-5">
        <Card className={`resultado-card ${esPagoExitoso ? 'success' : 'error'}`}>
          <Card.Body>
            {esPagoExitoso ? (
              <>
                <div className="resultado-icon success">✅</div>
                <h1 className="text-success">¡Pago Exitoso!</h1>
                <p className="lead">Tu compra ha sido procesada correctamente</p>
                
                <div className="pago-detalles mt-4">
                  <h5>Detalles de la Transacción</h5>
                  <div className="detalle-row">
                    <span>Código de Autorización:</span>
                    <strong>{estadoPago.authorizationCode || 'N/A'}</strong>
                  </div>
                  <div className="detalle-row">
                    <span>Orden de Compra:</span>
                    <strong>#{estadoPago.buyOrder || estadoPago.pedidoId}</strong>
                  </div>
                  <div className="detalle-row">
                    <span>Monto:</span>
                    <strong>{formatCLP(estadoPago.amount || estadoPago.monto)}</strong>
                  </div>
                  <div className="detalle-row">
                    <span>Fecha:</span>
                    <strong>
                      {new Date(estadoPago.transactionDate || Date.now()).toLocaleString('es-CL')}
                    </strong>
                  </div>
                  {estadoPago.cardNumber && (
                    <div className="detalle-row">
                      <span>Tarjeta:</span>
                      <strong>**** **** **** {estadoPago.cardNumber.slice(-4)}</strong>
                    </div>
                  )}
                  {estadoPago.paymentTypeCode && (
                    <div className="detalle-row">
                      <span>Tipo de Pago:</span>
                      <strong>
                        {estadoPago.paymentTypeCode === 'VD' ? 'Débito' :
                         estadoPago.paymentTypeCode === 'VN' ? 'Crédito' :
                         estadoPago.paymentTypeCode === 'VP' ? 'Prepago' :
                         estadoPago.paymentTypeCode}
                      </strong>
                    </div>
                  )}
                </div>

                <Alert variant="info" className="mt-4">
                  <strong>📧 Confirmación enviada</strong>
                  <p className="mb-0">
                    Hemos enviado un correo con los detalles de tu compra y el código de seguimiento.
                  </p>
                </Alert>

                <div className="mt-4 d-flex gap-2 justify-content-center">
                  <Button variant="primary" onClick={() => navigate('/mis-pedidos')}>
                    Ver Mis Pedidos
                  </Button>
                  <Button variant="outline-primary" onClick={() => navigate('/productos')}>
                    Seguir Comprando
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="resultado-icon error">❌</div>
                <h1 className="text-danger">Pago Rechazado</h1>
                <p className="lead">No se pudo procesar tu pago</p>
                
                <Alert variant="warning" className="mt-4">
                  <strong>Razón:</strong> {estadoPago.message || 'Transacción rechazada por el banco'}
                </Alert>

                <p className="text-muted">
                  Por favor, verifica los datos de tu tarjeta e intenta nuevamente o utiliza otro método de pago.
                </p>

                <div className="mt-4 d-flex gap-2 justify-content-center">
                  <Button variant="primary" onClick={() => navigate('/checkout')}>
                    Reintentar Pago
                  </Button>
                  <Button variant="outline-secondary" onClick={() => navigate('/productos')}>
                    Volver a la Tienda
                  </Button>
                </div>
              </>
            )}
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default PagoResultado;
