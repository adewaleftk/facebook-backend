const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Route for listing friend requests
router.get('/users/:userId/friend-requests', async (req, res) => {
    try {
      const { userId } = req.params;
  
      // Find the user and populate the friendRequests array
      const user = await User.findById(userId).populate('friendRequests');
      const currentUser = req.user;
    

      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }
  
      const friendRequests = user.friendRequests;
  
      res.render('friendRequests', { currentUser, friendRequests });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to retrieve friend requests.' });
    }
});  

// Route for sending Friend request
router.post('/users/:userId/friend-requests', async (req, res) => {
  try {
    const { userId } = req.params;
    const { friendId } = req.body;

    const currentUser = await User.findById(userId);
    const friendUser = await User.findById(friendId);

    if (!currentUser || !friendUser) {
      return res.status(404).json({ error: 'User not found.' });
    }

    currentUser.friendRequests.push(friendUser._id);
    friendUser.friendRequests.push(currentUser._id);

    await currentUser.save();
    await friendUser.save();

    res.status(200).json({ message: 'Friend request sent successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to send friend request.' });
  }
});


//Route for accepting friend request
router.post('/users/:userId/friend-requests/:friendRequestId/accept', async (req, res) => {
    try {
        const { userId, friendRequestId } = req.params;
    
        // Find the current user and the friend request to accept
        const currentUser = await User.findById(userId);
        const friendRequest = await User.findById(friendRequestId);
    
        // Remove the friend request from both users' friend requests
        currentUser.friendRequests = currentUser.friendRequests.filter(requestId => requestId.toString() !== friendRequest._id.toString());
        friendRequest.friendRequests = friendRequest.friendRequests.filter(requestId => requestId.toString() !== currentUser._id.toString());
    
        // Add the friend to both users' friends list
        currentUser.friends.push(friendRequest._id);
        friendRequest.friends.push(currentUser._id);
    
        await currentUser.save();
        await friendRequest.save();
    
        res.status(200).json({ message: 'Friend request accepted successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to accept friend request.' });
    }
});

// Route for rejecting friend request
router.post('/users/:userId/friend-requests/:friendRequestId/reject', async (req, res) => {
    try {
        const { userId, friendRequestId } = req.params;
    
        // Find the current user and the friend request to reject
        const currentUser = await User.findById(userId);
        const friendRequest = await User.findById(friendRequestId);
    
        // Remove the friend request from both users' friend requests
        currentUser.friendRequests = currentUser.friendRequests.filter(requestId => requestId.toString() !== friendRequest._id.toString());
        friendRequest.friendRequests = friendRequest.friendRequests.filter(requestId => requestId.toString() !== currentUser._id.toString());
    
        await currentUser.save();
        await friendRequest.save();
    
        res.status(200).json({ message: 'Friend request rejected successfully.' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to reject friend request.' });
      }
})

router.get('/users', async (req, res) => {
    try {
      // Retrieve all users from the database
      const users = await User.find();
  
      // Render the 'users' template with the users' data
      res.render('users', { users });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to retrieve users.' });
  }
});
  

module.exports = router;
