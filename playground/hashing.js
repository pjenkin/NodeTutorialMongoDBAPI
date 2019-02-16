const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

var data =
{
  id:10
};

// var token = jwt.sign(data, 'PNJWebSiteSaltingSecretblahblah');
var token = jwt.sign(data, '123abc');
console.log(token);

// see in jwt.io

// var decoded = jwt.verify(token + '1', '123abc');   // resulted in invalid signature error
var decoded = jwt.verify(token, '123abc');
console.log(decoded);


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
