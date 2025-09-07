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
        const article = document.createElement('article');
        article.className = 'product-card';
        article.setAttribute('role', 'listitem');

        // Encontrar la categoría para el badge
        const categoria = CATEGORIES_LG.find(cat => cat.id === product.categoriaId);
        const nombreCategoria = categoria ? categoria.nombre : product.categoriaId;

        // Generar estrellas para el rating
        const ratingStars = this.generateRatingStars(product.rating);

        // Imagen por defecto si no existe la del producto
        const defaultImage = 'images/products/default.jpg';
        const imgSrc = product.imagen || defaultImage;

        article.innerHTML = `
            <div class="product-image">
                <img src="${imgSrc}" 
                     alt="Imagen de ${product.nombre}" 
                     loading="lazy"
                     onerror="this.onerror=null; this.src='${defaultImage}';">
                <span class="category-badge">${nombreCategoria}</span>
            </div>
            <div class="product-content">
                <h3 class="product-title" title="${product.nombre}">
                    ${product.nombre}
                </h3>
                <div class="rating" title="${product.rating} de 5 estrellas">
                    <span class="stars">${ratingStars}</span>
                    <span class="rating-value">${product.rating.toFixed(1)}</span>
                </div>
                <p class="product-price">${formatCLP(product.precioCLP)}</p>
                <button class="add-to-cart" 
                        aria-label="Añadir ${product.nombre} al carrito"
                        data-product-code="${product.code}">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                    </svg>
                    Añadir al carrito
                </button>
            </div>
        `;

        // Event listener para añadir al carrito
        const addButton = article.querySelector('.add-to-cart');
        addButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.cart.addItem(product);
            this.showAddNotification(product.nombre);
        });

        return article;
    }

    generateRatingStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        let stars = '★'.repeat(fullStars);
        if (hasHalfStar) stars += '½';
        return stars;
    }

    showAddNotification(productName) {
        const notification = document.createElement('div');
        notification.className = 'add-notification';
        notification.setAttribute('role', 'alert');
        notification.textContent = `¡${productName} añadido al carrito!`;
        
        document.body.appendChild(notification);
        
        // Forzar un reflow para que la transición funcione
        notification.offsetHeight;
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 2000);
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
