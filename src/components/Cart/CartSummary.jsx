import React from 'react';
import { useCart } from '../../context/CartContext';
import { cartConfig } from '../../data/cartData';
import styles from './Cart.module.css';

/**
 * Componente CartSummary - Resumen y totales del carrito
 * Basado en el cálculo de totales del cart.js original
 */
const CartSummary = ({ onClearCart, onClose }) => {
  const { totals, formatCLP, isEmpty, itemCount } = useCart();

  // No mostrar si el carrito está vacío
  if (isEmpty) return null;

  return (
    <div className={styles.cartSummary}>
      {/* Resumen de totales */}
      <div className={styles.summaryContent}>
        
        {/* Subtotal */}
        <div className={styles.summaryRow}>
          <span className={styles.summaryLabel}>
            Subtotal ({itemCount} {itemCount === 1 ? 'producto' : 'productos'})
          </span>
          <span className={styles.summaryValue}>
            {formatCLP(totals.subtotal)}
          </span>
        </div>

        {/* IVA */}
        <div className={styles.summaryRow}>
          <span className={styles.summaryLabel}>
            {cartConfig.tax.name} ({Math.round(cartConfig.tax.rate * 100)}%)
          </span>
          <span className={styles.summaryValue}>
            {formatCLP(totals.tax)}
          </span>
        </div>

        {/* Envío */}
        <div className={styles.summaryRow}>
          <span className={styles.summaryLabel}>Envío</span>
          <span className={`${styles.summaryValue} ${totals.shipping === 0 ? styles.free : ''}`}>
            {totals.shipping === 0 ? 'GRATIS' : formatCLP(totals.shipping)}
          </span>
        </div>

        {/* Ahorros por envío gratis */}
        {totals.savings > 0 && (
          <div className={styles.summaryRow}>
            <span className={styles.summaryLabel}>Ahorro en envío</span>
            <span className={`${styles.summaryValue} ${styles.savings}`}>
              -{formatCLP(totals.savings)}
            </span>
          </div>
        )}

        {/* Total */}
        <div className={`${styles.summaryRow} ${styles.total}`}>
          <span className={styles.summaryLabel}>Total</span>
          <span className={styles.summaryValue}>
            {formatCLP(totals.total)}
          </span>
        </div>
      </div>

      {/* Botones de acción */}
      <div className={styles.cartButtons}>
        {/* Botón proceder al checkout */}
        <button 
          className={`${styles.cartBtn} ${styles.primary}`}
          onClick={() => {
            // Aquí iría la lógica de checkout
            console.log('🛒 Proceder al checkout con:', totals);
            alert(`Checkout con total: ${formatCLP(totals.total)}\n(Funcionalidad en desarrollo)`);
          }}
          type="button"
        >
          Proceder al Pago ({formatCLP(totals.total)})
        </button>

        {/* Botón continuar comprando */}
        <button 
          className={`${styles.cartBtn} ${styles.secondary}`}
          onClick={onClose}
          type="button"
        >
          Continuar Comprando
        </button>

        {/* Botón vaciar carrito */}
        <button 
          className={`${styles.cartBtn} ${styles.danger}`}
          onClick={onClearCart}
          type="button"
        >
          Vaciar Carrito
        </button>
      </div>

      {/* Información adicional */}
      <div className={styles.summaryInfo}>
        {/* Progreso hacia envío gratis */}
        {!totals.freeShippingReached && totals.freeShippingRemaining > 0 && (
          <div className={styles.shippingProgress}>
            <small>
              💡 Agrega {formatCLP(totals.freeShippingRemaining)} más para envío gratuito
            </small>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill}
                style={{ 
                  width: `${Math.min(100, (totals.subtotal / cartConfig.shipping.freeShippingThreshold) * 100)}%` 
                }}
              />
            </div>
          </div>
        )}

        {/* Información de entrega */}
        <div className={styles.deliveryInfo}>
          <small>
            🚚 {totals.shipping === 0 ? 'Envío gratuito' : 'Envío estándar'} • 
            Entrega en 2-3 días hábiles
          </small>
        </div>

        {/* Garantía */}
        <div className={styles.warrantyInfo}>
          <small>
            🔒 Compra segura • ✓ Garantía de satisfacción
          </small>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;