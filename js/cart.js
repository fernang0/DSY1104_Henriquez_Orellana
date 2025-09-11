// LG-040, LG-041, LG-042: Carrito de compras con validación completa y CRUD
class Cart {
    constructor() {
        this.items = this.loadCart();
        this.isOpen = false;
        this.dropdownTimeout = null;
        this.dropdownPinned = false; // Para controlar si el dropdown está fijado por clic
        this.addingProduct = new Set(); // Set para rastrear productos siendo agregados
        this.initializeCartUI();
        this.initializeListeners();
        this.updateCartCount();
        
        // Debug: Logs para diagnosticar el problema
        console.log('Carrito inicializado con items:', this.items);
        console.log('Cart toggle element:', document.getElementById('cart-toggle'));
    }

    // LG-040: Módulo localStorage (CRUD)
    loadCart() {
        try {
            const savedCart = localStorage.getItem('levelup_cart');
            console.log('Cargando carrito desde localStorage:', savedCart);
            const cart = savedCart ? JSON.parse(savedCart) : [];
            console.log('Carrito parseado:', cart);
            // Validar integridad de datos al cargar
            const validatedCart = this.validateCartData(cart);
            console.log('Carrito validado:', validatedCart);
            return validatedCart;
        } catch (error) {
            console.error('Error cargando carrito:', error);
            this.showMessage('Error al cargar el carrito', 'error');
            // Limpiar localStorage corrupto
            localStorage.removeItem('levelup_cart');
            return [];
        }
    }

    validateCartData(cart) {
        if (!Array.isArray(cart)) return [];
        
        return cart.filter(item => {
            return item && 
                   item.code && 
                   typeof item.quantity === 'number' && 
                   item.quantity > 0 &&
                   typeof item.precioCLP === 'number' &&
                   item.precioCLP > 0;
        });
    }

    saveCart() {
        try {
            console.log('💾 Guardando carrito, items:', this.items.length);
            
            // Validar que this.items sea un array
            if (!Array.isArray(this.items)) {
                console.error('❌ this.items no es un array:', this.items);
                this.items = [];
            }
            
            localStorage.setItem('levelup_cart', JSON.stringify(this.items));
            console.log('✅ Carrito guardado en localStorage');
            
            // Actualizar toda la UI después de guardar
            requestAnimationFrame(() => {
                this.updateCartCount();
                this.updateCartDisplay();
                this.updateCartDropdown();
                this.updateCartButtons();
                console.log('✅ UI del carrito actualizada');
            });
            
        } catch (error) {
            console.error('❌ Error guardando carrito:', error);
            this.showMessage('Error al guardar en el carrito', 'error');
            
            // Intentar recuperar el carrito
            this.items = [];
            this.updateCartCount();
        }
    }

    updateCartCount() {
        const count = this.items.reduce((total, item) => total + item.quantity, 0);
        const badge = document.getElementById('cart-count');
        
        console.log('Actualizando contador del carrito:', count);
        
        if (badge) {
            badge.textContent = count.toString();
            badge.style.display = count > 0 ? 'inline-flex' : 'none';
            
            // Actualizar el aria-label del botón del carrito
            const cartBtn = document.getElementById('cart-toggle');
            if (cartBtn) {
                cartBtn.setAttribute('aria-label', `Abrir carrito, ${count} producto${count !== 1 ? 's' : ''}`);
            }
        } else {
            console.warn('Badge del carrito no encontrado');
        }
    }

