import React, { useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import CartItem from './CartItem';
import CartSummary from './CartSummary';
import CartEmpty from './CartEmpty';
import { cartConfig } from '../../data/cartData';
import styles from './Cart.module.css';

/**
 * Componente CartSidebar - Carrito lateral deslizante
 * Basado en el carrito lateral original de LevelUp
 */
const CartSidebar = () => {
  const {
    sidebarOpen,
    toggleSidebar,
    items,
    isEmpty,
    loading,
    error,
    vaciarCarrito,
    itemCount,
    total
  } = useCart();

  const freeShippingThreshold = 50000;
  const freeShippingRemaining = Math.max(0, freeShippingThreshold - total);
  const freeShippingReached = total >= freeShippingThreshold;

  // Cerrar con tecla Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && sidebarOpen) {
        toggleSidebar(false);
      }
    };

    if (sidebarOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden'; // Prevenir scroll del body
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [sidebarOpen, toggleSidebar]);

  // Manejar clic en overlay
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      toggleSidebar(false);
    }
  };

  // Manejar confirmación de vaciar carrito
  const handleClearCart = async () => {
    if (window.confirm(cartConfig.messages.clearConfirm)) {
      try {
        await vaciarCarrito();
        console.log('✅ Carrito vaciado');
      } catch (error) {
        console.error('Error:', error);
        alert('Error al vaciar carrito');
      }
    }
  };

  // No renderizar si el sidebar no está abierto
  if (!sidebarOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className={styles.cartOverlay} 
        onClick={handleOverlayClick}
        aria-hidden="true"
      />
      
      {/* Sidebar */}
      <aside 
        className={`${styles.cartSidebar} ${sidebarOpen ? styles.active : ''}`}
        role="dialog"
        aria-labelledby="cart-title"
        aria-modal="true"
      >
        {/* Header */}
        <header className={styles.cartHeader}>
          <h2 id="cart-title" className={styles.cartTitle}>
            Mi Carrito
            {!isEmpty && (
              <span style={{ fontSize: '0.875rem', fontWeight: 'normal', marginLeft: '0.5rem' }}>
                ({itemCount} {itemCount === 1 ? 'producto' : 'productos'})
              </span>
            )}
          </h2>
          <button
            className={styles.cartClose}
            onClick={() => toggleSidebar(false)}
            aria-label="Cerrar carrito"
            type="button"
          >
            ✕
          </button>
        </header>

        {/* Contenido */}
        <div className={styles.cartContent}>
          {/* Loading state */}
          {loading && (
            <div className={styles.cartLoading}>
              <div className={styles.loadingSpinner} />
              <span style={{ marginLeft: '0.5rem' }}>Cargando...</span>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className={styles.cartError}>
              {error}
            </div>
          )}

          {/* Carrito vacío */}
          {isEmpty && !loading && (
            <CartEmpty onClose={() => toggleSidebar(false)} />
          )}

          {/* Items del carrito */}
          {!isEmpty && !loading && (
            <>
              {/* Mensaje de envío gratis */}
              {freeShippingReached ? (
                <div className={styles.freeShippingMessage}>
                  ¡Felicidades! Tienes envío gratuito 🚚
                </div>
              ) : (
                <div className={styles.freeShippingProgress}>
                  Faltan ${freeShippingRemaining.toLocaleString('es-CL')} para envío gratuito
                </div>
              )}

              {/* Lista de items */}
              <div id="cart-items" className={styles.cartItems}>
                {items.map((item) => (
                  <CartItem key={item.code} item={item} />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Resumen y botones (solo si hay items) */}
        {!isEmpty && !loading && (
          <CartSummary onClearCart={handleClearCart} onClose={() => toggleSidebar(false)} />
        )}
      </aside>
    </>
  );
};

export default CartSidebar;