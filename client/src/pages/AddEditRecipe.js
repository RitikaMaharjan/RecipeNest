import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FiPlus, FiTrash2, FiUpload } from 'react-icons/fi';

const categories = ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack', 'Drink'];

const AddEditRecipe = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Breakfast',
    tags: '',
    ingredients: [''],
    instructions: [''],
    image: ''
  });
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditing) {
      fetchRecipe();
    }
  }, [id]);

  const fetchRecipe = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/recipes/${id}`);
      const recipe = res.data;
      setFormData({
        title: recipe.title,
        description: recipe.description,
        category: recipe.category,
        tags: recipe.tags?.join(', ') || '',
        ingredients: recipe.ingredients?.length > 0 ? recipe.ingredients : [''],
        instructions: recipe.instructions?.length > 0 ? recipe.instructions : [''],
        image: recipe.image || ''
      });
    } catch (error) {
      toast.error('Failed to load recipe');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleIngredientChange = (index, value) => {
    const updated = [...formData.ingredients];
    updated[index] = value;
    setFormData({ ...formData, ingredients: updated });
  };

  const handleInstructionChange = (index, value) => {
    const updated = [...formData.instructions];
    updated[index] = value;
    setFormData({ ...formData, instructions: updated });
  };

  const addIngredient = () => {
    setFormData({ ...formData, ingredients: [...formData.ingredients, ''] });
  };

  const removeIngredient = (index) => {
    const updated = formData.ingredients.filter((_, i) => i !== index);
    setFormData({ ...formData, ingredients: updated });
  };

  const addInstruction = () => {
    setFormData({ ...formData, instructions: [...formData.instructions, ''] });
  };

  const removeInstruction = (index) => {
    const updated = formData.instructions.filter((_, i) => i !== index);
    setFormData({ ...formData, instructions: updated });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append('image', file);

    setUploading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFormData({ ...formData, image: res.data.imageUrl });
      toast.success('Image uploaded!');
    } catch (error) {
      toast.error('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
      ingredients: formData.ingredients.filter(i => i.trim()),
      instructions: formData.instructions.filter(i => i.trim())
    };

    setLoading(true);
    try {
      if (isEditing) {
        await axios.put(`http://localhost:5000/api/recipes/${id}`, payload);
        toast.success('Recipe updated successfully!');
      } else {
        await axios.post('http://localhost:5000/api/recipes', payload);
        toast.success('Recipe added successfully!');
      }
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary px-4 py-12">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-dark">
            {isEditing ? 'Edit ' : 'Add '} 
            <span className="text-primary">Recipe</span>
          </h1>
          <p className="text-gray-500 mt-1">
            {isEditing ? 'Update your recipe details' : 'Share a new recipe with food lovers'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">

          {/* Basic Info */}
          <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col gap-4">
            <h2 className="font-bold text-dark text-lg">Basic Information</h2>

            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">Recipe Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Classic Spaghetti Carbonara"
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your recipe..."
                rows={3}
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition resize-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">
                Tags <span className="text-gray-400">(comma separated)</span>
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="e.g. italian, pasta, quick"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition"
              />
            </div>
          </div>

          {/* Image Upload */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="font-bold text-dark text-lg mb-4">Recipe Image</h2>
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
              {formData.image ? (
                <div>
                  <img
                    src={formData.image}
                    alt="Recipe"
                    className="w-full h-48 object-cover rounded-xl mb-4"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, image: '' })}
                    className="text-red-400 hover:text-red-600 text-sm"
                  >
                    Remove Image
                  </button>
                </div>
              ) : (
                <div>
                  <FiUpload size={32} className="text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-400 mb-3">Upload a photo of your recipe</p>
                  <label className="bg-primary text-white px-4 py-2 rounded-full cursor-pointer hover:opacity-90 transition text-sm">
                    {uploading ? 'Uploading...' : 'Choose Image'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Ingredients */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="font-bold text-dark text-lg mb-4">Ingredients</h2>
            <div className="flex flex-col gap-3">
              {formData.ingredients.map((ingredient, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={ingredient}
                    onChange={(e) => handleIngredientChange(index, e.target.value)}
                    placeholder={`Ingredient ${index + 1}`}
                    className="flex-1 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition"
                  />
                  {formData.ingredients.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeIngredient(index)}
                      className="text-red-400 hover:text-red-600 transition"
                    >
                      <FiTrash2 size={20} />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addIngredient}
                className="flex items-center gap-2 text-primary font-medium hover:opacity-80 transition mt-2"
              >
                <FiPlus size={18} /> Add Ingredient
              </button>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="font-bold text-dark text-lg mb-4">Instructions</h2>
            <div className="flex flex-col gap-3">
              {formData.instructions.map((instruction, index) => (
                <div key={index} className="flex gap-2">
                  <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-3">
                    {index + 1}
                  </span>
                  <textarea
                    value={instruction}
                    onChange={(e) => handleInstructionChange(index, e.target.value)}
                    placeholder={`Step ${index + 1}`}
                    rows={2}
                    className="flex-1 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition resize-none"
                  />
                  {formData.instructions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeInstruction(index)}
                      className="text-red-400 hover:text-red-600 transition"
                    >
                      <FiTrash2 size={20} />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addInstruction}
                className="flex items-center gap-2 text-primary font-medium hover:opacity-80 transition mt-2"
              >
                <FiPlus size={18} /> Add Step
              </button>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-primary text-white px-8 py-3 rounded-full font-medium hover:opacity-90 transition"
            >
              {loading ? 'Saving...' : isEditing ? 'Update Recipe' : 'Add Recipe'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="border-2 border-gray-200 text-gray-500 px-8 py-3 rounded-full font-medium hover:border-primary hover:text-primary transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditRecipe;