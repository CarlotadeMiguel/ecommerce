import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true
});

// Interceptor para agregar token a las solicitudes
api.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar errores globales
api.interceptors.response.use(
  response => response,
  error => {
    // Si recibes 401, borra el token y redirige (si quieres)
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      // window.location = '/login'; // Opcional, si quieres forzar logout
    }
    return Promise.reject(error);
  }
);


export default api;
