// Importar funciones y datos necesarios
import { PRODUCTS_LG, getProductByCode, formatCLP } from './productos_levelup.js';

// Función para generar estrellas basadas en el rating
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let starsHTML = '';
    
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '⭐';
    }
    if (hasHalfStar) {
        starsHTML += '½';
    }
    
    return starsHTML;
}

// Función para cargar los detalles del producto
function loadProductDetails() {
    // Obtener el código del producto de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const productCode = urlParams.get('code');
    
    if (!productCode) {
        window.location.href = './productos.html';
        return;
    }
    
    // Obtener el producto
    const product = getProductByCode(productCode);
    
    if (!product) {
        window.location.href = './productos.html';
        return;
    }
    
    // Actualizar la imagen
    const mainImage = document.getElementById('product-main-image');
    const defaultImage = 'images/products/default.jpg';
    mainImage.src = product.imagen || defaultImage;
    mainImage.alt = product.nombre;
    mainImage.onerror = function() {
        this.onerror = null;
        this.src = defaultImage;
    };
    
    // Actualizar el código y título
    document.querySelector('.product-code').textContent = product.code;
    document.querySelector('.product-title').textContent = product.nombre;
    
    // Actualizar marca y rating
    document.querySelector('.product-brand .value').textContent = product.marca;
    document.querySelector('.stars').textContent = generateStars(product.rating);
    document.querySelector('.rating-value').textContent = product.rating.toFixed(1) + ' / 5.0';
    
    // Actualizar precio
    document.querySelector('.current-price').textContent = formatCLP(product.precioCLP);
    
    // Actualizar stock
    const stockValue = document.querySelector('.stock-value');
    stockValue.textContent = product.stock;
    if (product.stock === 0) {
        stockValue.classList.add('out-of-stock');
        document.querySelector('.product-actions').innerHTML = 
            '<span class="out-of-stock-badge">Agotado</span>';
    }
    
    // Actualizar descripción
    document.querySelector('.product-description p').textContent = product.descripcion;
    
    // Actualizar especificaciones
    const specsList = document.querySelector('.specs-list');
    product.specs.forEach(spec => {
        const li = document.createElement('li');
        li.textContent = spec;
        specsList.appendChild(li);
    });
    
    // Actualizar tags
    const tagsContainer = document.querySelector('.tags-container');
    product.tags.forEach(tag => {
        const tagSpan = document.createElement('span');
        tagSpan.className = 'tag';
        tagSpan.textContent = tag;
        tagsContainer.appendChild(tagSpan);
    });
    
    // Manejar el botón de agregar al carrito si el producto tiene stock
    const addToCartBtn = document.getElementById('add-to-cart');
    if (product.stock > 0) {
        addToCartBtn.addEventListener('click', () => {
            window.cart.addItem(product);
            showAddNotification(product.nombre);
        });
    } else {
        addToCartBtn.disabled = true;
    }
}

// Función para mostrar la notificación de producto agregado
function showAddNotification(productName) {
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

// Cargar los detalles del producto cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', loadProductDetails);
