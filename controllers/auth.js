var express = require('express')
var router = express.Router()

var passport = require('../config/passport')

var User = require('../models/user')

router.route('/fblogin')
.get(passport.authenticate('facebook', { scope: 'email' }))

router.get('/fblogin/callback',
  passport.authenticate('facebook', {
    successRedirect: '/profile',
    failureRedirect: '/'
  })
)

router.route('/register')
.get(function (req, res) {
  res.render('auth/signup', {
    flash: req.flash('error')
  })
})
.post(passport.authenticate('local-signup', {
  successRedirect: '/profile',
  failureRedirect: '/register'
}))

router.route('/login')
.get(function (req, res) {
  if (req.isAuthenticated()) {
    req.flash('error', 'You have logged in')
    return res.redirect('/profile')
  }
  res.render('auth/login')
})
.post(function (req, res) {
  // 1. find the user with the given email
  // 2. compare with the hashed password
  User.findByEmail(req.body.email, function (err, foundUser) {
    if (err) return res.send(err)
    if (!foundUser) return res.redirect('/login')
    var givenPassword = req.body.password

    // the password checker function
    if (foundUser.validPassword(givenPassword)) {
      res.redirect('/profile')
    } else {
      res.redirect('/login')
    }
  })
})

module.exports = router
