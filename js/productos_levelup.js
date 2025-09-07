// productos_levelup.js

// Helper para formatear moneda CLP
export const formatCLP = (amount) => {
    return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
};

// Validador de productos
export const validateProduct = (product) => {
    const errors = [];
    
    // Campos requeridos
    const requiredFields = ['code', 'nombre', 'categoriaId', 'precioCLP', 'stock', 'descripcion', 'marca'];
    requiredFields.forEach(field => {
        if (!product[field]) {
            errors.push(`El campo ${field} es requerido`);
        }
    });

    // Validaciones específicas
    if (product.precioCLP < 0) {
        errors.push('El precio debe ser mayor o igual a 0');
    }

    if (!Number.isInteger(product.stock) || product.stock < 0) {
        errors.push('El stock debe ser un número entero mayor o igual a 0');
    }

    if (product.rating && (product.rating < 0 || product.rating > 5)) {
        errors.push('El rating debe estar entre 0 y 5');
    }

    // Validar que specs y tags sean arrays
    if (product.specs && !Array.isArray(product.specs)) {
        errors.push('specs debe ser un array');
    }

    if (product.tags && !Array.isArray(product.tags)) {
        errors.push('tags debe ser un array');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

// Función para obtener productos por categoría
export const getProductsByCategory = (categoryId) => {
    return PRODUCTS_LG.filter(product => product.categoriaId === categoryId);
};

// Función para obtener un producto por código
export const getProductByCode = (code) => {
    return PRODUCTS_LG.find(product => product.code === code);
};

// Función para buscar productos por término
export const searchProducts = (term) => {
    const searchTerm = term.toLowerCase();
    return PRODUCTS_LG.filter(product => 
        product.nombre.toLowerCase().includes(searchTerm) ||
        product.descripcion.toLowerCase().includes(searchTerm) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
};

// Lista de productos con validación
export const PRODUCTS_LG = [
  {
    code: "JM001", nombre: "Catan", categoriaId: "JM",
    precioCLP: 29990, stock: 25, marca: "Kosmos", rating: 4.8,
    specs: ["3-4 jugadores", "60-90 min"],
    descripcion: "Clásico de estrategia de colonización y comercio.",
    tags: ["familiar", "estrategia"],
    imagen: "images/products/jm001.jpg"
  },
  {
    code: "JM002", nombre: "Carcassonne", categoriaId: "JM",
    precioCLP: 24990, stock: 30, marca: "Z-Man Games", rating: 4.7,
    specs: ["2-5 jugadores", "35 min"],
    descripcion: "Construcción de losetas en la campiña medieval.",
    tags: ["familiar", "colocación"],
    imagen: "images/products/jm002.jpg"
  },
  {
    code: "AC001", nombre: "Control Xbox Inalámbrico", categoriaId: "AC",
    precioCLP: 59990, stock: 18, marca: "Microsoft", rating: 4.6,
    specs: ["Bluetooth", "USB-C", "Xbox/PC"],
    descripcion: "Comodidad mejorada con agarre texturizado y baja latencia.",
    tags: ["xbox", "pc"],
    imagen: "images/products/ac001.jpg"
  },
  {
    code: "AC002", nombre: "HyperX Cloud II", categoriaId: "AC",
    precioCLP: 79990, stock: 14, marca: "HyperX", rating: 4.7,
    specs: ["Sonido 7.1", "Micrófono desmontable"],
    descripcion: "Sonido envolvente y comodidad para largas sesiones.",
    tags: ["audio", "microfono"],
    imagen: "images/products/ac002.jpg"
  },
  {
    code: "CO001", nombre: "PlayStation 5", categoriaId: "CO",
    precioCLP: 549990, stock: 8, marca: "Sony", rating: 4.9,
    specs: ["SSD ultra-rápido", "Ray Tracing"],
    descripcion: "Consola de nueva generación con tiempos de carga mínimos.",
    tags: ["ps5", "next-gen"],
    imagen: "images/products/co001.jpg"
  },
  {
    code: "CG001", nombre: "PC Gamer ASUS ROG Strix", categoriaId: "CG",
    precioCLP: 1299990, stock: 5, marca: "ASUS", rating: 4.8,
    specs: ["CPU Ryzen", "GPU RTX", "16GB RAM"],
    descripcion: "Rendimiento tope para juegos exigentes.",
    tags: ["asus", "rtx"],
    imagen: "images/products/cg001.jpg"
  },
  {
    code: "SG001", nombre: "Silla Gamer Secretlab Titan", categoriaId: "SG",
    precioCLP: 349990, stock: 9, marca: "Secretlab", rating: 4.8,
    specs: ["Soporte lumbar", "Ajustes 4D"],
    descripcion: "Confort ergonómico para sesiones prolongadas.",
    tags: ["ergonomia"],
    imagen: "images/products/sg001.jpg"
  },
  {
    code: "MS001", nombre: "Logitech G502 HERO", categoriaId: "MS",
    precioCLP: 49990, stock: 20, marca: "Logitech", rating: 4.7,
    specs: ["Sensor 25K", "11 botones programables"],
    descripcion: "Precisión y personalización para FPS y MOBA.",
    tags: ["logitech", "fps"],
    imagen: "images/products/ms001.jpg"
  },
  {
    code: "MP001", nombre: "Razer Goliathus Extended", categoriaId: "MP",
    precioCLP: 29990, stock: 22, marca: "Razer", rating: 4.6,
    specs: ["Superficie textil", "RGB"],
    descripcion: "Gran área de deslizamiento con iluminación personalizable.",
    tags: ["razer", "rgb"],
    imagen: "images/products/mp001.jpg"
  },
  {
    code: "PP001", nombre: "Polera Gamer Personalizada 'Level-Up'", categoriaId: "PP",
    precioCLP: 14990, stock: 40, marca: "Level-Up", rating: 4.5,
    specs: ["Personalización gamer tag"],
    descripcion: "Camiseta cómoda con diseño personalizado.",
    tags: ["merch"],
    imagen: "images/products/pp001.jpg"
  }
];
