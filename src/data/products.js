const updateImagePaths = (products) => {
  // Primero, intentamos obtener la URL de la imagen por defecto
  let defaultImageUrl;
  try {
    defaultImageUrl = new URL('../assets/images/products/default.jpg', import.meta.url).href;
  } catch (error) {
    console.error('No se pudo cargar la imagen por defecto:', error);
    defaultImageUrl = ''; // URL vacía como último recurso
  }

  return products.map(product => {
    let imagen;
    try {
      // Intentamos cargar la imagen del producto
      const moduleUrl = new URL(`../assets/images/products/${product.code}.jpg`, import.meta.url);
      
      // Verificamos si el archivo existe haciendo una petición
      fetch(moduleUrl.href)
        .then(response => {
          if (!response.ok) {
            product.imagen = defaultImageUrl;
          }
        })
        .catch(() => {
          product.imagen = defaultImageUrl;
        });
      
      imagen = moduleUrl.href;
    } catch (error) {
      console.warn(`Usando imagen por defecto para ${product.code}`);
      imagen = defaultImageUrl;
    }
    
    return { ...product, imagen };
  });
}

export const PRODUCTS_LG = updateImagePaths([
  {
    code: "JM001", nombre: "Catan", categoriaId: "JM",
    precioCLP: 29990, stock: 25, marca: "Kosmos", rating: 4.8,
    specs: ["3-4 jugadores", "60-90 min"],
    descripcion: "Clásico de estrategia de colonización y comercio.",
    tags: ["familiar", "estrategia"]
  },
  {
    code: "JM002", nombre: "Carcassonne", categoriaId: "JM",
    precioCLP: 24990, stock: 30, marca: "Z-Man Games", rating: 4.7,
    specs: ["2-5 jugadores", "35 min"],
    descripcion: "Construcción de losetas en la campiña medieval.",
    tags: ["familiar", "colocación"]
  },
  {
    code: "AC001", nombre: "Control Xbox Inalámbrico", categoriaId: "AC",
    precioCLP: 59990, stock: 18, marca: "Microsoft", rating: 4.6,
    specs: ["Bluetooth", "USB-C", "Xbox/PC"],
    descripcion: "Comodidad mejorada con agarre texturizado y baja latencia.",
    tags: ["xbox", "pc"]
  },
  {
    code: "AC002", nombre: "HyperX Cloud II", categoriaId: "AC",
    precioCLP: 79990, stock: 14, marca: "HyperX", rating: 4.7,
    specs: ["Sonido 7.1", "Micrófono desmontable"],
    descripcion: "Sonido envolvente y comodidad para largas sesiones.",
    tags: ["audio", "microfono"]
  },
  {
    code: "CO001", nombre: "PlayStation 5", categoriaId: "CO",
    precioCLP: 549990, stock: 8, marca: "Sony", rating: 4.9,
    specs: ["SSD ultra-rápido", "Ray Tracing"],
    descripcion: "Consola de nueva generación con tiempos de carga mínimos.",
    tags: ["ps5", "next-gen"]
  },
  {
    code: "CG001", nombre: "PC Gamer ASUS ROG Strix", categoriaId: "CG",
    precioCLP: 1299990, stock: 5, marca: "ASUS", rating: 4.8,
    specs: ["CPU Ryzen", "GPU RTX", "16GB RAM"],
    descripcion: "Rendimiento tope para juegos exigentes.",
    tags: ["asus", "rtx"]
  },
  {
    code: "SG001", nombre: "Silla Gamer Secretlab Titan", categoriaId: "SG",
    precioCLP: 349990, stock: 9, marca: "Secretlab", rating: 4.8,
    specs: ["Soporte lumbar", "Ajustes 4D"],
    descripcion: "Confort ergonómico para sesiones prolongadas.",
    tags: ["ergonomia"]
  },
  {
    code: "MS001", nombre: "Logitech G502 HERO", categoriaId: "MS",
    precioCLP: 49990, stock: 20, marca: "Logitech", rating: 4.7,
    specs: ["Sensor 25K", "11 botones programables"],
    descripcion: "Precisión y personalización para FPS y MOBA.",
    tags: ["logitech", "fps"]
  },
  {
    code: "MP001", nombre: "Razer Goliathus Extended", categoriaId: "MP",
    precioCLP: 29990, stock: 22, marca: "Razer", rating: 4.6,
    specs: ["Superficie textil", "RGB"],
    descripcion: "Gran área de deslizamiento con iluminación personalizable.",
    tags: ["razer", "rgb"]
  },
  {
    code: "PP001", nombre: "Polera Gamer Personalizada 'Level-Up'", categoriaId: "PP",
    precioCLP: 14990, stock: 40, marca: "Level-Up", rating: 4.5,
    specs: ["Personalización gamer tag"],
    descripcion: "Camiseta cómoda con diseño personalizado.",
    tags: ["merch"]
  },
  {
    code: "JM003", nombre: "Dixit", categoriaId: "JM",
    precioCLP: 26990, stock: 28, marca: "Libellud", rating: 4.6,
    specs: ["3-6 jugadores", "30 min"],
    descripcion: "Juego narrativo de imaginación y asociación de imágenes.",
    tags: ["familiar", "creatividad"]
  },
  {
    code: "JM004", nombre: "Ticket to Ride", categoriaId: "JM",
    precioCLP: 39990, stock: 15, marca: "Days of Wonder", rating: 4.8,
    specs: ["2-5 jugadores", "45-60 min"],
    descripcion: "Construcción de rutas ferroviarias a través de Norteamérica.",
    tags: ["estrategia", "familiar"]
  },
  {
    code: "AC003", nombre: "Teclado Mecánico Corsair K70 RGB", categoriaId: "AC",
    precioCLP: 129990, stock: 12, marca: "Corsair", rating: 4.7,
    specs: ["Switches Cherry MX", "RGB", "Anti-Ghosting"],
    descripcion: "Teclado premium para alto rendimiento gamer.",
    tags: ["corsair", "teclado"]
  },
  {
    code: "AC004", nombre: "Mouse Razer DeathAdder V2", categoriaId: "AC",
    precioCLP: 64990, stock: 25, marca: "Razer", rating: 4.8,
    specs: ["20K DPI", "6 botones programables"],
    descripcion: "Ergonomía y precisión para largas partidas competitivas.",
    tags: ["fps", "razer"]
  },
  {
    code: "CO002", nombre: "Xbox Series X", categoriaId: "CO",
    precioCLP: 499990, stock: 10, marca: "Microsoft", rating: 4.8,
    specs: ["1TB SSD", "4K Gaming"],
    descripcion: "La consola más potente de Xbox para nueva generación.",
    tags: ["xbox", "next-gen"]
  },
  {
    code: "CO003", nombre: "Nintendo Switch OLED", categoriaId: "CO",
    precioCLP: 379990, stock: 12, marca: "Nintendo", rating: 4.9,
    specs: ["Pantalla OLED", "Modo portátil y TV"],
    descripcion: "Híbrida portátil con vibrantes colores y versatilidad.",
    tags: ["switch", "portátil"]
  },
  {
    code: "CG002", nombre: "PC Gamer MSI Infinite", categoriaId: "CG",
    precioCLP: 1199990, stock: 7, marca: "MSI", rating: 4.7,
    specs: ["Intel i7", "RTX 3060", "16GB RAM"],
    descripcion: "Potencia confiable con diseño elegante para gamers exigentes.",
    tags: ["msi", "rtx"]
  },
  {
    code: "SG002", nombre: "Silla Gamer Cougar Armor One", categoriaId: "SG",
    precioCLP: 199990, stock: 15, marca: "Cougar", rating: 4.6,
    specs: ["Reclinable", "Cojines ergonómicos"],
    descripcion: "Comodidad y soporte para maratones de juego.",
    tags: ["ergonomia", "resistencia"]
  },
  {
    code: "MS002", nombre: "SteelSeries Rival 600", categoriaId: "MS",
    precioCLP: 79990, stock: 18, marca: "SteelSeries", rating: 4.7,
    specs: ["Dual Sensor", "Peso ajustable"],
    descripcion: "Precisión competitiva con diseño personalizable.",
    tags: ["steelseries", "fps"]
  },
  {
    code: "MP002", nombre: "Corsair MM300 Extended", categoriaId: "MP",
    precioCLP: 25990, stock: 20, marca: "Corsair", rating: 4.6,
    specs: ["Superficie de tela", "Antideslizante"],
    descripcion: "Gran alfombrilla para configuraciones multi-periféricos.",
    tags: ["corsair", "mousepad"]
  },
  {
    code: "PP002", nombre: "Polerón Gamer 'Respawn'", categoriaId: "PP",
    precioCLP: 29990, stock: 35, marca: "Level-Up", rating: 4.5,
    specs: ["Tallas S-XL", "Diseño gamer"],
    descripcion: "Polerón cómodo para mostrar tu estilo gamer.",
    tags: ["merch", "ropa"]
  },
  {
    code: "PP003", nombre: "Mousepad Gamer Personalizado", categoriaId: "PP",
    precioCLP: 9990, stock: 50, marca: "Level-Up", rating: 4.4,
    specs: ["Impresión personalizada", "Superficie gamer"],
    descripcion: "Mousepad único con tu diseño gamer favorito.",
    tags: ["merch", "personalizado"]
  },
  {
    code: "JM005", nombre: "Pandemic", categoriaId: "JM",
    precioCLP: 34990, stock: 20, marca: "Z-Man Games", rating: 4.7,
    specs: ["2-4 jugadores", "45 min"],
    descripcion: "Juego cooperativo para salvar al mundo de epidemias.",
    tags: ["cooperativo", "estrategia"]
  },
  {
    code: "JM006", nombre: "7 Wonders", categoriaId: "JM",
    precioCLP: 37990, stock: 18, marca: "Repos Production", rating: 4.8,
    specs: ["2-7 jugadores", "30 min"],
    descripcion: "Construcción de civilizaciones con mecánicas de draft.",
    tags: ["estrategia", "civilización"]
  },
  {
    code: "JM007", nombre: "Splendor", categoriaId: "JM",
    precioCLP: 28990, stock: 25, marca: "Space Cowboys", rating: 4.6,
    specs: ["2-4 jugadores", "30 min"],
    descripcion: "Juego de comercio y gemas con reglas simples y estratégicas.",
    tags: ["estrategia", "familiar"]
  },
  {
    code: "JM008", nombre: "Azul", categoriaId: "JM",
    precioCLP: 31990, stock: 22, marca: "Next Move Games", rating: 4.7,
    specs: ["2-4 jugadores", "30-45 min"],
    descripcion: "Juego abstracto de colocación de azulejos portugueses.",
    tags: ["abstracto", "estrategia"]
  },
  {
    code: "JM009", nombre: "Codenames", categoriaId: "JM",
    precioCLP: 22990, stock: 30, marca: "Czech Games", rating: 4.5,
    specs: ["2-8 jugadores", "15-30 min"],
    descripcion: "Juego de palabras por equipos para descubrir espías.",
    tags: ["fiesta", "palabras"]
  },
  {
    code: "AC005", nombre: "Auriculares Logitech G Pro X", categoriaId: "AC",
    precioCLP: 99990, stock: 16, marca: "Logitech", rating: 4.8,
    specs: ["Sonido 7.1", "Micrófono Blue VO!CE"],
    descripcion: "Audio competitivo con micrófono profesional.",
    tags: ["logitech", "audio"]
  },
  {
    code: "AC006", nombre: "Teclado Razer Huntsman Mini", categoriaId: "AC",
    precioCLP: 89990, stock: 20, marca: "Razer", rating: 4.7,
    specs: ["60%", "Switches ópticos", "RGB"],
    descripcion: "Formato compacto sin sacrificar velocidad ni estilo.",
    tags: ["razer", "teclado"]
  },
  {
    code: "AC007", nombre: "Control DualSense Edge", categoriaId: "AC",
    precioCLP: 199990, stock: 8, marca: "Sony", rating: 4.9,
    specs: ["PS5", "Personalizable", "USB-C"],
    descripcion: "Control premium de PlayStation con gatillos ajustables.",
    tags: ["ps5", "accesorio"]
  },
  {
    code: "AC008", nombre: "Webcam Logitech StreamCam", categoriaId: "AC",
    precioCLP: 129990, stock: 12, marca: "Logitech", rating: 4.6,
    specs: ["1080p 60fps", "USB-C"],
    descripcion: "Ideal para streaming y videollamadas de alta calidad.",
    tags: ["streaming", "logitech"]
  },
  {
    code: "CO004", nombre: "Steam Deck 512GB", categoriaId: "CO",
    precioCLP: 599990, stock: 5, marca: "Valve", rating: 4.8,
    specs: ["512GB SSD", "7'' Pantalla"],
    descripcion: "Consola portátil para tu biblioteca de Steam.",
    tags: ["pc", "portátil"]
  },
  {
    code: "CO005", nombre: "PlayStation 4 Slim 1TB", categoriaId: "CO",
    precioCLP: 299990, stock: 15, marca: "Sony", rating: 4.6,
    specs: ["1TB", "HDR"],
    descripcion: "La clásica consola de Sony con gran catálogo de juegos.",
    tags: ["ps4", "retro"]
  },
  {
    code: "CG003", nombre: "PC Gamer HP Omen", categoriaId: "CG",
    precioCLP: 1099990, stock: 6, marca: "HP", rating: 4.7,
    specs: ["Intel i5", "RTX 3050", "8GB RAM"],
    descripcion: "PC de entrada al mundo gamer con gran rendimiento.",
    tags: ["hp", "gaming"]
  },
  {
    code: "CG004", nombre: "Notebook Gamer Acer Nitro 5", categoriaId: "CG",
    precioCLP: 899990, stock: 10, marca: "Acer", rating: 4.6,
    specs: ["Ryzen 5", "GTX 1650", "8GB RAM"],
    descripcion: "Laptop versátil para jugar y estudiar.",
    tags: ["acer", "notebook"]
  },
  {
    code: "SG003", nombre: "Silla Gamer Razer Iskur", categoriaId: "SG",
    precioCLP: 399990, stock: 7, marca: "Razer", rating: 4.8,
    specs: ["Soporte lumbar dinámico", "Cojines de espuma"],
    descripcion: "Diseñada para comodidad y soporte máximo.",
    tags: ["razer", "ergonomia"]
  },
  {
    code: "SG004", nombre: "Silla Gamer DXRacer Formula", categoriaId: "SG",
    precioCLP: 329990, stock: 9, marca: "DXRacer", rating: 4.7,
    specs: ["Diseño deportivo", "Reclinable"],
    descripcion: "Clásica silla gamer con diseño de competición.",
    tags: ["dxracer", "ergonomia"]
  },
  {
    code: "MS003", nombre: "Glorious Model O", categoriaId: "MS",
    precioCLP: 69990, stock: 20, marca: "Glorious", rating: 4.7,
    specs: ["Ultra ligero", "RGB"],
    descripcion: "Mouse con diseño de panal para mayor agilidad.",
    tags: ["fps", "glorious"]
  },
  {
    code: "MS004", nombre: "Razer Naga Trinity", categoriaId: "MS",
    precioCLP: 89990, stock: 14, marca: "Razer", rating: 4.6,
    specs: ["Botonera modular", "16K DPI"],
    descripcion: "Perfecto para MMO con múltiples configuraciones.",
    tags: ["razer", "mmo"]
  },
  {
    code: "MP003", nombre: "HyperX Fury S Pro", categoriaId: "MP",
    precioCLP: 19990, stock: 25, marca: "HyperX", rating: 4.6,
    specs: ["Superficie textil", "Antideslizante"],
    descripcion: "Durabilidad y suavidad para precisión en el juego.",
    tags: ["hyperx", "mousepad"]
  },
  {
    code: "MP004", nombre: "SteelSeries QcK Prism XL", categoriaId: "MP",
    precioCLP: 54990, stock: 12, marca: "SteelSeries", rating: 4.8,
    specs: ["RGB", "XL"],
    descripcion: "Superficie optimizada con iluminación envolvente.",
    tags: ["steelseries", "rgb"]
  },
  {
    code: "PP004", nombre: "Polera Gamer Retro 8-Bit", categoriaId: "PP",
    precioCLP: 15990, stock: 30, marca: "Level-Up", rating: 4.5,
    specs: ["Tallas XS-XXL", "Diseño retro"],
    descripcion: "Polera inspirada en la era dorada de los videojuegos.",
    tags: ["retro", "ropa"]
  },
  {
    code: "PP005", nombre: "Polerón 'Game Over'", categoriaId: "PP",
    precioCLP: 29990, stock: 28, marca: "Level-Up", rating: 4.6,
    specs: ["Tallas M-XL", "Estampado frontal"],
    descripcion: "Estilo urbano gamer con un toque retro.",
    tags: ["merch", "ropa"]
  },
  {
    code: "PP006", nombre: "Gorro Gamer Pixelado", categoriaId: "PP",
    precioCLP: 9990, stock: 40, marca: "Level-Up", rating: 4.4,
    specs: ["Unisex", "Diseño pixel art"],
    descripcion: "Accesorio gamer para el invierno.",
    tags: ["accesorio", "retro"]
  },
  {
    code: "PP007", nombre: "Taza Gamer RGB", categoriaId: "PP",
    precioCLP: 7990, stock: 50, marca: "Level-Up", rating: 4.5,
    specs: ["Cerámica", "Impresión RGB"],
    descripcion: "Taza colorida para tus mañanas gamer.",
    tags: ["taza", "merch"]
  },
  {
    code: "PP008", nombre: "Poster Retro Arcade", categoriaId: "PP",
    precioCLP: 5990, stock: 60, marca: "Level-Up", rating: 4.4,
    specs: ["50x70 cm", "Impresión HD"],
    descripcion: "Decora tu habitación con estilo arcade.",
    tags: ["decoración", "retro"]
  },
  {
    code: "PP009", nombre: "Mochila Gamer RGB", categoriaId: "PP",
    precioCLP: 34990, stock: 18, marca: "Level-Up", rating: 4.6,
    specs: ["Compartimiento notebook", "Iluminación RGB"],
    descripcion: "Perfecta para transportar tu setup con estilo.",
    tags: ["mochila", "rgb"]
  },
  {
    code: "PP010", nombre: "Llaveros Gamer Pack", categoriaId: "PP",
    precioCLP: 4990, stock: 100, marca: "Level-Up", rating: 4.5,
    specs: ["Pack x3", "Diseños varios"],
    descripcion: "Colección de llaveros gamer para tu día a día.",
    tags: ["llaveros", "merch"]
  }
])

// Categorías disponibles
export const CATEGORIES = {
  JM: "Juegos de Mesa",
  AC: "Accesorios",
  CO: "Consolas",
  CG: "Computadores Gamers",
  SG: "Sillas Gamers",
  MS: "Mouse",
  MP: "Mousepad",
  PP: "Poleras Personalizadas",
  PG: "Polerones Gamers",
  ST: "Servicio Técnico"
}

// Obtener marcas únicas
export const getUniqueBrands = () => {
  const brands = new Set(PRODUCTS_LG.map(product => product.marca))
  return Array.from(brands).sort()
}

// Función para formatear precio en CLP
export const formatPrice = (price) => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP'
  }).format(price)
}