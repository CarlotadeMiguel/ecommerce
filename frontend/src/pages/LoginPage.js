// src/pages/LoginPage.js
import React from 'react';
import LoginForm from '../components/auth/LoginForm';

const LoginPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="w-full max-w-md p-8 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Iniciar sesión</h2>
      <LoginForm />
    </div>
  </div>
);

export default LoginPage;
