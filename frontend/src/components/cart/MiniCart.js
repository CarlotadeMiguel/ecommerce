// src/components/cart/MiniCart.jsx
import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

const MiniCart = () => {
  const { cart } = useContext(CartContext);
  const { user } = useAuth();
  const location = useLocation();

  // Solo mostrar en la ruta principal y si el usuario está autenticado
  if (location.pathname !== "/" || !user) return null;

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Link to="/cart" className="fixed bottom-4 right-4 z-50 bg-blue-600 text-white rounded-full shadow-lg px-5 py-3 flex items-center space-x-2 hover:bg-blue-700 transition">
      <span className="material-icons">shopping_cart</span>
      <span>Carrito</span>
      <span className="bg-white text-blue-700 rounded-full px-2 ml-2 font-bold">{itemCount}</span>
    </Link>
  );
};

export default MiniCart;
