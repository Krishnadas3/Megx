
const passport = require('passport')
require('dotenv').config()

const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5050/auth/google/callback",
    passReqToCallback : true
  },
  function(request ,accessToken, refreshToken, profile, done) {
      done(null,profile)
  }
));