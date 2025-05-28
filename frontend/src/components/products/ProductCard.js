import React, { useContext } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';

const ProductCard = ({ product }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addItem } = useContext(CartContext);

  const handleAddToCart = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    addItem(product.id, 1);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-100">
      {/* Contenedor de imagen con overflow controlado */}
      <div className="relative overflow-hidden h-48 bg-gray-100">
        <img
          src={product.image_url || 'https://via.placeholder.com/300x200?text=Producto'}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Badge de stock */}
        <div className="absolute top-3 right-3">
          <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
            Stock: {product.stock}
          </span>
        </div>
      </div>
      {/* Contenido del producto */}
      <div className="p-5">
        {/* Categoría */}
        {product.category && (
          <span className="text-xs font-medium text-blue-600 uppercase tracking-wide">
            {product.category}
          </span>
        )}
        {/* Nombre del producto */}
        <h3 className="text-lg font-semibold text-gray-900 mt-1 mb-2 line-clamp-2">
          {product.name}
        </h3>
        {/* Descripción */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {product.description || 'Sin descripción disponible'}
        </p>
        {/* Precio y botón */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-gray-900">
              ${product.price.toFixed(2)}
            </span>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              product.stock === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 active:scale-95'
            }`}
          >
            {product.stock === 0 ? 'Sin Stock' : 'Añadir'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
