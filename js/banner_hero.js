// script.js
const heroImage = document.getElementById('hero-image');
const changeImageBtn = document.getElementById('change-image-btn');
let currentImage = 1;

const images = [
  'imagen1.jpg', // Reemplaza con tus rutas de imagen
  'imagen2.jpg',
  'imagen3.jpg'
];

changeImageBtn.addEventListener('click', () => {
  // Ocultar la imagen actual con fade-out
  heroImage.style.opacity = 0;

  // Esperar a que la transición termine antes de cambiar la imagen
  setTimeout(() => {
    currentImage = (currentImage % images.length) + 1;
    heroImage.src = images[currentImage - 1]; // Ajustar el índice para array
    heroImage.style.opacity = 1; // Mostrar la nueva imagen con fade-in
  }, 500); // Coincidir con la duración de la transición CSS
});