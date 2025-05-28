// src/components/auth/PrivateRoute.js
import React, { useEffect } from 'react';
import { useNavigate, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user) navigate('/login');
  }, [user, loading, navigate]);

  if (loading) {
    return <div className="text-center py-8">Verificando autenticación...</div>;
  }
  if (!user) return <Navigate to="/login" state={{ from: location }} />;

  return user ? children : null;
};

export default PrivateRoute;
