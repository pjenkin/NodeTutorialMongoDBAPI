const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = '123abc!';


// console.log('bcryptHashedPassword: ', bcryptHashedPassword);

var result;

bcrypt.genSaltSync(10, (error, salt) =>
// var salted = bcrypt.genSaltSync(10, (error, salt) =>
{
  // hashing of password to make safe to store
  bcryptSync.hash(password, salt, (error, hash) =>
  {
    // hash value (encrypted password) to be stored in databased
    // console.log(JSON.stringify(hash));
    // console.log(hash + '???');
    // console.log(hash === '$2a$10$V5JEcqTLsoTXcBZ3ZUy1hOJKvGDVTS5m47klYQY1LYdYMlcS8vvfG');
    // console.log(hash.length);
    console.log('hash: ', hash);
    result = hash;
  });
});
// );
// difficult to get callbacks working with this

console.log('result: ', result);
var compare = bcrypt.compareSync(password, result);
console.log('compareSync callback :', compare);
console.log('---------------');

// https://www.npmjs.com/package/bcryptjs
var salted = bcrypt.genSaltSync(10);
console.log('salted: ',salted);
var hash = bcrypt.hashSync(password, salted);
console.log('hash: ',hash);
var response = bcrypt.compareSync(password,'$2a$10$j8H29NCE2Q3zFxdOZGtg2OJrtnuWnZv59v4aHD215ByCg3oD7UmaK');
console.log('bcrypt compareSync', response);
console.log('-------------');




// bcrypt.compare(password, hashedPassword, (error, response) => {
//   console.log('bcrypt compare', response);
// });


var data =
{
  id:10
};

// var token = jwt.sign(data, 'PNJWebSiteSaltingSecretblahblah');
var token = jwt.sign(data, '123abc');
console.log('token ', token);

// see in jwt.io

// var decoded = jwt.verify(token + '1', '123abc');   // resulted in invalid signature error
var decoded = jwt.verify(token, '123abc');
console.log('decoded', decoded);


/*
var message = 'I am not a number!';
var hash = SHA256(message).toString();

console.log(`Message ${message}`);
console.log(`Hash ${hash}`);    // useful for comparison of entered/stored password




var data = {
  id: 4     // data to send to client
};

var token =
{
  data,   // ES6 abbreviation
  hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
  // salted hash (somesecret) for checking
}

// fraud attempt without 'somesecret' salting
token.data.id = 5;
token.hash = SHA256(JSON.stringify(token.data)).toString()



var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret') .toString();

if (resultHash === token.hash)
{
  console.log('Hash comparison d\'show data was not changed');
}
else {
  console.log('Hash comparison d\'show data *was* indeed changed. Don\'t trust!');
}
*/
