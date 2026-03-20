import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FiSearch } from 'react-icons/fi';

const categories = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack', 'Drink', 'Vegan', 'Vegetarian', 'Seafood', 'Grilling & BBQ', 'Pasta', 'Soup', 'Salad', 'Baking', 'Asian', 'Italian', 'Mexican', 'Indian', 'Middle Eastern', 'American', 'French', 'Healthy', 'Kids Friendly'];

const RecipePortfolio = () => {
  const { id } = useParams();
  const [recipes, setRecipes] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('newest');

  useEffect(() => {
    fetchRecipes();
    fetchProfile();
  // eslint-disable-next-line
  }, [id]);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/chefs/${id}`);
      setProfile(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchRecipes = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/recipes/chef/${id}`);
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
            {profile?.user?.name}'s <span className="text-primary">Recipes</span>
          </h1>
          <p className="text-gray-400 mt-1">{recipes.length} recipes shared</p>
          <Link to={`/chefs/${id}`} className="text-primary font-medium hover:underline mt-2 inline-block">
            ← Back to Profile
          </Link>
        </div>

        {/* Search and Filters */}
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
        <div className="flex gap-3 flex-wrap mb-8">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition border ${
                category === cat
                  ? 'bg-primary text-white border-primary shadow-sm'
                  : 'bg-white text-gray-500 border-gray-200 hover:border-primary hover:text-primary'
              }`}
            >
              {cat === 'All' && '🍽️ '}
              {cat === 'Breakfast' && '🥞 '}
              {cat === 'Lunch' && '🥗 '}
              {cat === 'Dinner' && '🍝 '}
              {cat === 'Dessert' && '🍰 '}
              {cat === 'Snack' && '🥨 '}
              {cat === 'Drink' && '🥤 '}
              {cat === 'Vegan' && '🌱 '}
              {cat === 'Vegetarian' && '🥦 '}
              {cat === 'Seafood' && '🦞 '}
              {cat === 'Grilling & BBQ' && '🔥 '}
              {cat === 'Pasta' && '🍝 '}
              {cat === 'Soup' && '🍲 '}
              {cat === 'Salad' && '🥙 '}
              {cat === 'Baking' && '🥐 '}
              {cat === 'Asian' && '🍜 '}
              {cat === 'Italian' && '🍕 '}
              {cat === 'Mexican' && '🌮 '}
              {cat === 'Indian' && '🍛 '}
              {cat === 'Middle Eastern' && '🧆 '}
              {cat === 'American' && '🍔 '}
              {cat === 'French' && '🥖 '}
              {cat === 'Healthy' && '💚 '}
              {cat === 'Kids Friendly' && '🧒 '}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
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
                    <span className="text-6xl">🍽️</span>
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
                  {recipe.tags?.length > 0 && (
                    <div className="flex gap-2 flex-wrap mt-2">
                      {recipe.tags.slice(0, 3).map((tag, i) => (
                        <span key={i} className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400">★</span>
                      <span className="text-sm text-gray-400">
                        {recipe.averageRating > 0 ? recipe.averageRating.toFixed(1) : 'No ratings'}
                      </span>
                    </div>
                    <span className="text-primary text-sm font-medium">View Recipe →</span>
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

export default RecipePortfolio;