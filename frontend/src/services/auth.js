// src/services/auth.js
import api from "./api";

export const register = async (data) => {
  const res = await api.post("/auth/register", data);
  return res.data;
};

export const login = async (data) => {
  const res = await api.post("/auth/login", data);
  return res.data;
};

export const logout = async () => {
  await api.post("/auth/logout");
};
