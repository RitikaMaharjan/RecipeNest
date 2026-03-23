import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import axios from 'axios';

const Landing = () => {
  const [chefs, setChefs] = useState([]);
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    fetchChefs();
    fetchRecipes();
  }, []);

  const fetchChefs = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/chefs');
      setChefs(res.data.slice(0, 4));
    } catch (error) {
      console.error(error);
    }
  };

  const fetchRecipes = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/recipes');
      setRecipes(res.data.slice(0, 6));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-secondary">

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col md:flex-row items-center justify-between gap-10">
        
        {/* Left Content */}
        <div className="flex-1">
          <span className="bg-orange-100 text-primary px-4 py-1 rounded-full text-sm font-medium">
        ✨ The Chef's Platform
      
          </span>
          <h1 className="font-display text-5xl md:text-6xl text-dark leading-tight mt-4">
          Cook. <br />
          <span className="text-primary">Share.</span> <br />
           Connect.
        </h1>
          <p className="mt-6 text-gray-500 text-lg max-w-md">
            A platform built for chefs to showcase their recipes and connect with food lovers around the world.
          </p>
          <div className="mt-8 flex gap-4 flex-wrap">
            <Link
              to="/chefs"
              className="bg-primary text-white px-6 py-3 rounded-full font-medium hover:opacity-90 transition flex items-center gap-2"
            >
              Find a Chef <FiArrowRight />
            </Link>
            <Link
              to="/register"
              className="border-2 border-primary text-primary px-6 py-3 rounded-full font-medium hover:bg-primary hover:text-white transition"
            >
              Join as Chef
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-12 flex gap-8">
            <div>
              <h3 className="text-3xl font-bold text-dark">50+</h3>
              <p className="text-gray-500 text-sm">Expert Chefs</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-dark">200+</h3>
              <p className="text-gray-500 text-sm">Recipes Shared</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-dark">1k+</h3>
              <p className="text-gray-500 text-sm">Food Lovers</p>
            </div>
          </div>
        </div>

        
{/* Right Content - Real Food Images */}
<div className="flex-1 grid grid-cols-2 gap-3">
  <div className="rounded-2xl overflow-hidden shadow-sm h-52">
    <img src="https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=600&auto=format&fit=crop&q=60" 
         alt="food" className="w-full h-full object-cover hover:scale-105 transition duration-300" />
  </div>
  <div className="rounded-2xl overflow-hidden shadow-sm h-52 mt-6">
    <img src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&auto=format&fit=crop&q=60" 
         alt="food" className="w-full h-full object-cover hover:scale-105 transition duration-300" />
  </div>
  <div className="rounded-2xl overflow-hidden shadow-sm h-52">
    <img src="https://images.unsplash.com/photo-1559847844-5315695dadae?w=600&auto=format&fit=crop&q=60" 
         alt="food" className="w-full h-full object-cover hover:scale-105 transition duration-300" />
  </div>
  <div className="rounded-2xl overflow-hidden shadow-sm h-52 mt-6">
    <img src="https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop&q=60" 
         alt="food" className="w-full h-full object-cover hover:scale-105 transition duration-300" />
  </div>
</div>

      </div>

      {/* How It Works */}
<div className="bg-white py-16">
  <div className="max-w-7xl mx-auto px-4">
    <h2 className="font-display text-4xl text-dark text-center mb-3">How It Works</h2>
    <p className="text-gray-400 text-center mb-12">Get started in just a few steps</p>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="text-center bg-secondary rounded-3xl p-8">
        <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h3 className="font-display text-xl text-dark mb-2">1. Create Account</h3>
        <p className="text-gray-400 text-sm leading-relaxed">Sign up as a chef and set up your professional profile in minutes.</p>
      </div>
      <div className="text-center bg-secondary rounded-3xl p-8">
        <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <h3 className="font-display text-xl text-dark mb-2">2. Share Recipes</h3>
        <p className="text-gray-400 text-sm leading-relaxed">Upload your recipes with ingredients, instructions and photos.</p>
      </div>
      <div className="text-center bg-secondary rounded-3xl p-8">
        <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <h3 className="font-display text-xl text-dark mb-2">3. Connect & Grow</h3>
        <p className="text-gray-400 text-sm leading-relaxed">Build your audience and connect with food lovers worldwide.</p>
      </div>
    </div>
  </div>
