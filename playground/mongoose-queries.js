const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');

const {ObjectID} = require('mongodb');

var id = '5c6444bf027af267b07ca0ac';
// var id = '5c6444bf027af267b07ca0ac11';  // invalid - too long

if (!ObjectID.isValid(id))
{
  console.log('ID not valid');
}

// Todo.find(
//   {
//     _id: id         // NB mongoose doesn't require ObjectID object for ID
//   })
//   .then((todos) =>
// {
//   console.log('Todos', todos);
// });
//
// Todo.findOne(      // cf firstOrDefault??``
// {
//   _id: id           // NB mongoose doesn't require ObjectID object for ID
// })
// .then((todo) =>     // just 1 todo
// {
//   console.log('Todos', todo);
// });

Todo.findById(id).then((todo) =>     // by ID - just 1 todo
{
  if (!todo)
  {
    return console.log('ID not found');
  }
  console.log('Todos', todo);
}).catch((error) => console.log(error));
