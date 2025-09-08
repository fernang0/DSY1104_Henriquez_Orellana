// Clase para manejar los filtros y su estado
export class ProductFilters {
    constructor() {
        this.filters = {
            categoria: '',
            precioMin: '',
            precioMax: '',
            marca: '',
            rating: ''
        };
        
        this.initFromURL();
        this.setupEventListeners();
    }

    // Inicializar filtros desde URL
    initFromURL() {
        const params = new URLSearchParams(window.location.search);
        
        this.filters.categoria = params.get('categoria') || '';
        this.filters.precioMin = params.get('precioMin') || '';
        this.filters.precioMax = params.get('precioMax') || '';
        this.filters.marca = params.get('marca') || '';
        this.filters.rating = params.get('rating') || '';
        
        // Actualizar UI con valores de URL
        this.updateUI();
    }

    // Actualizar URL con estado de filtros
    updateURL() {
        const params = new URLSearchParams();
        
        Object.entries(this.filters).forEach(([key, value]) => {
            if (value) {
                params.set(key, value);
            }
        });

        // Actualizar URL sin recargar la página
        const newURL = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
        window.history.pushState({}, '', newURL);
    }

    // Actualizar UI con valores actuales
    updateUI() {
        Object.entries(this.filters).forEach(([key, value]) => {
            const element = document.querySelector(`[data-filter="${key}"]`);
            if (element) {
                element.value = value;
            }
        });
    }

    // Configurar event listeners
    setupEventListeners() {
        // Event listener para cambios en filtros
        document.querySelectorAll('[data-filter]').forEach(element => {
            element.addEventListener('change', (e) => {
                const filterType = e.target.dataset.filter;
                this.filters[filterType] = e.target.value;
                this.updateURL();
                this.applyFilters();
            });
        });

        // Event listener para botón de limpiar
        const clearButton = document.querySelector('#clear-filters');
        if (clearButton) {
            clearButton.addEventListener('click', () => this.clearFilters());
        }
    }

    // Limpiar todos los filtros
    clearFilters() {
        Object.keys(this.filters).forEach(key => {
            this.filters[key] = '';
        });
        
        this.updateUI();
        this.updateURL();
        this.applyFilters();
    }

    // Aplicar filtros a la lista de productos
    applyFilters(products) {
        return products.filter(product => {
            // Filtro por categoría
            if (this.filters.categoria && product.categoriaId !== this.filters.categoria) {
                return false;
            }

            // Filtro por precio mínimo
            if (this.filters.precioMin && product.precioCLP < parseInt(this.filters.precioMin)) {
                return false;
            }

            // Filtro por precio máximo
            if (this.filters.precioMax && product.precioCLP > parseInt(this.filters.precioMax)) {
                return false;
            }

            // Filtro por marca
            if (this.filters.marca && product.marca !== this.filters.marca) {
                return false;
            }

            // Filtro por rating
            if (this.filters.rating && product.rating < parseFloat(this.filters.rating)) {
                return false;
            }

            return true;
        });
    }
}
