import { useState, useEffect } from 'react';
import api from '../services/api';

export const useProductos = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProductos = async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      let url = '/productos';
      const params = new URLSearchParams();

      if (filters.categoria) params.append('categoria', filters.categoria);
      if (filters.keyword) params.append('keyword', filters.keyword);

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await api.get(url);
      setProductos(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar productos');
      console.error('Error fetching productos:', err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchProductoById = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/productos/${id}`);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar producto');
      console.error('Error fetching producto:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const buscarProductos = async (keyword) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/productos/buscar?keyword=${keyword}`);
      setProductos(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Error al buscar productos');
      console.error('Error buscando productos:', err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchProductosPorCategoria = async (categoriaId) => {
    setLoading(true);
    setError(null);
    try {
      // Si categoriaId está vacío, cargar todos los productos
      if (!categoriaId) {
        return await fetchProductos();
      }
      
      const response = await api.get(`/productos/categoria/${categoriaId}`);
      setProductos(response.data);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Error al cargar productos por categoría';
      setError(errorMsg);
      console.error('Error fetching productos por categoria:', err);
      
      // Si falla, intentar cargar todos los productos
      if (err.response?.status === 404 || err.response?.status === 400) {
        console.warn('Categoría no encontrada, cargando todos los productos');
        return await fetchProductos();
      }
      
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    productos,
    loading,
    error,
    fetchProductos,
    fetchProductoById,
    buscarProductos,
    fetchProductosPorCategoria
  };
};
