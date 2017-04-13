var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var FacebookStrategy = require('passport-facebook').Strategy

var User = require('../models/user')

// set the authenticated user data into session
passport.serializeUser(function (user, done) {
  done(null, user.id)
})

/*
 * Passport "deserializes" objects by taking the user's serialization (id)
 * and looking it up in the database
 */
passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user)
  })
})

// passport facebook strategy
passport.use('facebook', new FacebookStrategy({
  clientID: process.env.FB_APP_KEY,
  clientSecret: process.env.FB_APP_SECRET,
  callbackURL: 'http://localhost:3300/fblogin/callback',
  enableProof: true,
  profileFields: ['name', 'emails']
}, function (accessToken, refreshToken, profile, next) {
  console.log({
    accessToken, refreshToken, profile
  })

  User.findOne({
    email: profile.email
  })
}))

// passport local-signup strategy
passport.use('local-signup', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, function (req, givenEmail, givenPassword, next) {
  var newUser = new User({
    email: givenEmail,
    name: req.body.name,
    password: givenPassword
  })

  newUser.save(function (err, data) {
    if (err) {
      req.flash('error', 'Registration failed')
      return next(err)
    }

    next(null, data)
  })
}))

module.exports = passport
