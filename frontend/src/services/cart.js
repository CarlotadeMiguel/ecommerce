// src/services/cart.js
import api from "./api";

export const addToCart = async (productId, quantity = 1) => {
  try {
    const response = await api.post("/cart/add", {
      product_id: productId,
      quantity: quantity
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
      window.location = "/login";
    }
    throw error;
  }
};