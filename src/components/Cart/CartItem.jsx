import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { cartConfig } from '../../data/cartData';
import styles from './Cart.module.css';

/**
 * Componente CartItem - Item individual del carrito
 * Basado en la estructura original del cart.js
 */
const CartItem = ({ item }) => {
  const { actualizarItem, eliminarItem } = useCart();
  const [isUpdating, setIsUpdating] = useState(false);
  const [tempQuantity, setTempQuantity] = useState(item.cantidad);

  const formatCLP = (amount) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Debounce para actualizar cantidad
  const [debounceTimer, setDebounceTimer] = useState(null);

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity < 1) return;
    
    setTempQuantity(newQuantity);
    
    // Cancelar timer anterior
    if (debounceTimer) clearTimeout(debounceTimer);
    
    // Nuevo timer de 500ms
    const timer = setTimeout(async () => {
      if (newQuantity !== item.cantidad) {
        setIsUpdating(true);
        try {
          await actualizarItem(item.id, newQuantity);
        } catch (error) {
          console.error('Error:', error);
          alert(error.message);
          setTempQuantity(item.cantidad); // Revertir
        } finally {
          setIsUpdating(false);
        }
      }
    }, 500);
    
    setDebounceTimer(timer);
  };

  const handleQuantityInput = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      handleQuantityChange(value);
    }
  };

  const handleRemove = async () => {
    if (window.confirm(`¿Eliminar ${item.productoNombre} del carrito?`)) {
      setIsUpdating(true);
      try {
        await eliminarItem(item.id);
      } catch (error) {
        console.error('Error:', error);
        alert(error.message);
      } finally {
        setIsUpdating(false);
      }
    }
  };

  // El backend envía: productoNombre, productoCode, productoImagen
  const nombreProducto = item.productoNombre || 'Producto sin nombre';
  const codigoProducto = item.productoCode || 'N/A';
  const imagenProducto = item.productoImagen || '/images/products/default.jpg';
  const precioUnitario = item.precioUnitario || 0;
  const subtotal = item.subtotal || 0;
  const cantidad = tempQuantity;

  return (
    <div className={`${styles.cartItem} ${isUpdating ? styles.updating : ''}`} data-id={item.id}>
      <div className={styles.itemImage}>
        <img
          src={imagenProducto}
          alt={nombreProducto}
          loading="lazy"
          onError={(e) => { e.target.src = '/images/products/default.jpg'; }}
        />
      </div>

      <div className={styles.itemDetails}>
        <h4 className={styles.itemName}>{nombreProducto}</h4>
        <p className={styles.itemCode}>Código: {codigoProducto}</p>
        <p className={styles.itemPrice}>{formatCLP(precioUnitario)}</p>
      </div>

      {/* Controles del item */}
      <div className={styles.itemControls}>
        {/* Controles de cantidad */}
        <div className={styles.quantityControls}>
          <button
            className={styles.quantityBtn}
            onClick={() => handleQuantityChange(cantidad - 1)}
            disabled={cantidad <= 1 || isUpdating}
            aria-label={`Disminuir cantidad de ${nombreProducto}`}
            type="button"
          >
            −
          </button>
          
          <input
            type="number"
            className={styles.quantityInput}
            value={cantidad}
            onChange={handleQuantityInput}
            onBlur={(e) => {
              const value = parseInt(e.target.value);
              if (isNaN(value) || value < 1) {
                e.target.value = cantidad;
              }
            }}
            min="1"
            max={cartConfig.validation.maxQuantity}
            disabled={isUpdating}
            aria-label={`Cantidad de ${nombreProducto}`}
          />
          
          <button
            className={styles.quantityBtn}
            onClick={() => handleQuantityChange(cantidad + 1)}
            disabled={isUpdating || cantidad >= cartConfig.validation.maxQuantity}
            aria-label={`Aumentar cantidad de ${nombreProducto}`}
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
          aria-label={`Eliminar ${nombreProducto} del carrito`}
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