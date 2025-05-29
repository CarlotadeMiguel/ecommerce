// frontend/src/components/orders/OrderList.js
import React from 'react';
import OrderItem from './OrderItem';

const OrderList = ({ orders }) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {orders.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          No tienes pedidos registrados
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {orders.map(order => (
            <OrderItem key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderList;
