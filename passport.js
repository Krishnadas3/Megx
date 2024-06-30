
  const passport = require('passport')
  const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;


  passport.serializeUser((user,done) =>{
    done(null,user)
  })

  passport.deserializeUser((function(user,done){
    done(null,user)
  }))

  passport.use(new GoogleStrategy({
    clientID:     process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "https://megx.onrender.com/auth/google/callback",
    passReqToCallback   : true
  },
  function(request, accessToken, refreshToken, profile, done) {
      done(null,profile)
  }
));