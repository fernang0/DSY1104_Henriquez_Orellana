import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert, Spinner, ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { pedidoService } from '../services/pedidoService';
import { useTransbank } from '../hooks/useTransbank';
import { useAuth } from '../context/AuthContext';

/**
 * Página de Checkout con pago Transbank
 * 
 * FLUJO:
 * 1. Usuario ingresa dirección
 * 2. Crear pedido (POST /pedidos)
 * 3. Iniciar pago (POST /pagos/iniciar)
 * 4. Redirigir a Transbank
 */
const CheckoutSimple = () => {
  const navigate = useNavigate();
  const { items, total, itemCount, fetchCarrito } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { iniciarPago, loading: pagoLoading } = useTransbank();
  
  const [direccionEnvio, setDireccionEnvio] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      alert('Debes iniciar sesión para continuar');
      navigate('/login');
      return;
    }
    fetchCarrito();
  }, [isAuthenticated, navigate, fetchCarrito]);

  const formatCLP = (precio) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(precio);
  };

  /**
   * Maneja el pago con Transbank
   * Implementación exacta según especificación
   */
  const handlePagar = async (e) => {
    e.preventDefault();
    
    // Validaciones
    if (!direccionEnvio || direccionEnvio.trim().length < 10) {
      setError('Por favor ingresa una dirección completa (mínimo 10 caracteres)');
      return;
    }

    if (!items || items.length === 0) {
      setError('Tu carrito está vacío');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('=== INICIANDO CHECKOUT ===');
      
      // PASO 1: Crear pedido
      console.log('1. Creando pedido...');
      const pedido = await pedidoService.createFromCart(direccionEnvio.trim());
      
      if (!pedido || !pedido.id) {
        throw new Error('Error al crear el pedido');
      }
      
      console.log('✓ Pedido creado ID:', pedido.id);

      // PASO 2: Iniciar pago con Transbank
      console.log('2. Iniciando pago con Transbank...');
      await iniciarPago(pedido.id);
      
      // La función iniciarPago redirige automáticamente a Transbank
      // No se ejecuta código después de esto
      
    } catch (err) {
      console.error('❌ Error:', err);
      setError(err.message || 'Error al procesar el pago');
      setLoading(false);
    }
  };

  // Carrito vacío
  if (!items || items.length === 0) {
    return (
      <Container className="py-5 text-center">
        <i className="bi bi-cart-x mb-3" style={{ fontSize: '4rem', color: '#ddd' }}></i>
        <h2>Tu carrito está vacío</h2>
        <p className="text-muted mb-4">Agrega productos para continuar</p>
        <Button variant="primary" onClick={() => navigate('/productos')}>
          Ir a productos
        </Button>
      </Container>
    );
  }

  const isProcessing = loading || pagoLoading;

  return (
    <Container className="py-4">
      <h2 className="mb-4">
        <i className="bi bi-credit-card me-2"></i>
        Finalizar Compra
      </h2>

      <Row>
        {/* Columna izquierda: Formulario */}
        <Col lg={7}>
          <Card className="mb-4">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">
                <i className="bi bi-truck me-2"></i>
                Datos de Envío
              </h5>
            </Card.Header>
            <Card.Body>
              {error && (
                <Alert variant="danger" dismissible onClose={() => setError(null)}>
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {error}
                </Alert>
              )}

              <Form onSubmit={handlePagar}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Dirección de Envío <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Calle, número, depto/casa, comuna, ciudad, región&#10;Ejemplo: Av. Providencia 1234, Depto 501, Providencia, Santiago, RM"
                    value={direccionEnvio}
                    onChange={(e) => setDireccionEnvio(e.target.value)}
                    required
                    minLength={10}
                    disabled={isProcessing}
                  />
                  <Form.Text className="text-muted">
                    Ingresa tu dirección completa para el envío
                  </Form.Text>
                </Form.Group>

                <div className="bg-light p-3 rounded mb-3">
                  <p className="mb-2"><strong>Usuario:</strong> {user?.email}</p>
                  <p className="mb-0"><strong>Nombre:</strong> {user?.nombre || 'Usuario'}</p>
                </div>

                <div className="d-grid gap-2">
                  <Button
                    type="submit"
                    variant="success"
                    size="lg"
                    disabled={isProcessing || !direccionEnvio.trim()}
                  >
                    {isProcessing ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Procesando pago...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-credit-card-2-front me-2"></i>
                        Pagar con Transbank
                      </>
                    )}
                  </Button>

                  <Button
                    variant="outline-secondary"
                    onClick={() => navigate('/carrito')}
                    disabled={isProcessing}
                  >
                    <i className="bi bi-arrow-left me-2"></i>
                    Volver al carrito
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>

          {/* Información de seguridad */}
          <Card className="border-success">
            <Card.Body>
              <div className="d-flex align-items-center text-success">
                <i className="bi bi-shield-check fs-3 me-3"></i>
                <div>
                  <strong>Pago 100% Seguro</strong>
                  <p className="mb-0 small">
                    Protegido por Transbank Webpay. Tus datos están encriptados y seguros.
                  </p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Columna derecha: Resumen */}
        <Col lg={5}>
          <Card className="sticky-top" style={{ top: '20px' }}>
            <Card.Header className="bg-light">
              <h5 className="mb-0">
                <i className="bi bi-cart-check me-2"></i>
                Resumen del Pedido
              </h5>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                {items.map((item) => (
                  <ListGroup.Item key={item.id} className="px-0">
                    <div className="d-flex justify-content-between align-items-start">
                      <div className="flex-grow-1">
                        <strong>{item.productoNombre}</strong>
                        <div className="small text-muted">
                          {item.productoCode} × {item.cantidad}
                        </div>
                      </div>
                      <div className="text-end ms-3">
                        <div>{formatCLP(item.subtotal)}</div>
                      </div>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>

              <hr />

              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal ({itemCount} {itemCount === 1 ? 'producto' : 'productos'})</span>
                <strong>{formatCLP(total)}</strong>
              </div>

              <div className="d-flex justify-content-between mb-3 text-success">
                <span>Envío</span>
                <strong>Gratis</strong>
              </div>

              <hr />

              <div className="d-flex justify-content-between align-items-center">
                <h4 className="mb-0">Total</h4>
                <h3 className="mb-0 text-primary">{formatCLP(total)}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CheckoutSimple;
