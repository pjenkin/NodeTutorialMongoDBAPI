const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp', {useNewUrlParser: true});
// mongoose configured
var Todo = mongoose.model('Todo', {
  text:
  {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  completed:
  {
    type: Boolean,
    default: false
  },
  completedAt:
  {
    type: Number,    // standard UNIX timestamp
    default: null
  }
});
// model cf schema https://mongoosejs.com/docs/guide.html#models

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

// var stinkyUser = new User({email: ''}).save().then((document) =>   // deliberately wrong
var stinkyUser = new User({email: 'stinky@example.com'}).save().then((document) =>   // deliberately wrong
{
  console.log('Added Stinky as an user', document);
},
(error) =>
{
  console.log('Alas, error adding Stinky as an user: ', error.message);
}
);

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
