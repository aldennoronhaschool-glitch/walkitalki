const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Send friend request
router.post('/request', async (req, res) => {
  try {
    const { toUserId } = req.body;
    
    if (!toUserId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    
    if (toUserId === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot send friend request to yourself' });
    }
    
    const [fromUser, toUser] = await Promise.all([
      User.findById(req.user._id),
      User.findById(toUserId)
    ]);
    
    if (!toUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if already friends
    if (fromUser.friends.includes(toUserId)) {
      return res.status(400).json({ message: 'Already friends' });
    }
    
    // Check if request already exists
    const existingRequest = toUser.friendRequests.find(
      req => req.from.toString() === req.user._id.toString() && req.status === 'pending'
    );
    
    if (existingRequest) {
      return res.status(400).json({ message: 'Friend request already sent' });
    }
    
    // Add friend request
    toUser.friendRequests.push({
      from: req.user._id,
      status: 'pending'
    });
    
    await toUser.save();
    
    res.json({
      message: 'Friend request sent successfully',
      toUser: {
        id: toUser._id,
        username: toUser.username,
        uniqueId: toUser.uniqueId,
        avatar: toUser.avatar
      }
    });
  } catch (error) {
    console.error('Send friend request error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get friend requests
router.get('/requests', async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('friendRequests.from', 'username uniqueId avatar')
      .select('friendRequests');
    
    const pendingRequests = user.friendRequests.filter(req => req.status === 'pending');
    
    res.json(pendingRequests);
  } catch (error) {
    console.error('Get friend requests error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Respond to friend request
router.post('/request/respond', async (req, res) => {
  try {
    const { fromUserId, accepted } = req.body;
    
    if (!fromUserId || accepted === undefined) {
      return res.status(400).json({ message: 'User ID and response are required' });
    }
    
    const [fromUser, toUser] = await Promise.all([
      User.findById(fromUserId),
      User.findById(req.user._id)
    ]);
    
    if (!fromUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Find and update the friend request
    const friendRequest = toUser.friendRequests.find(
      req => req.from.toString() === fromUserId && req.status === 'pending'
    );
    
    if (!friendRequest) {
      return res.status(404).json({ message: 'Friend request not found' });
    }
    
    friendRequest.status = accepted ? 'accepted' : 'rejected';
    
    if (accepted) {
      // Add to friends list for both users
      if (!toUser.friends.includes(fromUserId)) {
        toUser.friends.push(fromUserId);
      }
      if (!fromUser.friends.includes(req.user._id)) {
        fromUser.friends.push(req.user._id);
      }
    }
    
    await Promise.all([toUser.save(), fromUser.save()]);
    
    res.json({
      message: accepted ? 'Friend request accepted' : 'Friend request rejected',
      fromUser: {
        id: fromUser._id,
        username: fromUser.username,
        uniqueId: fromUser.uniqueId,
        avatar: fromUser.avatar
      }
    });
  } catch (error) {
    console.error('Respond to friend request error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get friends list
router.get('/list', async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('friends', 'username uniqueId avatar isOnline lastSeen')
      .select('friends');
    
    res.json(user.friends);
  } catch (error) {
    console.error('Get friends list error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove friend
router.delete('/remove/:friendId', async (req, res) => {
  try {
    const { friendId } = req.params;
    
    const [user, friend] = await Promise.all([
      User.findById(req.user._id),
      User.findById(friendId)
    ]);
    
    if (!friend) {
      return res.status(404).json({ message: 'Friend not found' });
    }
    
    // Remove from both users' friends lists
    user.friends = user.friends.filter(id => id.toString() !== friendId);
    friend.friends = friend.friends.filter(id => id.toString() !== req.user._id.toString());
    
    await Promise.all([user.save(), friend.save()]);
    
    res.json({
      message: 'Friend removed successfully',
      removedFriend: {
        id: friend._id,
        username: friend.username,
        uniqueId: friend.uniqueId
      }
    });
  } catch (error) {
    console.error('Remove friend error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
