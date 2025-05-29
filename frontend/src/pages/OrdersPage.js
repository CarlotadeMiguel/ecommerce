// frontend/src/pages/OrdersPage.js
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import OrderList from '../components/orders/OrderList';
import { getOrders } from '../services/orders';
import LoadingSpinner from '../components/common/LoadingSpinner';

function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrders();
        setOrders(data);
      } catch (err) {
        setError('Error al cargar órdenes');
      } finally {
        setLoading(false);
      }
    };
    
    if (user) fetchOrders();
  }, [user]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Historial de Pedidos</h1>
      <OrderList orders={orders} />
    </div>
  );
}

export default OrdersPage;
