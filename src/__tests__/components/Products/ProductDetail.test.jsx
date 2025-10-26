import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter, useParams, useNavigate } from 'react-router-dom';
import ProductDetail from '../../../pages/ProductDetail';
import { PRODUCTS_LG } from '../../../data/products';
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock de react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: vi.fn(),
    useNavigate: vi.fn()
  };
});

// Mock del producto para pruebas
const mockProduct = PRODUCTS_LG[0];
const mockNavigate = vi.fn();

// Configuración inicial para cada prueba
beforeEach(() => {
  useParams.mockReturnValue({ productId: mockProduct.code });
  useNavigate.mockReturnValue(mockNavigate);
});

// Helper para renderizar el componente
const renderProductDetail = () => {
  return render(
    <BrowserRouter>
      <ProductDetail />
    </BrowserRouter>
  );
};

describe('ProductDetail', () => {
  // Pruebas de renderizado
  describe('renderizado del producto', () => {
    it('debe mostrar los detalles del producto', () => {
      renderProductDetail();

      expect(screen.getByText(mockProduct.nombre)).toBeInTheDocument();
      expect(screen.getByText(mockProduct.code)).toBeInTheDocument();
      expect(screen.getByText(mockProduct.descripcion)).toBeInTheDocument();
      expect(screen.getByAltText(mockProduct.nombre)).toBeInTheDocument();
    });

    it('debe mostrar especificaciones y tags', () => {
      renderProductDetail();

      expect(screen.getByText('Especificaciones')).toBeInTheDocument();
      mockProduct.specs.forEach(spec => {
        expect(screen.getByText(spec)).toBeInTheDocument();
      });

      mockProduct.tags.forEach(tag => {
        expect(screen.getByText(tag)).toBeInTheDocument();
      });
    });

    it('debe mostrar información de precio y stock', () => {
      renderProductDetail();

      expect(screen.getByText(new RegExp(`${mockProduct.stock} unidades disponibles`))).toBeInTheDocument();
      expect(screen.getByText(new RegExp(`\\$${mockProduct.precioCLP.toLocaleString('es-CL')}`))).toBeInTheDocument();
    });
  });

  // Pruebas de producto no encontrado
  describe('producto no encontrado', () => {
    it('debe mostrar mensaje de error y botón de volver', () => {
      useParams.mockReturnValue({ productId: 'INVALID-ID' });
      renderProductDetail();

      expect(screen.getByText('Producto no encontrado')).toBeInTheDocument();
      const backButton = screen.getByText(/volver a productos/i);
      expect(backButton).toBeInTheDocument();

      fireEvent.click(backButton);
      expect(mockNavigate).toHaveBeenCalledWith('/productos');
    });
  });

  // Pruebas de interacción
  describe('interacciones', () => {
    it('debe permitir ajustar la cantidad', () => {
      renderProductDetail();

      const decreaseButton = screen.getByText('-');
      const increaseButton = screen.getByText('+');
      const quantity = screen.getByText('1');

      // Aumentar cantidad
      fireEvent.click(increaseButton);
      expect(screen.getByText('2')).toBeInTheDocument();

      // Disminuir cantidad
      fireEvent.click(decreaseButton);
      expect(screen.getByText('1')).toBeInTheDocument();

      // No permitir cantidad menor a 1
      fireEvent.click(decreaseButton);
      expect(screen.getByText('1')).toBeInTheDocument();
    });

    it('debe deshabilitar controles cuando no hay stock', () => {
      const noStockProduct = { ...mockProduct, stock: 0 };
      PRODUCTS_LG[0] = noStockProduct;
      renderProductDetail();

      expect(screen.getByText('Sin Stock')).toBeInTheDocument();
      expect(screen.getByText('-')).toBeDisabled();
      expect(screen.getByText('+')).toBeDisabled();
      expect(screen.getByText('Sin Stock')).toBeDisabled();
    });

    it('debe permitir volver a la lista de productos', () => {
      renderProductDetail();

      const backButton = screen.getByText('← Volver a Productos');
      fireEvent.click(backButton);
      expect(mockNavigate).toHaveBeenCalledWith('/productos');
    });
  });

  // Pruebas de manejo de errores
  describe('manejo de errores', () => {
    it('debe cargar imagen por defecto si falla la carga', () => {
      renderProductDetail();
      
      const img = screen.getByAltText(mockProduct.nombre);
      fireEvent.error(img);
      
      expect(img.src).toContain('default.jpg');
    });
  });
});