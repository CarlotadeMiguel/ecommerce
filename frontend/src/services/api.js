// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true, // Para cookies JWT httpOnly
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response && err.response.status === 401) {
      // Manejo global de auth
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;