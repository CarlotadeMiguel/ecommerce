//src/components/products/ProductCard.js

import React, { useContext } from "react";
import { CartContext } from "../../context/CartContext";

function ProductCard({ product }) {
  const { addItem } = useContext(CartContext);

  return (
    <div className="border rounded shadow p-4 flex flex-col items-center">
      <img src={product.image_url || "/default.jpg"} alt={product.name} className="w-32 h-32 object-cover mb-2" />
      <h4 className="font-bold">{product.name}</h4>
      <p className="text-gray-700">{product.description?.slice(0, 60)}...</p>
      <div className="font-bold text-lg my-2">{product.price} €</div>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded mt-auto"
        onClick={() => addItem(product.id, 1)}
      >
        Agregar al carrito
      </button>
    </div>
  );
}

export default ProductCard;
