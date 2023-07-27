const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const router = express.Router();
const User = require('../models/User');

router.get('/logout', (req, res) => {
  // Perform the logout action
  req.logout((err) => {
    if (err) {
      // Handle the error
    } else {
      // The user has been logged out
      res.redirect('/login');
    }
  });
});


router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/email-login", (req, res) => {
  res.render("email-login");
});

// Login route
router.post('/email-login', passport.authenticate('local', {
  successRedirect: '/home',
  failureRedirect: '/login',
  failureFlash: true
}));

router.post('/register', async (req, res) => {
  try {
    const { email, firstName, lastName, password } = req.body;

    // Create a new user instance with email
    const newUser = new User({
      email: email,
      firstName: firstName,
      lastName: lastName
    });

    // Register the user with the provided password using User.register() method
    await User.register(newUser, password);

    res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to register user.' });
  }
});
passport.use(User.createStrategy());


router.get('/auth/facebook', passport.authenticate('facebook'));

router.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect: '/home', failureRedirect: '/views/login' }));

module.exports = router;
