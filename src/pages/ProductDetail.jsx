import { useParams, useNavigate } from 'react-router-dom'
import { Container, Row, Col, Button, Badge, Spinner, Alert } from 'react-bootstrap'
import { useState, useEffect } from 'react'
import { useProductos } from '../hooks/useProductos'
import { useCarrito } from '../hooks/useCarrito'
import '../styles/components/product-detail.css'

function ProductDetail() {
  const { productId } = useParams()
  const navigate = useNavigate()
  const [quantity, setQuantity] = useState(1)
  const { fetchProductoById, loading, error } = useProductos()
  const { agregarItem, loading: carritoLoading } = useCarrito()
  const [product, setProduct] = useState(null)

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await fetchProductoById(productId)
        setProduct(data)
      } catch (err) {
        console.error('Error loading product:', err)
      }
    }
    loadProduct()
  }, [productId])

  const formatCLP = (precio) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(precio)
  }

  // Manejar adición al carrito
  const handleAddToCart = async (e) => {
    e.preventDefault();
    try {
      await agregarItem(product.id, quantity);
      alert(`${quantity} x ${product.nombre} agregado al carrito`);
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
        <p className="mt-3">Cargando producto...</p>
      </Container>
    )
  }

  if (error || !product) {
    return (
      <Container className="py-5 text-center">
        <Alert variant="danger">
          <h2>Producto no encontrado</h2>
          <p>{error || 'No se pudo cargar el producto'}</p>
        </Alert>
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
                {product.categoriaNombre}
              </Badge>
              <h1>{product.nombre}</h1>
              <div className="mb-3">
                <span className="product-code me-3">{product.sku}</span>
                {product.rating && (
                  <span className="product-rating">{renderRating(product.rating)}</span>
                )}
              </div>
              <p className="product-description">
                {product.descripcion}
              </p>
              <div className="price-stock-section my-4">
                <div className="product-price">
                  {formatCLP(product.precio)}
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
                disabled={product.stock === 0 || carritoLoading}
                onClick={handleAddToCart}
              >
                {product.stock === 0 ? 'Sin Stock' : '🛒 Agregar al Carrito'}
              </Button>
              
              <div className="additional-info">
                <h4>Información Adicional</h4>
                <p><strong>Marca:</strong> {product.marca}</p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default ProductDetail