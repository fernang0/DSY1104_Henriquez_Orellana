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
      <Row className="py-5">
        <Col md={6} className="mb-4">
          <h1>Bienvenido a LevelUp</h1>
          <p className="lead">Tu destino gaming definitivo. Encuentra los mejores productos para tu setup gaming.</p>
          <Button variant="primary" href="/productos">Ver Productos</Button>
        </Col>
        <Col md={6}>
          <img 
            src="/path-to-your-image.jpg" 
            alt="Gaming Setup" 
            className="img-fluid rounded"
          />
        </Col>
      </Row>

      <Row className="py-4">
        <Col>
          <h2 className="text-center mb-4">Productos Destacados</h2>
        </Col>
      </Row>

      <Row className="g-4">
        {/* Mostrar productos demo del carrito */}
        {demoProducts.slice(0, 3).map((product) => (
          <Col key={product.code} md={4}>
            <Card className="h-100">
              <Card.Img 
                variant="top" 
                src={product.imagen} 
                style={{ height: '200px', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.src = '/images/products/default.jpg';
                }}
              />
              <Card.Body className="d-flex flex-column">
                <Card.Title>{product.nombre}</Card.Title>
                <Card.Text className="flex-grow-1">
                  {product.descripcion}
                </Card.Text>
                <div className="mt-auto">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <strong className="text-primary fs-5">
                      {formatCLP(product.precioCLP)}
                    </strong>
                    <small className="text-muted">
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