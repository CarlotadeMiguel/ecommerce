import React, { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';

const StripePaymentForm = ({ total, shippingInfo, cart, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) return;

    setIsProcessing(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success`,
      },
      redirect: 'if_required'
    });

    if (error) {
      alert(error.message);
      setIsProcessing(false);
    } else {
      onSuccess(paymentIntent);  // Ejecuta la función pasada desde CheckoutPage
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      
      <button
        type="submit"
        disabled={isProcessing || !stripe}
        className={`w-full bg-blue-600 text-white py-3 rounded-lg transition
          ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
      >
        {isProcessing ? 'Procesando Pago...' : `Pagar $${total.toFixed(2)}`}
      </button>
    </form>
  );
};

export default StripePaymentForm;
