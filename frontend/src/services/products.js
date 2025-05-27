// src/services/products.js
import api from "./api";

export const getProducts = async (params) => {
  const res = await api.get("/products", { params });
  return res.data;
};

export const getProduct = async (id) => {
  const res = await api.get(`/products/${id}`);
  return res.data;
};
