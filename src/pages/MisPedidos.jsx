import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Badge, Button, Spinner, Alert } from 'react-bootstrap';
import { usePedidos } from '../hooks/usePedidos';
import { useAuth } from '../context/AuthContext';
import '../styles/components/mis-pedidos.css';

function MisPedidos() {
  const { fetchPedidos, cancelarPedido, loading, error } = usePedidos();
  const { user } = useAuth();
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    loadPedidos();
  }, []);

  const loadPedidos = async () => {
    try {
      const data = await fetchPedidos();
      setPedidos(data);
    } catch (err) {
      console.error('Error loading pedidos:', err);
    }
  };

  const handleCancelar = async (pedidoId) => {
    if (window.confirm('¿Estás seguro de cancelar este pedido?')) {
      try {
        await cancelarPedido(pedidoId);
        alert('Pedido cancelado exitosamente');
        loadPedidos();
      } catch (err) {
        alert(`Error al cancelar pedido: ${err.message}`);
      }
    }
  };

  const formatCLP = (precio) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(precio);
  };

  const formatFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEstadoBadge = (estado) => {
    const estados = {
      PENDIENTE: { variant: 'warning', icon: '⏳' },
      PAGADO: { variant: 'success', icon: '✅' },
      CANCELADO: { variant: 'danger', icon: '❌' },
      ENVIADO: { variant: 'info', icon: '🚚' },
      ENTREGADO: { variant: 'success', icon: '📦' }
    };
    const config = estados[estado] || { variant: 'secondary', icon: '❓' };
    return (
      <Badge bg={config.variant}>
        {config.icon} {estado}
      </Badge>
    );
  };

  if (loading && pedidos.length === 0) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
        <p className="mt-3">Cargando tus pedidos...</p>
      </Container>
    );
  }

  return (
    <div className="mis-pedidos-page">
      <Container className="py-4">
        <div className="page-header mb-4">
          <h1>📦 Mis Pedidos</h1>
          <p className="text-muted">Historial de tus compras en LevelUp Gaming</p>
        </div>

        {error && (
          <Alert variant="danger" dismissible>
            {error}
          </Alert>
        )}

        {pedidos.length === 0 ? (
          <Card className="text-center py-5">
            <Card.Body>
              <h3>No tienes pedidos aún</h3>
              <p className="text-muted">¡Empieza a comprar productos gaming!</p>
              <Button variant="primary" href="/productos">
                Explorar Productos
              </Button>
            </Card.Body>
          </Card>
        ) : (
          <Row>
            {pedidos.map((pedido) => (
              <Col key={pedido.id} md={12} className="mb-4">
                <Card className="pedido-card">
                  <Card.Header className="d-flex justify-content-between align-items-center">
                    <div>
                      <strong>Pedido #{pedido.id}</strong>
                      <br />
                      <small className="text-muted">
                        {formatFecha(pedido.fechaPedido)}
                      </small>
                    </div>
                    <div>
                      {getEstadoBadge(pedido.estado)}
                    </div>
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      <Col md={8}>
                        <h6>Productos:</h6>
                        <ul className="pedido-items-list">
                          {pedido.items && pedido.items.map((item, index) => (
                            <li key={index}>
                              <strong>{item.cantidad}x</strong> {item.productoNombre} - {formatCLP(item.precioUnitario)}
                            </li>
                          ))}
                        </ul>
                        
                        {pedido.direccionEntrega && (
                          <div className="mt-3">
                            <h6>Dirección de entrega:</h6>
                            <p className="text-muted">{pedido.direccionEntrega}</p>
                          </div>
                        )}

                        <div className="mt-3">
                          <h6>Método de pago:</h6>
                          <p className="text-muted">
                            {pedido.metodoPago === 'webpay' ? '💳 Webpay Plus' : 
                             pedido.metodoPago === 'transferencia' ? '💰 Transferencia' : 
                             '🚚 Contra Entrega'}
                          </p>
                        </div>
                      </Col>
                      <Col md={4} className="text-end">
                        <div className="pedido-total">
                          <h5>Total</h5>
                          <h3 className="text-primary">{formatCLP(pedido.total)}</h3>
                        </div>
                        
                        {pedido.estado === 'PENDIENTE' && (
                          <Button 
                            variant="outline-danger" 
                            size="sm" 
                            className="mt-3"
                            onClick={() => handleCancelar(pedido.id)}
                          >
                            Cancelar Pedido
                          </Button>
                        )}
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </div>
  );
}

export default MisPedidos;