    // LG-040: API add(item,qty) con validaciones
    add(product, quantity = 1) {
        console.log('🛒 Agregando producto:', product, 'cantidad:', quantity);
        
        // Validación básica del producto
        if (!product || typeof product !== 'object') {
            console.error('❌ Producto inválido:', product);
            this.showMessage('Error: Producto inválido', 'error');
            return false;
        }

        // Protección contra múltiples adiciones simultáneas del mismo producto
        if (this.addingProduct.has(product.code)) {
            console.log('⚠️ Producto ya siendo agregado, ignorando duplicado:', product.code);
            return false;
        }
        
        // Marcar producto como siendo agregado
        this.addingProduct.add(product.code);
        
        try {
            // Validación: qty > 0
            if (quantity <= 0) {
                this.showMessage('La cantidad debe ser mayor a 0', 'error');
                return false;
            }

            // Validación: datos requeridos del producto
            if (!product.code || !product.nombre || !product.precioCLP) {
                console.error('❌ Datos de producto incompletos:', product);
                this.showMessage('Error: Datos de producto incompletos', 'error');
                return false;
            }

            // Validación: precio válido
            if (isNaN(product.precioCLP) || product.precioCLP <= 0) {
                console.error('❌ Precio inválido:', product.precioCLP);
                this.showMessage('Error: Precio de producto inválido', 'error');
                return false;
            }

            // Validación: stock disponible
            if (product.stock && quantity > product.stock) {
                this.showMessage(`Stock insuficiente. Disponible: ${product.stock}`, 'error');
                return false;
            }

            // Validación: prohibir duplicados, actualizar cantidad
            const existingItem = this.items.find(item => item.code === product.code);
            if (existingItem) {
                const newQuantity = existingItem.quantity + quantity;
                
                // Validar stock total
                if (product.stock && newQuantity > product.stock) {
                    this.showMessage(`Stock insuficiente. Máximo disponible: ${product.stock}`, 'error');
                    return false;
                }
                
                existingItem.quantity = newQuantity;
                existingItem.updatedAt = new Date().toISOString();
                console.log('✅ Cantidad actualizada para producto existente:', existingItem);
            } else {
                // Agregar nuevo producto
                const newItem = { 
                    ...product, 
                    quantity: quantity,
                    addedAt: new Date().toISOString()
                };
                this.items.push(newItem);
                console.log('✅ Nuevo producto agregado:', newItem);
            }
            
            this.saveCart();
            this.showMessage(`${product.nombre} agregado al carrito`, 'success');
            
            console.log('🛒 Estado del carrito después de agregar:', {
                totalItems: this.items.length,
                totalQuantity: this.items.reduce((sum, item) => sum + item.quantity, 0)
            });
            
            return true;
            
        } catch (error) {
            console.error('❌ Error agregando producto al carrito:', error);
            this.showMessage('Error al agregar producto', 'error');
            return false;
        } finally {
            // Remover producto del set después de un delay
            setTimeout(() => {
                this.addingProduct.delete(product.code);
            }, 1000);
        }
    }

    // LG-040: API remove(code)
    remove(productCode) {
        const itemIndex = this.items.findIndex(item => item.code === productCode);
        if (itemIndex === -1) {
            this.showMessage('Producto no encontrado en el carrito', 'error');
            return false;
        }
        
        const removedItem = this.items[itemIndex];
        this.items.splice(itemIndex, 1);
        this.saveCart();
        this.showMessage(`${removedItem.nombre} eliminado del carrito`, 'success');
        return true;
    }

    // LG-040: API update(code,qty) con validaciones
    update(productCode, quantity) {
        // Validación: qty > 0
        if (quantity <= 0) {
            this.showMessage('La cantidad debe ser mayor a 0', 'error');
            return false;
        }

        const item = this.items.find(item => item.code === productCode);
        if (!item) {
            this.showMessage('Producto no encontrado en el carrito', 'error');
            return false;
        }

        // Validación: stock disponible
        if (item.stock && quantity > item.stock) {
            this.showMessage(`Stock insuficiente. Disponible: ${item.stock}`, 'error');
            return false;
        }

        item.quantity = quantity;
        item.updatedAt = new Date().toISOString();
        this.saveCart();
        return true;
    }

    // LG-040: API clear() con confirmación accesible
    clear(skipConfirmation = false) {
        console.log('🗑️ Función clear() llamada, items actuales:', this.items.length, 'skipConfirmation:', skipConfirmation);
        
        if (this.items.length === 0) {
            console.log('ℹ️ Carrito ya está vacío');
            this.showMessage('El carrito ya está vacío', 'warning');
            return false;
        }

        // LG-042: Confirmación accesible antes de vaciar
        if (!skipConfirmation) {
            console.log('📋 Mostrando confirmación para vaciar carrito');
            this.showClearConfirmation();
            return false; // No procedemos hasta que se confirme
        }
        
        console.log('✅ Confirmación pasada, vaciando carrito...');
        
        // Limpiar el array de items
        this.items = [];
        console.log('🗑️ Items limpiados, nuevo length:', this.items.length);
        
        // Limpiar también el set de productos siendo agregados
        this.addingProduct.clear();
        
        try {
            // Guardar estado vacío
            this.saveCart();
            
            // Cerrar dropdown después de vaciar ya que estará vacío
            this.forceHideCartDropdown();
            
            // Mostrar mensaje de éxito
            this.showMessage('Carrito vaciado completamente', 'success');
            
            console.log('✅ Carrito vaciado exitosamente');
            return true;
            
        } catch (error) {
            console.error('❌ Error vaciando carrito:', error);
            this.showMessage('Error al vaciar el carrito', 'error');
            return false;
        }
    }

    // Función de limpieza forzada para debugging
    forceResetCart() {
        console.log('Limpieza forzada del carrito');
        this.items = [];
        localStorage.removeItem('levelup_cart');
        
        // Actualizar UI inmediatamente
        this.updateCartCount();
        this.updateCartDisplay();
        this.updateCartDropdown();
        this.forceHideCartDropdown();
        
        // Deshabilitar botones del carrito si está vacío
        this.updateCartButtons();
        
        this.showMessage('Carrito limpiado completamente', 'success');
    }

