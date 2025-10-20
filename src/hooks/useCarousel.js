import { useState, useEffect, useCallback, useRef } from 'react';
import { carouselConfig } from '../data/carouselData';

/**
 * Hook personalizado para manejar toda la lógica del Hero Carousel
 * Basado en la funcionalidad del carousel original de LevelUp
 */
export const useCarousel = (totalSlides) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(carouselConfig.enableAutoPlay);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef(null);
  const touchStartRef = useRef(0);
  const touchEndRef = useRef(0);

  // Navegar al siguiente slide (equivalente a nextSlide del original)
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  // Navegar al slide anterior (equivalente a prevSlide del original)
  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  // Ir a un slide específico (equivalente a goToSlide del original)
  const goToSlide = useCallback((index) => {
    if (index >= 0 && index < totalSlides) {
      setCurrentSlide(index);
    }
  }, [totalSlides]);

  // Iniciar auto-play (equivalente a startAutoPlay del original)
  const startAutoPlay = useCallback(() => {
    if (!carouselConfig.enableAutoPlay || isHovered) return;
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    intervalRef.current = setInterval(() => {
      nextSlide();
    }, carouselConfig.autoPlayDelay);
  }, [nextSlide, isHovered]);

  // Pausar auto-play (equivalente a pauseAutoPlay del original)
  const pauseAutoPlay = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Toggle auto-play (equivalente a toggleAutoPlay del original)
  const toggleAutoPlay = useCallback(() => {
    setIsPlaying((prev) => {
      const newState = !prev;
      if (newState) {
        startAutoPlay();
      } else {
        pauseAutoPlay();
      }
      return newState;
    });
  }, [startAutoPlay, pauseAutoPlay]);

  // Manejar hover (del comportamiento original)
  const handleMouseEnter = useCallback(() => {
    if (carouselConfig.pauseOnHover) {
      setIsHovered(true);
      pauseAutoPlay();
    }
  }, [pauseAutoPlay]);

  const handleMouseLeave = useCallback(() => {
    if (carouselConfig.pauseOnHover) {
      setIsHovered(false);
      if (isPlaying) {
        startAutoPlay();
      }
    }
  }, [startAutoPlay, isPlaying]);

  // Navegación por teclado (del original: ArrowLeft, ArrowRight, Space)
  const handleKeyDown = useCallback((e) => {
    if (!carouselConfig.enableKeyboard) return;
    
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        prevSlide();
        break;
      case 'ArrowRight':
        e.preventDefault();
        nextSlide();
        break;
      case ' ':
        e.preventDefault();
        toggleAutoPlay();
        break;
      default:
        break;
    }
  }, [prevSlide, nextSlide, toggleAutoPlay]);

  // Touch/swipe support (del addTouchSupport original)
  const handleTouchStart = useCallback((e) => {
    if (!carouselConfig.enableTouch) return;
    touchStartRef.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback((e) => {
    if (!carouselConfig.enableTouch) return;
    touchEndRef.current = e.changedTouches[0].clientX;
    handleSwipe();
  }, []);

  // Lógica de swipe (del handleSwipe original)
  const handleSwipe = useCallback(() => {
    const distance = touchStartRef.current - touchEndRef.current;
    const isSignificantSwipe = Math.abs(distance) > carouselConfig.swipeThreshold;

    if (isSignificantSwipe) {
      if (distance > 0) {
        // Swipe left - next slide
        nextSlide();
      } else {
        // Swipe right - previous slide
        prevSlide();
      }
    }
  }, [nextSlide, prevSlide]);

  // Mouse drag para desktop (del original)
  const handleMouseDown = useCallback((e) => {
    touchStartRef.current = e.clientX;
    document.addEventListener('mouseup', handleMouseUp);
  }, []);

  const handleMouseUp = useCallback((e) => {
    touchEndRef.current = e.clientX;
    handleSwipe();
    document.removeEventListener('mouseup', handleMouseUp);
  }, [handleSwipe]);

  // Effect para auto-play (basado en el startAutoPlay original)
  useEffect(() => {
    if (isPlaying && !isHovered) {
      startAutoPlay();
    } else {
      pauseAutoPlay();
    }

    return () => pauseAutoPlay();
  }, [isPlaying, isHovered, startAutoPlay, pauseAutoPlay]);

  // Effect para eventos de teclado globales (del original)
  useEffect(() => {
    if (carouselConfig.enableKeyboard) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [handleKeyDown]);

  // Cleanup al desmontar (del destroy original)
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Retorna todas las funciones y estados necesarios
  return {
    currentSlide,
    isPlaying,
    nextSlide,
    prevSlide,
    goToSlide,
    toggleAutoPlay,
    handleMouseEnter,
    handleMouseLeave,
    handleTouchStart,
    handleTouchEnd,
    handleMouseDown,
    // Handlers agrupados para facilitar el uso
    carouselHandlers: {
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      onTouchStart: handleTouchStart,
      onTouchEnd: handleTouchEnd,
      onMouseDown: handleMouseDown,
    }
  };
};