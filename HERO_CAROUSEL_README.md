# 🎮 HeroCarousel Component

Componente HeroCarousel para React basado en el carousel original de LevelUp Gaming.

## 📁 Estructura creada en `src/`

```
src/
├── components/
│   └── HeroCarousel/
│       ├── HeroCarousel.jsx          # Componente principal
│       ├── HeroCarousel.module.css   # Estilos CSS Modules
│       └── index.js                  # Export del componente
├── hooks/
│   └── useCarousel.js                # Hook personalizado para lógica
├── data/
│   └── carouselData.js               # Datos y configuración
└── pages/
    └── Home.jsx                      # Integrado en la página Home
```

## 🎯 Características Implementadas

### ✅ **Funcionalidad Completa del Original**
- **Auto-play**: 5 segundos por slide
- **Navegación manual**: Botones anterior/siguiente
- **Indicadores**: Dots clickeables  
- **Navegación por teclado**: ArrowLeft, ArrowRight, Spacebar
- **Soporte táctil**: Swipe gestures en móviles
- **Drag en desktop**: Mouse drag support
- **Pausa en hover**: Auto-pausa al pasar el mouse

### ✅ **4 Slides Gaming Originales**
1. **Slide 1**: "Tu siguiente partida comienza aquí"
2. **Slide 2**: "Potencia tu experiencia gaming"  
3. **Slide 3**: "Equípate como un pro"
4. **Slide 4**: "Diversión sin límites"

### ✅ **Tecnologías Integradas**
- **React 19** con hooks modernos
- **CSS Modules** para estilos encapsulados
- **Bootstrap 5** para responsive design
- **React Router** para navegación
- **Vite** compatible

## 🚀 Uso del Componente

```jsx
import HeroCarousel from '../components/HeroCarousel';

function HomePage() {
  return (
    <div>
      <HeroCarousel />
      {/* Resto del contenido */}
    </div>
  );
}
```

## ⚙️ Configuración

### Modificar slides en `src/data/carouselData.js`:

```javascript
export const carouselSlides = [
  {
    id: 1,
    image: 'images/hero-1.jpg',
    title: 'Título del slide',
    description: 'Descripción del slide',
    buttonText: 'Texto del botón',
    buttonLink: './ruta-destino.html',
    gradient: 'linear-gradient(...)'
  }
  // ... más slides
];
```

### Configurar comportamiento:

```javascript
export const carouselConfig = {
  autoPlayDelay: 5000,      // Tiempo entre slides
  transitionDuration: 800,  // Duración transición
  swipeThreshold: 50,       // Distancia mínima swipe
  enableAutoPlay: true,     // Auto-play on/off
  enableKeyboard: true,     // Navegación teclado
  enableTouch: true,        // Gestos táctiles
  pauseOnHover: true        // Pausa en hover
};
```

## 🎨 Personalización de Estilos

Los estilos están en `HeroCarousel.module.css` usando CSS Modules. Variables CSS disponibles:

```css
.heroCarousel {
  --primary: #00d4ff;           /* Color primario */
  --accent-green: #39ff14;      /* Color acento */
  --background: #0a0a0a;        /* Fondo */
  --font-heading: 'Orbitron';   /* Fuente títulos */
  --font-body: 'Roboto';        /* Fuente texto */
}
```

## 📱 Responsive Design

- **Desktop**: Altura 70vh, controles completos
- **Tablet**: Altura 60vh, botones adaptados
- **Mobile**: Altura 50vh, layout optimizado

## 🎮 Controles Disponibles

- **Botones**: ← → navegación
- **Dots**: Indicadores clickeables
- **Teclado**: 
  - `←` Slide anterior
  - `→` Slide siguiente  
  - `Espacio` Play/Pause
- **Touch**: Swipe left/right
- **Mouse**: Drag gestures

## 🖼️ Imágenes Requeridas

Coloca las imágenes en `public/images/`:
- `hero-1.jpg` (1920x1080 recomendado)
- `hero-2.jpg` (1920x1080 recomendado)
- `hero-3.jpg` (1920x1080 recomendado)
- `hero-4.jpg` (1920x1080 recomendado)

## 🔧 Hook useCarousel

El hook `useCarousel` maneja toda la lógica:

```javascript
const {
  currentSlide,     // Slide actual
  isPlaying,        // Estado auto-play
  nextSlide,        // Ir al siguiente
  prevSlide,        // Ir al anterior
  goToSlide,        // Ir a slide específico
  toggleAutoPlay,   // Toggle play/pause
  carouselHandlers  // Event handlers
} = useCarousel(totalSlides);
```

## ✨ Efectos y Animaciones

- **Transiciones suaves**: opacity con cubic-bezier
- **Efectos gaming**: Gradient text, glow effects
- **Hover effects**: Scale y shadow en botones
- **Loading animations**: Smooth slide transitions

---

**🎮 Gaming-ready carousel para React + Vite + Bootstrap!**