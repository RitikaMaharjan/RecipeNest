const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Profile = require('../models/Profile');
const User = require('../models/User');

// @route   GET /api/chefs
// @desc    Get all chefs
// @access  Public
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'email']);
    res.json(profiles);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/chefs/:id
// @desc    Get chef by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.params.id })
      .populate('user', ['name', 'email']);

    if (!profile) {
      return res.status(404).json({ message: 'Chef not found' });
    }

    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/chefs/:id
// @desc    Update chef profile
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const { bio, specialty, location, social, photo } = req.body;

    const profileFields = {};
    if (bio) profileFields.bio = bio;
    if (specialty) profileFields.specialty = specialty;
    if (location) profileFields.location = location;
    if (req.body.coverImage !== undefined) profileFields.coverImage = req.body.coverImage;
    if (social) profileFields.social = social;

    let profile = await Profile.findOne({ user: req.params.id });

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    // Make sure chef owns the profile
    if (profile.user.toString() !== req.user.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    profile = await Profile.findOneAndUpdate(
      { user: req.params.id },
      { $set: profileFields },
      { new: true }
    );

    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/chefs/:id/follow
// @desc    Follow a chef
// @access  Private
router.post('/:id/follow', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.params.id });

    if (!profile) {
      return res.status(404).json({ message: 'Chef not found' });
    }

    // Check if already following
    if (profile.followers.includes(req.user.user.id)) {
      return res.status(400).json({ message: 'Already following this chef' });
    }

    profile.followers.push(req.user.user.id);
    await profile.save();

    res.json({ message: 'Chef followed successfully', followers: profile.followers });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/chefs/:id/unfollow
// @desc    Unfollow a chef
// @access  Private
router.post('/:id/unfollow', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.params.id });

    if (!profile) {
      return res.status(404).json({ message: 'Chef not found' });
    }

    // Check if not following
    if (!profile.followers.includes(req.user.user.id)) {
      return res.status(400).json({ message: 'Not following this chef' });
    }

    profile.followers = profile.followers.filter(
      follower => follower.toString() !== req.user.user.id
    );
    await profile.save();

    res.json({ message: 'Chef unfollowed successfully', followers: profile.followers });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;