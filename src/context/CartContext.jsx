import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { 
  cartConfig, 
  productValidation, 
  cartUtils, 
  cartActionTypes, 
  cartStates 
} from '../data/cartData';

// Crear el contexto
const CartContext = createContext();

// Estado inicial del carrito
const initialState = {
  items: [],
  sidebarOpen: false,
  isLoading: false,
  error: null,
  state: cartStates.IDLE
};

// Reducer del carrito
function cartReducer(state, action) {
  switch (action.type) {
    case cartActionTypes.LOAD_CART:
      return {
        ...state,
        items: action.payload,
        isLoading: false,
        error: null
      };

    case cartActionTypes.ADD_ITEM:
      const existingItemIndex = state.items.findIndex(item => item.code === action.payload.code);
      
      if (existingItemIndex >= 0) {
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + action.payload.quantity,
          updatedAt: new Date().toISOString()
        };
        return {
          ...state,
          items: updatedItems,
          isLoading: false,
          error: null
        };
      } else {
        const newItem = {
          ...action.payload,
          addedAt: new Date().toISOString()
        };
        return {
          ...state,
          items: [...state.items, newItem],
          isLoading: false,
          error: null
        };
      }

    case cartActionTypes.REMOVE_ITEM:
      return {
        ...state,
        items: state.items.filter(item => item.code !== action.payload),
        isLoading: false,
        error: null
      };

    case cartActionTypes.UPDATE_QUANTITY:
      const updatedItems = state.items.map(item =>
        item.code === action.payload.code
          ? { ...item, quantity: action.payload.quantity, updatedAt: new Date().toISOString() }
          : item
      );
      return {
        ...state,
        items: updatedItems,
        isLoading: false,
        error: null
      };

    case cartActionTypes.CLEAR_CART:
      return {
        ...state,
        items: [],
        isLoading: false,
        error: null
      };

    case cartActionTypes.TOGGLE_SIDEBAR:
      return {
        ...state,
        sidebarOpen: action.payload !== undefined ? action.payload : !state.sidebarOpen
      };

    case cartActionTypes.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
        error: null
      };

    case cartActionTypes.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    default:
      return state;
  }
}

