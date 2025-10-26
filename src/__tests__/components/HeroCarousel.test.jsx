import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import HeroCarousel from '../../components/HeroCarousel/HeroCarousel';
import { carouselSlides } from '../../data/carouselData';
import '@testing-library/jest-dom';

// Mock functions
const mockNextSlide = vi.fn();
const mockPrevSlide = vi.fn();
const mockGoToSlide = vi.fn();
const mockHandlers = {
  onMouseEnter: vi.fn(),
  onMouseLeave: vi.fn(),
  onTouchStart: vi.fn(),
  onTouchEnd: vi.fn(),
  onMouseDown: vi.fn(),
};

// Mock del hook useCarousel
vi.mock('../../hooks/useCarousel', () => ({
  useCarousel: () => ({
    currentSlide: 0,
    nextSlide: mockNextSlide,
    prevSlide: mockPrevSlide,
    goToSlide: mockGoToSlide,
    carouselHandlers: mockHandlers
  })
}));

describe('HeroCarousel', () => {
  // Pruebas de renderizado inicial
  describe('renderizado inicial', () => {
    it('debe renderizar todos los slides', () => {
      const { container } = render(<HeroCarousel />);
      const slides = container.getElementsByClassName('_carouselSlide_ea6bc2');
      expect(slides).toHaveLength(carouselSlides.length);
    });

    it('debe renderizar el título y descripción del primer slide', () => {
      render(<HeroCarousel />);
      const firstSlide = carouselSlides[0];
      expect(screen.getByText(firstSlide.title)).toBeInTheDocument();
      expect(screen.getByText(firstSlide.description)).toBeInTheDocument();
    });

    it('debe renderizar el botón de acción con el enlace correcto', () => {
      render(<HeroCarousel />);
      const firstSlide = carouselSlides[0];
      const button = screen.getByText(firstSlide.buttonText);
      expect(button).toBeInTheDocument();
      expect(button.getAttribute('href')).toBe(firstSlide.buttonLink);
    });

    it('debe renderizar los botones de navegación', () => {
      render(<HeroCarousel />);
      expect(screen.getByLabelText('Slide anterior')).toBeInTheDocument();
      expect(screen.getByLabelText('Slide siguiente')).toBeInTheDocument();
    });

    it('debe renderizar los indicadores (dots)', () => {
      render(<HeroCarousel />);
      const dots = screen.getAllByRole('button', { name: /Ir al slide/ });
      expect(dots).toHaveLength(carouselSlides.length);
    });
  });

  // Pruebas de navegación
  describe('navegación', () => {
    it('debe llamar a nextSlide al hacer clic en el botón siguiente', () => {
      const { getByLabelText } = render(<HeroCarousel />);
      const nextButton = getByLabelText('Slide siguiente');
      fireEvent.click(nextButton);
      expect(mockNextSlide).toHaveBeenCalled();
    });

    it('debe llamar a prevSlide al hacer clic en el botón anterior', () => {
      const { getByLabelText } = render(<HeroCarousel />);
      const prevButton = getByLabelText('Slide anterior');
      fireEvent.click(prevButton);
      expect(mockPrevSlide).toHaveBeenCalled();
    });

    it('debe llamar a goToSlide al hacer clic en un dot', () => {
      const { getAllByRole } = render(<HeroCarousel />);
      const dots = getAllByRole('button', { name: /Ir al slide/ });
      fireEvent.click(dots[1]); // Click en el segundo dot
      expect(mockGoToSlide).toHaveBeenCalledWith(1);
    });
  });

  // Pruebas de interacción del usuario
  describe('interacciones del usuario', () => {
    it('debe registrar eventos touch', () => {
      const { container } = render(<HeroCarousel />);
      const carousel = container.firstChild;

      fireEvent.touchStart(carousel);
      expect(mockHandlers.onTouchStart).toHaveBeenCalled();

      fireEvent.touchEnd(carousel);
      expect(mockHandlers.onTouchEnd).toHaveBeenCalled();
    });

    it('debe registrar eventos del mouse', () => {
      const { container } = render(<HeroCarousel />);
      const carousel = container.firstChild;

      fireEvent.mouseEnter(carousel);
      expect(mockHandlers.onMouseEnter).toHaveBeenCalled();

      fireEvent.mouseLeave(carousel);
      expect(mockHandlers.onMouseLeave).toHaveBeenCalled();

      fireEvent.mouseDown(carousel);
      expect(mockHandlers.onMouseDown).toHaveBeenCalled();
    });
  });

  // Pruebas de clases activas
  describe('clases activas', () => {
    it('debe aplicar la clase active al slide actual', () => {
      const { container } = render(<HeroCarousel />);
      const activeSlide = container.querySelector('._active_ea6bc2');
      expect(activeSlide).toBeInTheDocument();
    });

    it('debe aplicar la clase active al dot correspondiente', () => {
      const { getAllByRole } = render(<HeroCarousel />);
      const dots = getAllByRole('button', { name: /Ir al slide/ });
      expect(dots[0]).toHaveClass('_active_ea6bc2');
    });
  });
});