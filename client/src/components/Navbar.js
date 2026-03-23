import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FiMenu, FiX, FiSearch } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/chefs?search=${search}`);
      setSearch('');
    }
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-6">
        
        {/* Logo */}
        <Link to="/" className="flex-shrink-0">
          <span className="font-display text-2xl">
            <span className="text-dark">Recipe</span>
            <span className="text-primary">Nest</span>
          </span>
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md relative">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search chefs or recipes..."
            className="w-full bg-secondary border border-gray-200 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary transition"
          />
        </form>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/chefs" className="text-gray-500 hover:text-primary transition text-sm font-medium">
            Chefs
          </Link>
          <Link to="/recipes" className="text-gray-500 hover:text-primary transition text-sm font-medium">
            Recipes
          </Link>
          <Link to="/about" className="text-gray-500 hover:text-primary transition text-sm font-medium">
            About
          </Link>
          {user ? (
            <>
              <Link to="/dashboard" className="text-gray-600 hover:text-primary transition font-medium text-sm">
                Dashboard
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">
                    {user.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-primary text-white px-4 py-2 rounded-full text-sm hover:opacity-90 transition"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-600 hover:text-primary transition font-medium text-sm">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-primary text-white px-4 py-2 rounded-full text-sm hover:opacity-90 transition"
              >
                Join as Chef
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-600"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Search */}
      <div className="md:hidden px-4 pb-3">
        <form onSubmit={handleSearch} className="relative">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search chefs or recipes..."
            className="w-full bg-secondary border border-gray-200 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary transition"
          />
        </form>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white px-4 pb-4 flex flex-col gap-3 border-t border-gray-100">
          <Link to="/chefs" className="text-gray-600 hover:text-primary transition py-2 font-medium"
            onClick={() => setMenuOpen(false)}>
            Chefs
          </Link>
          <Link to="/chefs" className="text-gray-600 hover:text-primary transition py-2 font-medium"
            onClick={() => setMenuOpen(false)}>
            Recipes
          </Link>
          {user ? (
            <>
              <Link to="/dashboard" className="text-gray-600 hover:text-primary transition py-2 font-medium"
                onClick={() => setMenuOpen(false)}>
                Dashboard
              </Link>
              <button
                onClick={() => { handleLogout(); setMenuOpen(false); }}
                className="bg-primary text-white px-4 py-2 rounded-full hover:opacity-90 transition text-left"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-600 hover:text-primary transition py-2 font-medium"
                onClick={() => setMenuOpen(false)}>
                Login
              </Link>
              <Link to="/register"
                className="bg-primary text-white px-4 py-2 rounded-full hover:opacity-90 transition"
                onClick={() => setMenuOpen(false)}>
                Join as Chef
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;