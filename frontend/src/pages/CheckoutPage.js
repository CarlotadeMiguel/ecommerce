import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { createOrder } from '../services/orders';
import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from '../services/stripe';
import StripePaymentForm from '../components/checkout/StripePaymentForm';
import api from '../services/api';

const CheckoutPage = () => {
  const { cart, clearCart, total } = useContext(CartContext);
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState(null);
  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'España'
  });

  // Solicita el clientSecret al backend cuando el carrito o el total cambian
  useEffect(() => {
    if (cart.length > 0 && total > 0) {
      api.post('/orders/create-payment-intent', { amount: total })
        .then(res => setClientSecret(res.data.clientSecret))
        .catch(() => alert('Error al inicializar el pago'));
    }
  }, [cart, total]);

  // Maneja cambios en el formulario de envío
  const handleInputChange = (e) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  // Lógica tras pago exitoso con Stripe
  const handleCheckoutSuccess = async (paymentIntent) => {
    setIsProcessing(true);
    try {
      const orderData = {
        shipping: shippingInfo,
        payment_intent: paymentIntent.id,
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
          <form className="space-y-4" onSubmit={e => e.preventDefault()}>
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
          </form>
        </div>

        {/* Resumen de compra y pago */}
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
          {/* Stripe Elements para pago */}
          <div className="mt-6">
            {clientSecret && (
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <StripePaymentForm
                  total={total}
                  shippingInfo={shippingInfo}
                  cart={cart}
                  onSuccess={handleCheckoutSuccess}
                  isProcessing={isProcessing}
                />
              </Elements>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
