// Importar funciones y datos necesarios
import { PRODUCTS_LG, getProductByCode, formatCLP } from './productos_levelup.js';

// Variable para almacenar el producto actual
let currentProduct = null;

// Función para validar la cantidad y actualizar la UI
function validateQuantity(value, stock) {
    const errorElement = document.getElementById('quantity-error');
    const quantity = parseInt(value);
    const decreaseBtn = document.getElementById('decrease-quantity');
    const increaseBtn = document.getElementById('increase-quantity');
    const addToCartBtn = document.getElementById('add-to-cart');

    if (isNaN(quantity) || quantity <= 0) {
        errorElement.textContent = 'La cantidad debe ser mayor a 0';
        addToCartBtn.disabled = true;
        return false;
    }

    if (quantity > stock) {
        errorElement.textContent = `Solo hay ${stock} unidades disponibles`;
        addToCartBtn.disabled = true;
        return false;
    }

    errorElement.textContent = '';
    addToCartBtn.disabled = false;

    // Actualizar estado de los botones + y -
    decreaseBtn.disabled = quantity <= 1;
    increaseBtn.disabled = quantity >= stock;

    return true;
}

// Función para actualizar la cantidad
function updateQuantity(amount) {
    const quantityInput = document.getElementById('quantity');
    const currentValue = parseInt(quantityInput.value) || 0;
    const newValue = currentValue + amount;
    
    if (newValue >= 1 && newValue <= currentProduct.stock) {
        quantityInput.value = newValue;
        validateQuantity(newValue, currentProduct.stock);
    }
}

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
    
    // Obtener el producto y guardarlo en la variable global
    currentProduct = getProductByCode(productCode);
    
    if (!currentProduct) {
        window.location.href = './productos.html';
        return;
    }
    
    // Actualizar la imagen
    const mainImage = document.getElementById('product-main-image');
    const defaultImage = 'images/products/default.jpg';
    mainImage.src = currentProduct.imagen || defaultImage;
    mainImage.alt = currentProduct.nombre;
    mainImage.onerror = function() {
        this.onerror = null;
        this.src = defaultImage;
    };
    
    // Actualizar el código y título
    document.querySelector('.product-code').textContent = currentProduct.code;
    document.querySelector('.product-title').textContent = currentProduct.nombre;
    
    // Actualizar marca y rating
    document.querySelector('.product-brand .value').textContent = currentProduct.marca;
    document.querySelector('.stars').textContent = generateStars(currentProduct.rating);
    document.querySelector('.rating-value').textContent = currentProduct.rating.toFixed(1) + ' / 5.0';
    
    // Actualizar precio
    document.querySelector('.current-price').textContent = formatCLP(currentProduct.precioCLP);
    
    // Actualizar stock
    const stockValue = document.querySelector('.stock-value');
    stockValue.textContent = currentProduct.stock;
    if (currentProduct.stock === 0) {
        stockValue.classList.add('out-of-stock');
        document.querySelector('.product-actions').innerHTML = 
            '<span class="out-of-stock-badge">Agotado</span>';
    }
    
    // Actualizar descripción
    document.querySelector('.product-description p').textContent = currentProduct.descripcion;
    
    // Actualizar especificaciones
    const specsList = document.querySelector('.specs-list');
    currentProduct.specs.forEach(spec => {
        const li = document.createElement('li');
        li.textContent = spec;
        specsList.appendChild(li);
    });
    
    // Actualizar tags
    const tagsContainer = document.querySelector('.tags-container');
    currentProduct.tags.forEach(tag => {
        const tagSpan = document.createElement('span');
        tagSpan.className = 'tag';
        tagSpan.textContent = tag;
        tagsContainer.appendChild(tagSpan);
    });
    
    // Configurar los controles de cantidad y el carrito si hay stock
    if (currentProduct.stock > 0) {
        const quantityInput = document.getElementById('quantity');
        const decreaseBtn = document.getElementById('decrease-quantity');
        const increaseBtn = document.getElementById('increase-quantity');
        const addToCartBtn = document.getElementById('add-to-cart');

        // Establecer el máximo según el stock
        quantityInput.max = currentProduct.stock;

        // Configurar el input de cantidad
        quantityInput.addEventListener('input', (e) => {
            validateQuantity(e.target.value, currentProduct.stock);
        });

        // Configurar los botones de + y -
        decreaseBtn.addEventListener('click', () => {
            updateQuantity(-1);
        });

        increaseBtn.addEventListener('click', () => {
            updateQuantity(1);
        });

        // Configurar el botón de agregar al carrito
        addToCartBtn.addEventListener('click', () => {
            const quantity = parseInt(quantityInput.value);
            if (validateQuantity(quantity, currentProduct.stock)) {
                window.cart.addItem(currentProduct, quantity);
                showAddNotification(currentProduct.nombre, quantity);
                
                // Actualizar el stock disponible
                currentProduct.stock -= quantity;
                stockValue.textContent = currentProduct.stock;
                
                // Resetear la cantidad a 1 y actualizar estados
                quantityInput.value = 1;
                validateQuantity(1, currentProduct.stock);
                
                // Si ya no hay stock, deshabilitar los controles
                if (currentProduct.stock === 0) {
                    quantityInput.disabled = true;
                    decreaseBtn.disabled = true;
                    increaseBtn.disabled = true;
                    addToCartBtn.disabled = true;
                    stockValue.classList.add('out-of-stock');
                    document.querySelector('.product-actions').innerHTML = 
                        '<span class="out-of-stock-badge">Agotado</span>';
                } else {
                    // Actualizar estado de los botones con la nueva cantidad (1)
                    decreaseBtn.disabled = true; // Siempre deshabilitado en 1
                    increaseBtn.disabled = currentProduct.stock === 1;
                    addToCartBtn.disabled = false;
                }
            }
        });

        // Estado inicial
        updateButtonStates(currentProduct.stock);
        validateQuantity(1, currentProduct.stock);
    } else {
        // Si no hay stock, deshabilitar los controles
        const quantityInput = document.getElementById('quantity');
        const decreaseBtn = document.getElementById('decrease-quantity');
        const increaseBtn = document.getElementById('increase-quantity');
        const addToCartBtn = document.getElementById('add-to-cart');
        
        quantityInput.disabled = true;
        decreaseBtn.disabled = true;
        increaseBtn.disabled = true;
        addToCartBtn.disabled = true;
    }
}

// Función para actualizar el estado de los botones + y -
function updateButtonStates(stock) {
    const quantityInput = document.getElementById('quantity');
    const currentValue = parseInt(quantityInput.value) || 0;
    const decreaseBtn = document.getElementById('decrease-quantity');
    const increaseBtn = document.getElementById('increase-quantity');

    decreaseBtn.disabled = currentValue <= 1;
    increaseBtn.disabled = currentValue >= stock;
}

// Función para mostrar la notificación de producto agregado
function showAddNotification(productName, quantity = 1) {
    const notification = document.createElement('div');
    notification.className = 'add-notification';
    notification.setAttribute('role', 'alert');
    notification.textContent = `¡${quantity} ${quantity === 1 ? 'unidad' : 'unidades'} de ${productName} añadido al carrito!`;
    
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
document.addEventListener('DOMContentLoaded', () => {
    loadProductDetails();
});
