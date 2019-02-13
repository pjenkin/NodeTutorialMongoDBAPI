var {mongoose} = require('./db/mongoose');  // E6 destructuring
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var express = require('express');
var bodyParser = require('body-parser');

var app = express();    // all round express server

app.listen(3000, () =>
{
  console.log('Started on port 3000');
}
);


// var stinkyUser = new User({email: ''}).save().then((document) =>   // deliberately wrong
// var stinkvar mongoose = require('mongoose');


// var newTodo = new Todo({text: 'mash potatoes'});
//
// newTodo.save().then((document) =>
// {
//   console.log('Saved document/record: ', document);
// }, (error) =>
// {
//   console.log('Unable to save document/record', error);
// });

// challenge 7-70 - Create record with model's property values completed
// var serveTodo = new Todo({text: 'serve mashed potatoes', completed: false, completedAt: null});
//
// serveTodo.save().then((document) =>
// {
//   console.log('Saving \'serve mashed potatoes\'...');
//   console.log('Saved document/record: ', document);
// }, (error) =>
// {
//   console.log('Unable to save document/record: ', error);
// });
