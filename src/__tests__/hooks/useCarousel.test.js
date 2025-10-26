import { renderHook, act } from '@testing-library/react';
import { useCarousel } from '../../hooks/useCarousel';
import { carouselConfig } from '../../data/carouselData';
import { vi } from 'vitest';

describe('useCarousel', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // Pruebas de navegación básica
  describe('navegación básica', () => {
    it('debe inicializar en el primer slide', () => {
      const { result } = renderHook(() => useCarousel(4));
      expect(result.current.currentSlide).toBe(0);
    });

    it('debe avanzar al siguiente slide correctamente', () => {
      const { result } = renderHook(() => useCarousel(4));
      act(() => {
        result.current.nextSlide();
      });
      expect(result.current.currentSlide).toBe(1);
    });

    it('debe volver al primer slide después del último', () => {
      const { result } = renderHook(() => useCarousel(4));
      act(() => {
        result.current.goToSlide(3);
        result.current.nextSlide();
      });
      expect(result.current.currentSlide).toBe(0);
    });

    it('debe retroceder al slide anterior correctamente', () => {
      const { result } = renderHook(() => useCarousel(4));
      act(() => {
        result.current.goToSlide(1);
        result.current.prevSlide();
      });
      expect(result.current.currentSlide).toBe(0);
    });

    it('debe ir al último slide cuando retrocede desde el primero', () => {
      const { result } = renderHook(() => useCarousel(4));
      act(() => {
        result.current.prevSlide();
      });
      expect(result.current.currentSlide).toBe(3);
    });
  });

  // Pruebas de autoplay
  describe('autoplay', () => {
    it('debe iniciar con autoplay si está habilitado en la configuración', () => {
      const { result } = renderHook(() => useCarousel(4));
      expect(result.current.isPlaying).toBe(carouselConfig.enableAutoPlay);
    });

    it('debe avanzar automáticamente cuando autoplay está activo', () => {
      const { result } = renderHook(() => useCarousel(4));
      act(() => {
        vi.advanceTimersByTime(carouselConfig.autoPlayDelay);
      });
      expect(result.current.currentSlide).toBe(1);
    });

    it('debe pausar y reanudar el autoplay correctamente', () => {
      const { result } = renderHook(() => useCarousel(4));
      
      act(() => {
        result.current.toggleAutoPlay(); // Pausa
      });
      expect(result.current.isPlaying).toBe(false);
      
      const currentSlide = result.current.currentSlide;
      act(() => {
        vi.advanceTimersByTime(carouselConfig.autoPlayDelay);
      });
      expect(result.current.currentSlide).toBe(currentSlide); // No debería cambiar
      
      act(() => {
        result.current.toggleAutoPlay(); // Reanuda
      });
      expect(result.current.isPlaying).toBe(true);
    });
  });

  // Pruebas de interacción del usuario
  describe('interacciones del usuario', () => {
    it('debe pausar en hover si pauseOnHover está habilitado', () => {
      const { result } = renderHook(() => useCarousel(4));
      const initialSlide = result.current.currentSlide;
      
      act(() => {
        result.current.handleMouseEnter();
        vi.advanceTimersByTime(carouselConfig.autoPlayDelay);
      });
      
      expect(result.current.currentSlide).toBe(initialSlide);
    });

    it('debe reanudar después de quitar el hover', () => {
      const { result } = renderHook(() => useCarousel(4));
      
      act(() => {
        result.current.handleMouseEnter();
        vi.advanceTimersByTime(carouselConfig.autoPlayDelay);
        result.current.handleMouseLeave();
        vi.advanceTimersByTime(carouselConfig.autoPlayDelay);
      });
      
      expect(result.current.currentSlide).toBe(1);
    });

    it('debe responder a las teclas de navegación', () => {
      const { result } = renderHook(() => useCarousel(4));
      
      // Simula presionar la tecla derecha
      act(() => {
        const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
        document.dispatchEvent(event);
      });
      expect(result.current.currentSlide).toBe(1);
      
      // Simula presionar la tecla izquierda
      act(() => {
        const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
        document.dispatchEvent(event);
      });
      expect(result.current.currentSlide).toBe(0);
    });

    it('debe manejar gestos touch correctamente', () => {
      const { result } = renderHook(() => useCarousel(4));
      
      // Simula swipe hacia la izquierda
      act(() => {
        result.current.handleTouchStart({ touches: [{ clientX: 200 }] });
        result.current.handleTouchEnd({ changedTouches: [{ clientX: 100 }] });
      });
      expect(result.current.currentSlide).toBe(1);
      
      // Simula swipe hacia la derecha
      act(() => {
        result.current.handleTouchStart({ touches: [{ clientX: 100 }] });
        result.current.handleTouchEnd({ changedTouches: [{ clientX: 200 }] });
      });
      expect(result.current.currentSlide).toBe(0);
    });
  });

  // Pruebas de limpieza
  describe('limpieza', () => {
    it('debe limpiar el intervalo al desmontar', () => {
      const { unmount } = renderHook(() => useCarousel(4));
      const clearIntervalSpy = vi.spyOn(window, 'clearInterval');
      
      unmount();
      expect(clearIntervalSpy).toHaveBeenCalled();
    });

    it('debe limpiar los event listeners al desmontar', () => {
      const { unmount } = renderHook(() => useCarousel(4));
      const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');
      
      unmount();
      expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
    });
  });
});