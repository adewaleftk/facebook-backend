const express = require("express");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config();
const User = require("./models/User");
const authRoutes = require('./routes/authRoutes');
const mainRoutes = require('./routes/mainRoutes');
const postRoutes = require('./routes/postRoutes');
const friendRoutes = require('./routes/friendRoutes');

mongoose.connect(process.env.MongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/styles'));

app.use(session({ secret: process.env.SessionKey, resave: false, saveUninitialized: false }));

// Require and configure passport.js
require('./passport');

app.use(passport.initialize());
app.use(passport.session());

// Parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Your routes and middleware can be added here
app.use('/', authRoutes);
app.use(mainRoutes);
app.use(postRoutes);
app.use(friendRoutes);


app.listen(3000, () => console.log("App listening on port 3000"));
