//src/components/products/ProductList.js
import React, { useEffect, useState } from "react";
import { getProducts } from "../../services/products";
import ProductCard from "./ProductCard";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    getProducts({ page, limit: 12 }).then((data) => setProducts(data.products));
  }, [page]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
      {/* Paginación aquí */}
    </div>
  );
}

export default ProductList;
