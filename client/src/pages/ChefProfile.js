import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FiInstagram, FiFacebook, FiYoutube, FiMapPin } from 'react-icons/fi';

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
    if (!user) {
      toast.error('Please login to follow chefs');
      return;
    }
    try {
      if (following) {
        await axios.post(`http://localhost:5000/api/chefs/${id}/unfollow`);
        toast.success('Unfollowed chef');
        setFollowing(false);
        setProfile(prev => ({
          ...prev,
          followers: prev.followers.filter(f => f !== user.id)
        }));
      } else {
        await axios.post(`http://localhost:5000/api/chefs/${id}/follow`);
        toast.success('Following chef!');
        setFollowing(true);
        setProfile(prev => ({
          ...prev,
          followers: [...prev.followers, user.id]
        }));
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
    <div className="min-h-screen bg-secondary px-4 py-12">
      <div className="max-w-5xl mx-auto">

        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow-sm p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">

            {/* Photo */}
            <div className="w-40 h-40 rounded-full bg-orange-100 flex items-center justify-center overflow-hidden flex-shrink-0">
              {profile.photo ? (
                <img
                  src={profile.photo}
                  alt={profile.user?.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-7xl">👨‍🍳</span>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-dark">{profile.user?.name}</h1>
              {profile.specialty && (
                <p className="text-primary font-medium mt-1">{profile.specialty}</p>
              )}
              {profile.location && (
                <p className="text-gray-400 mt-1 flex items-center gap-1 justify-center md:justify-start">
                  <FiMapPin size={14} /> {profile.location}
                </p>
              )}
              {profile.bio && (
                <p className="text-gray-500 mt-4 max-w-lg">{profile.bio}</p>
              )}

              {/* Stats */}
              <div className="flex gap-8 mt-6 justify-center md:justify-start">
                <div>
                  <h3 className="text-2xl font-bold text-dark">{recipes.length}</h3>
                  <p className="text-gray-400 text-sm">Recipes</p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-dark">{profile.followers?.length || 0}</h3>
                  <p className="text-gray-400 text-sm">Followers</p>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex gap-4 mt-4 justify-center md:justify-start">
                {profile.social?.instagram && (
                  <a href={profile.social.instagram} target="_blank" rel="noreferrer"
                    className="text-gray-400 hover:text-primary transition">
                    <FiInstagram size={22} />
                  </a>
                )}
                {profile.social?.facebook && (
                  <a href={profile.social.facebook} target="_blank" rel="noreferrer"
                    className="text-gray-400 hover:text-primary transition">
                    <FiFacebook size={22} />
                  </a>
                )}
                {profile.social?.youtube && (
                  <a href={profile.social.youtube} target="_blank" rel="noreferrer"
                    className="text-gray-400 hover:text-primary transition">
                    <FiYoutube size={22} />
                  </a>
                )}
              </div>

              {/* Follow Button */}
              {user && user.id !== id && (
                <button
                  onClick={handleFollow}
                  className={`mt-6 px-6 py-2 rounded-full font-medium transition ${
                    following
                      ? 'border-2 border-primary text-primary hover:bg-primary hover:text-white'
                      : 'bg-primary text-white hover:opacity-90'
                  }`}
                >
                  {following ? 'Following' : 'Follow Chef'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Recipes Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-dark">Recipes</h2>
            <Link
              to={`/chefs/${id}/recipes`}
              className="text-primary font-medium hover:underline"
            >
              View All →
            </Link>
          </div>

          {recipes.length === 0 ? (
            <div className="text-center text-gray-500 py-12 bg-white rounded-2xl">
              <div className="text-5xl mb-4">📖</div>
              <p>No recipes yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {recipes.slice(0, 6).map((recipe) => (
                <Link
                  to={`/recipes/${recipe._id}`}
                  key={recipe._id}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden group"
                >
                  <div className="h-40 bg-orange-100 flex items-center justify-center overflow-hidden">
                    {recipe.image ? (
                      <img
                        src={recipe.image}
                        alt={recipe.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition"
                      />
                    ) : (
                      <span className="text-5xl">🍽️</span>
                    )}
                  </div>
                  <div className="p-4">
                    <span className="text-xs text-primary font-medium bg-orange-50 px-2 py-1 rounded-full">
                      {recipe.category}
                    </span>
                    <h3 className="font-bold text-dark mt-2">{recipe.title}</h3>
                    <p className="text-gray-500 text-sm mt-1 line-clamp-2">{recipe.description}</p>
                    <div className="flex items-center gap-1 mt-2">
                      <span className="text-yellow-400">★</span>
                      <span className="text-sm text-gray-500">
                        {recipe.averageRating > 0 ? recipe.averageRating.toFixed(1) : 'No ratings'}
                      </span>
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