// Datos del Hero Carousel basados en el original de LevelUp
export const carouselSlides = [
  {
    id: 1,
    image: 'images/hero-1.jpg',
    title: 'Tu siguiente partida comienza aquí',
    description: 'Descubre los últimos videojuegos, consolas y accesorios gaming',
    buttonText: 'Explorar Catálogo',
    buttonLink: './productos.html?cat=JM',
    gradient: 'linear-gradient(135deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.3) 50%, rgba(0, 212, 255, 0.1) 100%)'
  },
  {
    id: 2,
    image: 'images/hero-2.jpg',
    title: 'Potencia tu experiencia gaming',
    description: 'Las mejores consolas y accesorios para llevar tu juego al siguiente nivel',
    buttonText: 'Ver Consolas',
    buttonLink: './productos.html?cat=CO',
    gradient: 'linear-gradient(135deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.3) 50%, rgba(57, 255, 20, 0.1) 100%)'
  },
  {
    id: 3,
    image: 'images/hero-3.jpg',
    title: 'Equípate como un pro',
    description: 'Accesorios gaming de alta calidad para maximizar tu rendimiento',
    buttonText: 'Ver Accesorios',
    buttonLink: './productos.html?cat=AC',
    gradient: 'linear-gradient(135deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.3) 50%, rgba(255, 0, 150, 0.1) 100%)'
  },
  {
    id: 4,
    image: 'images/hero-4.jpg',
    title: 'Diversión sin límites',
    description: 'Juegos de mesa y entretenimiento para toda la familia',
    buttonText: 'Ver Juegos',
    buttonLink: './productos.html?cat=JM',
    gradient: 'linear-gradient(135deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.3) 50%, rgba(255, 165, 0, 0.1) 100%)'
  }
];

// Configuración del carousel (basada en el JS original)
export const carouselConfig = {
  autoPlayDelay: 7000, // 7 segundos
  transitionDuration: 800, // 0.8 segundos 
  swipeThreshold: 50, // 50px mínimo para swipe
  enableAutoPlay: true,
  enableKeyboard: true,
  enableTouch: true,
  pauseOnHover: true
};

// Categorías para navegación (del original)
export const categories = {
  JM: 'juegos',
  CO: 'consolas', 
  AC: 'accesorios'
};