import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Container, Card, Spinner, Alert, Button } from 'react-bootstrap';
import { usePagos } from '../hooks/usePagos';
import { useCart } from '../context/CartContext';

/**
 * Página de retorno desde Transbank Webpay
 * URL: /pago/retorno?token_ws=xxxxx
 */
function PaymentReturn() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { obtenerEstadoPago, loading } = usePagos();
  const { vaciarCarrito } = useCart();
  
  const [pagoInfo, setPagoInfo] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const verificarPago = async () => {
      const token = searchParams.get('token_ws');
      
      if (!token) {
        setError('Token de pago no válido');
        return;
      }

      try {
        const resultado = await obtenerEstadoPago(token);
        
        if (resultado.success) {
          setPagoInfo(resultado.data);
          
          // Si el pago fue exitoso, limpiar carrito
          if (resultado.data.estado === 'APROBADO') {
            await vaciarCarrito();
          }
        } else {
          setError(resultado.error || 'Error al verificar el pago');
        }
      } catch (err) {
        setError('Error al procesar la respuesta del pago');
        console.error(err);
      }
    };

    verificarPago();
  }, [searchParams, obtenerEstadoPago, vaciarCarrito]);

  const formatCLP = (precio) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(precio);
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Verificando pago con Transbank...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <Alert.Heading>Error en el pago</Alert.Heading>
          <p>{error}</p>
          <Button variant="outline-danger" onClick={() => navigate('/checkout')}>
            Volver al checkout
          </Button>
        </Alert>
      </Container>
    );
  }

  if (!pagoInfo) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Cargando información del pago...</p>
      </Container>
    );
  }

  const isApproved = pagoInfo.estado === 'APROBADO';

  return (
    <Container className="py-5">
      <Card className={`text-center ${isApproved ? 'border-success' : 'border-danger'}`}>
        <Card.Body className="p-5">
          {isApproved ? (
            <>
              <div className="mb-4">
                <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '4rem' }}></i>
              </div>
              <h2 className="text-success mb-3">¡Pago Exitoso!</h2>
              <p className="lead">Tu pago ha sido procesado correctamente</p>
            </>
          ) : (
            <>
              <div className="mb-4">
                <i className="bi bi-x-circle-fill text-danger" style={{ fontSize: '4rem' }}></i>
              </div>
              <h2 className="text-danger mb-3">Pago Rechazado</h2>
              <p className="lead">No se pudo procesar tu pago</p>
            </>
          )}

          <hr className="my-4" />

          <div className="text-start">
            <h5 className="mb-3">Detalles de la transacción</h5>
            <div className="row mb-2">
              <div className="col-6"><strong>Orden de compra:</strong></div>
              <div className="col-6">{pagoInfo.ordenCompra || 'N/A'}</div>
            </div>
            <div className="row mb-2">
              <div className="col-6"><strong>Código de autorización:</strong></div>
              <div className="col-6">{pagoInfo.codigoAutorizacion || 'N/A'}</div>
            </div>
            <div className="row mb-2">
              <div className="col-6"><strong>Monto:</strong></div>
              <div className="col-6"><strong>{formatCLP(pagoInfo.monto || 0)}</strong></div>
            </div>
            <div className="row mb-2">
              <div className="col-6"><strong>Fecha:</strong></div>
              <div className="col-6">
                {pagoInfo.fechaTransaccion 
                  ? new Date(pagoInfo.fechaTransaccion).toLocaleString('es-CL')
                  : 'N/A'}
              </div>
            </div>
            <div className="row mb-2">
              <div className="col-6"><strong>Tipo de pago:</strong></div>
              <div className="col-6">{pagoInfo.tipoPago || 'Webpay'}</div>
            </div>
            {pagoInfo.numeroTarjeta && (
              <div className="row mb-2">
                <div className="col-6"><strong>Tarjeta:</strong></div>
                <div className="col-6">**** **** **** {pagoInfo.numeroTarjeta}</div>
              </div>
            )}
          </div>

          <hr className="my-4" />

          <div className="d-grid gap-2 d-md-flex justify-content-md-center">
            {isApproved ? (
              <>
                <Button 
                  variant="primary" 
                  size="lg"
                  onClick={() => navigate('/mis-pedidos')}
                >
                  Ver mis pedidos
                </Button>
                <Button 
                  variant="outline-primary" 
                  size="lg"
                  onClick={() => navigate('/')}
                >
                  Volver al inicio
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="danger" 
                  size="lg"
                  onClick={() => navigate('/checkout')}
                >
                  Intentar nuevamente
                </Button>
                <Button 
                  variant="outline-secondary" 
                  size="lg"
                  onClick={() => navigate('/')}
                >
                  Volver al inicio
                </Button>
              </>
            )}
          </div>

          {isApproved && (
            <Alert variant="info" className="mt-4">
              <i className="bi bi-info-circle me-2"></i>
              Recibirás un correo con los detalles de tu compra y el número de seguimiento.
            </Alert>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}

export default PaymentReturn;
