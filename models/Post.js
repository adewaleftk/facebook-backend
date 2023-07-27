const mongoose = require('mongoose');
const Comment = require('../models/Comment');

const postSchema = new mongoose.Schema({
  content: { type: String, required: true },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  likes: { type: Number, default: 0 },
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  author: { type: String, required: true }
});


module.exports = mongoose.model('Post', postSchema);
