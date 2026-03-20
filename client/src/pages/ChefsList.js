import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FiSearch } from 'react-icons/fi';

const ChefsList = () => {
  const [chefs, setChefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchChefs();
  }, []);

  const fetchChefs = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/chefs');
      setChefs(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredChefs = chefs.filter(chef =>
    chef.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
    chef.specialty?.toLowerCase().includes(search.toLowerCase())
  );

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
          <h1 className="text-4xl font-bold text-dark">
            Discover <span className="text-primary">Great Chefs</span>
          </h1>
          <p className="text-gray-500 mt-2">
            Browse talented chefs and explore their recipes
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md mx-auto mb-10">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search chefs by name or specialty..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-full pl-12 pr-4 py-3 focus:outline-none focus:border-primary transition"
          />
        </div>

        {/* Chefs Grid */}
        {filteredChefs.length === 0 ? (
          <div className="text-center text-gray-500 mt-20">
            <div className="text-6xl mb-4">👨‍🍳</div>
            <p className="text-xl">No chefs found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredChefs.map((chef) => (
              <Link
                to={`/chefs/${chef.user?._id}`}
                key={chef._id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden group"
              >
                {/* Chef Photo */}
                <div className="h-48 bg-orange-100 flex items-center justify-center overflow-hidden">
                  {chef.photo ? (
                    <img
                      src={chef.photo}
                      alt={chef.user?.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                  ) : (
                    <div className="text-6xl">👨‍🍳</div>
                  )}
                </div>

                {/* Chef Info */}
                <div className="p-4">
                  <h3 className="font-bold text-dark text-lg">{chef.user?.name}</h3>
                  {chef.specialty && (
                    <p className="text-primary text-sm font-medium mt-1">{chef.specialty}</p>
                  )}
                  {chef.location && (
                    <p className="text-gray-400 text-sm mt-1">📍 {chef.location}</p>
                  )}
                  {chef.bio && (
                    <p className="text-gray-500 text-sm mt-2 line-clamp-2">{chef.bio}</p>
                  )}
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-gray-400 text-xs">
                      {chef.followers?.length || 0} followers
                    </span>
                    <span className="text-primary text-sm font-medium">
                      View Profile →
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

export default ChefsList;