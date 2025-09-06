// Manejo del carrito de compras
class Cart {
    constructor() {
        this.items = this.loadCart();
        this.initializeListeners();
        this.updateCartCount();
    }

    loadCart() {
        const savedCart = localStorage.getItem('levelup_cart');
        return savedCart ? JSON.parse(savedCart) : [];
    }

    saveCart() {
        localStorage.setItem('levelup_cart', JSON.stringify(this.items));
        this.updateCartCount();
    }

    updateCartCount() {
        const count = this.items.reduce((total, item) => total + item.quantity, 0);
        const badge = document.getElementById('cart-count');
        if (badge) {
            badge.textContent = count.toString();
            // Actualizar el aria-label del botón del carrito
            const cartBtn = document.querySelector('.btn-icon[aria-label="Abrir carrito"]');
            if (cartBtn) {
                cartBtn.setAttribute('aria-label', `Abrir carrito, ${count} productos`);
            }
        }
    }

    addItem(product, quantity = 1) {
        const existingItem = this.items.find(item => item.code === product.code);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({ ...product, quantity });
        }
        this.saveCart();
    }

    removeItem(productCode) {
        this.items = this.items.filter(item => item.code !== productCode);
        this.saveCart();
    }

    updateQuantity(productCode, quantity) {
        const item = this.items.find(item => item.code === productCode);
        if (item) {
            item.quantity = quantity;
            this.saveCart();
        }
    }

    getTotal() {
        return this.items.reduce((total, item) => total + (item.precioCLP * item.quantity), 0);
    }

    clear() {
        this.items = [];
        this.saveCart();
    }

    initializeListeners() {
        // Inicializar el menú móvil
        const navToggle = document.querySelector('.nav-toggle');
        const navDrawer = document.querySelector('.nav-drawer');
        
        if (navToggle && navDrawer) {
            navToggle.addEventListener('click', (e) => {
                e.preventDefault();
                const isExpanded = navDrawer.hasAttribute('open');
                navToggle.setAttribute('aria-expanded', !isExpanded);
                if (!isExpanded) {
                    navDrawer.setAttribute('open', '');
                } else {
                    navDrawer.removeAttribute('open');
                }
            });

            // Cerrar al hacer clic fuera
            document.addEventListener('click', (e) => {
                if (navDrawer.hasAttribute('open') && 
                    !navDrawer.contains(e.target) && 
                    !navToggle.contains(e.target)) {
                    navDrawer.removeAttribute('open');
                    navToggle.setAttribute('aria-expanded', 'false');
                }
            });
        }

        // Resaltar sección activa
        this.highlightCurrentSection();
    }

    highlightCurrentSection() {
        const currentPath = window.location.pathname;
        const menuLinks = document.querySelectorAll('.menu a');
        
        menuLinks.forEach(link => {
            if (link.getAttribute('href') === currentPath || 
                (currentPath === '/' && link.getAttribute('href') === './')) {
                link.setAttribute('aria-current', 'page');
                link.classList.add('active');
            } else {
                link.removeAttribute('aria-current');
                link.classList.remove('active');
            }
        });
    }
}

// Inicializar el carrito cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.cart = new Cart();
});
