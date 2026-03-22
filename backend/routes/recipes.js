const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Recipe = require('../models/Recipe');

// @route   GET /api/recipes
// @desc    Get all recipes (with search & filter)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { search, category, sort } = req.query;

    let query = {};

    // Search by title
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    let recipes = Recipe.find(query).populate('chef', ['name']);

    // Sort
    if (sort === 'rating') {
      recipes = recipes.sort({ averageRating: -1 });
    } else if (sort === 'oldest') {
      recipes = recipes.sort({ createdAt: 1 });
    } else {
      recipes = recipes.sort({ createdAt: -1 });
    }

    const result = await recipes;
    res.json(result);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/recipes/chef/:chefId
// @desc    Get all recipes by a chef
// @access  Public
router.get('/chef/:chefId', async (req, res) => {
  try {
    const recipes = await Recipe.find({ chef: req.params.chefId })
      .sort({ createdAt: -1 });
    res.json(recipes);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/recipes/:id
// @desc    Get single recipe
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate('chef', ['name']);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    res.json(recipe);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/recipes
// @desc    Add new recipe
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
  const { title, description, category, tags, ingredients, instructions, image, cookingTime, difficulty, servings } = req.body;

    const recipe = new Recipe({
      chef: req.user.user.id,
      title,
      description,
      category,
      tags,
      ingredients,
      instructions,
      image,
      cookingTime,
      difficulty,
      servings
    });

    await recipe.save();
    res.json(recipe);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/recipes/:id
// @desc    Edit recipe
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    let recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // Make sure chef owns the recipe
    if (recipe.chef.toString() !== req.user.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

   const { title, description, category, tags, ingredients, instructions, image, cookingTime, difficulty, servings } = req.body;
    recipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          title,
          description,
          category,
          tags,
          ingredients,
          instructions,
          image,
          cookingTime,
          difficulty,
          servings,
          updatedAt: Date.now()
        }
      },
      { returnDocument: 'after' }
    );

    res.json(recipe);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/recipes/:id
// @desc    Delete recipe
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // Make sure chef owns the recipe
    if (recipe.chef.toString() !== req.user.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await recipe.deleteOne();
    res.json({ message: 'Recipe removed' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/recipes/:id/rate
// @desc    Rate and review a recipe
// @access  Private
router.post('/:id/rate', auth, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    const { rating, review } = req.body;

    // Check if already rated
    const alreadyRated = recipe.ratings.find(
      r => r.user.toString() === req.user.user.id
    );

    // Prevent chef from rating their own recipe
    if (recipe.chef.toString() === req.user.user.id) {
      return res.status(400).json({ message: 'You cannot rate your own recipe' });
    }

    if (alreadyRated) {
      // Update existing rating
      alreadyRated.rating = rating;
      alreadyRated.review = review;
    } else {
      // Add new rating
      recipe.ratings.push({
        user: req.user.user.id,
        rating,
        review
      });
    }

    // Calculate average rating
    recipe.averageRating = recipe.ratings.reduce(
      (acc, r) => acc + r.rating, 0) / recipe.ratings.length;

    await recipe.save();
    res.json(recipe);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;