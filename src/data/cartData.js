// Configuración del sistema de carrito basado en el original de LevelUp
// LG-040, LG-041, LG-042: Carrito de compras con validación completa y CRUD

export const cartConfig = {
  // Configuración del localStorage
  storageKey: 'levelup_cart',
  
  // Configuración de impuestos y envío (basado en el original)
  tax: {
    rate: 0.19, // IVA 19%
    name: 'IVA',
    included: false
  },
  
  shipping: {
    freeShippingThreshold: 50000, // Envío gratis sobre $50.000
    standardRate: 5000, // $5.000 envío estándar
    name: 'Envío'
  },
  
  // Configuración de validación
  validation: {
    maxQuantity: 999,
    minQuantity: 1,
    debounceTime: 300 // ms para evitar múltiples actualizaciones
  },
  
  // Mensajes del sistema (del original)
  messages: {
    addSuccess: 'agregado al carrito',
    addError: 'Error al agregar producto',
    removeSuccess: 'eliminado del carrito', 
    removeError: 'Error al eliminar producto',
    updateSuccess: 'Cantidad actualizada',
    updateError: 'Error al actualizar cantidad',
    clearSuccess: 'Carrito vaciado',
    clearError: 'Error al vaciar carrito',
    clearConfirm: '¿Estás seguro de que deseas vaciar el carrito? Esta acción no se puede deshacer.',
    stockInsufficient: 'Stock insuficiente. Disponible: ',
    quantityInvalid: 'La cantidad debe ser mayor a 0',
    productInvalid: 'Error: Producto inválido',
    priceInvalid: 'Error: Precio de producto inválido',
    dataIncomplete: 'Error: Datos de producto incompletos',
    loadError: 'Error al cargar el carrito',
    saveError: 'Error al guardar en el carrito'
  },
  
  // Configuración de animaciones (del CSS original)
  animations: {
    slideIn: 'cart-slide-in 0.3s ease-out',
    slideOut: 'cart-slide-out 0.3s ease-in',
    fadeIn: 'fade-in 0.2s ease-out',
    bounceIn: 'bounce-in 0.4s ease-out'
  }
};

// Validaciones de producto (basado en cart.js original)
export const productValidation = {
  // Validar estructura básica del producto
  validateProduct: (product) => {
    if (!product || typeof product !== 'object') {
      return { valid: false, error: cartConfig.messages.productInvalid };
    }

    // Campos requeridos (del original)
    const requiredFields = ['code', 'nombre', 'precioCLP'];
    for (const field of requiredFields) {
      if (!product[field]) {
        return { valid: false, error: cartConfig.messages.dataIncomplete };
      }
    }

    // Validar precio
    if (isNaN(product.precioCLP) || product.precioCLP <= 0) {
      return { valid: false, error: cartConfig.messages.priceInvalid };
    }

    return { valid: true };
  },

  // Validar cantidad
  validateQuantity: (quantity, stock = null) => {
    if (!Number.isInteger(quantity) || quantity < cartConfig.validation.minQuantity) {
      return { valid: false, error: cartConfig.messages.quantityInvalid };
    }

    if (quantity > cartConfig.validation.maxQuantity) {
      return { 
        valid: false, 
        error: `Cantidad máxima: ${cartConfig.validation.maxQuantity}` 
      };
    }

    if (stock && quantity > stock) {
      return { 
        valid: false, 
        error: `${cartConfig.messages.stockInsufficient}${stock}` 
      };
    }

    return { valid: true };
  },

  // Validar datos del carrito al cargar
  validateCartData: (cartData) => {
    if (!Array.isArray(cartData)) return [];
    
    return cartData.filter(item => {
      const productCheck = productValidation.validateProduct(item);
      const quantityCheck = productValidation.validateQuantity(item.quantity, item.stock);
      
      return productCheck.valid && quantityCheck.valid;
    });
  }
};

