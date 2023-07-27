const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('./models/User');
require("dotenv").config();

passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FacebookClientID,
        clientSecret: process.env.FacebookClientSecret,
        callbackURL: process.env.FacebookCallbackURL,
        profileFields: ["id", "email", "name"]
      },
      (accessToken, refreshToken, profile, done) => {
        const { email, first_name, last_name, id } = profile._json;
        const user = new User({
            firstName: first_name,
            lastName: last_name,
            email: email,
            facebookId: id
          });

      // Save the new user to the database
      user.save()
      .then(function() {
        return done(null, user);
      })
      .catch(function(err) {
        return done(err);
      }); 
    }
  )
);

passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser((id, done) => {
    User.findById(id)
      .then(function(user) {
        done(null, user);
      })
      .catch(function(err) {
        done(err);
      });
  });
  

module.exports = passport;