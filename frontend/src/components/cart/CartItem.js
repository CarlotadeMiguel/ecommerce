// src/components/cart/CartItem.js
import React from "react";

const CartItem = ({ item, onRemove, onUpdate }) => (
  <div className="flex items-center py-2 border-b">
    <img src={item.image_url || "/placeholder-product.jpg"} alt={item.name} className="w-16 h-16 object-cover rounded" />
    <div className="ml-4 flex-1">
      <div className="font-medium">{item.name}</div>
      <div className="text-gray-500">${item.price?.toFixed(2) || "?"}</div>
      <div className="flex items-center mt-2">
        <button onClick={() => onUpdate(item.product_id, item.quantity - 1)} className="px-2">-</button>
        <input
          type="number"
          value={item.quantity}
          min={1}
          onChange={e => onUpdate(item.product_id, Number(e.target.value))}
          className="w-12 text-center border rounded"
        />
        <button onClick={() => onUpdate(item.product_id, item.quantity + 1)} className="px-2">+</button>
      </div>
    </div>
    <div className="ml-4 font-semibold">${((item.price || 0) * item.quantity).toFixed(2)}</div>
    <button onClick={() => onRemove(item.product_id)} className="ml-4 text-red-500 hover:underline">Eliminar</button>
  </div>
);

export default CartItem;
