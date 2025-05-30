// src/pages/CheckoutPage.js

import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { createOrder } from '../services/orders';

const CheckoutPage = () => {
  const { cart, clearCart, total } = useContext(CartContext);
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'España'
  });

  // Maneja cambios en el formulario de envío
  const handleInputChange = (e) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  // Maneja el envío del checkout
  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert("¡Tu carrito está vacío!");
      return;
    }
    // Validación básica de formulario
    if (!shippingInfo.name || !shippingInfo.address || !shippingInfo.city || !shippingInfo.postalCode) {
      alert("Por favor, completa todos los campos de envío.");
      return;
    }

    setIsProcessing(true);
    try {
      // Estructura de la orden para el backend
      const orderData = {
        shipping: shippingInfo,
        items: cart.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price,
          name: item.name,
          image_url: item.image_url
        }))
      };

      await createOrder(orderData);
      clearCart();
      navigate('/orders');
    } catch (error) {
      alert(error.message || "Error al procesar la orden");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6">Confirmar Compra</h2>
      <div className="grid md:grid-cols-2 gap-8">
        {/* Formulario de envío */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Datos de Envío</h3>
          <form className="space-y-4" onSubmit={e => { e.preventDefault(); handleCheckout(); }}>
            <div>
              <label className="block text-sm font-medium mb-1">Nombre completo</label>
              <input
                type="text"
                name="name"
                value={shippingInfo.name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Dirección</label>
              <input
                type="text"
                name="address"
                value={shippingInfo.address}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Ciudad</label>
                <input
                  type="text"
                  name="city"
                  value={shippingInfo.city}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Código Postal</label>
                <input
                  type="text"
                  name="postalCode"
                  value={shippingInfo.postalCode}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">País</label>
              <select
                name="country"
                value={shippingInfo.country}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              >
                <option>España</option>
                <option>México</option>
                <option>Estados Unidos</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={isProcessing}
              className={`w-full bg-blue-600 text-white py-3 rounded-lg transition ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
            >
              {isProcessing ? 'Procesando...' : 'Confirmar Pago'}
            </button>
          </form>
        </div>

        {/* Resumen de compra */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Resumen de Compra</h3>
          {cart.map(item => (
            <div key={item.product_id} className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-4">
                <img
                  src={item.image_url || '/default-product.jpg'}
                  className="w-16 h-16 object-cover rounded"
                  alt={item.name}
                />
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-gray-600">{item.quantity} x ${item.price.toFixed(2)}</p>
                </div>
              </div>
              <p className="font-semibold">
                ${(item.quantity * item.price).toFixed(2)}
              </p>
            </div>
          ))}
          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">Total:</span>
              <span className="text-xl font-bold">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
