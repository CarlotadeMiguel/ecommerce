// src/components/auth/PrivateRoute.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate('/login');
  }, [user, loading, navigate]);

  if (loading) {
    return <div className="text-center py-8">Verificando autenticación...</div>;
  }

  return user ? children : null;
};

export default PrivateRoute;
