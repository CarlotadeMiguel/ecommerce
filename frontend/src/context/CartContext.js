// src/context/CartContext.js
import React, { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export function CartProvider({ children }) {
  // Solo localStorage, sin backend
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  // Guardar en localStorage cada vez que cambie el carrito
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addItem = (product_id, quantity = 1, product = {}) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.product_id === product_id);
      if (existingItem) {
        return prev.map(item =>
          item.product_id === product_id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { 
        product_id, 
        quantity, 
        name: product.name,
        price: Number(product.price),
        image_url: product.image_url 
      }];
    });
  };

  const removeItem = (product_id) => {
    setCart(prev => prev.filter(item => item.product_id !== product_id));
  };

  const updateQuantity = (product_id, quantity) => {
    setCart(prev =>
      prev.map(item =>
        item.product_id === product_id
          ? { ...item, quantity: Math.max(1, quantity) }
          : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const subtotal = cart.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 0),
    0
  );
  const iva = subtotal * 0.16;
  const total = subtotal + iva;

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        subtotal,
        iva,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
