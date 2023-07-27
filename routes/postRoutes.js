const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;


// Parse URL-encoded form data
router.use(bodyParser.urlencoded({ extended: true }));

// Handle POST request to create a new post
router.post('/posts', (req, res) => {
  // Extract the post data from the request body
  const { content } = req.body;
  const userId = req.user.firstName; // Assuming you have the user ID available

  // Create a new post instance
  const newPost = new Post({
    content,
    author: userId
  });

  // Save the new post to the database
  newPost.save()
    .then(() => {
      // Redirect to the homepage or display a success message
      res.redirect('/home');
    })
    .catch(err => {
      // Handle any errors
      console.error(err);
      res.status(500).send('Error creating a new post');
    });
});


router.post('/posts/:postId/comments', async (req, res) => {
  try {
    const postId = req.params.postId;
    const commentContent = req.body.comment;
    const userId = req.user.firstName;

    // Create a new Comment instance
    const newComment = new Comment({
      content: commentContent,
      author: userId,
      post: postId,
    });

    // Save the new comment to the database
    await newComment.save();

    res.redirect('/home'); // Redirect to the home page or the post details page
  } catch (err) {
    console.error(err);
    res.status(500).send('Error submitting comment: ' + err.message);
  }
});



 
router.get('/posts/:postId/comments', async (req, res) => {
  try {
    const postId = req.params.postId;

    // Find the post by ID
    const post = await Post.findById(postId);

    // Check if the post exists
    if (!post) {
      throw new Error('Invalid postId');
    }

    // Find the comments for the post
    const comments = await Comment.find({ post: postId });

    // Extract the content of each comment
    const commentContents = comments.map(comment => comment.content);

    // Send the comment contents as a JSON response
    res.json({ comments: commentContents });

  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving comments');
  }
});


router.post('/posts/:postId/like', async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.user._id; // Assuming you have user authentication middleware

    // Query the database for the post
    const post = await Post.findById(postId);

    // Check if the post exists
    if (!post) {
      throw new Error('Invalid postId');
    }

    // Check if the user has already liked the post
    const userIndex = post.likedBy.findIndex((id) => id.equals(userId));
    if (userIndex !== -1) {
      // User has already liked the post, remove the like
      post.likedBy.splice(userIndex, 1);
      post.likes -= 1;
    } else {
      // User hasn't liked the post, add the like
      post.likedBy.push(userId);
      post.likes += 1;
    }

    // Save the updated post to the database
    await post.save();

    res.redirect('/home'); // Redirect to the home page or the post details page
  } catch (err) {
    console.error(err);
    res.status(500).send('Error liking post: ' + err.message);
  }
});




module.exports = router;