    // Función para actualizar el estado de los botones del carrito
    updateCartButtons() {
        const clearBtn = document.getElementById('clear-cart-btn');
        const continueBtn = document.getElementById('continue-shopping-btn');
        
        const hasItems = this.items.length > 0;
        
        if (clearBtn) {
            clearBtn.disabled = !hasItems;
        }
        if (continueBtn) {
            continueBtn.disabled = !hasItems;
        }
    }

    // LG-041: Resumen y totales (CLP)
    calculateTotals() {
        if (this.items.length === 0) {
            return {
                subtotal: 0,
                tax: 0,
                shipping: 0,
                total: 0,
                itemCount: 0
            };
        }

        const subtotal = this.items.reduce((total, item) => {
            return total + (item.precioCLP * item.quantity);
        }, 0);

        const tax = Math.round(subtotal * 0.19); // IVA 19%
        const shipping = subtotal >= 50000 ? 0 : 5000; // Envío gratis sobre $50.000
        const total = subtotal + tax + shipping;
        const itemCount = this.items.reduce((count, item) => count + item.quantity, 0);

        return {
            subtotal,
            tax,
            shipping,
            total,
            itemCount
        };
    }

    // LG-041: Formato moneda CLP
    formatCLP(amount) {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }

    getTotal() {
        return this.calculateTotals().total;
    }

    // LG-042: Modal de confirmación accesible con ARIA
    showClearConfirmation() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-labelledby', 'clear-cart-title');
        modal.setAttribute('aria-describedby', 'clear-cart-description');
        modal.setAttribute('aria-modal', 'true');

        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3 id="clear-cart-title">Confirmar acción</h3>
                    <button class="modal-close" aria-label="Cerrar modal">&times;</button>
                </div>
                <div class="modal-body">
                    <p id="clear-cart-description">¿Estás seguro de que deseas vaciar el carrito? Esta acción no se puede deshacer.</p>
                    <p class="text-muted">Se eliminarán ${this.items.length} productos.</p>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary modal-cancel">Cancelar</button>
                    <button class="btn btn-danger modal-confirm">Vaciar carrito</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Enfocar el modal para accesibilidad
        setTimeout(() => {
            const confirmBtn = modal.querySelector('.modal-confirm');
            if (confirmBtn) confirmBtn.focus();
        }, 100);

        // Event listeners
        const closeModal = () => {
            document.body.removeChild(modal);
            // Devolver focus al botón que abrió el modal
            const clearBtn = document.querySelector('#clear-cart-btn');
            if (clearBtn) clearBtn.focus();
        };

        modal.querySelector('.modal-close').addEventListener('click', closeModal);
        modal.querySelector('.modal-cancel').addEventListener('click', closeModal);
        modal.querySelector('.modal-confirm').addEventListener('click', () => {
            this.clear(true); // skipConfirmation = true para evitar bucle infinito
            closeModal();
        });

