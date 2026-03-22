import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FiSearch, FiClock } from 'react-icons/fi';

const categories = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack', 'Drink'];

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
    <div className="min-h-screen bg-secondary">

      {/* Header Banner */}
      <div className="bg-white border-b border-gray-100 px-4 py-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <Link to={`/chefs/${id}`} className="text-gray-400 text-sm hover:text-primary transition mb-3 inline-block">
              ← Back to Profile
            </Link>
            <h1 className="font-display text-4xl text-dark">
              {profile?.user?.name}'s <span className="text-primary">Recipes</span>
            </h1>
            <p className="text-gray-400 mt-1">{recipes.length} recipes shared</p>
          </div>

          
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Filters Row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          {/* Category Pills */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
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

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-white border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-primary transition flex-shrink-0"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="rating">Top Rated</option>
            <option value="name">A - Z</option>
          </select>
        </div>

        {/* Recipes Grid */}
        {filteredRecipes.length === 0 ? (
          <div className="text-center text-gray-400 py-20">
            <div className="text-6xl mb-4">🍽️</div>
            <p className="text-xl">No recipes found</p>
          </div>
        ) : (
          <>
            {/* Featured First Recipe */}
            {filteredRecipes.length > 0 && (
              <Link
                to={`/recipes/${filteredRecipes[0]._id}`}
                className="block relative rounded-3xl overflow-hidden h-72 mb-6 group"
              >
                {filteredRecipes[0].image ? (
                  <img src={filteredRecipes[0].image} alt={filteredRecipes[0].title}
                       className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                ) : (
                  <div className="w-full h-full bg-orange-100 flex items-center justify-center text-6xl">🍽️</div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="bg-primary text-white text-xs px-3 py-1 rounded-full">
                    {filteredRecipes[0].category}
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h2 className="font-display text-3xl text-white">{filteredRecipes[0].title}</h2>
                  <div className="flex items-center gap-4 mt-2">
                    {filteredRecipes[0].cookingTime > 0 && (
                      <span className="text-gray-300 text-sm flex items-center gap-1">
                        <FiClock size={14} /> {filteredRecipes[0].cookingTime} mins
                      </span>
                    )}
                    {filteredRecipes[0].difficulty && (
                      <span className={`text-sm font-medium px-3 py-0.5 rounded-full ${
                        filteredRecipes[0].difficulty === 'Easy' ? 'bg-green-500/80 text-white' :
                        filteredRecipes[0].difficulty === 'Medium' ? 'bg-yellow-500/80 text-white' :
                        'bg-red-500/80 text-white'
                      }`}>{filteredRecipes[0].difficulty}</span>
                    )}
                    <span className="text-yellow-400 text-sm">
                      ★ {filteredRecipes[0].averageRating > 0 ? filteredRecipes[0].averageRating.toFixed(1) : 'New'}
                    </span>
                  </div>
                </div>
              </Link>
            )}

            {/* Rest of Recipes Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredRecipes.slice(1).map((recipe) => (
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
                    <div className="flex items-center justify-between mt-3">
                      {recipe.difficulty && (
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          recipe.difficulty === 'Easy' ? 'bg-green-100 text-green-600' :
                          recipe.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-600' :
                          'bg-red-100 text-red-600'
                        }`}>
                          {recipe.difficulty}
                        </span>
                      )}
                      {recipe.cookingTime > 0 && (
                        <span className="text-gray-400 text-xs flex items-center gap-1">
                          <FiClock size={11} /> {recipe.cookingTime} mins
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-2">
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
          </>
        )}
      </div>
    </div>
  );
};

export default RecipePortfolio;