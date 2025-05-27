import api from './api';

export const createOrder = (items) => api.post('/orders', { items });
export const getOrders = () => api.get('/orders');
export const getOrder = (id) => api.get(`/orders/${id}`);
