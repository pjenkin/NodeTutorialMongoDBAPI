const mongoose = require('mongoose');   // const not really better than var for require
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

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
  // var token = jwt.sign({_id: user._id.toHexString(), access },'abc123').toString();      // access:access (ES6); eventually, secret to be in config
  var token = jwt.sign({_id: user._id.toHexString(), access },process.env.JWT_SECRET).toString();      // access:access (ES6); eventually, secret to be in config

  user.tokens = user.tokens.concat([{access, token}]);      // concat to new/empty array

  return user.save().then(() =>
  {
    return token;
    // return only a value rather than promise (tho' will be passed as succes argument in next chain-then in server.js)
  });
};

// .methods for a new instance method
// to log out a user by removing JWT token from tokens property
UserSchema.methods.removeToken = function (token)
{
  // mongodb operator
  var user = this;    // NB instance method so user not User

  // pass in the updates object, using mongodb operator $pull (like query, with parameters)
  return user.update(
    {
      $pull:
      {
        tokens: {token}
        // {
          // token: token
        // }
      }
    }
  );
};


// model method (not instance method) - NB statics
UserSchema.statics.findByToken = function (token)
{
  var User = this;
  var decoded;      // undefined

  try
  {
    // decoded = jwt.verify(token, 'abc123');     // secret hard conded but will be in config
    decoded = jwt.verify(token, process.env.JWT_SECRET);     // secret hard conded but will be in config
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

// model method 8-95
// using function syntax because (a) this required and (b) arguments passed
UserSchema.statics.findByCredentials = function (email, password)
{
  var User = this;

  // ES 6 email:email - search only on email first (not plain text password yet)
  return User.findOne({email}).then((user) =>
  {
    if (!user)
    {
      // will trigger catch
      return Promise.reject();
    }

    return new Promise((resolve, reject) =>
    {
      // response.send(user);
      // challenge 8-95 use bcrypt to compare, reject if not same
      // too tired - I copied this bit from video!
      bcrypt.compare(password, user.password, (error, result) =>
      {
        if (result)
        {
          resolve(user);
        }
        else
        {
          reject();
        }
        // if there's no match, reject to throw to any error catching in calling code
        // if there's a matching hashed password (email already matched), resolve, with this user

      });
    })
     // .catch ((error) => {console.log('error caught', error)});
    });
};

// mongoose middleware before saving
// hash password from model and over-write before saving to db
UserSchema.pre('save', function (next)
{
  var user = this;    // needed this - hence not arrow function syntax

  if (user.isModified('password'))     // prevent accidental re-hashing
  {
    //console.log('trying to hash password ', user.password);
    bcrypt.genSalt(10, (error,salt) =>
    {
      bcrypt.hash(user.password, salt, (error, hash) =>
      {
        console.log(hash);
        user.password = hash;
        // user.password = 'rubbish';
        next();
      });
    });
     // user.password = bcrypt.hashSync(password,genSaltSync(10));
// get user.password // user.password = hash
// call gensalt, call hash, inside callback for hash,  set user properties
  }
  else
  {
    next();
  }
});

/*
// https://www.udemy.com/the-complete-nodejs-developer-course-2/learn/v4/questions/6256840

UserSchema.pre('save', function () {
  return new Promise((resolve, reject) =>
  {
    var user = this;
    var errorMessage = {message: 'Unable to save user details'};
    if (user.isModified('password'))
    {
      bcrypt.genSalt(10, (error, salt) =>
      {
          if (error)
          {
            return reject(errorMessage);
          }
          bcrypt.hash(user.password, salt, (error, hash) =>
          {
            if (error)
            {
              return reject(errorMessage);
            }
            bcrypt.hash(user.password, salt, (error, hash) =>
            {
              if (error)
              {
                return reject(errorMessage);
              }
              console.log('got there');
              user.password = hash;
              resolve();    // successful fulfilment of promise
            });

          });

      });
    }
  });
});
*/


var User = mongoose.model('User', UserSchema);

module.exports = {User};
