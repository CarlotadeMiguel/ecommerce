// src/pages/ProductsPage.js
import React, { useEffect, useState } from 'react';
import { getProducts } from '../services/products';
import ProductCard from '../components/products/ProductCard';

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [page] = useState(1);

  useEffect(() => {
    getProducts({ page, limit: 12 })
      .then(res => {
        if (res.data?.products) {
          setProducts(res.data.products);
        }
      });
  }, [page]);

  return (
    <div className="product-grid">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export default ProductsPage;