// Utilidades de formato (del original)
export const cartUtils = {
  // Formatear moneda chilena
  formatCLP: (amount) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  },

  // Calcular totales (del original)
  calculateTotals: (items) => {
    if (!Array.isArray(items) || items.length === 0) {
      return {
        subtotal: 0,
        tax: 0,
        shipping: 0,
        total: 0,
        itemCount: 0,
        savings: 0
      };
    }

    const subtotal = items.reduce((total, item) => {
      return total + (item.precioCLP * item.quantity);
    }, 0);

    const tax = Math.round(subtotal * cartConfig.tax.rate);
    const shipping = subtotal >= cartConfig.shipping.freeShippingThreshold ? 0 : cartConfig.shipping.standardRate;
    const total = subtotal + tax + shipping;
    const itemCount = items.reduce((count, item) => count + item.quantity, 0);
    const savings = subtotal >= cartConfig.shipping.freeShippingThreshold ? cartConfig.shipping.standardRate : 0;

    return {
      subtotal,
      tax,
      shipping,
      total,
      itemCount,
      savings,
      freeShippingReached: subtotal >= cartConfig.shipping.freeShippingThreshold,
      freeShippingRemaining: Math.max(0, cartConfig.shipping.freeShippingThreshold - subtotal)
    };
  },

  // Generar ID único para items del carrito
  generateCartItemId: () => {
    return `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  },

  // Debounce para evitar múltiples actualizaciones
  debounce: (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Validar stock disponible
  checkStockAvailability: (product, requestedQuantity, currentCartQuantity = 0) => {
    if (!product.stock) return { available: true }; // Sin límite de stock
    
    const totalRequested = currentCartQuantity + requestedQuantity;
    const available = totalRequested <= product.stock;
    
    return {
      available,
      maxAvailable: product.stock,
      currentInCart: currentCartQuantity,
      requested: requestedQuantity,
      remaining: Math.max(0, product.stock - currentCartQuantity)
    };
  }
};

// Estados del carrito para UI
export const cartStates = {
  IDLE: 'idle',
  LOADING: 'loading',
  ADDING: 'adding',
  UPDATING: 'updating',
  REMOVING: 'removing',
  CLEARING: 'clearing',
  ERROR: 'error'
};

// Tipos de acciones del carrito
export const cartActionTypes = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  LOAD_CART: 'LOAD_CART',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  TOGGLE_SIDEBAR: 'TOGGLE_SIDEBAR'
};

// Productos demo para pruebas (basado en la estructura original)
export const demoProducts = [
  {
    code: 'PS5-001',
    nombre: 'PlayStation 5 Console',
    precioCLP: 599990,
    stock: 10,
    imagen: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&h=400&fit=crop&crop=center',
    categoria: 'consolas',
    descripcion: 'La consola PlayStation 5 más potente de Sony. Experimenta juegos de nueva generación con gráficos 4K, ray tracing, SSD ultra rápido y el revolucionario control DualSense con retroalimentación háptica. Incluye lector de discos Blu-ray 4K.'
  },
  {
    code: 'XBOX-001', 
    nombre: 'Xbox Series X',
    precioCLP: 549990,
    stock: 8,
    imagen: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=600&h=400&fit=crop&crop=center',
    categoria: 'consolas',
    descripcion: 'La consola Xbox más potente jamás creada. Disfruta de juegos en 4K hasta 120fps, Quick Resume para cambiar entre múltiples juegos al instante, y acceso a Xbox Game Pass. Con 1TB de almacenamiento SSD y compatibilidad con miles de juegos.'
  },
  {
    code: 'SWITCH-001',
    nombre: 'Nintendo Switch OLED',
    precioCLP: 399990,
    stock: 15,
    imagen: 'https://images.unsplash.com/photo-1635514569146-9a9607ecf303?w=600&h=400&fit=crop&crop=center',
    categoria: 'consolas',
    descripcion: 'Nintendo Switch OLED Model con pantalla OLED de 7 pulgadas y colores vibrantes. Juega en casa conectado al TV o llévalo contigo en modo portátil. Incluye dock mejorado, 64GB de almacenamiento interno y soporte ajustable integrado.'
  },
  {
    code: 'GAME-001',
    nombre: 'The Last of Us Part II',
    precioCLP: 39990,
    stock: 25,
    imagen: '/images/products/tlou2.jpg',
    categoria: 'juegos',
    descripcion: 'Juego para PlayStation 4/5'
  },
  {
    code: 'CTRL-001',
    nombre: 'DualSense Controller',
    precioCLP: 79990,
    stock: 20,
    imagen: '/images/products/dualsense.jpg',
    categoria: 'accesorios',
    descripcion: 'Control inalámbrico DualSense para PS5'
  }
];