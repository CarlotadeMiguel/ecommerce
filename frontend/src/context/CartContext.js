// src/context/CartContext.js
import React, { createContext, useState } from "react";
import { getCart, addToCart } from "../services/cart";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  const addItem = async (product_id, quantity) => {
    await addToCart(product_id, quantity);
    const res = await getCart();
    setCart(res.data.items);
  };

  // Puedes añadir métodos para update/remove

  return (
    <CartContext.Provider value={{ cart, addItem }}>
      {children}
    </CartContext.Provider>
  );
}
