// src/pages/CartPage.js
import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";

const CartPage = () => {
  const { cartItems } = useContext(CartContext);

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6">Carrito de compras</h2>
      {cartItems.length === 0 ? (
        <p>Tu carrito está vacío.</p>
      ) : (
        <ul>
          {cartItems.map((item) => (
            <li key={item.product_id || item.id}>
              Producto: {item.product_id || item.id} | Cantidad: {item.quantity}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CartPage;
