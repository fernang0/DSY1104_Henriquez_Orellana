import React, { createContext, useContext, useState } from 'react';
import { useCarrito } from '../hooks/useCarrito';

const CartContext = createContext();

/**
 * Provider del carrito
 * Backend estructura real:
 * {
 *   id, usuarioId, fechaCreacion, estado,
 *   items: [], total, totalItems
 * }
 */
export function CartProvider({ children }) {
  const hook = useCarrito();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { carrito, loading, error } = hook;

  // Valores del backend
  const isEmpty = !carrito || !carrito.items || carrito.items.length === 0;
  const itemCount = carrito?.totalItems || 0;
  const total = carrito?.total || 0;

  const toggleSidebar = (open) => {
    setSidebarOpen(open !== undefined ? open : !sidebarOpen);
  };

  const value = {
    carrito,
    items: carrito?.items || [],
    loading,
    error,
    isEmpty,
    itemCount,
    total,
    sidebarOpen,
    agregarItem: hook.agregarItem,
    actualizarItem: hook.actualizarItem,
    eliminarItem: hook.eliminarItem,
    vaciarCarrito: hook.vaciarCarrito,
    fetchCarrito: hook.fetchCarrito,
    toggleSidebar
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe estar dentro de CartProvider');
  }
  return context;
}