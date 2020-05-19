var passport = require("passport");
var GitHubStrategy = require("passport-github").Strategy;
var GoogleStrategy = require('passport-google-oauth20').Strategy;

require("dotenv").config();

let User = require("../models/user");

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "/auth/github/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      let newUser = {
        githubId: profile.id,
        name: profile.displayName,
      };
      User.findOneAndUpdate(
        { githubId: profile.id },
        newUser,
        { upsert: true },
        (err, user) => {
          if (err) console.log(err, "Error");
          console.log("-------------------------");

          console.log(user);
          done(err, user);
        }
      );
    }
  )
);



passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:5000/auth/google/callback"
},
function(accessToken, refreshToken, profile, done) {
  console.log(profile)
  let newUser = {
    googleId:profile.id,
    name:profile.displayName
  }
  User.findOneAndUpdate(
    { googleId: profile.id },
    newUser,
    {upsert:true},
    (err, user) => {
      if (err) console.log(err, "Error");
      console.log("-------------------------");

      console.log(user);
      done(err, user);
  });
}
));



passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) =>{
    if(err)
      return done(err);
    return done(null, user);
  });
  // done(null, id);
});
