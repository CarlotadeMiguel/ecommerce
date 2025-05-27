// src/components/auth/LoginForm.js
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const validate = () => {
        const newErrors = {};
        if (!email) newErrors.email = 'Email requerido';
        if (!/^\S+@\S+\.\S+$/.test(email)) newErrors.email = 'Email inválido';
        if (!password) newErrors.password = 'Contraseña requerida';
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            return setErrors(validationErrors);
        }

        try {
            setLoading(true);
            await login({ email, password });
            navigate('/');
        } catch (error) {
            setErrors({ general: error.response?.data?.error || 'Error en el login' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                {errors.general && <div className="text-red-500 mb-4">{errors.general}</div>}

                <div className="mb-4">
                    <label className="block mb-2">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`w-full p-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
                </div>

                <div className="mb-6">
                    <label className="block mb-2">Contraseña</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`w-full p-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.password && <span className="text-red-500 text-sm">{errors.password}</span>}
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                </button>
            </form>
            <div className="mt-4 text-center">
                <p className="text-gray-600">¿No tienes cuenta? <Link to="/register" className="text-blue-600 hover:underline">Regístrate</Link></p>
            </div>
        </>
    );
};

export default LoginForm;
