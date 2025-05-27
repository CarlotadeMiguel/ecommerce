//src/pages/ProductsPage.js
import React, { useEffect, useState } from "react";
import { getProducts } from "../services/products";
import ProductCard from "../components/products/ProductCard";

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    getProducts({ page, limit: 12 }).then(res => setProducts(res.data.products));
  }, [page]);

  return (
    <div className="container mx-auto py-6">
      <h2 className="text-2xl font-bold mb-4">Catálogo de Productos</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {/* Aquí puedes poner controles de paginación */}
    </div>
  );
}

export default ProductsPage;

