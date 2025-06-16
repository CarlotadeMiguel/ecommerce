// src/pages/CheckoutPage.js
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
  const [formTouched, setFormTouched] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'España'
  });

  // Validación de campos de envío
  const validateShipping = (fields = shippingInfo) => {
    const errors = {};
    if (!fields.name.trim()) errors.name = "El nombre es obligatorio";
    if (!fields.address.trim()) errors.address = "La dirección es obligatoria";
    if (!fields.city.trim()) errors.city = "La ciudad es obligatoria";
    if (!fields.postalCode.trim()) errors.postalCode = "El código postal es obligatorio";
    if (!fields.country.trim()) errors.country = "El país es obligatorio";
    return errors;
  };

  useEffect(() => {
    if (formTouched) setFormErrors(validateShipping());
  }, [shippingInfo, formTouched]);

  useEffect(() => {
    if (cart.length > 0 && total > 0) {
      api.post('/orders/create-payment-intent', { amount: total })
        .then(res => setClientSecret(res.data.clientSecret))
        .catch(() => alert('Error al inicializar el pago'));
    }
  }, [cart, total]);

  const handleInputChange = (e) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
    setFormTouched(true);
  };

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

  const isFormValid = Object.keys(validateShipping()).length === 0;

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
                className={`w-full p-2 border rounded-md ${formErrors.name ? 'border-red-500' : ''}`}
                required
              />
              {formTouched && formErrors.name && <p className="text-red-500 text-xs">{formErrors.name}</p>}
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
                  className={`w-full p-2 border rounded-md ${formErrors.city ? 'border-red-500' : ''}`}
                  required
                />
                {formTouched && formErrors.city && <p className="text-red-500 text-xs">{formErrors.city}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Código Postal</label>
                <input
                  type="text"
                  name="postalCode"
                  value={shippingInfo.postalCode}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded-md ${formErrors.postalCode ? 'border-red-500' : ''}`}
                  required
                />
                {formTouched && formErrors.postalCode && <p className="text-red-500 text-xs">{formErrors.postalCode}</p>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">País</label>
              <select
                name="country"
                value={shippingInfo.country}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded-md ${formErrors.country ? 'border-red-500' : ''}`}
              >
                <option>España</option>
                <option>México</option>
                <option>Estados Unidos</option>
              </select>
              {formTouched && formErrors.country && <p className="text-red-500 text-xs">{formErrors.country}</p>}
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
                  disabled={!isFormValid}
                />
              </Elements>
            )}
            {!isFormValid && (
              <div className="text-red-500 text-sm mt-2">
                Por favor, completa todos los campos de envío antes de pagar.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
