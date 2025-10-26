import { Container, Row, Col, Card, Button } from 'react-bootstrap'
import HeroCarousel from '../components/HeroCarousel'
import { useCartActions } from '../hooks/useCartActions'

function Home() {
  const { demoProducts, addToCart, formatCLP } = useCartActions();

  // Manejar adición al carrito
  const handleAddToCart = async (product) => {
    const result = await addToCart(product, 1);
    if (result.success) {
      alert(result.message);
    } else {
      alert(`Error: ${result.error}`);
    }
  };

  return (
    <div>
      {/* Hero Carousel Gaming */}
      <HeroCarousel />
      
      <Container>
      <Row className="py-4">
        <Col>
          <h2 className="text-center mb-4">Productos Destacados</h2>
        </Col>
      </Row>

      <Row className="g-4">
        {/* Mostrar productos demo del carrito */}
        {demoProducts.slice(0, 3).map((product) => (
          <Col key={product.code} md={4}>
            <Card className="h-100 shadow-lg border-0" style={{ 
              background: 'linear-gradient(135deg, #1a1f2e 0%, #2d1b69 50%, #1a1f2e 100%)',
              border: '2px solid #00d4ff' 
            }}>
              <Card.Img 
                variant="top" 
                src={product.imagen} 
                style={{ height: '250px', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.src = '/images/products/default.jpg';
                }}
              />
              <Card.Body className="d-flex flex-column" style={{ 
                backgroundColor: 'transparent', 
                color: '#ffffff' 
              }}>
                <Card.Title className="text-light fw-bold mb-3" style={{ 
                  color: '#ffffff !important',
                  textShadow: '0 2px 4px rgba(0,0,0,0.8)'
                }}>{product.nombre}</Card.Title>
                <Card.Text className="flex-grow-1 mb-3 text-light" style={{ 
                  fontSize: '14px', 
                  lineHeight: '1.6',
                  color: '#ffffff !important',
                  backgroundColor: 'rgba(0, 0, 0, 0.4)',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(0, 212, 255, 0.3)',
                  textShadow: '0 1px 3px rgba(0,0,0,0.8)'
                }}>
                  {product.descripcion}
                </Card.Text>
                <div className="mt-auto">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <strong className="text-primary fs-4" style={{
                      color: '#00d4ff !important',
                      textShadow: '0 2px 4px rgba(0,0,0,0.8)'
                    }}>
                      {formatCLP(product.precioCLP)}
                    </strong>
                    <small className="text-success fw-bold" style={{
                      color: '#00ff88 !important',
                      textShadow: '0 1px 3px rgba(0,0,0,0.8)'
                    }}>
                      Stock: {product.stock}
                    </small>
                  </div>
                  <div className="d-grid gap-2 d-md-flex">
                    <Button 
                      variant="outline-primary" 
                      size="sm"
                      className="flex-fill"
                    >
                      Ver Detalles
                    </Button>
                    <Button 
                      variant="primary" 
                      size="sm"
                      onClick={() => handleAddToCart(product)}
                      className="flex-fill"
                    >
                      🛒 Agregar
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
    </div>
  )
}

export default Home