const mongoose = require('mongoose');
const Post = require('../models/Post');

const commentSchema = new mongoose.Schema({
  content: { type: String, required: true },
  author: { type: String, required: true },
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Comment', commentSchema);