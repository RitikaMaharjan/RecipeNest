import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FiInstagram, FiFacebook, FiYoutube, FiMapPin, FiShare2 } from 'react-icons/fi';

const ChefProfile = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState(false);

  useEffect(() => {
    fetchProfile();
    fetchRecipes();
  // eslint-disable-next-line
  }, [id]);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/chefs/${id}`);
      setProfile(res.data);
      if (user) {
        setFollowing(res.data.followers?.includes(user.id));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecipes = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/recipes/chef/${id}`);
      setRecipes(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFollow = async () => {
    if (!user) { toast.error('Please login to follow chefs'); return; }
    try {
      if (following) {
        await axios.post(`http://localhost:5000/api/chefs/${id}/unfollow`);
        toast.success('Unfollowed chef');
        setFollowing(false);
        setProfile(prev => ({ ...prev, followers: prev.followers.filter(f => f !== user.id) }));
      } else {
        await axios.post(`http://localhost:5000/api/chefs/${id}/follow`);
        toast.success('Following chef!');
        setFollowing(true);
        setProfile(prev => ({ ...prev, followers: [...prev.followers, user.id] }));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 text-xl">Chef not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary">

      {/* Cover Image */}
      <div className="h-48 bg-gradient-to-r from-orange-100 to-orange-200 overflow-hidden">
        {profile.coverImage && (
          <img src={profile.coverImage} alt="cover" className="w-full h-full object-cover" />
        )}
      </div>

      <div className="max-w-5xl mx-auto px-4">

        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow-sm p-6 -mt-10 mb-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">

            {/* Photo */}
          <div className="w-32 h-32 rounded-full bg-orange-100 overflow-hidden flex-shrink-0 -mt-16 border-4 border-white shadow-md">
          {profile.photo ? (
        <img src={profile.photo} alt={profile.user?.name} className="w-full h-full object-cover" />
) : (
    <div className="w-full h-full flex items-center justify-center text-4xl">👨‍🍳</div>
  )}
</div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="font-display text-3xl text-dark">{profile.user?.name}</h1>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    {profile.specialty && (
                      <span className="text-primary text-sm font-medium">{profile.specialty}</span>
                    )}
                    {profile.location && (
                      <span className="text-gray-400 text-sm flex items-center gap-1">
                        <FiMapPin size={12} /> {profile.location}
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                  {user && user.id !== id && (
                    <button
                      onClick={handleFollow}
                      className={`px-5 py-2 rounded-full text-sm font-medium transition ${
                        following
                          ? 'border-2 border-primary text-primary hover:bg-primary hover:text-white'
                          : 'bg-primary text-white hover:opacity-90'
                      }`}
                    >
                      {following ? 'Following' : 'Follow Chef'}
                    </button>
                  )}
                  <button className="w-9 h-9 border border-gray-200 rounded-full flex items-center justify-center text-gray-400 hover:border-primary hover:text-primary transition">
                    <FiShare2 size={16} />
                  </button>
                </div>
              </div>

              {/* Bio */}
              {profile.bio && (
                <p className="text-gray-500 text-sm mt-3 max-w-lg leading-relaxed">{profile.bio}</p>
              )}

              {/* Stats & Social */}
              <div className="flex items-center gap-8 mt-4 flex-wrap">
                <div className="text-center">
                  <h3 className="font-bold text-dark text-lg">{recipes.length}</h3>
                  <p className="text-gray-400 text-xs">Recipes</p>
                </div>
                <div className="text-center">
                  <h3 className="font-bold text-dark text-lg">{profile.followers?.length || 0}</h3>
                  <p className="text-gray-400 text-xs">Followers</p>
                </div>
                <div className="text-center">
                  <h3 className="font-bold text-dark text-lg">
                    {recipes.length > 0
                      ? (recipes.reduce((acc, r) => acc + r.averageRating, 0) / recipes.length).toFixed(1)
                      : '0'}
                  </h3>
                  <p className="text-gray-400 text-xs">Avg Rating</p>
                </div>

                {/* Social Links */}
                <div className="flex gap-3 ml-auto">
                  {profile.social?.instagram && (
                    <a href={profile.social.instagram} target="_blank" rel="noreferrer"
                      className="w-9 h-9 bg-orange-50 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition">
                      <FiInstagram size={16} />
                    </a>
                  )}
                  {profile.social?.facebook && (
                    <a href={profile.social.facebook} target="_blank" rel="noreferrer"
                      className="w-9 h-9 bg-orange-50 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition">
                      <FiFacebook size={16} />
                    </a>
                  )}
                  {profile.social?.youtube && (
                    <a href={profile.social.youtube} target="_blank" rel="noreferrer"
                      className="w-9 h-9 bg-orange-50 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition">
                      <FiYoutube size={16} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recipes Section */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl text-dark">
              Recipes by <span className="text-primary">{profile.user?.name}</span>
            </h2>
            <Link to={`/chefs/${id}/recipes`}
              className="text-primary text-sm font-medium hover:underline">
              See all →
            </Link>
          </div>

          {recipes.length === 0 ? (
            <div className="text-center text-gray-400 py-12 bg-white rounded-2xl">
              <div className="text-5xl mb-3">📖</div>
              <p>No recipes yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {recipes.slice(0, 6).map((recipe) => (
                <Link to={`/recipes/${recipe._id}`} key={recipe._id}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden group">
                  <div className="h-44 bg-orange-100 overflow-hidden relative">
                    {recipe.image ? (
                      <img src={recipe.image} alt={recipe.title}
                           className="w-full h-full object-cover group-hover:scale-105 transition" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-5xl">🍽️</div>
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
                        }`}>{recipe.difficulty}</span>
                      )}
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-400">★</span>
                        <span className="text-sm text-gray-400">
                          {recipe.averageRating > 0 ? recipe.averageRating.toFixed(1) : 'New'}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChefProfile;