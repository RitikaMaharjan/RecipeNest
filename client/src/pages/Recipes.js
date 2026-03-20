import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FiSearch } from 'react-icons/fi';

const categories = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack', 'Drink'];

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('newest');

  useEffect(() => {
    fetchRecipes();
  // eslint-disable-next-line
  }, []);

  const fetchRecipes = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/recipes');
      setRecipes(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRecipes = recipes
    .filter(recipe => {
      const matchSearch = recipe.title.toLowerCase().includes(search.toLowerCase());
      const matchCategory = category === 'All' || recipe.category === category;
      return matchSearch && matchCategory;
    })
    .sort((a, b) => {
      if (sort === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sort === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      if (sort === 'rating') return b.averageRating - a.averageRating;
      if (sort === 'name') return a.title.localeCompare(b.title);
      return 0;
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary px-4 py-12">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="font-display text-4xl text-dark mb-2">
            Explore <span className="text-primary">Recipes</span>
          </h1>
          <p className="text-gray-400">Discover delicious recipes from talented chefs</p>
        </div>

        {/* Search and Sort */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search recipes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-full pl-12 pr-4 py-3 focus:outline-none focus:border-primary transition"
            />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-white border border-gray-200 rounded-full px-4 py-3 focus:outline-none focus:border-primary transition"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="rating">Top Rated</option>
            <option value="name">A - Z</option>
          </select>
        </div>

 
{/* Category Filter */}
<div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide">
  {categories.map(cat => (
    <button
      key={cat}
      onClick={() => setCategory(cat)}
      className={`px-4 py-1.5 rounded-full text-xs font-medium transition border whitespace-nowrap flex-shrink-0 ${
        category === cat
          ? 'bg-primary text-white border-primary'
          : 'bg-white text-gray-500 border-gray-200 hover:border-primary hover:text-primary'
      }`}
    >
      {cat}
    </button>
  ))}
</div>

        {/* Recipes Grid */}
        {filteredRecipes.length === 0 ? (
          <div className="text-center text-gray-400 py-20">
            <div className="text-6xl mb-4">🍽️</div>
            <p className="text-xl">No recipes found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredRecipes.map((recipe) => (
              <Link
                to={`/recipes/${recipe._id}`}
                key={recipe._id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden group"
              >
                <div className="h-48 bg-orange-100 flex items-center justify-center overflow-hidden relative">
                  {recipe.image ? (
                    <img src={recipe.image} alt={recipe.title}
                         className="w-full h-full object-cover group-hover:scale-105 transition" />
                  ) : (
                    <span className="text-5xl">🍽️</span>
                  )}
                  <div className="absolute top-3 left-3">
                    <span className="text-xs text-primary font-medium bg-white px-2 py-1 rounded-full shadow-sm">
                      {recipe.category}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-display text-lg text-dark">{recipe.title}</h3>
                  <p className="text-gray-400 text-sm mt-1 line-clamp-2">{recipe.description}</p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400">★</span>
                      <span className="text-sm text-gray-400">
                        {recipe.averageRating > 0 ? recipe.averageRating.toFixed(1) : 'No ratings'}
                      </span>
                    </div>
                    <span className="text-gray-400 text-xs">
                      By {recipe.chef?.name}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Recipes;