const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

const {ObjectID} = require('mongodb');

// Todo.remove({})  - would remove all

//Todo.remove({}).then((result) => {      // deprecated
// Todo.deleteMany({}).then((result) => {
//   console.log(result);
// });

// Todo.findOneAndRemove()    // returns info of what was removed (useful for undo)
// Todo.findByIdAndRemove()   // ditto



// Todo.findByIdAndRemove('5c6594e60537173de46c6f4e').then( (todo) =>    // todo passed back by function?
// DeprecationWarning: collection.findAndModify is deprecated. Use findOneAndUpdate, findOneAndReplace or findOneAndDelete instead.
// Todo.findOneAndDelete({_id:'5c65956b0537173de46c6f4f'}).then( (todo) =>
Todo.findByIdAndDelete('5c6596bf0537173de46c6f51').then( (todo) =>    // NB use findByIdAndDelete 14/2/19
{
    console.log(todo);  // see what was removed
}
);
