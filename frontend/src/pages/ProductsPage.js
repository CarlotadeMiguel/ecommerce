// src/pages/ProductsPage.js
import React, { useEffect, useState } from 'react';
import { getProducts } from '../services/products';
import ProductList from '../components/products/ProductList';

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page] = useState(1);

  useEffect(() => {
    setLoading(true);
    getProducts({ page, limit: 12 })
      .then(res => {
        if (res.data?.products) {
          setProducts(res.data.products);
        }
      })
      .catch(error => {
        console.error('Error loading products:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [page]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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

      {/* Lista de productos */}
      <ProductList products={products} />
    </div>
  );
}

export default ProductsPage;
