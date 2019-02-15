const {SHA256} = require('crypto-js');

var message = 'I am not a number!';
var hash = SHA256(message).toString();

console.log(`Message ${message}`);
console.log(`Hash ${hash}`);    // useful for comparison of entered/stored password
