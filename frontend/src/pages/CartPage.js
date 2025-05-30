// src/pages/CartPage.js
import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";
import CartItem from "../components/cart/CartItem";
import CartSummary from "../components/cart/CartSummary";
import {useNavigate} from "react-router-dom";

const CartPage = () => {
  const { cart, removeItem, updateQuantity, subtotal, iva, total, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("¡Tu carrito está vacío!");
      return;
    }
    navigate('/checkout');
  };

  return (
    <div className="container mx-auto py-8 flex flex-col md:flex-row gap-8">
      <div className="flex-1">
        <h2 className="text-2xl font-bold mb-4">Carrito de compras</h2>
        {cart.length === 0 ? (
          <p>Tu carrito está vacío.</p>
        ) : (
          cart.map(item => (
            <CartItem
              key={item.product_id}
              item={item}
              onRemove={removeItem}
              onUpdate={updateQuantity}
            />
          ))
        )}
      </div>
      <div className="w-full md:w-1/3">
        <CartSummary subtotal={subtotal} iva={iva} total={total} onCheckout={handleCheckout} />
      </div>
    </div>
  );
};

export default CartPage;
