import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FiShare2, FiClock, FiUser } from 'react-icons/fi';

const RecipeDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);

  useEffect(() => {
    fetchRecipe();
  }, [id]);

  const fetchRecipe = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/recipes/${id}`);
      setRecipe(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRate = async () => {
    if (!user) {
      toast.error('Please login to rate recipes');
      return;
    }
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    setSubmitting(true);
    try {
      await axios.post(`http://localhost:5000/api/recipes/${id}/rate`, {
        rating,
        review
      });
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

  return (
    <div className="min-h-screen bg-secondary px-4 py-12">
      <div className="max-w-4xl mx-auto">

        {/* Back Button */}
        <Link
          to={`/chefs/${recipe.chef?._id}/recipes`}
          className="text-primary font-medium hover:underline mb-6 inline-block"
        >
          ← Back to Recipes
        </Link>

        {/* Recipe Header */}
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden mb-8">
          {/* Image */}
          <div className="h-72 bg-orange-100 flex items-center justify-center overflow-hidden">
            {recipe.image ? (
              <img
                src={recipe.image}
                alt={recipe.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-8xl">🍽️</span>
            )}
          </div>

          <div className="p-8">
            {/* Category & Tags */}
            <div className="flex gap-2 flex-wrap mb-4">
              <span className="text-sm text-primary font-medium bg-orange-50 px-3 py-1 rounded-full">
                {recipe.category}
              </span>
              {recipe.tags?.map((tag, i) => (
                <span key={i} className="text-sm text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-dark">{recipe.title}</h1>
            <p className="text-gray-500 mt-2">{recipe.description}</p>

            {/* Chef & Rating */}
            <div className="flex items-center justify-between mt-4 flex-wrap gap-4">
              <Link
                to={`/chefs/${recipe.chef?._id}`}
                className="flex items-center gap-2 text-gray-500 hover:text-primary transition"
              >
                <FiUser size={18} />
                <span>By <strong>{recipe.chef?.name}</strong></span>
              </Link>
              <div className="flex items-center gap-1">
                <span className="text-yellow-400 text-xl">★</span>
                <span className="font-bold text-dark">
                  {recipe.averageRating > 0 ? recipe.averageRating.toFixed(1) : 'No ratings'}
                </span>
                <span className="text-gray-400 text-sm">
                  ({recipe.ratings?.length} reviews)
                </span>
              </div>
            </div>

            {/* Share Buttons */}
            <div className="flex items-center gap-3 mt-6">
              <span className="text-gray-500 text-sm flex items-center gap-1">
                <FiShare2 size={16} /> Share:
              </span>
              <button
                onClick={() => handleShare('facebook')}
                className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm hover:opacity-90 transition"
              >
                Facebook
              </button>
              <button
                onClick={() => handleShare('twitter')}
                className="bg-sky-500 text-white px-3 py-1 rounded-full text-sm hover:opacity-90 transition"
              >
                Twitter
              </button>
              <button
                onClick={() => handleShare('whatsapp')}
                className="bg-green-500 text-white px-3 py-1 rounded-full text-sm hover:opacity-90 transition"
              >
                WhatsApp
              </button>
            </div>
          </div>
        </div>

        {/* Ingredients & Instructions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Ingredients */}
          <div className="bg-white rounded-3xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-dark mb-4">🥗 Ingredients</h2>
            <ul className="flex flex-col gap-3">
              {recipe.ingredients?.map((ingredient, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-600">
                  <span className="w-6 h-6 bg-orange-100 text-primary rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {i + 1}
                  </span>
                  {ingredient}
                </li>
              ))}
            </ul>
          </div>

          {/* Instructions */}
          <div className="bg-white rounded-3xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-dark mb-4">📋 Instructions</h2>
            <ol className="flex flex-col gap-4">
              {recipe.instructions?.map((step, i) => (
                <li key={i} className="flex gap-3 text-gray-600">
                  <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Rating Section */}
        <div className="bg-white rounded-3xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold text-dark mb-6">⭐ Ratings & Reviews</h2>

          {/* Add Rating */}
          {user && (
            <div className="mb-8 pb-8 border-b border-gray-100">
              <h3 className="font-medium text-dark mb-3">Leave a Review</h3>
              {/* Stars */}
              <div className="flex gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                    className="text-3xl transition"
                  >
                    <span className={star <= (hoveredStar || rating) ? 'text-yellow-400' : 'text-gray-300'}>
                      ★
                    </span>
                  </button>
                ))}
              </div>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Write your review..."
                rows={3}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition resize-none"
              />
              <button
                onClick={handleRate}
                disabled={submitting}
                className="mt-3 bg-primary text-white px-6 py-2 rounded-full hover:opacity-90 transition"
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          )}

          {/* Reviews List */}
          {recipe.ratings?.length === 0 ? (
            <p className="text-gray-400 text-center py-4">No reviews yet. Be the first to review!</p>
          ) : (
            <div className="flex flex-col gap-4">
              {recipe.ratings?.map((r, i) => (
                <div key={i} className="flex gap-4 pb-4 border-b border-gray-100 last:border-0">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                    👤
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-dark">Chef</span>
                      <span className="text-yellow-400">{'★'.repeat(r.rating)}</span>
                    </div>
                    {r.review && <p className="text-gray-500 text-sm mt-1">{r.review}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;