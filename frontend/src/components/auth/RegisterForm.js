// src/components/auth/RegisterForm.jsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  // Validación de campos
  const validate = () => {
    const newErrors = {};
    if (!formData.name) {
      newErrors.name = 'El nombre es obligatorio';
    } else if (formData.name.length < 2 || formData.name.length > 50) {
      newErrors.name = 'El nombre debe tener entre 2 y 50 caracteres';
    }

    if (!formData.email) {
      newErrors.email = 'El email es obligatorio';
    } else if (!/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
      newErrors.email = 'El email no tiene formato válido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (formData.password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    } else if (!/(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}/.test(formData.password)) {
      newErrors.password = 'Debe tener mayúscula, número y símbolo';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Debes confirmar la contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    return newErrors;
  };

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      navigate('/');
    } catch (error) {
      setErrors({ general: error.response?.data?.error || 'Error en el registro' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        {errors.general && <div className="text-red-600 mb-4">{errors.general}</div>}

        <div className="mb-4">
          <label className="block mb-1 font-medium">Nombre</label>
          <input
            type="text"
            name="name"
            className={`w-full p-2 border rounded ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
            value={formData.name}
            onChange={handleChange}
            autoComplete="name"
          />
          {errors.name && <span className="text-red-500 text-sm">{errors.name}</span>}
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            name="email"
            className={`w-full p-2 border rounded ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
          />
          {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Contraseña</label>
          <input
            type="password"
            name="password"
            className={`w-full p-2 border rounded ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
            value={formData.password}
            onChange={handleChange}
            autoComplete="new-password"
          />
          {errors.password && <span className="text-red-500 text-sm">{errors.password}</span>}
          <span className="text-xs text-gray-500 block mt-1">
            Mínimo 8 caracteres, una mayúscula, un número y un símbolo.
          </span>
        </div>

        <div className="mb-6">
          <label className="block mb-1 font-medium">Confirmar contraseña</label>
          <input
            type="password"
            name="confirmPassword"
            className={`w-full p-2 border rounded ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
            value={formData.confirmPassword}
            onChange={handleChange}
            autoComplete="new-password"
          />
          {errors.confirmPassword && <span className="text-red-500 text-sm">{errors.confirmPassword}</span>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 transition-colors disabled:opacity-60"
        >
          {loading ? 'Registrando...' : 'Registrarse'}
        </button>
      </form>

      <div className="mt-4 text-center">
        <p className="text-gray-600">¿Ya tienes cuenta? <Link to="/login" className="text-blue-600 hover:underline">Inicia sesión</Link></p>
      </div>
    </>
  );
};

export default RegisterForm;