</div>

      {/* Featured Chefs */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-dark">Featured Chefs</h2>
            <p className="text-gray-500 mt-1">Meet our talented culinary professionals</p>
          </div>
          <Link to="/chefs" className="text-primary font-medium hover:underline flex items-center gap-1">
            View All <FiArrowRight size={16} />
          </Link>
        </div>

        {chefs.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[1,2,3,4].map(i => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm">
                <div className="h-48 bg-orange-100 flex items-center justify-center">
                  <img 
                    src={`https://images.unsplash.com/photo-${i === 1 ? '1583394293253-ced6e94fb3c4' : i === 2 ? '1577219491135-ce391730fb2c' : i === 3 ? '1581299894007-aaa50297cf16' : '1606914501449-5a96b6ce24ca'}?w=400`}
                    alt="chef"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-dark">Chef Profile</h3>
                  <p className="text-primary text-sm">Culinary Expert</p>
                  <p className="text-gray-400 text-sm mt-1">Join to see chef profiles</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {chefs.map((chef) => (
              <Link
                to={`/chefs/${chef.user?._id}`}
                key={chef._id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition group"
              >
                <div className="h-48 bg-orange-100 flex items-center justify-center overflow-hidden">
                  {chef.photo ? (
                    <img src={chef.photo} alt={chef.user?.name}
                         className="w-full h-full object-cover group-hover:scale-105 transition" />
                  ) : (
                    <img src="https://images.unsplash.com/photo-1583394293253-ced6e94fb3c4?w=400"
                         alt="chef" className="w-full h-full object-cover group-hover:scale-105 transition" />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-dark">{chef.user?.name}</h3>
                  <p className="text-primary text-sm">{chef.specialty || 'Chef'}</p>
                  <p className="text-gray-400 text-sm mt-1">{chef.followers?.length || 0} followers</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Featured Recipes */}
<div className="bg-white py-16">
  <div className="max-w-7xl mx-auto px-4">
    <div className="flex items-center justify-between mb-8">
      <div>
        <h2 className="font-display text-4xl text-dark">Top Rated</h2>
        <p className="text-gray-400 mt-1">Most loved recipes by our community</p>
      </div>
      <Link to="/chefs" className="text-primary font-medium hover:underline flex items-center gap-1">
        View All <FiArrowRight size={16} />
      </Link>
    </div>

    {recipes.length === 0 ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {[
          'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400',
          'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400',
          'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400',
          'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=400',
          'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=400',
          'https://images.unsplash.com/photo-1473093226795-af9932fe5856?w=400',
        ].map((img, i) => (
          <div key={i} className="bg-secondary rounded-2xl overflow-hidden shadow-sm group">
            <div className="h-48 overflow-hidden">
              <img src={img} alt="recipe" className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
            </div>
            <div className="p-4">
              <span className="text-xs text-primary font-medium bg-orange-50 px-2 py-1 rounded-full">Recipe</span>
              <h3 className="font-display text-lg text-dark mt-2">Delicious Recipe</h3>
              <p className="text-gray-400 text-sm mt-1">Register to see full recipes</p>
              <div className="flex items-center gap-1 mt-3">
                <span className="text-yellow-400 text-sm">★★★★★</span>
                
                
              </div>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <Link
            to={`/recipes/${recipe._id}`}
            key={recipe._id}
            className="bg-secondary rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition group"
          >
            <div className="h-48 overflow-hidden relative">
              {recipe.image ? (
                <img src={recipe.image} alt={recipe.title}
                     className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
              ) : (
                <img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400"
                     alt="recipe" className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
              )}
              <div className="absolute top-3 left-3">
                <span className="text-xs text-primary font-medium bg-white px-2 py-1 rounded-full shadow-sm">
                  {recipe.category}
                </span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-display text-lg text-dark mt-1">{recipe.title}</h3>
              
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-1">
                  <span className="text-yellow-400">★</span>
                  <span className="text-sm text-gray-400">
                    {recipe.averageRating > 0 ? recipe.averageRating.toFixed(1) : 'No ratings'}
                  </span>
                </div>
                <span className="text-primary text-sm font-medium">View →</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    )}
  </div>
</div>
      {/* Footer */}
      <footer className="bg-dark text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold mb-3">
                Recipe<span className="text-primary">Nest</span>
              </h3>
              <p className="text-gray-400 max-w-sm">
                A dedicated platform for culinary professionals to share their passion and connect with food lovers worldwide.
              </p>
            </div>
            {/* Links */}
            <div>
              <h4 className="font-bold mb-4">Platform</h4>
              <div className="flex flex-col gap-2">
                <Link to="/chefs" className="text-gray-400 hover:text-primary transition">Browse Chefs</Link>
                <Link to="/register" className="text-gray-400 hover:text-primary transition">Join as Chef</Link>
                <Link to="/login" className="text-gray-400 hover:text-primary transition">Login</Link>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-4">Connect</h4>
              <div className="flex flex-col gap-2">
                <a href="#" className="text-gray-400 hover:text-primary transition">Instagram</a>
                <a href="#" className="text-gray-400 hover:text-primary transition">Facebook</a>
                <a href="#" className="text-gray-400 hover:text-primary transition">YouTube</a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 text-center text-gray-500 text-sm">
            © 2026 RecipeNest. All rights reserved.
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Landing;