const mongoose = require('mongoose');   // const not really better than var for require
const validator = require('validator');

// challenge 7-71 User email property require & trim & string minlength 1

var User = mongoose.model('User',
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

module.exports = {User};
