const mongoose = require('mongoose');   // const not really better than var for require
const validator = require('validator');
const jwt = require('jsonwebtoken');

var UserSchema = new mongoose.Schema(
  {
    email:
    {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      unique: true,
      validate: {     /* https://mongoosejs.com/docs/validation.html#custom-validators */
        /*validator: (value) =>
        {
          return validator.isEmail(value);
          // simplified below
        },*/
        validator: validator.isEmail,
        message: '{VALUE} is not a valid email'
      }
    },
    password:     /* plain text password at this stage */
    {
      type: String,
      require: true,
      minlength: 6
    },
    tokens:       /* tokens as array not universally available out-of-the-box  */
    [
      {
        access: {
          type: String,
          required: true
         },
        token: {
        type: String,
        required: true
       }
      }
    ]
  }
);


// challenge 7-71 User email property require & trim & string minlength 1

mongoose.set('useCreateIndex',true);    // https://github.com/Automattic/mongoose/issues/6890

// instance (not model) method added
// UserSchema is an object (instance methods will have access to hashing properties)
// (arrow functions don't bind this (needed here),...
//  ... so old-fashioned function declaration syntax used)
UserSchema.methods.generateAuthToken = function ()
{
  var user = this;    // this is the User in any instance
  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(), access },'abc123').toString();      // access:access (ES6); eventually, secret to be in config

  user.tokens = user.tokens.concat([{access, token}]);      // concat to new/empty array

  return user.save().then(() =>
  {
    return token;
    // return only a value rather than promise (tho' will be passed as succes argument in next chain-then in server.js)
  });
}

var User = mongoose.model('User', UserSchema);

module.exports = {User};
