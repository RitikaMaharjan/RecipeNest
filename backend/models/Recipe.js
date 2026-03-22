const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
  chef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack', 'Drink', ],
    required: true
  },
  tags: [
    {
      type: String
    }
  ],
  ingredients: [
    {
      type: String,
      required: true
    }
  ],
  instructions: [
    {
      type: String,
      required: true
    }
  ],
  image: {
    type: String,
    default: ''
  },
  cookingTime: {
    type: Number,
    default: 0
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Easy'
  },
  servings: {
    type: Number,
    default: 2
  },
  ratings: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      rating: {
        type: Number,
        min: 1,
        max: 5
      },
      review: {
        type: String
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  averageRating: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Recipe', RecipeSchema);