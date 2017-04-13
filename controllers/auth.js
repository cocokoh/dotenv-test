var express = require('express')
var router = express.Router()

var User = require('../models/user')

router.route('/register')
.get(function (req, res) {
  res.render('auth/signup', {
    flash: req.flash('error')
  })
})
.post(function (req, res) {
  // create using User method
  var newUser = new User({
    email: req.body.email,
    name: req.body.name,
    password: req.body.password
  })

  newUser.save(function (err, data) {
    if (err) {
      return res.send(err)
      // req.flash('error', 'Registration failed')
      // return res.redirect('/register')
    }
    res.redirect('/')
  })
})

router.route('/login')
.get(function (req, res) {
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
