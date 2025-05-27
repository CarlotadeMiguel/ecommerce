//src/context/AuthContext.js
import React, { createContext, useState, useEffect } from "react";
import { login as loginApi, register as registerApi, logout as logoutApi } from "../services/auth";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Aquí podrías validar el token con un endpoint como /auth/me
  }, []);

  const login = async (credentials) => {
    const data = await loginApi(credentials);
    setUser(data.user);
  };

  const register = async (info) => {
    const data = await registerApi(info);
    setUser(data.user);
  };

  const logout = async () => {
    await logoutApi();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
