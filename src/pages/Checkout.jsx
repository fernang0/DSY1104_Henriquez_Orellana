import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { usePedidos } from '../hooks/usePedidos';
import { usePagos } from '../hooks/usePagos';
import { useAuth } from '../context/AuthContext';
import '../styles/components/checkout.css';

function Checkout() {
  const navigate = useNavigate();
  const { items, carrito, total, itemCount, vaciarCarrito } = useCart();
  const { crearPedidoDesdeCarrito, loading: pedidoLoading } = usePedidos();
  const { iniciarPago, loading: pagoLoading } = usePagos();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    rut: '',
    email: user?.email || '',
    telefono: '',
    direccion: '',
    ciudad: '',
    region: '',
    codigoPostal: '',
    metodoPago: 'webpay',
    formaEntrega: 'domicilio'
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        email: user.email,
        nombre: user.nombre?.split(' ')[0] || '',
        apellido: user.nombre?.split(' ').slice(1).join(' ') || ''
      }));
    }
  }, [user]);

  const steps = [
    { number: 1, title: 'Tus datos', icon: '📝' },
    { number: 2, title: 'Forma de entrega', icon: '🚚' },
    { number: 3, title: 'Medio de pago', icon: '💳' },
    { number: 4, title: 'Confirmación', icon: '✅' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleContinue = () => {
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Procesar pago
      handlePayment();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    } else {
      navigate('/');
    }
  };

  const handlePayment = async () => {
    try {
      // Validación de datos
      if (!formData.nombre || !formData.apellido || !formData.direccion || !formData.ciudad) {
        alert('Por favor completa todos los campos obligatorios');
        return;
      }

      // 1. Crear pedido desde carrito
      const direccionCompleta = `${formData.direccion}, ${formData.ciudad}, ${formData.region}`;
      console.log('Creando pedido con dirección:', direccionCompleta);
      const pedido = await crearPedidoDesdeCarrito(direccionCompleta);

      if (!pedido || !pedido.id) {
        throw new Error('No se pudo crear el pedido');
      }

      console.log('Pedido creado:', pedido);

      // 2. Si es Webpay, iniciar flujo de pago con Transbank
      if (formData.metodoPago === 'webpay') {
        console.log('Iniciando pago Webpay para pedido:', pedido.id);
        const resultado = await iniciarPago(pedido.id);
        
        if (!resultado.success) {
          throw new Error(resultado.error || 'Error al iniciar el pago');
        }
        
        // El hook iniciarPago ya hace la redirección automática a Transbank
        console.log('Redirigiendo a Transbank...');
      } else {
        // Pago contra entrega o transferencia
        alert('¡Pedido creado exitosamente! Se ha enviado un correo con los detalles.');
        await vaciarCarrito();
        navigate('/mis-pedidos');
      }
    } catch (error) {
      console.error('Error en handlePayment:', error);
      alert(`Error al procesar el pedido: ${error.message}`);
    }
  };

  const formatCLP = (precio) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(precio);
  };

  if (!items || items.length === 0) {
    return (
      <Container className="py-5 text-center">
        <div className="checkout-empty">
          <h2 className="text-primary">🛒 Tu carrito está vacío</h2>
          <p className="text-muted">Agrega algunos productos gaming para continuar</p>
          <Button variant="primary" onClick={() => navigate('/productos')}>
            Explorar Productos
          </Button>
        </div>
      </Container>
    );
  }

  const isLoading = pedidoLoading || pagoLoading;

  return (
    <div className="checkout-page">
      <Container className="py-4">
        {/* Progress Steps */}
        <div className="checkout-steps mb-4">
          {steps.map((step, index) => (
            <div 
              key={step.number} 
              className={`step ${currentStep >= step.number ? 'active' : ''} ${currentStep === step.number ? 'current' : ''}`}
            >
              <div className="step-icon">
                {currentStep > step.number ? '✅' : step.icon}
              </div>
              <span className="step-title">{step.title}</span>
              {index < steps.length - 1 && <div className="step-connector"></div>}
            </div>
          ))}
        </div>

        <Row>
          <Col lg={8}>
            <Card className="checkout-form-card">
              <Card.Body>
                {/* Step 1: Datos personales */}
                {currentStep === 1 && (
                  <div className="checkout-step">
                    <h3 className="step-heading">
                      📝 Tus datos
                    </h3>
                    <p className="step-description">Datos para envío de notificaciones de la compra</p>
                    
                    <Form>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                              type="text"
                              name="nombre"
                              value={formData.nombre}
                              onChange={handleInputChange}
                              placeholder="Tu nombre"
                              required
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Apellido</Form.Label>
                            <Form.Control
                              type="text"
                              name="apellido"
                              value={formData.apellido}
                              onChange={handleInputChange}
                              placeholder="Tu apellido"
                              required
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>RUT</Form.Label>
                        <Form.Control
                          type="text"
                          name="rut"
                          value={formData.rut}
                          onChange={handleInputChange}
                          placeholder="12.345.678-9"
                          required
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>E-mail</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="gamer@levelup.cl"
                          required
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Teléfono</Form.Label>
                        <Form.Control
                          type="tel"
                          name="telefono"
                          value={formData.telefono}
                          onChange={handleInputChange}
                          placeholder="+56 9 1234 5678"
                          required
                        />
                      </Form.Group>
                    </Form>
                  </div>
                )}

                {/* Step 2: Forma de entrega */}
                {currentStep === 2 && (
                  <div className="checkout-step">
                    <h3 className="step-heading">
                      🚚 Forma de entrega
                    </h3>
                    
                    <div className="delivery-options">
                      <div 
                        className={`delivery-option ${formData.formaEntrega === 'domicilio' ? 'selected' : ''}`}
                        onClick={() => setFormData(prev => ({ ...prev, formaEntrega: 'domicilio' }))}
                      >
                        <div className="option-icon">🏠</div>
                        <div className="option-details">
                          <h5>Entrega a domicilio</h5>
                          <p>Recibe tu pedido gaming en la comodidad de tu casa</p>
                          <span className="delivery-time">2-3 días hábiles</span>
                        </div>
                        <div className="option-price">Gratis</div>
                      </div>

                      <div 
                        className={`delivery-option ${formData.formaEntrega === 'retiro' ? 'selected' : ''}`}
                        onClick={() => setFormData(prev => ({ ...prev, formaEntrega: 'retiro' }))}
                      >
                        <div className="option-icon">🏪</div>
                        <div className="option-details">
                          <h5>Retiro en tienda</h5>
                          <p>Av. Providencia 1234, Santiago</p>
                          <span className="delivery-time">Disponible hoy</span>
                        </div>
                        <div className="option-price">Gratis</div>
                      </div>
                    </div>

                    {formData.formaEntrega === 'domicilio' && (
                      <Form className="mt-4">
                        <Form.Group className="mb-3">
                          <Form.Label>Dirección</Form.Label>
                          <Form.Control
                            type="text"
                            name="direccion"
                            value={formData.direccion}
                            onChange={handleInputChange}
                            placeholder="Calle Gamer 123"
                            required
                          />
                        </Form.Group>
                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Ciudad</Form.Label>
                              <Form.Control
                                type="text"
                                name="ciudad"
                                value={formData.ciudad}
                                onChange={handleInputChange}
                                placeholder="Santiago"
                                required
                              />
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Región</Form.Label>
                              <Form.Select
                                name="region"
                                value={formData.region}
                                onChange={handleInputChange}
                                required
                              >
                                <option value="">Selecciona región</option>
                                <option value="RM">Región Metropolitana</option>
                                <option value="V">Valparaíso</option>
                                <option value="VIII">Biobío</option>
                              </Form.Select>
                            </Form.Group>
                          </Col>
                        </Row>
                      </Form>
                    )}
                  </div>
                )}

                {/* Step 3: Medio de pago */}
                {currentStep === 3 && (
                  <div className="checkout-step">
                    <h3 className="step-heading">
                      💳 Medio de pago
                    </h3>
                    
                    <div className="payment-options">
                      <div 
                        className={`payment-option ${formData.metodoPago === 'transferencia' ? 'selected' : ''}`}
                        onClick={() => setFormData(prev => ({ ...prev, metodoPago: 'transferencia' }))}
                      >
                        <div className="option-content">
                          <div className="option-icon">💰</div>
                          <div className="option-details">
                            <h5>Transferencia Bancaria</h5>
                            <p>Transferencia y Banco Estado</p>
                          </div>
                          <div className="option-price">{formatCLP(total)}</div>
                        </div>
                      </div>

                      <div 
                        className={`payment-option ${formData.metodoPago === 'webpay' ? 'selected' : ''}`}
                        onClick={() => setFormData(prev => ({ ...prev, metodoPago: 'webpay' }))}
                      >
                        <div className="option-content">
                          <div className="option-icon">💳</div>
                          <div className="option-details">
                            <h5>Webpay Plus (Transbank)</h5>
                            <p>Débito, Crédito, Prepago</p>
                          </div>
                          <div className="option-price">{formatCLP(total)}</div>
                        </div>
                      </div>

                      <div 
                        className={`payment-option ${formData.metodoPago === 'contraentrega' ? 'selected' : ''}`}
                        onClick={() => setFormData(prev => ({ ...prev, metodoPago: 'contraentrega' }))}
                      >
                        <div className="option-content">
                          <div className="option-icon">🚚</div>
                          <div className="option-details">
                            <h5>Pago Contra Entrega</h5>
                            <p>Paga al recibir tu pedido</p>
                          </div>
                          <div className="option-price">{formatCLP(total)}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Confirmación */}
                {currentStep === 4 && (
                  <div className="checkout-step">
                    <h3 className="step-heading">
                      ✅ Confirmación
                    </h3>
                    
                    <Alert variant="success">
                      <Alert.Heading>¡Todo listo para tu compra gaming!</Alert.Heading>
                      <p>Revisa los detalles antes de confirmar tu pedido.</p>
                    </Alert>

                    <div className="order-summary">
                      <h5>Resumen del pedido:</h5>
                      <p><strong>Cliente:</strong> {formData.nombre} {formData.apellido}</p>
                      <p><strong>Email:</strong> {formData.email}</p>
                      <p><strong>Entrega:</strong> {formData.formaEntrega === 'domicilio' ? 'Domicilio' : 'Retiro en tienda'}</p>
                      <p><strong>Pago:</strong> {formData.metodoPago === 'transferencia' ? 'Transferencia' : 'Webpay'}</p>
                    </div>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>

          {/* Resumen del pedido */}
          <Col lg={4}>
            <Card className="order-summary-card sticky-top">
              <Card.Header className="bg-primary text-white">
                <h5 className="mb-0">🛒 Resumen ({items.length} producto{items.length !== 1 ? 's' : ''})</h5>
              </Card.Header>
              <Card.Body>
                {items.map((item) => (
                  <div key={item.productoId} className="cart-item-summary">
                    <div className="item-details">
                      <h6>{item.productoNombre}</h6>
                      <p className="text-muted">Cantidad: {item.cantidad}</p>
                    </div>
                    <div className="item-price">
                      {formatCLP(item.precioUnitario * item.cantidad)}
                    </div>
                  </div>
                ))}

                <hr />
                
                <div className="price-breakdown">
                  <div className="price-row total">
                    <strong>
                      <span>TOTAL:</span>
                      <span>{formatCLP(total)}</span>
                    </strong>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Navigation buttons */}
        <div className="checkout-navigation mt-4">
          <Button 
            variant="outline-primary" 
            onClick={handleBack} 
            disabled={pedidoLoading || pagoLoading}
          >
            ← {currentStep === 1 ? 'Volver' : 'Atrás'}
          </Button>
          <Button 
            variant="primary"
            disabled={pedidoLoading || pagoLoading} 
            size="lg" 
            onClick={handleContinue}
            className="ms-3"
          >
            {pedidoLoading || pagoLoading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Procesando...
              </>
            ) : (
              currentStep === 4 ? '💳 Pagar con Transbank' : 'Continuar →'
            )}
          </Button>
        </div>
      </Container>
    </div>
  );
}

export default Checkout;