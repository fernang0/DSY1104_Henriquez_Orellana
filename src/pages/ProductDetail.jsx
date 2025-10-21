import { useParams, useNavigate } from 'react-router-dom'
import { Container, Row, Col, Button, Badge } from 'react-bootstrap'
import { PRODUCTS_LG, CATEGORIES, formatPrice } from '../data/products'
import { useState } from 'react'
import '../styles/components/product-detail.css'

function ProductDetail() {
  const { productId } = useParams()
  const navigate = useNavigate()
  const [quantity, setQuantity] = useState(1)

  const product = PRODUCTS_LG.find(p => p.code === productId)

  if (!product) {
    return (
      <Container className="py-5 text-center">
        <h2 className="text-danger">Producto no encontrado</h2>
        <Button 
          variant="primary" 
          className="mt-3"
          onClick={() => navigate('/productos')}
        >
          Volver a Productos
        </Button>
      </Container>
    )
  }

  const renderRating = (rating) => {
    const stars = '⭐'.repeat(Math.floor(rating))
    const half = rating % 1 >= 0.5 ? '½' : ''
    return stars + half + ` (${rating})`
  }

  return (
    <div className="product-detail">
      <Container className="py-4">
        <Button 
          variant="outline-primary" 
          className="mb-4"
          onClick={() => navigate('/productos')}
        >
          ← Volver a Productos
        </Button>

        <Row>
          <Col md={6}>
            <div className="product-image-container">
              <img 
                src={product.imagen} 
                alt={product.nombre}
                onError={(e) => {
                  e.target.src = new URL('../assets/images/products/default.jpg', import.meta.url).href
                  e.target.onerror = null
                }}
              />
            </div>
          </Col>
          <Col md={6}>
            <div className="product-info">
              <Badge bg="primary" className="mb-2">
                {CATEGORIES[product.categoriaId]}
              </Badge>
              <h1>{product.nombre}</h1>
              <div className="mb-3">
                <span className="product-code me-3">{product.code}</span>
                <span className="product-rating">{renderRating(product.rating)}</span>
              </div>
              <p className="product-description">
                {product.descripcion}
              </p>
              <div className="specs-section">
                <h4>Especificaciones</h4>
                <ul className="specs-list">
                  {product.specs.map((spec, index) => (
                    <li key={index}>{spec}</li>
                  ))}
                </ul>
              </div>
              <div className="price-stock-section my-4">
                <div className="product-price">
                  {formatPrice(product.precioCLP)}
                </div>
                <div className={`stock-info ${product.stock < 10 ? 'text-warning' : 'text-success'}`}>
                  {product.stock > 0 ? `${product.stock} unidades disponibles` : 'Sin stock'}
                </div>
              </div>
              <div className="quantity-selector mb-3">
                <Button 
                  variant="outline-secondary" 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  disabled={product.stock === 0}
                >
                  -
                </Button>
                <span>{quantity}</span>
                <Button 
                  variant="outline-secondary"
                  onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                  disabled={product.stock === 0}
                >
                  +
                </Button>
              </div>
              <Button 
                variant="primary" 
                size="lg" 
                className="w-100"
                disabled={product.stock === 0}
              >
                {product.stock === 0 ? 'Sin Stock' : 'Agregar al Carrito'}
              </Button>
              
              <div className="additional-info">
                <h4>Información Adicional</h4>
                <p><strong>Marca:</strong> {product.marca}</p>
                <div className="tags">
                  {product.tags.map((tag, index) => (
                    <Badge 
                      bg="secondary" 
                      className="me-2" 
                      key={index}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default ProductDetail