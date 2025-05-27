// src/services/products.js
import api from "./api";

export const getProducts = async (params) => {
    try {
      const response = await api.get('/products', { params });
      if (!response.data?.products) {
        throw new Error('Formato de respuesta inválido');
      }
      return response;
    } catch (error) {
      console.error('Error en getProducts:', error);
      throw error; // Propagar el error para manejarlo en el componente
    }
  };

export const getProduct = async (id) => {
  const res = await api.get(`/products/${id}`);
  return res.data;
};
