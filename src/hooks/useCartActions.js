import { useCallback } from 'react';
import { useCart as useCartContext } from '../context/CartContext';
import { demoProducts, cartUtils } from '../data/cartData';

/**
 * Hook personalizado con utilidades adicionales para el carrito
 * Basado en las funcionalidades del cart.js original
 */
export const useCartActions = () => {
  const cartContext = useCartContext();

  // Función para agregar múltiples productos al carrito
  const addMultipleToCart = useCallback(async (products) => {
    const results = [];
    
    for (const { product, quantity = 1 } of products) {
      const result = await cartContext.addToCart(product, quantity);
      results.push({ product: product.code, ...result });
    }
    
    return results;
  }, [cartContext]);

  // Función para buscar productos demo por categoría
  const getDemoProductsByCategory = useCallback((category) => {
    return demoProducts.filter(product => product.categoria === category);
  }, []);

  // Función para obtener producto demo por código
  const getDemoProduct = useCallback((code) => {
    return demoProducts.find(product => product.code === code);
  }, []);

  // Función para agregar producto demo rápido
  const addDemoProduct = useCallback(async (productCode, quantity = 1) => {
    const product = getDemoProduct(productCode);
    if (!product) {
      return { success: false, error: `Producto ${productCode} no encontrado` };
    }
    
    return await cartContext.addToCart(product, quantity);
  }, [cartContext, getDemoProduct]);

  // Función para calcular descuentos
  const calculateDiscount = useCallback((discountPercent) => {
    const totals = cartContext.totals;
    const discountAmount = Math.round(totals.subtotal * (discountPercent / 100));
    const newTotal = totals.total - discountAmount;
    
    return {
      originalTotal: totals.total,
      discountAmount,
      newTotal: Math.max(0, newTotal),
      discountPercent
    };
  }, [cartContext.totals]);

  // Función para verificar disponibilidad de productos
  const checkCartStock = useCallback(() => {
    const stockIssues = [];
    
    cartContext.items.forEach(item => {
      if (item.stock && item.quantity > item.stock) {
        stockIssues.push({
          code: item.code,
          name: item.nombre,
          requested: item.quantity,
          available: item.stock,
          excess: item.quantity - item.stock
        });
      }
    });
    
    return {
      hasIssues: stockIssues.length > 0,
      issues: stockIssues,
      totalIssues: stockIssues.length
    };
  }, [cartContext.items]);

  // Función para obtener recomendaciones basadas en el carrito
  const getRecommendations = useCallback(() => {
    const cartCategories = [...new Set(cartContext.items.map(item => item.categoria))];
    
    return demoProducts.filter(product => {
      // No recomendar productos que ya están en el carrito
      const isInCart = cartContext.items.some(item => item.code === product.code);
      if (isInCart) return false;
      
      // Recomendar productos de las mismas categorías
      return cartCategories.includes(product.categoria);
    }).slice(0, 3); // Máximo 3 recomendaciones
  }, [cartContext.items]);

  // Función para exportar carrito (para compartir, guardar, etc.)
  const exportCart = useCallback(() => {
    const cartData = {
      items: cartContext.items,
      totals: cartContext.totals,
      timestamp: new Date().toISOString(),
      itemCount: cartContext.itemCount
    };
    
    return {
      json: JSON.stringify(cartData, null, 2),
      data: cartData,
      summary: `${cartContext.itemCount} productos - Total: ${cartContext.formatCLP(cartContext.totals.total)}`
    };
  }, [cartContext]);

  // Función para importar carrito
  const importCart = useCallback(async (cartData) => {
    try {
      let parsedData;
      
      if (typeof cartData === 'string') {
        parsedData = JSON.parse(cartData);
      } else {
        parsedData = cartData;
      }
      
      if (!parsedData.items || !Array.isArray(parsedData.items)) {
        throw new Error('Formato de carrito inválido');
      }
      
      // Limpiar carrito actual
      await cartContext.clearCart();
      
      // Agregar productos del carrito importado
      const results = await addMultipleToCart(
        parsedData.items.map(item => ({ product: item, quantity: item.quantity }))
      );
      
      const successCount = results.filter(r => r.success).length;
      const errorCount = results.length - successCount;
      
      return {
        success: true,
        message: `Carrito importado: ${successCount} productos agregados`,
        details: { successCount, errorCount, results }
      };
      
    } catch (error) {
      return {
        success: false,
        error: `Error importando carrito: ${error.message}`
      };
    }
  }, [cartContext, addMultipleToCart]);

  // Función para limpiar productos sin stock
  const removeOutOfStockItems = useCallback(async () => {
    const outOfStockItems = cartContext.items.filter(item => 
      item.stock !== undefined && item.stock <= 0
    );
    
    if (outOfStockItems.length === 0) {
      return { success: true, message: 'No hay productos sin stock', removed: 0 };
    }
    
    const results = [];
    for (const item of outOfStockItems) {
      const result = await cartContext.removeFromCart(item.code);
      results.push(result);
    }
    
    const removedCount = results.filter(r => r.success).length;
    
    return {
      success: true,
      message: `${removedCount} productos sin stock eliminados`,
      removed: removedCount,
      details: results
    };
  }, [cartContext]);

  // Función para aplicar descuento de estudiante
  const applyStudentDiscount = useCallback(() => {
    return calculateDiscount(20); // 20% de descuento para estudiantes
  }, [calculateDiscount]);

  return {
    // Re-exportar contexto completo
    ...cartContext,
    
    // Funciones adicionales
    addMultipleToCart,
    getDemoProductsByCategory,
    getDemoProduct,
    addDemoProduct,
    calculateDiscount,
    checkCartStock,
    getRecommendations,
    exportCart,
    importCart,
    removeOutOfStockItems,
    applyStudentDiscount,
    
    // Datos de productos demo
    demoProducts,
    
    // Utilidades
    utils: cartUtils,
    
    // Estados computados adicionales
    hasStockIssues: checkCartStock().hasIssues,
    recommendations: getRecommendations(),
    categories: [...new Set(cartContext.items.map(item => item.categoria))],
    
    // Métrica de valor del carrito
    cartMetrics: {
      averageItemPrice: cartContext.items.length > 0 
        ? cartContext.totals.subtotal / cartContext.itemCount 
        : 0,
      totalSavings: cartContext.totals.savings,
      freeShippingProgress: cartContext.totals.freeShippingReached 
        ? 100 
        : Math.min(100, (cartContext.totals.subtotal / 50000) * 100)
    }
  };
};