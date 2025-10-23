const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Get current user profile
router.get('/profile', async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('friends', 'username uniqueId avatar isOnline')
      .select('-password');
    
    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/profile', async (req, res) => {
  try {
    const { username, avatar } = req.body;
    const user = await User.findById(req.user._id);
    
    if (username) user.username = username;
    if (avatar) user.avatar = avatar;
    
    await user.save();
    
    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        uniqueId: user.uniqueId,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Search users by unique ID
router.get('/search/:uniqueId', async (req, res) => {
  try {
    const { uniqueId } = req.params;
    
    if (!uniqueId || uniqueId.length !== 8) {
      return res.status(400).json({ message: 'Invalid unique ID format' });
    }
    
    const user = await User.findOne({ 
      uniqueId: uniqueId.toUpperCase() 
    }).select('username uniqueId avatar isOnline');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if already friends
    const currentUser = await User.findById(req.user._id);
    const isFriend = currentUser.friends.includes(user._id);
    const hasPendingRequest = currentUser.friendRequests.some(
      req => req.from.toString() === user._id.toString() && req.status === 'pending'
    );
    
    res.json({
      user,
      isFriend,
      hasPendingRequest
    });
  } catch (error) {
    console.error('Search user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's unique ID
router.get('/unique-id', async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('uniqueId');
    res.json({ uniqueId: user.uniqueId });
  } catch (error) {
    console.error('Get unique ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user settings
router.put('/settings', async (req, res) => {
  try {
    const { notifications, audioQuality, videoQuality } = req.body;
    const user = await User.findById(req.user._id);
    
    if (notifications !== undefined) user.settings.notifications = notifications;
    if (audioQuality) user.settings.audioQuality = audioQuality;
    if (videoQuality) user.settings.videoQuality = videoQuality;
    
    await user.save();
    
    res.json({
      message: 'Settings updated successfully',
      settings: user.settings
    });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
