// src/components/common/Header.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { CartContext } from "../../context/CartContext";

const Header = () => {
  const { user, logout } = useAuth();
  const { cart } = React.useContext(CartContext);
  const navigate = useNavigate();
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="font-bold text-2xl text-blue-700 tracking-wide">
          MiEcommerce
        </Link>
        {/* Opciones de navegación */}
        <nav className="flex items-center gap-4">
          <Link to="/" className="text-gray-700 hover:text-blue-700 font-medium">Productos</Link>
          {/* Si quieres más enlaces, añádelos aquí */}
        </nav>
        {/* Acciones de usuario */}
        <div className="flex items-center gap-4">
          {/* Carrito */}
          <Link to="/cart" className="relative flex items-center group">
            <svg className="w-6 h-6 text-gray-600 group-hover:text-blue-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M3 3h2l.4 2M7 13h10l4-8H5.4" />
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
            </svg>
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full px-1.5">
                {itemCount}
              </span>
            )}
          </Link>
          {/* Usuario autenticado */}
          {user ? (
            <>
              <span className="text-gray-700 hidden sm:inline">Hola, {user.name || user.email}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition"
              >
                Logout
              </button>
              {/* Panel admin opcional */}
              {user.role === "admin" && (
                <Link to="/admin" className="bg-gray-800 text-white px-3 py-1 rounded hover:bg-gray-900">
                  Admin
                </Link>
              )}
            </>
          ) : (
            <>
              <Link to="/login" className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition">
                Iniciar sesión
              </Link>
              <Link to="/register" className="text-blue-600 hover:underline">
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
