import { useState } from 'react'
import { Card, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { formatPrice, CATEGORIES } from '../../data/products'

function ProductCard({ product }) {
  const [showDetails, setShowDetails] = useState(false);
  
  const renderRating = (rating) => {
    const stars = '⭐'.repeat(Math.floor(rating))
    const half = rating % 1 >= 0.5 ? '½' : ''
    return stars + half + ` (${rating})`
  }

  return (
    <Card className="product-card h-100">
      <div className="position-relative">
        <Card.Img 
          variant="top" 
          src={product.imagen} 
          alt={product.nombre}
          style={{ height: '200px', objectFit: 'cover' }}
          onError={(e) => {
            e.target.src = new URL('../../assets/images/products/default.jpg', import.meta.url).href;
            e.target.onerror = null;
          }}
        />
        <div className="product-overlay">
          {product.stock < 10 && (
            <span className="stock-warning" style={{ 
              backgroundColor: '#ffd43b',
              color: '#1a1a1a',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '0.8rem',
              fontWeight: '500'
            }}>
              ¡Últimas unidades!
            </span>
          )}
        </div>
      </div>
      <Card.Body>
        <Card.Title>{product.nombre}</Card.Title>
        <div className="product-meta">
          <span className="product-code">{product.code}</span>
          <span className="product-rating">{renderRating(product.rating)}</span>
        </div>
        <Card.Text className="product-description">{product.descripcion}</Card.Text>
        <div className="specs-list">
          {product.specs.map((spec, index) => (
            <span key={index} className="spec-tag">{spec}</span>
          ))}
        </div>
        <div className="product-price-container">
          <div className="product-price">{formatPrice(product.precioCLP)}</div>
          <div className="stock-info">
            <span className={`text-${product.stock > 10 ? 'success' : 'warning'}`}>
              Stock: {product.stock}
            </span>
          </div>
        </div>
          <div className="d-flex gap-2">
            <Button 
              variant="primary" 
              className="flex-grow-1"
              disabled={product.stock === 0}
            >
              {product.stock === 0 ? 'Sin Stock' : 'Agregar al carrito'}
            </Button>
            <Button 
              variant="outline-secondary"
              as={Link}
              to={`/productos/${product.code}`}
            >
              Ver Detalles
            </Button>
          </div>
          
          {showDetails && (
            <div className="product-details mt-3">
              <hr className="border-secondary" />
              <small className="d-block mb-2">
                <strong>Marca:</strong> {product.marca}
              </small>
              <small className="d-block mb-2">
                <strong>Categoría:</strong> {CATEGORIES[product.categoriaId]}
              </small>
              <div className="tags mt-2">
                {product.tags.map((tag, index) => (
                  <span key={index} className="badge bg-secondary me-1">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
      </Card.Body>
    </Card>
  )
}

export default ProductCard