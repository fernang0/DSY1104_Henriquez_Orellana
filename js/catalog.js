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
            <a href="./producto-detalle.html?code=${product.code}" class="product-link">
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
                <div class="product-actions">
                    <button class="add-to-cart-btn btn btn-primary" 
                            aria-label="Añadir ${product.nombre} al carrito"
                            data-code="${product.code}"
                            data-nombre="${product.nombre}"
                            data-precio="${product.precioCLP}"
                            data-imagen="${imgSrc}"
                            data-stock="${product.stock}"
                            data-quantity="1"
                            ${product.stock === 0 ? 'disabled' : ''}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                        </svg>
                        ${product.stock === 0 ? 'Sin stock' : 'Añadir al carrito'}
                    </button>
                    <button class="redeem-btn btn btn-outline" 
                            aria-label="Canjear ${product.nombre} con puntos"
                            data-code="${product.code}"
                            data-nombre="${product.nombre}"
                            data-precio="${product.precioCLP}"
                            data-points="${this.calculatePointsRequired(product.precioCLP)}">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                        </svg>
                        ${this.calculatePointsRequired(product.precioCLP)} pts
                    </button>
                    ${product.stock <= 10 && product.stock > 0 ? 
                        `<p class="stock-warning">¡Solo quedan ${product.stock}!</p>` : 
                        product.stock === 0 ? 
                        `<p class="stock-out">Sin stock disponible</p>` : ''}
                </div>
            </div>
        `;

        return article;
    }

    // LG-062: Calcular puntos requeridos para canje (1 peso = 1 punto)
    calculatePointsRequired(priceCLP) {
        return Math.floor(priceCLP * 0.1); // 10% del precio en puntos
    }

    // LG-062: Función para manejar canje de productos
    handleRedeem(productData) {
        const currentUser = JSON.parse(localStorage.getItem('levelup_current_user') || 'null');
        
        if (!currentUser) {
            this.showRedeemModal('Error', 'Debes iniciar sesión para canjear productos.', 'error');
            return;
        }

        const userPoints = currentUser.levelupPoints || 0;
        const requiredPoints = parseInt(productData.points);
        
        if (userPoints < requiredPoints) {
            this.showRedeemModal(
                'Puntos insuficientes', 
                `Necesitas ${requiredPoints} puntos para canjear este producto. Tienes ${userPoints} puntos.`,
                'warning'
            );
            return;
        }

        // Mostrar modal de confirmación de canje
        this.showRedeemConfirmation(productData, userPoints, requiredPoints);
    }

    // LG-062: Modal de confirmación de canje
    showRedeemConfirmation(productData, userPoints, requiredPoints) {
        this.showRedeemModal(
            '💎 Confirmar Canje',
            `
                <div class="redeem-confirmation">
                    <h4>${productData.nombre}</h4>
                    <div class="redeem-details">
                        <div class="point-calculation">
                            <span>Tus puntos actuales: <strong>${userPoints}</strong></span>
                            <span>Puntos requeridos: <strong>${requiredPoints}</strong></span>
                            <span>Puntos restantes: <strong>${userPoints - requiredPoints}</strong></span>
                        </div>
                        <p><strong>Nota:</strong> Este es un canje simulado. El stock real no se modificará.</p>
                    </div>
                </div>
            `,
            'info',
            [
                {
                    text: 'Canjear',
                    class: 'btn-success',
                    action: () => this.processRedeem(productData, requiredPoints)
                },
                {
                    text: 'Cancelar',
                    class: 'btn-outline',
                    action: () => this.closeRedeemModal()
                }
            ]
        );
    }

    // LG-062: Procesar canje (simulado)
    processRedeem(productData, requiredPoints) {
        // Simular descuento de puntos
        const currentUser = JSON.parse(localStorage.getItem('levelup_current_user'));
        currentUser.levelupPoints -= requiredPoints;
        localStorage.setItem('levelup_current_user', JSON.stringify(currentUser));

        // Actualizar UI si hay sistema de niveles
        if (window.authSystem && window.authSystem.updateLevelUI) {
            window.authSystem.currentUser = currentUser;
            window.authSystem.updateLevelUI();
        }

        this.closeRedeemModal();
        
        // Mostrar confirmación de canje exitoso
        this.showRedeemModal(
            '🎉 ¡Canje Exitoso!',
            `
                <div class="redeem-success">
                    <h4>${productData.nombre}</h4>
                    <p>Tu canje ha sido procesado exitosamente.</p>
                    <p><strong>Puntos descontados:</strong> ${requiredPoints}</p>
                    <p><em>*Canje simulado - No se modificó el stock real.</em></p>
                </div>
            `,
            'success'
        );
    }

    // LG-062: Modal universal para canjes
    showRedeemModal(title, content, type = 'info', buttons = null) {
        // Remover modal existente si hay uno
        this.closeRedeemModal();

        const modal = document.createElement('div');
        modal.className = 'redeem-modal';
        modal.id = 'redeem-modal';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-labelledby', 'redeem-modal-title');
        modal.setAttribute('aria-modal', 'true');

        const defaultButtons = buttons || [
            {
                text: 'Cerrar',
                class: 'btn-primary',
                action: () => this.closeRedeemModal()
            }
        ];

        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content redeem-modal-${type}">
                <div class="modal-header">
                    <h3 id="redeem-modal-title">${title}</h3>
                    <button class="modal-close" aria-label="Cerrar modal">×</button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
                <div class="modal-actions">
                    ${defaultButtons.map(btn => 
                        `<button class="btn ${btn.class}" data-action="${btn.text}">${btn.text}</button>`
                    ).join('')}
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Event listeners
        const overlay = modal.querySelector('.modal-overlay');
        const closeBtn = modal.querySelector('.modal-close');
        const actionButtons = modal.querySelectorAll('[data-action]');

        overlay.addEventListener('click', () => this.closeRedeemModal());
        closeBtn.addEventListener('click', () => this.closeRedeemModal());

        actionButtons.forEach((btn, index) => {
            btn.addEventListener('click', () => defaultButtons[index].action());
        });

        // Focus trap
        modal.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeRedeemModal();
            }
        });

        // Focus inicial
        setTimeout(() => {
            const firstButton = modal.querySelector('.btn');
            if (firstButton) firstButton.focus();
        }, 100);
    }

    closeRedeemModal() {
        const modal = document.getElementById('redeem-modal');
        if (modal) {
            modal.remove();
        }
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
    // Hacer el catálogo accesible globalmente para los event listeners
    window.catalog = catalog;
});
