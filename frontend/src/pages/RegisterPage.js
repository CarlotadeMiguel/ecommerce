// src/pages/RegisterPage.js
import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import RegisterForm from '../components/auth/RegisterForm';


const RegisterPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/'); // Redirige a productos si ya está logueado
    }
  }, [user, navigate]);

<div className="min-h-screen flex items-center justify-center bg-gray-50">
  <div className="w-full max-w-md p-8 bg-white rounded shadow">
    <h2 className="text-2xl font-bold mb-6 text-center">Crear cuenta</h2>
    <RegisterForm />
  </div>
</div>
};

export default RegisterPage;
