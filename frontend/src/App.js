import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import PrivateRoute from "./components/auth/PrivateRoute";
import ProductsPage from "./pages/ProductsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CartPage from "./pages/CartPage";
import Header from "./components/common/Header";
import MiniCart from "./components/cart/MiniCart";

function App() {
  return (
    <Router>
      <CartProvider>
      <Header />
      <MiniCart />
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<ProductsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Rutas protegidas */}
          <Route path="/cart" element={
            <PrivateRoute>
              <CartPage />
            </PrivateRoute>
          } />
          
        </Routes>
      </CartProvider>
    </Router>
  );
}

export default App;
