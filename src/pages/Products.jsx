import { useState, useEffect } from 'react'
import { Container, Row, Col, Form } from 'react-bootstrap'
import { useSearchParams } from 'react-router-dom'
import { PRODUCTS_LG } from '../data/products'
import Filters from '../components/Products/Filters'
import ProductCard from '../components/Products/ProductCard'
import '../styles/components/products.css'

function Products() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [filters, setFilters] = useState({
    categoria: searchParams.get('cat') || '',
    marca: '',
    precioMin: '',
    precioMax: '',
    rating: ''
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('')
  const [filteredProducts, setFilteredProducts] = useState(PRODUCTS_LG)
  const [displayProducts, setDisplayProducts] = useState([])
  const [page, setPage] = useState(1)
  const productsPerPage = 12

  // Aplicar filtros
  useEffect(() => {
    let result = [...PRODUCTS_LG]

    // Filtro por búsqueda
    if (searchTerm) {
      const search = searchTerm.toLowerCase()
      result = result.filter(product => 
        product.nombre.toLowerCase().includes(search) ||
        product.code.toLowerCase().includes(search)
      )
    }

    // Filtro por categoría
    if (filters.categoria) {
      result = result.filter(product => product.categoriaId === filters.categoria)
    }

    // Filtro por marca
    if (filters.marca) {
      result = result.filter(product => product.marca === filters.marca)
    }

    // Filtro por precio
    if (filters.precioMin) {
      result = result.filter(product => product.precioCLP >= Number(filters.precioMin))
    }
    if (filters.precioMax) {
      result = result.filter(product => product.precioCLP <= Number(filters.precioMax))
    }

    // Filtro por rating
    if (filters.rating) {
      result = result.filter(product => product.rating >= Number(filters.rating))
    }

    // Ordenamiento
    if (sortBy) {
      switch (sortBy) {
        case 'price-asc':
          result.sort((a, b) => a.precioCLP - b.precioCLP)
          break
        case 'price-desc':
          result.sort((a, b) => b.precioCLP - a.precioCLP)
          break
        case 'rating-desc':
          result.sort((a, b) => b.rating - a.rating)
          break
      }
    }

    setFilteredProducts(result)
    setPage(1) // Reset pagination when filters change
  }, [filters, searchTerm, sortBy])

  // Paginación
  useEffect(() => {
    if (page === 1) {
      // Si es la primera página, mostrar solo los primeros productos
      setDisplayProducts(filteredProducts.slice(0, productsPerPage))
    } else {
      // Si no, añadir los nuevos productos a los ya mostrados
      const start = 0
      const end = page * productsPerPage
      setDisplayProducts(filteredProducts.slice(start, end))
    }
  }, [filteredProducts, page])

  // Actualizar URL cuando cambia la categoría
  useEffect(() => {
    if (filters.categoria) {
      setSearchParams({ cat: filters.categoria })
    } else {
      setSearchParams({})
    }
  }, [filters.categoria])

  const loadMore = () => {
    setPage(prev => prev + 1)
  }

  return (
    <div className="products-container">
      <Container>
        <Row>
          <Col md={3}>
            <div className="filters-sidebar">
              <div className="filters-header">
                <h2>Filtros</h2>
                <button 
                  className="btn-clear"
                  onClick={() => {
                    setFilters({
                      categoria: '',
                      marca: '',
                      precioMin: '',
                      precioMax: '',
                      rating: ''
                    });
                    setSearchTerm('');
                    setSortBy('');
                  }}
                >
                  Limpiar filtros
                </button>
              </div>
              <Filters filters={filters} setFilters={setFilters} />
            </div>
          </Col>
          
          <Col md={9}>
            <div className="products-header">
              <h1>Nuestros Productos</h1>
              <div className="search-sort-container">
                <div className="search-container">
                  <input
                    type="search"
                    placeholder="Buscar por nombre o código..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="sort-select"
                >
                  <option value="">Sin ordenar</option>
                  <option value="price-asc">Precio: Menor a mayor</option>
                  <option value="price-desc">Precio: Mayor a menor</option>
                  <option value="rating-desc">Rating: Mayor a menor</option>
                </select>
              </div>
              <p className="results-count">
                Mostrando {displayProducts.length} de {filteredProducts.length} productos
              </p>
            </div>

            <Row className="g-4">
              {displayProducts.map(product => (
                <Col key={product.code} xs={12} sm={6} lg={4}>
                  <ProductCard product={product} />
                </Col>
              ))}
            </Row>

            {displayProducts.length < filteredProducts.length && (
              <div className="text-center mt-4">
                <button 
                  className="btn btn-primary btn-lg"
                  onClick={loadMore}
                >
                  Ver más productos
                </button>
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Products