// Provider del carrito
export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Cargar carrito desde localStorage al inicializar
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(cartConfig.storageKey);
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        const validatedCart = productValidation.validateCartData(parsedCart);
        dispatch({ type: cartActionTypes.LOAD_CART, payload: validatedCart });
      }
    } catch (error) {
      console.error('Error cargando carrito:', error);
      dispatch({ 
        type: cartActionTypes.SET_ERROR, 
        payload: cartConfig.messages.loadError 
      });
      localStorage.removeItem(cartConfig.storageKey);
    }
  }, []);

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    try {
      localStorage.setItem(cartConfig.storageKey, JSON.stringify(state.items));
    } catch (error) {
      console.error('Error guardando carrito:', error);
      dispatch({ 
        type: cartActionTypes.SET_ERROR, 
        payload: cartConfig.messages.saveError 
      });
    }
  }, [state.items]);

  // Función para agregar producto al carrito
  const addToCart = useCallback(async (product, quantity = 1) => {
    dispatch({ type: cartActionTypes.SET_LOADING, payload: true });

    try {
      const productCheck = productValidation.validateProduct(product);
      if (!productCheck.valid) {
        dispatch({ type: cartActionTypes.SET_ERROR, payload: productCheck.error });
        return { success: false, error: productCheck.error };
      }

      const quantityCheck = productValidation.validateQuantity(quantity, product.stock);
      if (!quantityCheck.valid) {
        dispatch({ type: cartActionTypes.SET_ERROR, payload: quantityCheck.error });
        return { success: false, error: quantityCheck.error };
      }

      const existingItem = state.items.find(item => item.code === product.code);
      const currentQuantity = existingItem ? existingItem.quantity : 0;
      
      if (product.stock && (currentQuantity + quantity) > product.stock) {
        const error = `${cartConfig.messages.stockInsufficient}${product.stock}`;
        dispatch({ type: cartActionTypes.SET_ERROR, payload: error });
        return { success: false, error };
      }

      dispatch({ 
        type: cartActionTypes.ADD_ITEM, 
        payload: { ...product, quantity } 
      });

      const message = `${product.nombre} ${cartConfig.messages.addSuccess}`;
      return { success: true, message };

    } catch (error) {
      const errorMessage = cartConfig.messages.addError;
      dispatch({ type: cartActionTypes.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  }, [state.items]);

  // Función para remover producto del carrito
  const removeFromCart = useCallback(async (productCode) => {
    dispatch({ type: cartActionTypes.SET_LOADING, payload: true });

    try {
      const item = state.items.find(item => item.code === productCode);
      if (!item) {
        const error = `Producto ${productCode} no encontrado`;
        dispatch({ type: cartActionTypes.SET_ERROR, payload: error });
        return { success: false, error };
      }

      dispatch({ type: cartActionTypes.REMOVE_ITEM, payload: productCode });

      const message = `${item.nombre} ${cartConfig.messages.removeSuccess}`;
      return { success: true, message };

    } catch (error) {
      const errorMessage = cartConfig.messages.removeError;
      dispatch({ type: cartActionTypes.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  }, [state.items]);

  // Función para actualizar cantidad
  const updateQuantity = useCallback(async (productCode, newQuantity) => {
    dispatch({ type: cartActionTypes.SET_LOADING, payload: true });

    try {
      const item = state.items.find(item => item.code === productCode);
      if (!item) {
        const error = `Producto ${productCode} no encontrado`;
        dispatch({ type: cartActionTypes.SET_ERROR, payload: error });
        return { success: false, error };
      }

      const quantityCheck = productValidation.validateQuantity(newQuantity, item.stock);
      if (!quantityCheck.valid) {
        dispatch({ type: cartActionTypes.SET_ERROR, payload: quantityCheck.error });
        return { success: false, error: quantityCheck.error };
      }

      dispatch({ 
        type: cartActionTypes.UPDATE_QUANTITY, 
        payload: { code: productCode, quantity: newQuantity } 
      });

      return { success: true, message: cartConfig.messages.updateSuccess };

    } catch (error) {
      const errorMessage = cartConfig.messages.updateError;
      dispatch({ type: cartActionTypes.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  }, [state.items]);

  // Función para vaciar carrito
  const clearCart = useCallback(async () => {
    dispatch({ type: cartActionTypes.SET_LOADING, payload: true });

    try {
      dispatch({ type: cartActionTypes.CLEAR_CART });
      return { success: true, message: cartConfig.messages.clearSuccess };
    } catch (error) {
      const errorMessage = cartConfig.messages.clearError;
      dispatch({ type: cartActionTypes.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  }, []);

  // Función para toggle del sidebar
  const toggleSidebar = useCallback((open) => {
    dispatch({ type: cartActionTypes.TOGGLE_SIDEBAR, payload: open });
  }, []);

  // Función para formatear moneda
  const formatCLP = useCallback((amount) => {
    return cartUtils.formatCLP(amount);
  }, []);

  // Calcular totales
  const totals = cartUtils.calculateTotals(state.items);
  
  // Estados computados
  const isEmpty = state.items.length === 0;
  const itemCount = state.items.reduce((count, item) => count + item.quantity, 0);

  // Valor del contexto
  const contextValue = {
    // Estado
    items: state.items,
    sidebarOpen: state.sidebarOpen,
    isLoading: state.isLoading,
    error: state.error,
    isEmpty,
    itemCount,
    totals,
    
    // Acciones
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleSidebar,
    formatCLP,
    
    // Utilidades
    utils: cartUtils,
    config: cartConfig
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
}

// Hook para usar el contexto del carrito
export function useCart() {
  const context = useContext(CartContext);
  
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  
  return context;
}