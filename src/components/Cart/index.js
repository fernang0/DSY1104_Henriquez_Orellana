// Exportaciones principales del sistema de carrito
export { default as CartSidebar } from './CartSidebar';
export { default as CartItem } from './CartItem';
export { default as CartSummary } from './CartSummary';
export { default as CartEmpty } from './CartEmpty';
export { default as CartButton } from './CartButton';

// Re-exportar el contexto para conveniencia
export { useCart, CartProvider } from '../../context/CartContext';