        // Cerrar con ESC
        const handleKeydown = (e) => {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', handleKeydown);
            }
        };
        document.addEventListener('keydown', handleKeydown);

        // Cerrar al hacer clic fuera
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }

    // Sistema de mensajes no intrusivo
    showMessage(message, type = 'info') {
        const messageContainer = document.getElementById('cart-messages') || this.createMessageContainer();
        
        const messageEl = document.createElement('div');
        messageEl.className = `cart-message cart-message-${type}`;
        messageEl.setAttribute('role', 'alert');
        messageEl.setAttribute('aria-live', 'polite');
        
        const icon = {
            'success': '✓',
            'error': '⚠',
            'warning': '⚠',
            'info': 'ℹ'
        }[type] || 'ℹ';
        
        messageEl.innerHTML = `
            <span class="message-icon">${icon}</span>
            <span class="message-text">${message}</span>
            <button class="message-close" aria-label="Cerrar mensaje">&times;</button>
        `;

        messageContainer.appendChild(messageEl);

        // Auto-remove después de 5 segundos
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.remove();
            }
        }, 5000);

        // Botón de cerrar
        messageEl.querySelector('.message-close').addEventListener('click', () => {
            messageEl.remove();
        });
    }

    createMessageContainer() {
        const container = document.createElement('div');
        container.id = 'cart-messages';
        container.className = 'cart-messages';
        container.setAttribute('aria-live', 'polite');
        document.body.appendChild(container);
        return container;
    }

    // Inicializar UI del carrito plegable
    initializeCartUI() {
        // Esperar a que el DOM esté completamente cargado
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupCartUI();
            });
        } else {
            this.setupCartUI();
        }
    }

    setupCartUI() {
        this.createCartSidebar();
        this.createCartDropdown();
        
        // Verificar que el botón del carrito existe
        const cartToggle = document.getElementById('cart-toggle');
        if (!cartToggle) {
            console.warn('Botón del carrito no encontrado. Reintentando...');
            setTimeout(() => this.setupCartUI(), 500);
            return;
        }

        this.bindCartEvents();
        this.updateCartDisplay(); // Asegurar que se muestre el contenido inicial
    }

    createCartSidebar() {
        // Verificar si ya existe
        if (document.getElementById('cart-sidebar')) return;

        const cartSidebar = document.createElement('aside');
        cartSidebar.id = 'cart-sidebar';
        cartSidebar.className = 'cart-sidebar';
        cartSidebar.setAttribute('aria-label', 'Carrito de compras');
        cartSidebar.setAttribute('aria-hidden', 'true');

        cartSidebar.innerHTML = `
            <div class="cart-overlay"></div>
            <div class="cart-content">
                <div class="cart-header">
                    <h3>🛒 Tu Carrito</h3>
                    <button id="cart-close" class="btn-icon" aria-label="Cerrar carrito">
                        <span>&times;</span>
                    </button>
                </div>
                
                <div class="cart-body">
                    <div id="cart-items" class="cart-items"></div>
                    <div id="cart-empty" class="cart-empty" style="display: none;">
                        <div class="empty-state">
                            <span class="empty-icon">🛒</span>
                            <h4>Tu carrito está vacío</h4>
                            <p>Agrega algunos productos para comenzar</p>
                            <a href="productos.html" class="btn btn-primary">Ver productos</a>
                        </div>
                    </div>
                </div>
                
                <div class="cart-footer">
                    <div id="cart-summary" class="cart-summary"></div>
                    <div class="cart-actions">
                        <button id="clear-cart-btn" class="btn btn-secondary btn-sm" disabled>
                            🗑️ Vaciar carrito
                        </button>
                        <button id="continue-shopping-btn" class="btn btn-primary btn-lg" disabled>
                            Continuar compra
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(cartSidebar);
    }

    // Crear dropdown del carrito con efecto cristal
    createCartDropdown() {
        // Verificar si ya existe
        if (document.getElementById('cart-dropdown')) return;

        const cartDropdown = document.createElement('div');
        cartDropdown.id = 'cart-dropdown';
        cartDropdown.className = 'cart-dropdown';
        cartDropdown.setAttribute('aria-label', 'Vista previa del carrito');
        cartDropdown.setAttribute('aria-hidden', 'true');

        cartDropdown.innerHTML = `
            <div class="cart-dropdown-content">
                <div class="cart-dropdown-header">
                    <h4>🛒 Tu Carrito</h4>
                </div>
                
                <div class="cart-dropdown-items" id="cart-dropdown-items">
                    <!-- Los items se cargarán dinámicamente -->
                </div>
                
                <div class="cart-dropdown-footer">
                    <div class="cart-dropdown-total" id="cart-dropdown-total">
                        <!-- Total se calculará dinámicamente -->
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(cartDropdown);
    }

    // Actualizar contenido del dropdown del carrito
    updateCartDropdown() {
        const dropdownItems = document.getElementById('cart-dropdown-items');
        const dropdownTotal = document.getElementById('cart-dropdown-total');
        
        if (!dropdownItems || !dropdownTotal) {
            // Si no existen los elementos del dropdown, crearlos
            this.createCartDropdown();
            return;
        }

        console.log('Actualizando dropdown, items:', this.items.length);

        if (this.items.length === 0) {
            console.log('Carrito vacío, mostrando mensaje vacío');
            dropdownItems.innerHTML = `
                <div class="cart-dropdown-empty">
                    <span class="empty-icon">🛒</span>
                    <p>Tu carrito está vacío</p>
                </div>
            `;
            dropdownTotal.innerHTML = '';
            return;
        }

        // Mostrar máximo 3 items en el dropdown
        const displayItems = this.items.slice(0, 3);
        const hasMore = this.items.length > 3;

        dropdownItems.innerHTML = displayItems.map(item => `
            <div class="cart-dropdown-item">
                <div class="item-image-small">
                    <img src="${item.imagen || 'images/products/default.jpg'}" 
                         alt="${item.nombre}" 
                         loading="lazy"
                         onerror="this.onerror=null; this.src='images/products/default.jpg';">
                </div>
                <div class="item-info">
                    <h5>${item.nombre}</h5>
                    <p class="item-quantity">${item.quantity}x ${this.formatCLP(item.precioCLP)}</p>
                </div>
                <div class="item-subtotal-small">
                    ${this.formatCLP(item.precioCLP * item.quantity)}
                </div>
            </div>
        `).join('') + (hasMore ? `
            <div class="cart-dropdown-more">
                <p>+ ${this.items.length - 3} productos más...</p>
            </div>
        ` : '');

        // Mostrar total
        const totals = this.calculateTotals();
        dropdownTotal.innerHTML = `
            <div class="dropdown-total-line">
                <span><strong>Total: ${this.formatCLP(totals.total)}</strong></span>
            </div>
            <div class="cart-dropdown-actions">
                <button class="btn-dropdown btn-outline btn-danger" onclick="window.cart.showClearConfirmation(); window.cart.forceHideCartDropdown();">
                    🗑️ Vaciar
                </button>
                <button class="btn-dropdown btn-primary" onclick="window.cart.simulateCheckout(); window.cart.forceHideCartDropdown();">
                    ➡️ Continuar
                </button>
            </div>
        `;
    }

    // Funciones para manejar el dropdown del carrito
    showCartDropdown() {
        if (this.items.length === 0) {
            this.hideCartDropdown();
            return;
        }
        
        let dropdown = document.getElementById('cart-dropdown');
        const cartButton = document.getElementById('cart-toggle');
        
        // Si no existe el dropdown, crearlo
        if (!dropdown) {
            this.createCartDropdown();
            dropdown = document.getElementById('cart-dropdown');
        }
        
        if (dropdown && cartButton) {
            // Cancelar cualquier timeout de ocultamiento
            this.cancelHideDropdown();
            
            // Actualizar contenido antes de mostrar
            this.updateCartDropdown();
            
            // Posicionar el dropdown relativo al botón
            const buttonRect = cartButton.getBoundingClientRect();
            dropdown.style.top = (buttonRect.bottom + 10) + 'px';
            dropdown.style.right = (window.innerWidth - buttonRect.right) + 'px';
            
            dropdown.classList.add('cart-dropdown-visible');
            dropdown.setAttribute('aria-hidden', 'false');
        }
    }

    toggleCartDropdown() {
        const dropdown = document.getElementById('cart-dropdown');
        if (dropdown && dropdown.classList.contains('cart-dropdown-visible')) {
            this.hideCartDropdown();
            this.dropdownPinned = false;
        } else {
            this.showCartDropdown();
            this.dropdownPinned = true;
        }
    }

    hideCartDropdownDelayed() {
        // No ocultar si está pinned por clic
        if (this.dropdownPinned) return;
        
        this.dropdownTimeout = setTimeout(() => {
            this.hideCartDropdown();
        }, 500); // Delay aumentado para mejor UX al navegar con el mouse
    }

    cancelHideDropdown() {
        if (this.dropdownTimeout) {
            clearTimeout(this.dropdownTimeout);
            this.dropdownTimeout = null;
        }
    }

    hideCartDropdown() {
        // No ocultar si está pinned por clic
        if (this.dropdownPinned) return;
        
        const dropdown = document.getElementById('cart-dropdown');
        if (dropdown) {
            dropdown.classList.remove('cart-dropdown-visible');
            dropdown.setAttribute('aria-hidden', 'true');
        }
    }

    forceHideCartDropdown() {
        // Función para forzar el ocultamiento (útil cuando se abre el carrito completo)
        this.dropdownPinned = false;
        const dropdown = document.getElementById('cart-dropdown');
        if (dropdown) {
            dropdown.classList.remove('cart-dropdown-visible');
            dropdown.setAttribute('aria-hidden', 'true');
        }
    }

    bindCartEvents() {
        // Prevenir múltiples bindings
        if (this.eventsbound) return;
        this.eventsbound = true;

        // Toggle del carrito
        const cartToggle = document.getElementById('cart-toggle');
        if (cartToggle) {
            // Remover event listeners previos si existen
            cartToggle.removeEventListener('click', this.handleCartToggleClick);
            cartToggle.removeEventListener('mouseenter', this.handleCartToggleMouseEnter);
            cartToggle.removeEventListener('mouseleave', this.handleCartToggleMouseLeave);

            // Crear handlers como propiedades para poder removerlos
            this.handleCartToggleClick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                // Si hay items, toggle del dropdown; si no hay items, abrir carrito
                if (this.items.length > 0) {
                    this.toggleCartDropdown();
                } else {
                    this.toggleCart();
                }
            };

            this.handleCartToggleMouseEnter = () => {
                if (this.items.length > 0) {
                    this.showCartDropdown();
                    this.cancelHideDropdown();
                }
            };

            this.handleCartToggleMouseLeave = () => {
                if (!this.dropdownPinned && this.items.length > 0) {
                    this.hideCartDropdownDelayed();
                }
            };

            // Agregar nuevos event listeners
            cartToggle.addEventListener('click', this.handleCartToggleClick);
            cartToggle.addEventListener('mouseenter', this.handleCartToggleMouseEnter);
            cartToggle.addEventListener('mouseleave', this.handleCartToggleMouseLeave);
        }

        // Eventos para el dropdown
        const cartDropdown = document.getElementById('cart-dropdown');
        if (cartDropdown) {
            // Eventos hover - siempre activos para mejor UX
            cartDropdown.addEventListener('mouseenter', () => {
                this.cancelHideDropdown(); // Cancelar ocultamiento al entrar
            });
            cartDropdown.addEventListener('mouseleave', () => {
                // Solo ocultar con delay si no está pinned manualmente
                if (!this.dropdownPinned) {
                    this.hideCartDropdownDelayed();
                }
            });
            
            // Prevenir que clics dentro del dropdown lo cierren
            cartDropdown.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }

        // Cerrar carrito
        const cartClose = document.getElementById('cart-close');
        if (cartClose) {
            cartClose.addEventListener('click', () => this.closeCart());
        }

        // Overlay para cerrar (solo al hacer clic en el fondo)
        const cartOverlay = document.querySelector('.cart-overlay');
        if (cartOverlay) {
            cartOverlay.addEventListener('click', (e) => {
                // Solo cerrar si el clic es directamente en el overlay, no en sus hijos
                if (e.target === cartOverlay) {
                    this.closeCart();
                }
            });
        }

        // Prevenir que clics dentro del contenido del carrito cierren el modal
        document.addEventListener('click', (e) => {
            const cartToggle = document.getElementById('cart-toggle');
            const cartDropdown = document.getElementById('cart-dropdown');
            
            // Si el dropdown está pinned y se hace clic fuera del botón y del dropdown
            if (this.dropdownPinned && 
                !e.target.closest('#cart-toggle') && 
                !e.target.closest('#cart-dropdown')) {
                this.forceHideCartDropdown();
            }
            
            // Si el carrito está abierto y se hace clic dentro del cart-content, no cerrar
            if (this.isOpen && e.target.closest('.cart-content')) {
                e.stopPropagation();
            }
        });

        // Botón vaciar carrito
        const clearBtn = document.getElementById('clear-cart-btn');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.showClearConfirmation());
        }

        // Botón continuar compra (simulado)
        const continueBtn = document.getElementById('continue-shopping-btn');
        if (continueBtn) {
            continueBtn.addEventListener('click', () => this.simulateCheckout());
        }

        // Cerrar con ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (this.isOpen) {
                    this.closeCart();
                } else if (this.dropdownPinned) {
                    this.forceHideCartDropdown();
                }
            }
        });
    }

    toggleCart() {
        if (this.isOpen) {
            this.closeCart();
        } else {
            this.openCart();
        }
    }

    openCart() {
        // Cerrar dropdown si está abierto
        this.forceHideCartDropdown();
        
        const sidebar = document.getElementById('cart-sidebar');
        if (sidebar) {
            sidebar.classList.add('cart-open');
            sidebar.setAttribute('aria-hidden', 'false');
            this.isOpen = true;
            this.updateCartDisplay();
            
            // Focus management para accesibilidad
            setTimeout(() => {
                const closeBtn = document.getElementById('cart-close');
                if (closeBtn) closeBtn.focus();
            }, 300);
        }
    }

    closeCart() {
        const sidebar = document.getElementById('cart-sidebar');
        if (sidebar) {
            sidebar.classList.remove('cart-open');
            sidebar.setAttribute('aria-hidden', 'true');
            this.isOpen = false;
            
            // Devolver focus al botón que abrió el carrito
            setTimeout(() => {
                const cartToggle = document.getElementById('cart-toggle');
                if (cartToggle) cartToggle.focus();
            }, 300);
        }
    }

    // LG-041: Actualizar display del carrito con totales
    updateCartDisplay() {
        console.log('updateCartDisplay llamado con items:', this.items);
        
        const cartItemsContainer = document.getElementById('cart-items');
        const cartEmptyContainer = document.getElementById('cart-empty');
        const cartSummaryContainer = document.getElementById('cart-summary');
        const clearBtn = document.getElementById('clear-cart-btn');
        const continueBtn = document.getElementById('continue-shopping-btn');

        console.log('Elementos encontrados:', {
            cartItemsContainer: !!cartItemsContainer,
            cartEmptyContainer: !!cartEmptyContainer,
            cartSummaryContainer: !!cartSummaryContainer,
            clearBtn: !!clearBtn,
            continueBtn: !!continueBtn
        });

        if (!cartItemsContainer) {
            console.error('cart-items container no encontrado');
            return;
        }

        // LG-041: Mostrar mensaje de carrito vacío
        if (this.items.length === 0) {
            cartItemsContainer.style.display = 'none';
            cartEmptyContainer.style.display = 'block';
            cartSummaryContainer.innerHTML = '';
            
            if (clearBtn) clearBtn.disabled = true;
            if (continueBtn) continueBtn.disabled = true;
            return;
        }

        cartItemsContainer.style.display = 'block';
        cartEmptyContainer.style.display = 'none';
        
        if (clearBtn) clearBtn.disabled = false;
        if (continueBtn) continueBtn.disabled = false;

        // Renderizar items del carrito
        cartItemsContainer.innerHTML = this.items.map(item => `
            <div class="cart-item" data-code="${item.code}">
                <div class="item-image">
                    <img src="${item.imagen || 'images/products/default.jpg'}" 
                         alt="${item.nombre}" 
                         loading="lazy">
                </div>
                <div class="item-details">
                    <h4 class="item-name">${item.nombre}</h4>
                    <p class="item-code">Código: ${item.code}</p>
                    <p class="item-price">${this.formatCLP(item.precioCLP)}</p>
                    ${item.stock ? `<p class="item-stock">Stock: ${item.stock}</p>` : ''}
                </div>
                <div class="item-controls">
                    <div class="quantity-controls">
                        <button class="qty-btn qty-decrease" 
                                data-code="${item.code}"
                                aria-label="Disminuir cantidad de ${item.nombre}"
                                ${item.quantity <= 1 ? 'disabled' : ''}>−</button>
                        <input type="number" 
                               class="qty-input" 
                               data-code="${item.code}"
                               value="${item.quantity}" 
                               min="1" 
                               max="${item.stock || 999}"
                               aria-label="Cantidad de ${item.nombre}">
                        <button class="qty-btn qty-increase" 
                                data-code="${item.code}"
                                aria-label="Aumentar cantidad de ${item.nombre}"
                                ${item.stock && item.quantity >= item.stock ? 'disabled' : ''}>+</button>
                    </div>
                    <p class="item-subtotal">${this.formatCLP(item.precioCLP * item.quantity)}</p>
                    <button class="btn-remove" 
                            data-code="${item.code}"
                            aria-label="Eliminar ${item.nombre} del carrito">
                        🗑️
                    </button>
                </div>
            </div>
        `).join('');

        // Bind events para controles de cantidad
        this.bindQuantityControls();

        // LG-041: Actualizar resumen de totales
        this.updateCartSummary();
    }

    bindQuantityControls() {
        const cartItemsContainer = document.getElementById('cart-items');
        if (!cartItemsContainer) return;

        // Event delegation para controles de cantidad
        cartItemsContainer.addEventListener('click', (e) => {
            const code = e.target.dataset.code;
            if (!code) return;

            if (e.target.classList.contains('qty-decrease')) {
                const item = this.items.find(item => item.code === code);
                if (item && item.quantity > 1) {
                    this.update(code, item.quantity - 1);
                }
            } else if (e.target.classList.contains('qty-increase')) {
                const item = this.items.find(item => item.code === code);
                if (item) {
                    this.update(code, item.quantity + 1);
                }
            } else if (e.target.classList.contains('btn-remove')) {
                this.remove(code);
            }
        });

        // Input directo de cantidad
        cartItemsContainer.addEventListener('change', (e) => {
            if (e.target.classList.contains('qty-input')) {
                const code = e.target.dataset.code;
                const newQuantity = parseInt(e.target.value);
                
                if (newQuantity > 0) {
                    this.update(code, newQuantity);
                } else {
                    // Restaurar valor anterior si es inválido
                    const item = this.items.find(item => item.code === code);
                    if (item) {
                        e.target.value = item.quantity;
                    }
                }
            }
        });
    }

    // LG-041: Resumen con totales derivados en CLP
    updateCartSummary() {
        const summaryContainer = document.getElementById('cart-summary');
        if (!summaryContainer) return;

        const totals = this.calculateTotals();

        summaryContainer.innerHTML = `
            <div class="summary-line">
                <span>Productos (${totals.itemCount})</span>
                <span>${this.formatCLP(totals.subtotal)}</span>
            </div>
            <div class="summary-line">
                <span>IVA (19%)</span>
                <span>${this.formatCLP(totals.tax)}</span>
            </div>
            <div class="summary-line">
                <span>Envío</span>
                <span>${totals.shipping === 0 ? 'GRATIS' : this.formatCLP(totals.shipping)}</span>
            </div>
            ${totals.shipping === 0 ? '<p class="shipping-note">🎉 Envío gratis por compra sobre $50.000</p>' : ''}
            <div class="summary-total">
                <span><strong>Total</strong></span>
                <span><strong>${this.formatCLP(totals.total)}</strong></span>
            </div>
        `;
    }

    // LG-041: CTA 'Continuar' simulada
    simulateCheckout() {
        if (this.items.length === 0) {
            this.showMessage('El carrito está vacío', 'warning');
            return;
        }

        const totals = this.calculateTotals();
        
        // Simular proceso de checkout
        this.showMessage('Procesando compra...', 'info');
        
        setTimeout(() => {
            this.showMessage(
                `¡Compra simulada exitosa! Total: ${this.formatCLP(totals.total)}`, 
                'success'
            );
            
            // Limpiar carrito después de compra exitosa
            setTimeout(() => {
                this.clear(true); // skipConfirmation = true para checkout automático
                this.closeCart();
            }, 2000);
        }, 1500);
    }

    initializeListeners() {
        // Bind eventos del carrito
        this.bindCartEvents();
        
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

    // Métodos públicos para compatibilidad con código existente
    addItem(product, quantity = 1) {
        return this.add(product, quantity);
    }

    removeItem(productCode) {
        return this.remove(productCode);
    }

    updateQuantity(productCode, quantity) {
        return this.update(productCode, quantity);
    }
}

