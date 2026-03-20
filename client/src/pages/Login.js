import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const { email, password } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-sm p-8 w-full max-w-md">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-dark">
            Welcome Back, <span className="text-primary">Chef!</span>
          </h1>
          <p className="text-gray-500 mt-2">Sign in to manage your recipes and profile</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1 block">Email</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600 mb-1 block">Password</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-primary text-white py-3 rounded-xl font-medium hover:opacity-90 transition mt-2"
          >
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="text-gray-400 text-sm">or</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary font-medium hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;