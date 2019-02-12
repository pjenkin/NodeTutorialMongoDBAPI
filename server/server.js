const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp', {useNewUrlParser: true});
// mongoose configured
var Todo = mongoose.model('Todo', {
  text:
  {
    type: String,
    required: true,
    minlength: 1
  },
  completed:
  {
    type: Boolean
  },
  completedAt:
  {
    type: Number    // standard UNIX timestamp
  }
});
// model cf schema https://mongoosejs.com/docs/guide.html#models

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
var serveTodo = new Todo({text: 'serve mashed potatoes', completed: false, completedAt: null});

serveTodo.save().then((document) =>
{
  console.log('Saving \'serve mashed potatoes\'...');
  console.log('Saved document/record: ', document);
}, (error) =>
{
  console.log('Unable to save document/record: ', error);
});
