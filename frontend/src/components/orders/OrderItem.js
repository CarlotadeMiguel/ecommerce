import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const OrderItem = ({ order }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold">Pedido #{order.id}</h3>
          <p className="text-gray-600">
            {format(new Date(order.created_at), "dd 'de' MMMM yyyy - HH:mm", { locale: es })}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm ${
          order.status === 'completed' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          {order.status === 'completed' ? 'Completado' : 'En proceso'}
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {order.items.map((item, index) => (
          <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded">
            <div className="flex-1">
              <p className="font-medium">{item.name}</p> {/* Corregido aquí */}
              <p className="text-sm text-gray-500">
                {item.quantity} x ${item.price_at_purchase.toFixed(2)}
              </p>
            </div>
            <p className="font-semibold">
              ${(item.quantity * item.price_at_purchase).toFixed(2)}
            </p>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="font-semibold">Total:</span>
          <span className="text-xl font-bold">
            ${order.total.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderItem;
