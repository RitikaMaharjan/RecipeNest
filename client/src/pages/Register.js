import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Register = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await register(formData.name, formData.email, formData.password);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (error) {
      if (error.response?.data?.errors) {
        error.response.data.errors.forEach(err => toast.error(err.msg));
      } else {
        toast.error(error.response?.data?.message || 'Registration failed');
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
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-0 left-0 text-9xl">🍳</div>
            <div className="absolute top-20 right-0 text-8xl">🥘</div>
            <div className="absolute bottom-0 left-20 text-8xl">🍱</div>
            <div className="absolute bottom-20 right-10 text-9xl">🧑‍🍳</div>
          </div>

          <div className="relative z-10">
            <h1 className="font-display text-7xl text-dark leading-tight mb-6">
              Register <br />Here, <br />
              <span className="text-primary">Chef!</span>
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed max-w-md">
              Join thousands of chefs sharing their passion for food and inspiring food lovers around the world.
            </p>

            {/* Stats */}
            <div className="flex gap-10 mt-10">
              <div>
                <h3 className="font-bold text-3xl text-dark">50+</h3>
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
              <h2 className="font-display text-3xl text-dark">Create account</h2>
              <p className="text-gray-400 mt-1 text-sm">Start sharing your recipes today</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1.5 block">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:border-primary transition text-sm"
                />
              </div>
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
                <label className="text-sm font-medium text-gray-600 mb-1.5 block">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:border-primary transition text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1.5 block">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:border-primary transition text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-primary text-white py-4 rounded-xl font-medium hover:opacity-90 transition text-sm mt-1"
              >
                {loading ? 'Creating account...' : 'Register'}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-gray-100"></div>
              <span className="text-gray-300 text-xs">or continue with</span>
              <div className="flex-1 h-px bg-gray-100"></div>
            </div>

            {/* Social Buttons */}
            <div className="flex gap-4 mb-4 justify-center">
              <button className="flex-1 h-12 flex items-center justify-center border border-gray-200 rounded-2xl hover:border-primary hover:bg-orange-50 transition gap-2">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#1877F2">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span className="text-sm text-gray-600 font-medium">Facebook</span>
              </button>
              <button className="flex-1 h-12 flex items-center justify-center border border-gray-200 rounded-2xl hover:border-primary hover:bg-orange-50 transition gap-2">
                <svg width="22" height="22" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span className="text-sm text-gray-600 font-medium">Google</span>
              </button>
              <button className="flex-1 h-12 flex items-center justify-center border border-gray-200 rounded-2xl hover:border-primary hover:bg-orange-50 transition gap-2">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#000">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <span className="text-sm text-gray-600 font-medium">Apple</span>
              </button>
            </div>

            <p className="text-center text-gray-400 text-sm mt-4">
              Already have an account?{' '}
              <Link to="/login" className="text-primary font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;