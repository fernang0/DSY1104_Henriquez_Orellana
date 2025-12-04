import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { cartConfig } from '../../data/cartData';
import styles from './Cart.module.css';

/**
 * Componente CartSummary - Resumen y totales del carrito
 * Basado en el cálculo de totales del cart.js original
 */
const CartSummary = ({ onClearCart, onClose }) => {
  const { items, isEmpty, itemCount, total } = useCart();
  const navigate = useNavigate();

  if (isEmpty) return null;

  const formatCLP = (amount) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // El backend ya calcula el total, aquí solo calculamos subtotales para UI
  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  const taxRate = cartConfig.tax.rate || 0.19;
  const tax = subtotal * taxRate;
  const freeShippingThreshold = cartConfig.shipping.freeShippingThreshold || 50000;
  const shippingCost = cartConfig.shipping.cost || 5000;
  const shipping = subtotal >= freeShippingThreshold ? 0 : shippingCost;
  const savings = subtotal >= freeShippingThreshold ? shippingCost : 0;
  const freeShippingReached = subtotal >= freeShippingThreshold;
  const freeShippingRemaining = Math.max(0, freeShippingThreshold - subtotal);

  const handleCheckout = () => {
    // Cerrar el sidebar del carrito
    if (onClose) onClose();
    // Navegar a la página de checkout
    navigate('/checkout');
  };

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
            {formatCLP(subtotal)}
          </span>
        </div>

        {/* IVA */}
        <div className={styles.summaryRow}>
          <span className={styles.summaryLabel}>
            {cartConfig.tax.name} ({Math.round(cartConfig.tax.rate * 100)}%)
          </span>
          <span className={styles.summaryValue}>
            {formatCLP(tax)}
          </span>
        </div>

        {/* Envío */}
        <div className={styles.summaryRow}>
          <span className={styles.summaryLabel}>Envío</span>
          <span className={`${styles.summaryValue} ${shipping === 0 ? styles.free : ''}`}>
            {shipping === 0 ? 'GRATIS' : formatCLP(shipping)}
          </span>
        </div>

        {/* Ahorros por envío gratis */}
        {savings > 0 && (
          <div className={styles.summaryRow}>
            <span className={styles.summaryLabel}>Ahorro en envío</span>
            <span className={`${styles.summaryValue} ${styles.savings}`}>
              -{formatCLP(savings)}
            </span>
          </div>
        )}

        {/* Total */}
        <div className={`${styles.summaryRow} ${styles.total}`}>
          <span className={styles.summaryLabel}>Total</span>
          <span className={styles.summaryValue}>
            {formatCLP(total)}
          </span>
        </div>
      </div>

      {/* Botones de acción */}
      <div className={styles.cartButtons}>
        {/* Botón proceder al checkout */}
        <button 
          className={`${styles.cartBtn} ${styles.primary}`}
          onClick={handleCheckout}
          type="button"
        >
          🛒 Proceder al Pago ({formatCLP(total)})
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
        {!freeShippingReached && freeShippingRemaining > 0 && (
          <div className={styles.shippingProgress}>
            <small>
              💡 Agrega {formatCLP(freeShippingRemaining)} más para envío gratuito
            </small>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill}
                style={{ 
                  width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%` 
                }}
              />
            </div>
          </div>
        )}

        {/* Información de entrega */}
        <div className={styles.deliveryInfo}>
          <small>
            🚚 {shipping === 0 ? 'Envío gratuito' : 'Envío estándar'} • 
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