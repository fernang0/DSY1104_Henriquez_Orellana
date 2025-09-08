import { PRODUCTS_LG, formatCLP } from './productos_levelup.js';
import { CATEGORIES_LG } from './categorias_lavelup.js';
import { ProductFilters } from './filters.js';
import { ProductSearch } from './search.js';

class ProductCatalog {
    constructor() {
        this.filters = new ProductFilters();
        this.search = new ProductSearch(this);
        this.pageSize = 12;
        this.currentPage = 1;
        this.allProducts = PRODUCTS_LG;
        this.filteredProducts = [];
        this.initializeCatalog();
        this.initializePagination();
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

    initializePagination() {
        // Obtener elementos de paginación
        this.loadMoreButton = document.getElementById('load-more');
        this.paginationInfo = document.getElementById('pagination-info');
        
        // Agregar evento al botón "Ver más"
        if (this.loadMoreButton) {
            this.loadMoreButton.addEventListener('click', () => {
                this.currentPage++;
                this.renderCurrentPage();
            });
        }
    }

    renderProducts(products) {
        // Guardar productos filtrados y resetear paginación
        this.filteredProducts = products;
        this.currentPage = 1;
        this.renderCurrentPage();
    }

    renderCurrentPage() {
        const container = document.querySelector('.products-list');
        if (!container) return;

        // Calcular productos a mostrar
        const start = (this.currentPage - 1) * this.pageSize;
        const end = this.currentPage * this.pageSize;
        const currentPageProducts = this.filteredProducts.slice(0, end);

        // Limpiar y renderizar productos
        container.innerHTML = '';
        currentPageProducts.forEach(product => {
            const productElement = this.createProductCard(product);
            container.appendChild(productElement);
        });

        // Actualizar controles de paginación
        this.updatePaginationControls();
    }
    
    updatePaginationControls() {
        const totalProducts = this.filteredProducts.length;
        const currentlyShowing = Math.min(this.currentPage * this.pageSize, totalProducts);
        const hasMoreProducts = currentlyShowing < totalProducts;

        // Actualizar botón "Ver más"
        if (this.loadMoreButton) {
            this.loadMoreButton.hidden = !hasMoreProducts;
            if (hasMoreProducts) {
                const remaining = totalProducts - currentlyShowing;
                const nextBatch = Math.min(remaining, this.pageSize);
                this.loadMoreButton.textContent = `Ver más (${nextBatch} productos)`;
            }
        }

        // Actualizar información de paginación
        if (this.paginationInfo) {
            this.paginationInfo.textContent = 
                `Mostrando ${currentlyShowing} de ${totalProducts} productos`;
        }
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
        // Dejar que la búsqueda maneje la actualización de la vista
        this.search.updateResults();
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const catalog = new ProductCatalog();
});
