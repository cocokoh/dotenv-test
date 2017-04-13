var mongoose = require('mongoose')

if (process.env.NODE_ENV === 'test') {
  mongoose.connect('mongodb://localhost/express-authentication')
} else {
  mongoose.connect('mongodb://localhost/express-authentication-test')
}

var User = require('./models/user')

User.create({
  name: 'Prima Aulia',
  password: 'prima1234',
  email: 'prima@test.com'
}, function (err, data) {
  if (err) return console.error(err)
  console.log('this is after save', data)
})
