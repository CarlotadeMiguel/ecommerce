// frontend/src/services/orders.js
import api from './api';

export const createOrder = async (items) => {
    console.log(items);
  try {
    const response = await api.post('/orders/', items );

    return response.data;
  } catch (error) {
    if (error.response?.data?.error === 'Stock insuficiente') {
      throw new Error(`Productos sin stock: ${error.response.data.products.join(', ')}`);
    }
    throw new Error('Error al crear la orden');
  }
};

export const getOrders = async () => {
  const response = await api.get('/orders/');
  return response.data;
};
