import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FiEdit, FiTrash2, FiPlus, FiUser, FiBook, FiStar, FiUsers, FiCamera, FiUpload } from 'react-icons/fi';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [profileForm, setProfileForm] = useState({
    bio: '',
    specialty: '',
    location: '',
    social: {
      instagram: '',
      facebook: '',
      youtube: ''
    }
  });
  const [updating, setUpdating] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);

  useEffect(() => {
    fetchData();
  // eslint-disable-next-line
  }, []);

  const fetchData = async () => {
    try {
      const [recipesRes, profileRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/recipes/chef/${user.id}`),
        axios.get(`http://localhost:5000/api/chefs/${user.id}`)
      ]);
      setRecipes(recipesRes.data);
      setProfile(profileRes.data);
      setProfileForm({
        bio: profileRes.data.bio || '',
        specialty: profileRes.data.specialty || '',
        location: profileRes.data.location || '',
        social: {
          instagram: profileRes.data.social?.instagram || '',
          facebook: profileRes.data.social?.facebook || '',
          youtube: profileRes.data.social?.youtube || ''
        }
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRecipe = async (id) => {
    if (!window.confirm('Are you sure you want to delete this recipe?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/recipes/${id}`);
      toast.success('Recipe deleted');
      setRecipes(recipes.filter(r => r._id !== id));
    } catch (error) {
      toast.error('Failed to delete recipe');
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const res = await axios.put(`http://localhost:5000/api/chefs/${user.id}`, profileForm);
      setProfile(res.data);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const data = new FormData();
    data.append('image', file);
    setUploadingPhoto(true);
    try {
      const res = await axios.post('http://localhost:5000/api/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      await axios.put(`http://localhost:5000/api/chefs/${user.id}`, {
        ...profileForm,
        photo: res.data.imageUrl,
        coverImage: profile?.coverImage || ''
      });
      setProfile(prev => ({ ...prev, photo: res.data.imageUrl }));
      toast.success('Profile photo updated!');
    } catch (error) {
      toast.error('Failed to upload photo');
    } finally {
      setUploadingPhoto(false);
    }
  };
  
  const handleCoverUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const data = new FormData();
    data.append('image', file);
    setUploadingCover(true);
    try {
      const res = await axios.post('http://localhost:5000/api/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      await axios.put(`http://localhost:5000/api/chefs/${user.id}`, {
        ...profileForm,
        photo: profile?.photo || '',
        coverImage: res.data.imageUrl
      });
      setProfile(prev => ({ ...prev, coverImage: res.data.imageUrl }));
      toast.success('Cover image updated!');
    } catch (error) {
      toast.error('Failed to upload cover image');
    } finally {
      setUploadingCover(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const totalReviews = recipes.reduce((acc, r) => acc + (r.ratings?.length || 0), 0);
  const avgRating = recipes.length > 0
    ? (recipes.reduce((acc, r) => acc + r.averageRating, 0) / recipes.length).toFixed(1)
    : '0';

  return (
    <div className="min-h-screen bg-secondary">

      {/* Cover Image */}
{/* Cover Image */}
<div className="relative h-56 bg-gradient-to-r from-orange-100 to-orange-200 overflow-hidden">
  {profile?.coverImage ? (
    <img src={profile.coverImage} alt="cover" className="w-full h-full object-cover" />
  ) : (
    <div className="w-full h-full bg-gradient-to-r from-orange-100 via-orange-50 to-secondary" />
  )}
  <div className="absolute bottom-4 right-4 flex gap-2">
    {profile?.coverImage && (
      <button
        onClick={async () => {
          await axios.put(`http://localhost:5000/api/chefs/${user.id}`, { ...profileForm, coverImage: '' });
          setProfile(prev => ({ ...prev, coverImage: '' }));
          toast.success('Cover image removed!');
        }}
        className="bg-white text-red-400 px-3 py-2 rounded-full text-sm font-medium cursor-pointer hover:shadow-md transition flex items-center gap-2"
      >
        Remove Cover
      </button>
    )}
    <label className="bg-white text-gray-600 px-3 py-2 rounded-full text-sm font-medium cursor-pointer hover:shadow-md transition flex items-center gap-2">
      {uploadingCover ? 'Uploading...' : <><FiCamera size={16} /> Change Cover</>}
      <input type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
    </label>
  </div>
</div>

      <div className="max-w-6xl mx-auto px-4">

        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end gap-4 -mt-12 mb-8">
          {/* Profile Photo */}
{/* Profile Photo */}
<div className="relative">
  <div className="w-24 h-24 rounded-2xl bg-white border-4 border-white shadow-md overflow-hidden">
    {profile?.photo ? (
      <img src={profile.photo} alt={user?.name} className="w-full h-full object-cover" />
    ) : (
      <div className="w-full h-full bg-orange-100 flex items-center justify-center">
        <FiUser size={32} className="text-primary" />
      </div>
    )}
  </div>
  <label className="absolute -bottom-2 -right-2 w-7 h-7 bg-primary text-white rounded-full flex items-center justify-center cursor-pointer hover:opacity-90 transition shadow">
    {uploadingPhoto ? '...' : <FiCamera size={12} />}
    <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
  </label>
  {profile?.photo && (
    <button
      onClick={async () => {
        await axios.put(`http://localhost:5000/api/chefs/${user.id}`, { ...profileForm, photo: '', coverImage: profile?.coverImage || '' });
        setProfile(prev => ({ ...prev, photo: '' }));
        toast.success('Photo removed!');
      }}
      className="absolute -top-2 -right-2 w-6 h-6 bg-red-400 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition shadow text-xs"
    >
      ✕
    </button>
  )}
</div>

          {/* Name & Info */}
          <div className="flex-1 pb-2">
            <h1 className="font-display text-2xl text-dark">{user?.name}</h1>
            <p className="text-gray-400 text-sm mt-1">
              {profile?.specialty || 'Chef'} {profile?.location ? `· 📍 ${profile.location}` : ''}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pb-2">
            <Link
              to={`/chefs/${user.id}`}
              className="border border-gray-200 text-gray-600 px-4 py-2 rounded-full text-sm font-medium hover:border-primary hover:text-primary transition"
            >
              View Profile
            </Link>
            <Link
              to="/dashboard/add-recipe"
              className="bg-primary text-white px-4 py-2 rounded-full text-sm font-medium hover:opacity-90 transition flex items-center gap-2"
            >
              <FiPlus size={16} /> Add Recipe
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <FiBook size={20} className="text-primary" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-dark">{recipes.length}</h3>
              <p className="text-gray-400 text-xs">Recipes</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <FiUsers size={20} className="text-primary" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-dark">{profile?.followers?.length || 0}</h3>
              <p className="text-gray-400 text-xs">Followers</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <FiStar size={20} className="text-primary" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-dark">{totalReviews}</h3>
              <p className="text-gray-400 text-xs">Reviews</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <FiStar size={20} className="text-primary" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-dark">{avgRating}</h3>
              <p className="text-gray-400 text-xs">Avg Rating</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-white p-1 rounded-full w-fit shadow-sm">
          {['overview', 'recipes', 'profile'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-full font-medium text-sm transition capitalize ${
                activeTab === tab
                  ? 'bg-primary text-white'
                  : 'text-gray-500 hover:text-primary'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-dark mb-4">Quick Actions</h3>
              <div className="flex flex-col gap-3">
                <Link to="/dashboard/add-recipe"
                  className="flex items-center gap-3 p-3 bg-secondary rounded-xl hover:bg-orange-100 transition">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <FiPlus size={16} className="text-white" />
                  </div>
                  <span className="text-sm font-medium text-dark">Add New Recipe</span>
                </Link>
                <button onClick={() => setActiveTab('profile')}
                  className="flex items-center gap-3 p-3 bg-secondary rounded-xl hover:bg-orange-100 transition text-left">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <FiUser size={16} className="text-primary" />
                  </div>
                  <span className="text-sm font-medium text-dark">Edit Profile</span>
                </button>
                <Link to={`/chefs/${user.id}`}
                  className="flex items-center gap-3 p-3 bg-secondary rounded-xl hover:bg-orange-100 transition">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <FiUpload size={16} className="text-primary" />
                  </div>
                  <span className="text-sm font-medium text-dark">View Public Profile</span>
                </Link>
              </div>
            </div>

            {/* Recent Recipes */}
            <div className="bg-white rounded-2xl p-6 shadow-sm md:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-dark">Recent Recipes</h3>
                <button onClick={() => setActiveTab('recipes')}
                  className="text-primary text-sm hover:underline">View All</button>
              </div>
              {recipes.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <FiBook size={32} className="mx-auto mb-2 text-gray-200" />
                  <p className="text-sm">No recipes yet</p>
                  <Link to="/dashboard/add-recipe"
                    className="text-primary text-sm hover:underline mt-1 inline-block">
                    Add your first recipe
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {recipes.slice(0, 4).map(recipe => (
                    <div key={recipe._id} className="flex items-center gap-3 p-3 bg-secondary rounded-xl">
                      <div className="w-12 h-12 bg-orange-100 rounded-xl overflow-hidden flex-shrink-0">
                        {recipe.image ? (
                          <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xl">🍽️</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-dark text-sm truncate">{recipe.title}</h4>
                        <p className="text-gray-400 text-xs">{recipe.category} · {recipe.ratings?.length || 0} reviews</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link to={`/dashboard/edit-recipe/${recipe._id}`}
                          className="text-blue-400 hover:text-blue-600 transition">
                          <FiEdit size={16} />
                        </Link>
                        <button onClick={() => handleDeleteRecipe(recipe._id)}
                          className="text-red-300 hover:text-red-500 transition">
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Recipes Tab */}
        {activeTab === 'recipes' && (
          <div className="mb-8">
            {recipes.length === 0 ? (
              <div className="bg-white rounded-3xl p-16 text-center shadow-sm">
                <FiBook size={48} className="mx-auto mb-4 text-gray-200" />
                <h3 className="font-display text-xl text-dark mb-2">No recipes yet</h3>
                <p className="text-gray-400 mb-6">Start sharing your culinary creations!</p>
                <Link to="/dashboard/add-recipe"
                  className="bg-primary text-white px-6 py-3 rounded-full hover:opacity-90 transition inline-flex items-center gap-2">
                  <FiPlus size={18} /> Add Your First Recipe
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {recipes.map((recipe) => (
                  <div key={recipe._id} className="bg-white rounded-2xl shadow-sm overflow-hidden group">
                    <div className="h-44 bg-orange-100 flex items-center justify-center overflow-hidden relative">
                      {recipe.image ? (
                        <img src={recipe.image} alt={recipe.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition" />
                      ) : (
                        <span className="text-5xl">🍽️</span>
                      )}
                      <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                        <Link to={`/dashboard/edit-recipe/${recipe._id}`}
                          className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow text-blue-500 hover:text-blue-700">
                          <FiEdit size={14} />
                        </Link>
                        <button onClick={() => handleDeleteRecipe(recipe._id)}
                          className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow text-red-400 hover:text-red-600">
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      <span className="text-xs text-primary font-medium bg-orange-50 px-2 py-1 rounded-full">
                        {recipe.category}
                      </span>
                      <h3 className="font-bold text-dark mt-2">{recipe.title}</h3>
                      <p className="text-gray-400 text-sm mt-1 line-clamp-2">{recipe.description}</p>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-400">★</span>
                          <span className="text-sm text-gray-400">
                            {recipe.averageRating > 0 ? recipe.averageRating.toFixed(1) : 'No ratings'}
                          </span>
                        </div>
                        <Link to={`/recipes/${recipe._id}`}
                          className="text-primary text-sm font-medium hover:underline">
                          View →
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-3xl shadow-sm p-8 mb-8">
            <h2 className="font-display text-2xl text-dark mb-6">Edit Profile</h2>
            <form onSubmit={handleUpdateProfile} className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-600 mb-1 block">Bio</label>
                <textarea
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                  placeholder="Tell us about yourself..."
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition resize-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">Specialty</label>
                <input type="text" value={profileForm.specialty}
                  onChange={(e) => setProfileForm({ ...profileForm, specialty: e.target.value })}
                  placeholder="e.g. Italian Cuisine"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">Location</label>
                <input type="text" value={profileForm.location}
                  onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                  placeholder="e.g. London, UK"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">Instagram</label>
                <input type="text" value={profileForm.social.instagram}
                  onChange={(e) => setProfileForm({ ...profileForm, social: { ...profileForm.social, instagram: e.target.value } })}
                  placeholder="https://instagram.com/yourprofile"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">Facebook</label>
                <input type="text" value={profileForm.social.facebook}
                  onChange={(e) => setProfileForm({ ...profileForm, social: { ...profileForm.social, facebook: e.target.value } })}
                  placeholder="https://facebook.com/yourprofile"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">YouTube</label>
                <input type="text" value={profileForm.social.youtube}
                  onChange={(e) => setProfileForm({ ...profileForm, social: { ...profileForm.social, youtube: e.target.value } })}
                  placeholder="https://youtube.com/yourchannel"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition" />
              </div>
              <div className="md:col-span-2">
                <button type="submit" disabled={updating}
                  className="bg-primary text-white py-3 px-8 rounded-full font-medium hover:opacity-90 transition">
                  {updating ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;