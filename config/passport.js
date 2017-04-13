var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
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

// passport middleware strategy
passport.use('local-signup', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, function (req, givenEmail, givenPassword, next) {
  console.log('im running passport authentication here')
  console.log(req.body)
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
