import { useState, useEffect } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { useSearchParams } from 'react-router-dom'
import { useProductos } from '../hooks/useProductos'
import { useCategorias } from '../hooks/useCategorias'
import Filters from '../components/Products/Filters'
import ProductCard from '../components/Products/ProductCard'
import '../styles/components/products.css'

function Products() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { productos, loading, error, fetchProductos, buscarProductos, fetchProductosPorCategoria } = useProductos()
  const { categorias, fetchCategorias } = useCategorias()
  
  const [filters, setFilters] = useState({
    categoria: searchParams.get('cat') || '',
    marca: '',
    precioMin: '',
    precioMax: '',
    rating: ''
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('')
  const [filteredProducts, setFilteredProducts] = useState([])
  const [displayProducts, setDisplayProducts] = useState([])
  const [page, setPage] = useState(1)
  const productsPerPage = 12

  // Cargar productos y categorías al montar
  useEffect(() => {
    const loadInitialData = async () => {
      await fetchCategorias()
      const categoriaParam = searchParams.get('cat')
      
      if (categoriaParam) {
        try {
          await fetchProductosPorCategoria(categoriaParam)
        } catch (err) {
          console.error('Error cargando productos por categoría, cargando todos:', err)
          await fetchProductos()
        }
      } else {
        await fetchProductos()
      }
    }
    
    loadInitialData()
  }, [])

  // Aplicar filtros locales a los productos obtenidos del backend
  useEffect(() => {
    let result = [...productos]

    // Filtro por búsqueda (ya se maneja en el backend con buscarProductos)
    if (searchTerm) {
      const search = searchTerm.toLowerCase()
      result = result.filter(product => 
        product.nombre?.toLowerCase().includes(search) ||
        product.sku?.toLowerCase().includes(search) ||
        product.descripcion?.toLowerCase().includes(search)
      )
    }

    // Filtro por marca
    if (filters.marca) {
      result = result.filter(product => product.marca === filters.marca)
    }

    // Filtro por precio
    if (filters.precioMin) {
      result = result.filter(product => product.precio >= Number(filters.precioMin))
    }
    if (filters.precioMax) {
      result = result.filter(product => product.precio <= Number(filters.precioMax))
    }

    // Filtro por rating (solo si existe)
    if (filters.rating) {
      result = result.filter(product => product.rating && product.rating >= Number(filters.rating))
    }

    // Ordenamiento
    if (sortBy) {
      switch (sortBy) {
        case 'price-asc':
          result.sort((a, b) => a.precio - b.precio)
          break
        case 'price-desc':
          result.sort((a, b) => b.precio - a.precio)
          break
        case 'rating-desc':
          result.sort((a, b) => (b.rating || 0) - (a.rating || 0))
          break
        case 'name-asc':
          result.sort((a, b) => a.nombre.localeCompare(b.nombre))
          break
      }
    }

    setFilteredProducts(result)
    setPage(1)
  }, [productos, filters, searchTerm, sortBy])

  // Actualizar cuando cambia la categoría
  useEffect(() => {
    const updateByCategory = async () => {
      if (filters.categoria) {
        setSearchParams({ cat: filters.categoria })
        try {
          await fetchProductosPorCategoria(filters.categoria)
        } catch (err) {
          console.error('Error al filtrar por categoría:', err)
          // Continuar mostrando productos actuales
        }
      } else {
        setSearchParams({})
        await fetchProductos()
      }
    }
    
    // Solo ejecutar si la categoría realmente cambió
    const currentCat = searchParams.get('cat')
    if (currentCat !== filters.categoria) {
      updateByCategory()
    }
  }, [filters.categoria])

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

  const loadMore = () => {
    setPage(prev => prev + 1)
  }

  if (loading && productos.length === 0) {
    return (
      <div className="products-container">
        <Container className="text-center py-5">
          <h2>Cargando productos...</h2>
        </Container>
      </div>
    )
  }

  if (error) {
    return (
      <div className="products-container">
        <Container className="text-center py-5">
          <h2>Error al cargar productos</h2>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={() => fetchProductos()}>
            Reintentar
          </button>
        </Container>
      </div>
    )
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
              <Filters filters={filters} setFilters={setFilters} categorias={categorias} />
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

            {displayProducts.length === 0 ? (
              <div className="text-center py-5">
                <h3>No se encontraron productos</h3>
                <p>Intenta ajustar los filtros de búsqueda</p>
              </div>
            ) : (
              <>
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
              </>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Products