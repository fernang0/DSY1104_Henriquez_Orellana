import axios from 'axios';

// En producción usa el proxy de Vercel, en desarrollo usa AWS directo
const API_BASE_URL = import.meta.env.MODE === 'production' 
  ? '/api/v1' 
  : 'http://ec2-44-200-28-175.compute-1.amazonaws.com:8080/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true'
  },
  transformResponse: [
    (data) => {
      // El backend devuelve "0[...]" o "0{...}", limpiamos el 0
      if (typeof data === 'string' && /^0[\[\{]/.test(data)) {
        data = data.substring(1);
      }
      try {
        return JSON.parse(data);
      } catch (e) {
        return data;
      }
    }
  ]
});

// Interceptor para agregar el token JWT automáticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
export { API_BASE_URL };
