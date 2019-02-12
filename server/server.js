const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp', {useNewUrlParser: true});
// mongoose configured
var Todo = mongoose.model('Todo', {
  text:
  {
    type: String
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

var newTodo = new Todo({text: 'mash potatoes'});

newTodo.save().then((document) =>
{
  console.log('Saved document/record: ', document);
}, (error) =>
{
  console.log('Unable to save document/record', error);
});
