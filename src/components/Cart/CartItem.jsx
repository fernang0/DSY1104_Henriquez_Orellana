import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { cartConfig } from '../../data/cartData';
import styles from './Cart.module.css';

/**
 * Componente CartItem - Item individual del carrito
 * Basado en la estructura original del cart.js
 */
const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart, formatCLP } = useCart();
  const [isUpdating, setIsUpdating] = useState(false);

  // Manejar cambio de cantidad con botones
  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity === item.quantity || newQuantity < 1) return;
    
    setIsUpdating(true);
    
    try {
      const result = await updateQuantity(item.code, newQuantity);
      if (result.success) {
        console.log('✅ Cantidad actualizada:', result.message);
      } else {
        console.error('❌ Error actualizando cantidad:', result.error);
      }
    } catch (error) {
      console.error('❌ Error actualizando cantidad:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Manejar input directo de cantidad
  const handleQuantityInput = (e) => {
    const newQuantity = parseInt(e.target.value);
    if (!isNaN(newQuantity) && newQuantity > 0) {
      handleQuantityChange(newQuantity);
    }
  };

  // Manejar eliminación del item
  const handleRemove = async () => {
    if (window.confirm(`¿Eliminar ${item.nombre} del carrito?`)) {
      setIsUpdating(true);
      
      try {
        const result = await removeFromCart(item.code);
        if (result.success) {
          console.log('✅ Item eliminado:', result.message);
        } else {
          console.error('❌ Error eliminando item:', result.error);
        }
      } catch (error) {
        console.error('❌ Error eliminando item:', error);
      } finally {
        setIsUpdating(false);
      }
    }
  };

  // Calcular subtotal del item
  const subtotal = item.precioCLP * item.quantity;

  return (
    <div className={`${styles.cartItem} ${isUpdating ? styles.updating : ''}`} data-code={item.code}>
      {/* Imagen del producto */}
      <div className={styles.itemImage}>
        <img
          src={item.imagen || '/images/products/default.jpg'}
          alt={item.nombre}
          loading="lazy"
          onError={(e) => {
            e.target.src = '/images/products/default.jpg';
          }}
        />
      </div>

      {/* Detalles del producto */}
      <div className={styles.itemDetails}>
        <h4 className={styles.itemName}>{item.nombre}</h4>
        <p className={styles.itemCode}>Código: {item.code}</p>
        <p className={styles.itemPrice}>{formatCLP(item.precioCLP)}</p>
        {item.stock && (
          <p className={styles.itemStock}>Stock: {item.stock}</p>
        )}
      </div>

      {/* Controles del item */}
      <div className={styles.itemControls}>
        {/* Controles de cantidad */}
        <div className={styles.quantityControls}>
          <button
            className={styles.quantityBtn}
            onClick={() => handleQuantityChange(item.quantity - 1)}
            disabled={item.quantity <= 1 || isUpdating}
            aria-label={`Disminuir cantidad de ${item.nombre}`}
            type="button"
          >
            −
          </button>
          
          <input
            type="number"
            className={styles.quantityInput}
            value={item.quantity}
            onChange={handleQuantityInput}
            onBlur={(e) => {
              // Validar y corregir el valor al perder el foco
              const value = parseInt(e.target.value);
              if (isNaN(value) || value < 1) {
                e.target.value = item.quantity;
              }
            }}
            min="1"
            max={item.stock || cartConfig.validation.maxQuantity}
            disabled={isUpdating}
            aria-label={`Cantidad de ${item.nombre}`}
          />
          
          <button
            className={styles.quantityBtn}
            onClick={() => handleQuantityChange(item.quantity + 1)}
            disabled={
              isUpdating || 
              (item.stock && item.quantity >= item.stock) ||
              item.quantity >= cartConfig.validation.maxQuantity
            }
            aria-label={`Aumentar cantidad de ${item.nombre}`}
            type="button"
          >
            +
          </button>
        </div>

        {/* Subtotal */}
        <p className={styles.itemSubtotal}>
          {formatCLP(subtotal)}
        </p>

        {/* Botón eliminar */}
        <button
          className={styles.removeBtn}
          onClick={handleRemove}
          disabled={isUpdating}
          aria-label={`Eliminar ${item.nombre} del carrito`}
          type="button"
          title="Eliminar producto"
        >
          🗑️
        </button>
      </div>

      {/* Indicador de actualización */}
      {isUpdating && (
        <div className={styles.updatingIndicator}>
          <div className={styles.loadingSpinner} />
        </div>
      )}
    </div>
  );
};

export default CartItem;