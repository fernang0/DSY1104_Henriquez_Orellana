import React from 'react';
import { useCart } from '../../context/CartContext';
import styles from './Cart.module.css';

/**
 * Componente CartButton - Botón del carrito para la navbar
 * Basado en el botón del carrito original con contador
 */
const CartButton = ({ className = '', showText = false }) => {
  const { toggleSidebar, itemCount, total, loading } = useCart();

  const formatCLP = (precio) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(precio);
  };

  const handleClick = () => {
    toggleSidebar(true);
  };

  return (
    <button
      className={`${styles.cartToggle} ${className}`}
      onClick={handleClick}
      disabled={loading}
      aria-label={`Abrir carrito, ${itemCount} producto${itemCount !== 1 ? 's' : ''}`}
      type="button"
    >
      {/* Icono del carrito */}
      <span className={styles.cartIcon}>🛒</span>
      
      {/* Texto opcional */}
      {showText && (
        <span className={styles.cartText}>
          Carrito
        </span>
      )}

      {/* Badge con contador */}
      {itemCount > 0 && (
        <span className={styles.cartBadge} aria-live="polite">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}

      {/* Tooltip con información del carrito */}
      <div className={styles.cartTooltip}>
        {itemCount === 0 ? (
          <span>Carrito vacío</span>
        ) : (
          <div>
            <div>{itemCount} {itemCount === 1 ? 'producto' : 'productos'}</div>
            <div><strong>Total: {formatCLP(total)}</strong></div>
          </div>
        )}
      </div>
    </button>
  );
};

export default CartButton;