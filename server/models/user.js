const mongoose = require('mongoose');   // const not really better than var for require
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

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


// existing instance method over-ridden
// restrict HTTP response body contents to only id and email fields/properties/objects
UserSchema.methods.toJSON = function ()
{
  var user = this;
  var userObject = user.toObject();   // mongoose user object -> normal ObjectID

  return _.pick(userObject, ['_id','email']);
};


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
};

// model method (not instance method) - NB statics
UserSchema.statics.findByToken = function (token)
{
  var User = this;
  var decoded;      // undefined

  try
  {
    decoded = jwt.verify(token, 'abc123');     // secret hard conded but will be in config
  }
  catch (error)
  {
    console.log('some error decoding JWT');
    // return new Promise((resolve,reject) =>
    // {
    //   reject();   // since error, rejected Promise returned, so enclosing 'then' success (in server.js) never used
    // });
    // simplification of above
    // return Promise.reject();    // could have returned reject value; would have been error caught in enclosing code
    return Promise.reject().catch(error => {console.log('caught decoding findByToken reject error',error);});
    // could have returned reject value; would have been error caught in enclosing code -
    // NB need to catch rejection error
  }

  // find a user whose properties are matching those in the HTTP response's x-auth header (JWT, now decoded)
  return User.findOne({
    // _id: decoded._id,
    '_id': decoded._id,          /* just for consistency, use quotes around property even without dot reference */
    'tokens.token': token,      /* nested property reference in quotes - cf User model structure */
    'tokens.access': 'auth'
  }).catch((error) =>
  {
    response.status(401).send();  // 401 unauthoriz(s)ed
  });

};



var User = mongoose.model('User', UserSchema);

module.exports = {User};
