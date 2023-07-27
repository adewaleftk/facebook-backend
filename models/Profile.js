const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  username: { type: String, required: true },
  bio: { type: String, required: true },
  friends: { type: [String], required: true },
  posts: { type: String, required: true }
  // ...add more fields as per your requirements
});

module.exports = mongoose.model('Profile', profileSchema);