import React, { useEffect, useState } from 'react';
import { getProducts } from '../services/products';
import ProductList from '../components/products/ProductList';
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page] = useState(1);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    getProducts({ page: 1, limit: 12 })
      .then(res => {
        if (res.data?.products) setProducts(res.data.products);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Catálogo de Productos
          </h1>
          <p className="text-gray-600">
            Descubre nuestra selección de productos de calidad
          </p>
        </div>
      </div>

      <div>
        {!user && (
          <div className="login-prompt">
            <p>Inicia sesión para añadir productos al carrito y comprar.</p>
            <button onClick={() => navigate("/login")}>Iniciar sesión</button>
          </div>
        )}
        <ProductList products={products} />
      </div>
    </div>
  );
}

export default ProductsPage;
