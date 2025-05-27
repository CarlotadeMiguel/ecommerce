import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProductsPage from "./pages/ProductsPage";
// Importa aquí otras páginas (HomePage, CartPage, etc.)

function App() {
  return (
    <Router>

      <Routes>
        <Route path="/" element={<ProductsPage />} />

      </Routes>

    </Router>
  );
}

export default App;
