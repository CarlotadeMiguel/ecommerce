// src/components/cart/CartSummary.js
import React from "react";

const CartSummary = ({ subtotal, iva, total, onCheckout }) => (
  <div className="p-4 bg-gray-50 rounded shadow">
    <div className="flex justify-between">
      <span>Subtotal</span>
      <span>${subtotal.toFixed(2)}</span>
    </div>
    <div className="flex justify-between">
      <span>IVA (16%)</span>
      <span>${iva.toFixed(2)}</span>
    </div>
    <div className="flex justify-between font-bold text-lg mt-2">
      <span>Total</span>
      <span>${total.toFixed(2)}</span>
    </div>
    <button
      onClick={onCheckout}
      className="w-full bg-green-600 text-white mt-4 py-2 rounded hover:bg-green-700"
    >
      Finalizar Compra
    </button>
  </div>
);

export default CartSummary;
