var express = require('express')
var ejsLayouts = require('express-ejs-layouts')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var app = express()
require('dotenv').config({ silent: true })

if (process.env.NODE_ENV === 'test') {
  mongoose.connect('mongodb://localhost/express-authentication-test')
} else {
  mongoose.connect(process.env.MONGODB_URI)
}

app.set('view engine', 'ejs')

app.use(require('morgan')('dev'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(ejsLayouts)

// setup the session
// store the session into mongodb
var session = require('express-session')
var MongoStore = require('connect-mongo')(session)
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({ url: process.env.MONGODB_URI })
}))

// setup the flash data
var flash = require('connect-flash')
app.use(flash())

// initialize our passport
var passport = require('./config/passport')

// initialize the passport configuration and session as middleware
app.use(passport.initialize())
app.use(passport.session())

// all my routes
app.get('/', function (req, res) {
  res.render('index')
})

app.get('/profile', function (req, res) {
  res.render('profile', {
    user: req.user,
    flash: req.flash('error')
  })
})

var authController = require('./controllers/auth')
app.use('/', authController)

var server
if (process.env.NODE_ENV === 'test') {
  server = app.listen(process.env.PORT || 4000)
} else {
  server = app.listen(process.env.PORT || 3300)
}

module.exports = server
