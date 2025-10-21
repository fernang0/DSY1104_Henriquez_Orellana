import { CATEGORIES } from '../../data/products'
import { getUniqueBrands } from '../../data/products'

function Filters({ filters, setFilters }) {
  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const clearFilters = () => {
    setFilters({
      categoria: '',
      marca: '',
      precioMin: '',
      precioMax: '',
      rating: ''
    })
  }

  return (
    <aside className="filters-sidebar">
      <div className="filters-header">
        <h2>Filtros</h2>
        <button onClick={clearFilters} className="btn-clear" aria-label="Limpiar todos los filtros">
          Limpiar filtros
        </button>
      </div>

      <form className="filters-form" aria-label="Filtros de productos">
        {/* Filtro por categoría */}
        <div className="filter-group">
          <label htmlFor="categoria">Categoría</label>
          <select
            id="categoria"
            name="categoria"
            className="filter-select"
            value={filters.categoria}
            onChange={handleFilterChange}
          >
            <option value="">Todas las categorías</option>
            {Object.entries(CATEGORIES).map(([key, value]) => (
              <option key={key} value={key}>{value}</option>
            ))}
          </select>
        </div>

        {/* Filtro por precio */}
        <div className="filter-group">
          <fieldset className="price-range">
            <legend>Rango de precio</legend>
            <div className="price-inputs">
              <div>
                <label htmlFor="precioMin">Mínimo</label>
                <input
                  type="number"
                  id="precioMin"
                  name="precioMin"
                  min="0"
                  step="1000"
                  placeholder="0"
                  value={filters.precioMin}
                  onChange={handleFilterChange}
                />
              </div>
              <div>
                <label htmlFor="precioMax">Máximo</label>
                <input
                  type="number"
                  id="precioMax"
                  name="precioMax"
                  min="0"
                  step="1000"
                  placeholder="Max"
                  value={filters.precioMax}
                  onChange={handleFilterChange}
                />
              </div>
            </div>
          </fieldset>
        </div>

        {/* Filtro por marca */}
        <div className="filter-group">
          <label htmlFor="marca">Marca</label>
          <select
            id="marca"
            name="marca"
            className="filter-select"
            value={filters.marca}
            onChange={handleFilterChange}
          >
            <option value="">Todas las marcas</option>
            {getUniqueBrands().map(brand => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
        </div>

        {/* Filtro por rating */}
        <div className="filter-group">
          <label htmlFor="rating">Rating mínimo</label>
          <select
            id="rating"
            name="rating"
            className="filter-select"
            value={filters.rating}
            onChange={handleFilterChange}
          >
            <option value="">Cualquier rating</option>
            <option value="4.5">⭐⭐⭐⭐½ (4.5+)</option>
            <option value="4">⭐⭐⭐⭐ (4.0+)</option>
            <option value="3.5">⭐⭐⭐½ (3.5+)</option>
            <option value="3">⭐⭐⭐ (3.0+)</option>
          </select>
        </div>
      </form>
    </aside>
  )
}

export default Filters