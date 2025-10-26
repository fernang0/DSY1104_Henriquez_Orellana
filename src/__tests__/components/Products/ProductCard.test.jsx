import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProductCard from '../../../components/Products/ProductCard';
import '@testing-library/jest-dom';

// Mock de producto para pruebas
const mockProduct = {
  code: 'PROD001',
  nombre: 'Teclado Mecánico RGB',
  descripcion: 'Teclado gaming con switches Cherry MX',
  precioCLP: 89990,
  stock: 15,
  rating: 4.5,
  imagen: 'https://example.com/teclado.jpg',
  marca: 'Razer',
  categoriaId: 1,
  specs: ['RGB', 'Mecánico', 'USB'],
  tags: ['Gaming', 'Periféricos']
};

// Mock de producto sin stock
const mockProductNoStock = {
  ...mockProduct,
  stock: 0
};

// Mock de producto con stock bajo
const mockProductLowStock = {
  ...mockProduct,
  stock: 5
};

// Helper para renderizar el componente
const renderProductCard = (product = mockProduct) => {
  return render(
    <BrowserRouter>
      <ProductCard product={product} />
    </BrowserRouter>
  );
};

describe('ProductCard', () => {
  // Pruebas de renderizado
  describe('renderizado inicial', () => {
    it('debe renderizar la información básica del producto', () => {
      renderProductCard();
      
      expect(screen.getByText(mockProduct.nombre)).toBeInTheDocument();
      expect(screen.getByText(mockProduct.descripcion)).toBeInTheDocument();
      expect(screen.getByText(/\$89.990/)).toBeInTheDocument();
      expect(screen.getByText(mockProduct.code)).toBeInTheDocument();
      expect(screen.getByAltText(mockProduct.nombre)).toBeInTheDocument();
    });

    it('debe mostrar las especificaciones y tags', () => {
      renderProductCard();
      
      mockProduct.specs.forEach(spec => {
        expect(screen.getByText(spec)).toBeInTheDocument();
      });
    });

    it('debe mostrar el rating correcto', () => {
      renderProductCard();
      
      const ratingText = screen.getByText(/4.5/);
      expect(ratingText).toBeInTheDocument();
      expect(ratingText.textContent).toMatch(/⭐⭐⭐⭐½/);
    });
  });

  // Pruebas de estado del stock
  describe('estado del stock', () => {
    it('debe mostrar botón deshabilitado cuando no hay stock', () => {
      renderProductCard(mockProductNoStock);
      
      const button = screen.getByText('Sin Stock');
      expect(button).toBeDisabled();
    });

    it('debe mostrar advertencia de stock bajo', () => {
      renderProductCard(mockProductLowStock);
      
      expect(screen.getByText('¡Últimas unidades!')).toBeInTheDocument();
      expect(screen.getByText('Stock: 5')).toBeInTheDocument();
    });

    it('debe mostrar stock normal sin advertencias', () => {
      renderProductCard();
      
      expect(screen.queryByText('¡Últimas unidades!')).not.toBeInTheDocument();
      expect(screen.getByText('Stock: 15')).toBeInTheDocument();
    });
  });

  // Pruebas de interacción
  describe('interacciones', () => {
    it('debe permitir agregar al carrito si hay stock', () => {
      renderProductCard();
      
      const addButton = screen.getByText('Agregar al carrito');
      expect(addButton).toBeEnabled();
    });

    it('debe tener enlace a detalles del producto', () => {
      renderProductCard();
      
      const detailsButton = screen.getByText('Ver Detalles');
      expect(detailsButton).toHaveAttribute('href', `/productos/${mockProduct.code}`);
    });
  });

  // Pruebas de manejo de errores
  describe('manejo de errores', () => {
    it('debe cargar imagen por defecto si falla la carga', () => {
      renderProductCard();
      
      const img = screen.getByAltText(mockProduct.nombre);
      fireEvent.error(img);
      
      expect(img.src).toContain('default.jpg');
    });
  });
});