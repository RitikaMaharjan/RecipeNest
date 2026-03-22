import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FiShare2, FiUser, FiClock, FiUsers, FiBarChart2 } from 'react-icons/fi';

const RecipeDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [recipe, setRecipe] = useState(null);
  const [relatedRecipes, setRelatedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);

  useEffect(() => {
    fetchRecipe();
  // eslint-disable-next-line
  }, [id]);

  const fetchRecipe = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/recipes/${id}`);
      setRecipe(res.data);
      fetchRelatedRecipes(res.data.category, res.data._id);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedRecipes = async (category, currentId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/recipes?category=${category}`);
      setRelatedRecipes(res.data.filter(r => r._id !== currentId).slice(0, 4));
    } catch (error) {
      console.error(error);
    }
  };

  const handleRate = async () => {
    if (!user) { toast.error('Please login to rate recipes'); return; }
    if (rating === 0) { toast.error('Please select a rating'); return; }
    setSubmitting(true);
    try {
      await axios.post(`http://localhost:5000/api/recipes/${id}/rate`, { rating, review });
      toast.success('Rating submitted!');
      fetchRecipe();
      setRating(0);
      setReview('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const text = `Check out this recipe: ${recipe.title}`;
    const links = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      whatsapp: `https://wa.me/?text=${text} ${url}`
    };
    window.open(links[platform], '_blank');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 text-xl">Recipe not found</p>
      </div>
    );
  }

  const isOwnRecipe = user && recipe.chef?._id === user.id;

  return (
    <div className="min-h-screen bg-secondary">
      
      {/* Hero - Full Width */}
      <div className="relative h-[500px] overflow-hidden">
        {recipe.image ? (
          <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-orange-100 flex items-center justify-center text-8xl">🍽️</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-10 max-w-5xl mx-auto">
          <div className="flex gap-2 mb-3 flex-wrap">
            <span className="bg-primary text-white text-xs px-3 py-1 rounded-full">{recipe.category}</span>
            {recipe.tags?.map((tag, i) => (
              <span key={i} className="bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">#{tag}</span>
            ))}
          </div>
          <h1 className="font-display text-5xl text-white leading-tight">{recipe.title}</h1>
          <p className="text-gray-300 mt-2 text-lg">{recipe.description}</p>
          <div className="flex items-center gap-6 mt-4 flex-wrap">
            <Link to={`/chefs/${recipe.chef?._id}`} className="flex items-center gap-2 text-white hover:opacity-80 transition">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <FiUser size={14} />
              </div>
              <span className="text-sm">By <strong>{recipe.chef?.name}</strong></span>
            </Link>
            {recipe.cookingTime > 0 && (
              <span className="text-white text-sm flex items-center gap-1"><FiClock size={14} /> {recipe.cookingTime} mins</span>
            )}
            {recipe.servings > 0 && (
              <span className="text-white text-sm flex items-center gap-1"><FiUsers size={14} /> {recipe.servings} servings</span>
            )}
            {recipe.difficulty && (
              <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                recipe.difficulty === 'Easy' ? 'bg-green-500/80 text-white' :
                recipe.difficulty === 'Medium' ? 'bg-yellow-500/80 text-white' :
                'bg-red-500/80 text-white'
              }`}>{recipe.difficulty}</span>
            )}
            <div className="flex items-center gap-1">
              <span className="text-yellow-400">★</span>
              <span className="text-white text-sm">
                {recipe.averageRating > 0 ? recipe.averageRating.toFixed(1) : 'New'}
                <span className="text-gray-300 ml-1">({recipe.ratings?.length})</span>
              </span>
            </div>
          </div>
        </div>
        <Link to="/recipes" className="absolute top-6 left-6 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm hover:bg-white/30 transition">
          ← Back
        </Link>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Left - Ingredients */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl p-6 sticky top-24">
              <h2 className="font-display text-xl text-dark mb-5">Ingredients</h2>
              <ul className="flex flex-col gap-3">
                {recipe.ingredients?.map((ingredient, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-600 text-sm pb-3 border-b border-gray-50 last:border-0">
                    <span className="w-5 h-5 bg-orange-100 text-primary rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    {ingredient}
                  </li>
                ))}
              </ul>
              <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-gray-400 text-xs mb-3 flex items-center gap-1"><FiShare2 size={12} /> Share Recipe</p>
                <div className="flex gap-2 flex-wrap">
                  <button onClick={() => handleShare('facebook')} className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs hover:opacity-90 transition">Facebook</button>
                  <button onClick={() => handleShare('twitter')} className="bg-sky-500 text-white px-3 py-1 rounded-full text-xs hover:opacity-90 transition">Twitter</button>
                  <button onClick={() => handleShare('whatsapp')} className="bg-green-500 text-white px-3 py-1 rounded-full text-xs hover:opacity-90 transition">WhatsApp</button>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Instructions + Rest */}
          <div className="md:col-span-2">
            <h2 className="font-display text-2xl text-dark mb-5">Instructions</h2>
            <div className="flex flex-col gap-4 mb-10">
              {recipe.instructions?.map((step, i) => (
                <div key={i} className="bg-white rounded-2xl p-5 flex gap-4">
                  <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {i + 1}
                  </span>
                  <p className="text-gray-600 leading-relaxed pt-0.5">{step}</p>
                </div>
              ))}
            </div>

            {/* Chef Card */}
            <div className="bg-white rounded-2xl p-6 mb-8">
              <h2 className="font-display text-xl text-dark mb-4">About the Chef</h2>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <FiUser size={24} className="text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-dark">{recipe.chef?.name}</h3>
                  <p className="text-gray-400 text-sm">Professional Chef</p>
                </div>
                <Link to={`/chefs/${recipe.chef?._id}`}
                  className="border border-primary text-primary px-4 py-2 rounded-full text-sm font-medium hover:bg-primary hover:text-white transition">
                  View Profile
                </Link>
              </div>
            </div>

            {/* Ratings */}
            <div className="mb-8">
              <h2 className="font-display text-2xl text-dark mb-6">Ratings & Reviews</h2>
              {user && !isOwnRecipe && (
                <div className="bg-white rounded-2xl p-6 mb-4">
                  <h3 className="font-medium text-dark mb-3">Leave a Review</h3>
                  <div className="flex gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star} onClick={() => setRating(star)}
                        onMouseEnter={() => setHoveredStar(star)}
                        onMouseLeave={() => setHoveredStar(0)}
                        className="text-3xl transition">
                        <span className={star <= (hoveredStar || rating) ? 'text-yellow-400' : 'text-gray-200'}>★</span>
                      </button>
                    ))}
                  </div>
                  <textarea value={review} onChange={(e) => setReview(e.target.value)}
                    placeholder="Share your experience..."
                    rows={3}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition resize-none text-sm" />
                  <button onClick={handleRate} disabled={submitting}
                    className="mt-3 bg-primary text-white px-6 py-2 rounded-full text-sm hover:opacity-90 transition">
                    {submitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>
              )}
              {isOwnRecipe && (
                <div className="bg-orange-50 rounded-2xl p-4 mb-4">
                  <p className="text-primary text-sm">This is your recipe — you cannot rate your own recipe.</p>
                </div>
              )}
              {!user && (
                <div className="bg-white rounded-2xl p-4 mb-4">
                  <p className="text-gray-400 text-sm">
                    <Link to="/login" className="text-primary hover:underline font-medium">Login</Link> to leave a review
                  </p>
                </div>
              )}
              {recipe.ratings?.length === 0 ? (
                <p className="text-gray-400 text-center py-8 bg-white rounded-2xl">No reviews yet. Be the first!</p>
              ) : (
                <div className="flex flex-col gap-4">
                  {recipe.ratings?.map((r, i) => (
                    <div key={i} className="bg-white rounded-2xl p-5 flex gap-4">
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <FiUser size={16} className="text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-dark text-sm">Chef</span>
                          <span className="text-yellow-400">{'★'.repeat(r.rating)}</span>
                          <span className="text-gray-200">{'★'.repeat(5 - r.rating)}</span>
                        </div>
                        {r.review && <p className="text-gray-500 text-sm mt-1">{r.review}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Related Recipes */}
            {relatedRecipes.length > 0 && (
              <div>
                <h2 className="font-display text-2xl text-dark mb-6">
                  You May Also <span className="text-primary">Like</span>
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {relatedRecipes.map((r) => (
                    <Link to={`/recipes/${r._id}`} key={r._id}
                      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition group">
                      <div className="h-32 bg-orange-100 overflow-hidden">
                        {r.image ? (
                          <img src={r.image} alt={r.title}
                               className="w-full h-full object-cover group-hover:scale-105 transition" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-3xl">🍽️</div>
                        )}
                      </div>
                      <div className="p-3">
                        <h4 className="font-bold text-dark text-sm line-clamp-1">{r.title}</h4>
                        <p className="text-gray-400 text-xs mt-1">{r.category}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;