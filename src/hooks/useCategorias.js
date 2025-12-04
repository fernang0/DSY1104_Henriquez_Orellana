import { useState } from 'react';
import api from '../services/api';

export const useCategorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCategorias = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/categorias');
      setCategorias(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar categorías');
      console.error('Error fetching categorias:', err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoriaById = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/categorias/${id}`);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar categoría');
      console.error('Error fetching categoria:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    categorias,
    loading,
    error,
    fetchCategorias,
    fetchCategoriaById
  };
};
