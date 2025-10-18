import { Container, Row, Col, Card, Button } from 'react-bootstrap'

function Home() {
  return (
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
        <Col md={4}>
          <Card>
            <Card.Img variant="top" src="/path-to-product1.jpg" />
            <Card.Body>
              <Card.Title>Teclado Mecánico</Card.Title>
              <Card.Text>
                RGB personalizable, switches Cherry MX.
              </Card.Text>
              <Button variant="outline-primary">Ver Detalles</Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card>
            <Card.Img variant="top" src="/path-to-product2.jpg" />
            <Card.Body>
              <Card.Title>Mouse Gaming</Card.Title>
              <Card.Text>
                Sensor óptico de alta precisión.
              </Card.Text>
              <Button variant="outline-primary">Ver Detalles</Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card>
            <Card.Img variant="top" src="/path-to-product3.jpg" />
            <Card.Body>
              <Card.Title>Auriculares 7.1</Card.Title>
              <Card.Text>
                Sonido envolvente, micrófono retráctil.
              </Card.Text>
              <Button variant="outline-primary">Ver Detalles</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default Home