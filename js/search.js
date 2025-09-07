import { PRODUCTS_LG } from './productos_levelup.js';

// Función para normalizar texto (remover acentos)
function normalizeText(text) {
    return text.normalize("NFD")
               .replace(/[\u0300-\u036f]/g, "")
               .toLowerCase();
}

// Función de debounce para evitar muchas búsquedas seguidas
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Función para buscar productos
function searchProducts(products, searchTerm) {
    if (!searchTerm) return products;
    
    const normalizedSearch = normalizeText(searchTerm);
    const searchWords = normalizedSearch.split(/\s+/).filter(word => word.length > 0);
    
    return products.filter(product => {
        const normalizedName = normalizeText(product.nombre);
        const normalizedCode = normalizeText(product.code);
        const normalizedBrand = normalizeText(product.marca || '');
        
        // Verificar que todas las palabras de búsqueda coincidan
        return searchWords.every(word => 
            normalizedName.includes(word) || 
            normalizedCode.includes(word) ||
            normalizedBrand.includes(word)
        );
    });
}

// Función para ordenar productos
function sortProducts(products, sortCriteria) {
    const sortedProducts = [...products]; // Copia para mantener estabilidad
    
    switch (sortCriteria) {
        case 'price-asc':
            return sortedProducts.sort((a, b) => a.precioCLP - b.precioCLP);
        case 'price-desc':
            return sortedProducts.sort((a, b) => b.precioCLP - a.precioCLP);
        case 'rating-desc':
            return sortedProducts.sort((a, b) => b.rating - a.rating);
        default:
            return sortedProducts;
    }
}

// Clase para manejar la búsqueda y ordenamiento
export class ProductSearch {
    constructor(catalog) {
        this.catalog = catalog;
        this.currentSearch = '';
        this.currentSort = '';
        
        this.searchInput = document.getElementById('search-products');
        this.searchButton = document.getElementById('search-button');
        this.sortSelect = document.getElementById('sort-products');
        
        // Inicializar eventos
        this.initializeEvents();
    }
    
    initializeEvents() {
        // Evento de búsqueda con debounce de 250ms
        this.searchInput.addEventListener('input', 
            debounce(() => this.updateResults(), 250)
        );
        
        // Búsqueda al hacer clic en el botón
        this.searchButton.addEventListener('click', 
            () => this.updateResults()
        );
        
        // Búsqueda al presionar Enter
        this.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.updateResults();
            }
        });
        
        // Evento de ordenamiento
        this.sortSelect.addEventListener('change', 
            () => this.updateResults()
        );
    }
    
    updateResults() {
        const searchTerm = this.searchInput.value;
        const sortCriteria = this.sortSelect.value;
        
        // Aplicar filtros y búsqueda
        let filteredProducts = PRODUCTS_LG;
        
        // Aplicar búsqueda si hay término
        if (searchTerm) {
            filteredProducts = searchProducts(filteredProducts, searchTerm);
        }
        
        // Aplicar filtros existentes
        filteredProducts = this.catalog.filters.applyFilters(filteredProducts);
        
        // Ordenar resultados
        if (sortCriteria) {
            filteredProducts = sortProducts(filteredProducts, sortCriteria);
        }
        
        // Actualizar la vista
        this.catalog.renderProducts(filteredProducts);
        
        // Actualizar contador de resultados
        const resultsCount = document.querySelector('.results-count');
        if (resultsCount) {
            const plural = filteredProducts.length === 1 ? 'producto encontrado' : 'productos encontrados';
            resultsCount.textContent = `${filteredProducts.length} ${plural}`;
        }
    }
}
