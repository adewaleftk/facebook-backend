const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

router.get("/login", (req, res) => {
  res.render("login");
});

router.get('/home', isAuthenticated, async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ _id: -1 })
      .limit(5)
      .populate('author', 'firstName')
      .exec();

    const currentUser = req.user; // Access the authenticated user object

    res.render('homepage', { posts, currentUser });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving posts');
  }
});

// Middleware to check if the user is authenticated
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    // Pass the authenticated user object to the next middleware/route handler
    return next(null, req.user);
  }

  // If the user is not authenticated, redirect to the login page or display an error message
  res.redirect('/login');
}




module.exports = router;