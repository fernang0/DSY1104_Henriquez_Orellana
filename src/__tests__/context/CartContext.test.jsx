import { render, act } from '@testing-library/react';
import { vi } from 'vitest';
import { CartProvider, useCart } from '../../context/CartContext';
import { cartConfig, cartActionTypes, demoProducts } from '../../data/cartData';
import '@testing-library/jest-dom';

// Mock de localStorage
const mockLocalStorage = (() => {
  let store = {};
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    })
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
});

// Componente de prueba
function TestComponent({ children }) {
  const cart = useCart();
  return children(cart);
}

function renderWithCart(children) {
  return render(
    <CartProvider>
      <TestComponent>
        {children}
      </TestComponent>
    </CartProvider>
  );
}

describe('CartContext', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
    vi.clearAllMocks();
  });

  // Pruebas de estado inicial
  describe('estado inicial', () => {
    it('debe inicializar con un carrito vacío', () => {
      let cartState;
      renderWithCart((cart) => {
        cartState = cart;
        return null;
      });

      expect(cartState.items).toHaveLength(0);
      expect(cartState.isEmpty).toBe(true);
      expect(cartState.itemCount).toBe(0);
      expect(cartState.totals.total).toBe(0);
    });

    it('debe cargar items del localStorage si existen', () => {
      const savedItems = [{ ...demoProducts[0], quantity: 1 }];
      mockLocalStorage.getItem.mockReturnValueOnce(JSON.stringify(savedItems));

      let cartState;
      renderWithCart((cart) => {
        cartState = cart;
        return null;
      });

      expect(cartState.items).toHaveLength(1);
      expect(cartState.items[0].code).toBe(demoProducts[0].code);
    });
  });

  // Pruebas de agregar al carrito
  describe('agregar al carrito', () => {
    it('debe agregar un nuevo item correctamente', async () => {
      let cartState;
      renderWithCart((cart) => {
        cartState = cart;
        return null;
      });

      await act(async () => {
        const result = await cartState.addToCart(demoProducts[0], 1);
        expect(result.success).toBe(true);
      });

      expect(cartState.items).toHaveLength(1);
      expect(cartState.items[0].code).toBe(demoProducts[0].code);
      expect(cartState.items[0].quantity).toBe(1);
    });

    it('debe incrementar la cantidad si el item ya existe', async () => {
      let cartState;
      renderWithCart((cart) => {
        cartState = cart;
        return null;
      });

      await act(async () => {
        await cartState.addToCart(demoProducts[0], 1);
      });

      await act(async () => {
        await cartState.addToCart(demoProducts[0], 2);
      });

      expect(cartState.items).toHaveLength(1);
      expect(cartState.items[0].quantity).toBe(3);
    });

    it('debe validar el stock antes de agregar', async () => {
      let cartState;
      renderWithCart((cart) => {
        cartState = cart;
        return null;
      });

      const product = { ...demoProducts[0], stock: 2 };
      await act(async () => {
        const result = await cartState.addToCart(product, 3);
        expect(result.success).toBe(false);
        expect(result.error).toContain('Stock insuficiente');
      });

      expect(cartState.items).toHaveLength(0);
    });
  });

  // Pruebas de eliminar del carrito
  describe('eliminar del carrito', () => {
    it('debe eliminar un item correctamente', async () => {
      let cartState;
      renderWithCart((cart) => {
        cartState = cart;
        return null;
      });

      await act(async () => {
        await cartState.addToCart(demoProducts[0], 1);
      });

      await act(async () => {
        const result = await cartState.removeFromCart(demoProducts[0].code);
        expect(result.success).toBe(true);
      });

      expect(cartState.items).toHaveLength(0);
    });

    it('debe devolver error al intentar eliminar un item inexistente', async () => {
      let cartState;
      renderWithCart((cart) => {
        cartState = cart;
        return null;
      });

      await act(async () => {
        const result = await cartState.removeFromCart('INVALID-CODE');
        expect(result.success).toBe(false);
        expect(result.error).toContain('no encontrado');
      });
    });
  });

  // Pruebas de actualizar cantidad
  describe('actualizar cantidad', () => {
    it('debe actualizar la cantidad correctamente', async () => {
      let cartState;
      renderWithCart((cart) => {
        cartState = cart;
        return null;
      });

      await act(async () => {
        await cartState.addToCart(demoProducts[0], 1);
      });

      await act(async () => {
        const result = await cartState.updateQuantity(demoProducts[0].code, 3);
        expect(result.success).toBe(true);
      });

      expect(cartState.items[0].quantity).toBe(3);
    });

    it('debe validar el stock al actualizar cantidad', async () => {
      let cartState;
      renderWithCart((cart) => {
        cartState = cart;
        return null;
      });

      const product = { ...demoProducts[0], stock: 2 };
      await act(async () => {
        await cartState.addToCart(product, 1);
      });

      await act(async () => {
        const result = await cartState.updateQuantity(product.code, 3);
        expect(result.success).toBe(false);
        expect(result.error).toContain('Stock insuficiente');
      });

      expect(cartState.items[0].quantity).toBe(1);
    });
  });

  // Pruebas de totales y cálculos
  describe('totales y cálculos', () => {
    it('debe calcular subtotal correctamente', async () => {
      let cartState;
      renderWithCart((cart) => {
        cartState = cart;
        return null;
      });

      await act(async () => {
        await cartState.addToCart({ ...demoProducts[0], precioCLP: 1000 }, 2);
      });

      await act(async () => {
        await cartState.addToCart({ ...demoProducts[1], precioCLP: 500 }, 1);
      });

      expect(cartState.totals.subtotal).toBe(2500);
    });

    it('debe calcular IVA correctamente', async () => {
      let cartState;
      renderWithCart((cart) => {
        cartState = cart;
        return null;
      });

      await act(async () => {
        await cartState.addToCart({ ...demoProducts[0], precioCLP: 1000 }, 1);
      });

      const expectedTax = Math.round(1000 * cartConfig.tax.rate);
      expect(cartState.totals.tax).toBe(expectedTax);
    });

    it('debe aplicar envío gratis cuando corresponde', async () => {
      let cartState;
      renderWithCart((cart) => {
        cartState = cart;
        return null;
      });

      await act(async () => {
        await cartState.addToCart({
          ...demoProducts[0],
          precioCLP: cartConfig.shipping.freeShippingThreshold + 1000
        }, 1);
      });

      expect(cartState.totals.shipping).toBe(0);
      expect(cartState.totals.freeShippingReached).toBe(true);
    });
  });

  // Pruebas de persistencia
  describe('persistencia', () => {
    it('debe guardar en localStorage al modificar el carrito', async () => {
      let cartState;
      renderWithCart((cart) => {
        cartState = cart;
        return null;
      });

      await act(async () => {
        await cartState.addToCart(demoProducts[0], 1);
      });

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        cartConfig.storageKey,
        JSON.stringify(cartState.items)
      );
    });

    it('debe limpiar localStorage al vaciar el carrito', async () => {
      let cartState;
      renderWithCart((cart) => {
        cartState = cart;
        return null;
      });

      await act(async () => {
        await cartState.addToCart(demoProducts[0], 1);
      });

      await act(async () => {
        await cartState.clearCart();
      });

      expect(mockLocalStorage.setItem).toHaveBeenLastCalledWith(
        cartConfig.storageKey,
        JSON.stringify([])
      );
    });
  });
});