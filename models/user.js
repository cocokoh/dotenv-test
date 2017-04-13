// require mongoose
var mongoose = require('mongoose')

// regex for email
var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/

// draw the schema
var userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: emailRegex
  },
  name: {
    type: String,
    required: true,
    minlength: [3, 'Name must be between 3 and 99 characters'],
    maxlength: [99, 'Name must be between 3 and 99 characters']
  },
  password: {
    type: String,
    required: true,
    minlength: [8, 'Password must be between 8 and 99 characters'],
    maxlength: [99, 'Password must be between 8 and 99 characters']
  }
})

// do sth before we create new user
var bcrypt = require('bcrypt')

// create === var newUser = new User && newUser.save()
userSchema.pre('save', function (next) {
  var user = this
  // console.log('about to save user', user)
  // where we hash the password
  var hash = bcrypt.hashSync(user.password, 10)
  // console.log('original password', user.password)
  // console.log('hashed password', hash)
  user.password = hash
  next()
})

userSchema.statics.findByEmail = function (givenEmail, next) {
  this.findOne({
    email: givenEmail
  }, function (err, foundUser) {
    if (err) return next(err)

    next(null, foundUser)
  })
}

userSchema.methods.validPassword = function (givenPassword) {
  var hashedpassword = this.password
  return bcrypt.compareSync(givenPassword, hashedpassword)
}

// check if we hashed the given password is the same like the hashed password

var User = mongoose.model('User', userSchema)

module.exports = User
