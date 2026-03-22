import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import axios from 'axios';
import { FiSearch, FiClock } from 'react-icons/fi';

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
{/* Trending Section */}
{recipes.length > 0 && (
  <div className="mb-12 -mx-4">
    <Swiper
      modules={[Autoplay, Pagination, Navigation]}
      slidesPerView={1}
      navigation
      pagination={{ clickable: true }}
      autoplay={{ delay: 4000, disableOnInteraction: false }}
      className="rounded-3xl overflow-hidden pb-10"
    >
      {recipes.slice(0, 5).map((recipe) => (
        <SwiperSlide key={recipe._id}>
          <Link to={`/recipes/${recipe._id}`} className="block relative h-[400px]">
            {/* Background Image */}
            {recipe.image ? (
              <img src={recipe.image} alt={recipe.title}
                   className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-orange-100" />
            )}
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

            {/* Content - Left aligned */}
            <div className="absolute inset-0 flex items-center px-16">
              <div className="max-w-lg">
                <div className="flex items-center gap-3 mb-3">
                  <span className="bg-primary text-white text-xs px-3 py-1 rounded-full">
                    {recipe.category}
                  </span>
                  <span className="text-orange-300 text-sm font-medium">🔥 Trending</span>
                </div>
                <h3 className="font-display text-5xl text-white leading-tight mb-3">
                  {recipe.title}
                </h3>
                <p className="text-gray-300 text-sm mb-6">
                  By <span className="text-white font-medium">{recipe.chef?.name}</span>
                  {recipe.averageRating > 0 && (
                    <span className="ml-3">⭐ {recipe.averageRating.toFixed(1)}</span>
                  )}
                </p>
                <span className="bg-primary text-white px-6 py-3 rounded-full font-medium hover:opacity-90 transition inline-block">
                  View Recipe →
                </span>
              </div>
            </div>
          </Link>
        </SwiperSlide>
      ))}
    </Swiper>
  </div>
)}

{/* Chef's Pick Section */}
{recipes.length > 0 && (
  <div className="mb-12">
    <div className="flex items-center justify-between mb-6">
      <h2 className="font-display text-2xl text-dark">
   <span className="text-primary">Chef's</span> Pick
  </h2>
      <span className="text-gray-400 text-sm">Swipe to explore</span>
    </div>

    <Swiper
      modules={[Autoplay, Pagination, Navigation]}
      spaceBetween={20}
      slidesPerView={1}
      navigation
      pagination={{ clickable: true }}
      autoplay={{ delay: 3000, disableOnInteraction: false }}
      breakpoints={{
        640: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
      }}
      className="pb-10"
    >
      {recipes.slice(0, 10).map((recipe) => (
        <SwiperSlide key={recipe._id}>
          <Link
            to={`/recipes/${recipe._id}`}
            className="relative rounded-3xl overflow-hidden h-72 block group"
          >
            {recipe.image ? (
              <img src={recipe.image} alt={recipe.title}
                   className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
            ) : (
              <div className="w-full h-full bg-orange-100 flex items-center justify-center text-6xl">🍽️</div>
            )}
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <span className="bg-primary text-white text-xs px-3 py-1 rounded-full font-medium">
                {recipe.category}
              </span>
              <h3 className="font-display text-xl text-white mt-2 line-clamp-1">{recipe.title}</h3>
              <div className="flex items-center justify-between mt-2">
                <p className="text-gray-300 text-sm">By {recipe.chef?.name}</p>
                <div className="flex items-center gap-1">
                  <span className="text-yellow-400 text-sm">★</span>
                  <span className="text-white text-sm">
                    {recipe.averageRating > 0 ? recipe.averageRating.toFixed(1) : 'New'}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </SwiperSlide>
      ))}
    </Swiper>
  </div>
)}
        {/* Recipes Grid */}
        <div className="flex items-center justify-between mb-6">
  <h2 className="font-display text-2xl text-dark">
    Discover <span className="text-primary">All Recipes</span>
  </h2>
</div>
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
    <span className="text-gray-400 text-xs">By {recipe.chef?.name}</span>
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