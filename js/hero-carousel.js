// ===== HERO CAROUSEL CONTROLLER =====
class HeroCarousel {
    constructor() {
        this.currentSlide = 0;
        this.totalSlides = 4;
        this.isPlaying = true;
        this.interval = null;
        this.autoPlayDelay = 5000; // 5 segundos
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.showSlide(0);
        this.startAutoPlay();
        console.log('🎮 Hero Carousel initialized');
    }

    bindEvents() {
        // Navegación con botones prev/next
        const prevBtn = document.querySelector('.carousel-btn-prev');
        const nextBtn = document.querySelector('.carousel-btn-next');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.prevSlide());
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextSlide());
        }

        // Navegación con dots
        const dots = document.querySelectorAll('.carousel-dot');
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });

        // Pausar auto-play al hover
        const carousel = document.querySelector('.hero-carousel');
        if (carousel) {
            carousel.addEventListener('mouseenter', () => this.pauseAutoPlay());
            carousel.addEventListener('mouseleave', () => this.startAutoPlay());
        }

        // Navegación con teclado
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.prevSlide();
            } else if (e.key === 'ArrowRight') {
                this.nextSlide();
            } else if (e.key === ' ') {
                e.preventDefault();
                this.toggleAutoPlay();
            }
        });

        // Touch/swipe support para móviles
        this.addTouchSupport();
    }

    showSlide(index) {
        const slides = document.querySelectorAll('.carousel-slide');
        const dots = document.querySelectorAll('.carousel-dot');
        
        if (!slides.length) return;

        // Normalizar el índice
        if (index >= this.totalSlides) {
            this.currentSlide = 0;
        } else if (index < 0) {
            this.currentSlide = this.totalSlides - 1;
        } else {
            this.currentSlide = index;
        }

        // Actualizar slides - remover active de todos y agregar al actual
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            if (i === this.currentSlide) {
                slide.classList.add('active');
            }
        });

        // Actualizar dots
        dots.forEach((dot, i) => {
            dot.classList.remove('active');
            if (i === this.currentSlide) {
                dot.classList.add('active');
            }
        });

        console.log(`🖼️ Showing slide ${this.currentSlide + 1} of ${this.totalSlides}`);
    }

    nextSlide() {
        this.showSlide(this.currentSlide + 1);
    }

    prevSlide() {
        this.showSlide(this.currentSlide - 1);
    }

    goToSlide(index) {
        this.showSlide(index);
    }

    startAutoPlay() {
        if (!this.isPlaying) return;
        
        this.stopAutoPlay(); // Limpiar interval existente
        this.interval = setInterval(() => {
            this.nextSlide();
        }, this.autoPlayDelay);
        
        console.log('▶️ Carousel auto-play started');
    }

    stopAutoPlay() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    pauseAutoPlay() {
        this.stopAutoPlay();
        console.log('⏸️ Carousel auto-play paused');
    }

    toggleAutoPlay() {
        this.isPlaying = !this.isPlaying;
        if (this.isPlaying) {
            this.startAutoPlay();
        } else {
            this.pauseAutoPlay();
        }
    }

    addTouchSupport() {
        const carousel = document.querySelector('.hero-carousel');
        if (!carousel) return;

        let startX = 0;
        let endX = 0;
        const minSwipeDistance = 50;

        carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        }, { passive: true });

        carousel.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            this.handleSwipe(startX, endX, minSwipeDistance);
        }, { passive: true });

        // Mouse support para desktop
        let isMouseDown = false;
        
        carousel.addEventListener('mousedown', (e) => {
            isMouseDown = true;
            startX = e.clientX;
            carousel.style.cursor = 'grabbing';
        });

        carousel.addEventListener('mousemove', (e) => {
            if (!isMouseDown) return;
            e.preventDefault();
        });

        carousel.addEventListener('mouseup', (e) => {
            if (!isMouseDown) return;
            isMouseDown = false;
            endX = e.clientX;
            carousel.style.cursor = 'grab';
            this.handleSwipe(startX, endX, minSwipeDistance);
        });

        carousel.addEventListener('mouseleave', () => {
            isMouseDown = false;
            carousel.style.cursor = 'grab';
        });
    }

    handleSwipe(startX, endX, minDistance) {
        const distance = Math.abs(startX - endX);
        
        if (distance < minDistance) return;

        if (startX > endX) {
            // Swipe left - next slide
            this.nextSlide();
        } else {
            // Swipe right - previous slide
            this.prevSlide();
        }
    }

    // Método público para controlar desde fuera
    destroy() {
        this.stopAutoPlay();
        console.log('🗑️ Hero Carousel destroyed');
    }
}

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', () => {
    // Solo inicializar si estamos en una página con carousel
    const carouselElement = document.querySelector('.hero-carousel');
    if (carouselElement) {
        window.heroCarousel = new HeroCarousel();
    }
});

// ===== EXPORTAR PARA USO GLOBAL =====
window.HeroCarousel = HeroCarousel;
