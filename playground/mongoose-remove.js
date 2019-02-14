const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

const {ObjectID} = require('mongodb');

// Todo.remove({})  - would remove all

//Todo.remove({}).then((result) => {      // deprecated
Todo.deleteMany({}).then((result) => {
  console.log(result);
});

// Todo.findOneAndRemove()    // returns info of what was removed (useful for undo)
// Todo.findByIdAndRemove()   // ditto



Todo.findByIdAndRemove('5c658d720537173de46c6f4a').then( (todo) =>    // todo passed back by function?
{
    console.log(todo);  // see what was removed
}
);
