// src/services/stripe.js
import { loadStripe } from '@stripe/stripe-js';

// Usa tu clave pública de Stripe (publishable key, empieza por pk_test_...)
export const stripePromise = loadStripe('pk_test_51RUBRhCBLtgnAtWjCEZQF5NHOnPhbnHjLFfrM62y9GK51RgwDaR83N408roChceMeBDzYfoEvuwr9RP5ifQynL1g002xJrkceK');