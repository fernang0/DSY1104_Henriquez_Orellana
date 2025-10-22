import React from 'react';
import { demoProducts } from '../../data/cartData';
import { useCart } from '../../context/CartContext';
import styles from './Cart.module.css';

/**
 * Componente CartEmpty - Estado de carrito vacío
 * Basado en el mensaje de carrito vacío del original
 */
const CartEmpty = ({ onClose }) => {
  const { addToCart } = useCart();

  // Manejar adición de producto demo
  const handleAddDemo = async (product) => {
    const result = await addToCart(product, 1);
    if (result.success) {
      console.log('✅ Producto demo agregado:', result.message);
    } else {
      console.error('❌ Error agregando producto demo:', result.error);
    }
  };

  return (
    <div className={styles.cartEmpty}>
      {/* Icono */}
      <div className={styles.emptyIcon}>
        🛒
      </div>

      {/* Mensaje principal */}
      <h3>Tu carrito está vacío</h3>
      <p>¡Agrega algunos productos increíbles y comienza tu aventura gaming!</p>

      {/* Botón para continuar comprando */}
      <button 
        className={`${styles.cartBtn} ${styles.primary}`}
        onClick={onClose}
        style={{ marginBottom: '1.5rem' }}
        type="button"
      >
        Explorar Productos
      </button>

      {/* Productos sugeridos */}
      <div className={styles.suggestedProducts}>
        <h4 style={{ 
          color: 'var(--cart-text-secondary)', 
          fontSize: '0.875rem', 
          marginBottom: '1rem',
          textAlign: 'center'
        }}>
          Productos Destacados
        </h4>
        
        <div className={styles.demoProducts}>
          {demoProducts.slice(0, 3).map((product) => (
            <div key={product.code} className={styles.demoProduct}>
              <div className={styles.demoProductImage}>
                <img 
                  src={product.imagen} 
                  alt={product.nombre}
                  onError={(e) => {
                    e.target.src = '/images/products/default.jpg';
                  }}
                />
              </div>
              <div className={styles.demoProductInfo}>
                <h5 className={styles.demoProductName}>{product.nombre}</h5>
                <p className={styles.demoProductPrice}>
                  {new Intl.NumberFormat('es-CL', {
                    style: 'currency',
                    currency: 'CLP',
                    minimumFractionDigits: 0
                  }).format(product.precioCLP)}
                </p>
                <button 
                  className={`${styles.cartBtn} ${styles.secondary}`}
                  onClick={() => handleAddDemo(product)}
                  style={{ 
                    padding: '0.5rem 0.75rem',
                    fontSize: '0.75rem'
                  }}
                  type="button"
                >
                  Agregar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Beneficios de comprar */}
      <div className={styles.benefits}>
        <div className={styles.benefit}>
          <span className={styles.benefitIcon}>🚚</span>
          <span className={styles.benefitText}>Envío gratis sobre $50.000</span>
        </div>
        <div className={styles.benefit}>
          <span className={styles.benefitIcon}>🔒</span>
          <span className={styles.benefitText}>Compra 100% segura</span>
        </div>
        <div className={styles.benefit}>
          <span className={styles.benefitIcon}>↩️</span>
          <span className={styles.benefitText}>30 días para cambios</span>
        </div>
      </div>
    </div>
  );
};

export default CartEmpty;