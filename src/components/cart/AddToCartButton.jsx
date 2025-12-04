import React, { useState } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { useCart } from '../../context/CartContext';
import './AddToCartButton.css';

/**
 * Botón reutilizable para agregar productos al carrito
 * Props: producto (objeto con id, nombre, stock)
 */
const AddToCartButton = ({ producto, cantidad = 1, className = '', size = 'md' }) => {
  const { agregarItem, loading } = useCart();
  const [adding, setAdding] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (producto.stock === 0) return;

    setAdding(true);
    try {
      await agregarItem(producto.id, cantidad);
      
      // Toast notification
      const toast = document.createElement('div');
      toast.className = 'toast-notification success';
      toast.textContent = `✓ ${producto.nombre} agregado al carrito`;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3000);
      
    } catch (error) {
      const toast = document.createElement('div');
      toast.className = 'toast-notification error';
      toast.textContent = error.message;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3000);
    } finally {
      setAdding(false);
    }
  };

  const isDisabled = adding || loading || producto.stock === 0;

  return (
    <Button
      variant={producto.stock === 0 ? 'secondary' : 'primary'}
      size={size}
      className={className}
      onClick={handleAdd}
      disabled={isDisabled}
    >
      {adding ? (
        <>
          <Spinner animation="border" size="sm" className="me-2" />
          Agregando...
        </>
      ) : producto.stock === 0 ? (
        'Sin Stock'
      ) : (
        '🛒 Agregar al carrito'
      )}
    </Button>
  );
};

export default AddToCartButton;
