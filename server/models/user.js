var mongoose = require('mongoose');

// challenge 7-71 User email property require & trim & string minlength 1

var User = mongoose.model('User',
{
  email:
  {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  }
}
);

module.exports = {User};