// Inicializar el carrito cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    try {
        console.log('Inicializando carrito...');
        window.cart = new Cart();
        
        // Debug: Función global para limpiar carrito
        window.resetCart = () => {
            window.cart.forceResetCart();
        };
        
        // Verificar que la inicialización fue exitosa
        setTimeout(() => {
            const cartToggle = document.getElementById('cart-toggle');
            const cartCount = document.getElementById('cart-count');
            
            if (cartToggle && cartCount) {
                console.log('✅ Carrito inicializado correctamente');
            } else {
                console.warn('⚠️ Carrito inicializado pero elementos DOM no encontrados');
            }
        }, 100);
        
        console.log('Carrito inicializado. Para limpiar forzadamente, ejecuta: resetCart()');
        
    } catch (error) {
        console.error('❌ Error inicializando carrito:', error);
    }
    
    // Variable para prevenir múltiples clics rápidos
    let isProcessingAddToCart = false;
    
    // Event listener global para agregar productos al carrito
    document.addEventListener('click', (e) => {
        // Buscar el botón más cercano, incluso si se hace clic en un elemento hijo
        const button = e.target.closest('.add-to-cart-btn, .add-to-cart');
        if (button && !isProcessingAddToCart && window.cart) {
            console.log('🛒 Botón de agregar al carrito clickeado:', button);
            e.preventDefault();
            e.stopPropagation(); // Prevenir propagación para evitar múltiples eventos
            
            // Activar flag para prevenir múltiples ejecuciones
            isProcessingAddToCart = true;
            
            try {
                const productData = button.dataset;
                console.log('📦 Datos del producto desde dataset:', productData);
                
                // Validar datos mínimos requeridos
                if (!productData.code || !productData.nombre || !productData.precio) {
                    console.error('❌ Datos de producto incompletos:', {
                        code: productData.code,
                        nombre: productData.nombre,
                        precio: productData.precio
                    });
                    window.cart.showMessage('Error: Datos de producto incompletos', 'error');
                    return;
                }

                // Validar que el precio sea un número válido
                const precio = parseInt(productData.precio);
                if (isNaN(precio) || precio <= 0) {
                    console.error('❌ Precio inválido:', productData.precio);
                    window.cart.showMessage('Error: Precio de producto inválido', 'error');
                    return;
                }

                const product = {
                    code: productData.code,
                    nombre: productData.nombre,
                    precioCLP: precio,
                    imagen: productData.imagen || 'images/products/default.jpg',
                    stock: productData.stock ? parseInt(productData.stock) : null
                };
                
                const quantity = parseInt(productData.quantity) || 1;
                console.log('✅ Producto procesado para agregar:', product, 'cantidad:', quantity);
                
                // Intentar agregar al carrito
                const success = window.cart.add(product, quantity);
                if (success) {
                    console.log('✅ Producto agregado exitosamente al carrito');
                } else {
                    console.log('⚠️ No se pudo agregar el producto al carrito');
                }
                
            } catch (error) {
                console.error('❌ Error procesando producto:', error);
                if (window.cart) {
                    window.cart.showMessage('Error al agregar producto', 'error');
                }
            } finally {
                // Resetear flag después de un pequeño delay
                setTimeout(() => {
                    isProcessingAddToCart = false;
                }, 1000);
            }
        }
    });

    // Variable para prevenir múltiples clics rápidos en redeem
    let isProcessingRedeem = false;
    
    // Event listener global para botones de redeem
    document.addEventListener('click', (e) => {
        // Buscar el botón más cercano de redeem
        const button = e.target.closest('.redeem-btn');
        if (button && !isProcessingRedeem) {
            console.log('Botón de redeem clickeado:', button);
            e.preventDefault();
            e.stopPropagation();
            
            // Activar flag para prevenir múltiples ejecuciones
            isProcessingRedeem = true;
            
            const productData = button.dataset;
            console.log('Datos del producto para redeem:', productData);
            
            if (productData.code && productData.nombre && productData.precio && productData.points) {
                const product = {
                    code: productData.code,
                    nombre: productData.nombre,
                    precioCLP: parseInt(productData.precio),
                    pointsRequired: parseInt(productData.points)
                };
                
                console.log('Producto para redeem procesado:', product);
                
                // Verificar si existe el catálogo y llamar al método handleRedeem
                if (window.catalog && typeof window.catalog.handleRedeem === 'function') {
                    window.catalog.handleRedeem(product);
                } else {
                    console.error('Catálogo no disponible o método handleRedeem no encontrado');
                }
            } else {
                console.error('Datos de producto para redeem incompletos:', productData);
            }
            
            // Resetear flag después de un pequeño delay
            setTimeout(() => {
                isProcessingRedeem = false;
            }, 500);
        }
    });
});
