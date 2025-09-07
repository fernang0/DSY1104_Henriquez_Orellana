import { PRODUCTS_LG, formatCLP } from './productos_levelup.js';
import { CATEGORIES_LG } from './categorias_lavelup.js';
import { ProductFilters } from './filters.js';

class ProductCatalog {
    constructor() {
        this.filters = new ProductFilters();
        this.initializeCatalog();
    }

    initializeCatalog() {
        this.populateCategories();
        this.populateBrands();
        this.renderProducts(PRODUCTS_LG);

        // Re-aplicar filtros si hay parámetros en la URL
        if (window.location.search) {
            this.applyFilters();
        }
    }

    populateCategories() {
        const select = document.querySelector('#categoria');
        if (!select) return;

        CATEGORIES_LG.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.nombre;
            select.appendChild(option);
        });
    }

    populateBrands() {
        const select = document.querySelector('#marca');
        if (!select) return;

        // Obtener marcas únicas
        const brands = [...new Set(PRODUCTS_LG.map(p => p.marca))].sort();
        
        brands.forEach(brand => {
            const option = document.createElement('option');
            option.value = brand;
            option.textContent = brand;
            select.appendChild(option);
        });
    }

    renderProducts(products) {
        const container = document.querySelector('.products-list');
        if (!container) return;
        
        container.innerHTML = '';
        products.forEach(product => {
            const productElement = this.createProductCard(product);
            container.appendChild(productElement);
        });
    }

    createProductCard(product) {
        const div = document.createElement('div');
        div.textContent = `${product.nombre} - ${formatCLP(product.precioCLP)}`;
        return div;
    }

    applyFilters() {
        const filteredProducts = this.filters.applyFilters(PRODUCTS_LG);
        this.renderProducts(filteredProducts);
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const catalog = new ProductCatalog();
});
