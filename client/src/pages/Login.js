import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(formData.email, formData.password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (error) {
      if (error.response?.data?.errors) {
        error.response.data.errors.forEach(err => toast.error(err.msg));
      } else {
        toast.error(error.response?.data?.message || 'Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary">
      <div className="max-w-7xl mx-auto px-4 py-16 flex flex-col md:flex-row items-center gap-16">

        {/* Left Side */}
        <div className="flex-1 relative">
          {/* Background food icons */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-0 left-0 text-9xl">🍕</div>
            <div className="absolute top-20 right-0 text-8xl">🍜</div>
            <div className="absolute bottom-0 left-20 text-8xl">🥗</div>
            <div className="absolute bottom-20 right-10 text-9xl">🍰</div>
          </div>

          <div className="relative z-10">
            <h1 className="font-display text-7xl text-dark leading-tight mb-6">
              Your Culinary <br />Journey, <br />
              <span className="text-primary">Starts Here!</span>
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed max-w-md">
              Share your recipes, grow your audience and connect with food lovers who appreciate your craft.
            </p>

            {/* Stats */}
            <div className="flex gap-10 mt-10">
              <div>
                <h3 className="font-bold text-3xl text-dark">20+</h3>
                <p className="text-gray-400 text-sm mt-1">Expert Chefs</p>
              </div>
              <div>
                <h3 className="font-bold text-3xl text-dark">200+</h3>
                <p className="text-gray-400 text-sm mt-1">Recipes Shared</p>
              </div>
              <div>
                <h3 className="font-bold text-3xl text-dark">1k+</h3>
                <p className="text-gray-400 text-sm mt-1">Food Lovers</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-[500px] flex-shrink-0">
          <div className="bg-white rounded-3xl shadow-sm p-10">

            <div className="mb-8">
              <h2 className="font-display text-3xl text-dark">Welcome back!</h2>
              <p className="text-gray-400 mt-1 text-sm">Sign in to your chef account</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1.5 block">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:border-primary transition text-sm"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-medium text-gray-600">Password</label>
                  <span className="text-xs text-primary cursor-pointer hover:underline">Forgot password?</span>
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:border-primary transition text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-primary text-white py-4 rounded-xl font-medium hover:opacity-90 transition text-sm mt-1"
              >
                {loading ? 'Signing in...' : 'Login'}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-gray-100"></div>
              <span className="text-gray-300 text-xs">or continue with</span>
              <div className="flex-1 h-px bg-gray-100"></div>
            </div>

            {/* Social Buttons */}
            <div className="flex gap-3 mb-4">
              <button className="flex-1 flex items-center justify-center gap-2 border border-gray-200 py-3 rounded-xl hover:border-primary hover:bg-orange-50 transition text-sm text-gray-600 font-medium">
                <span className="text-blue-600 font-bold text-base">f</span> Facebook
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 border border-gray-200 py-3 rounded-xl hover:border-primary hover:bg-orange-50 transition text-sm text-gray-600 font-medium">
                <span className="text-red-500 font-bold text-base">G</span> Google
              </button>
            </div>

            {/* Continue as Guest */}
            <Link to="/chefs"
              className="block w-full text-center border border-gray-200 text-gray-400 py-3 rounded-xl text-sm hover:border-primary hover:text-primary transition">
              Continue as Guest
            </Link>

            <p className="text-center text-gray-400 text-sm mt-6">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary font-medium hover:underline">
                Sign up free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;