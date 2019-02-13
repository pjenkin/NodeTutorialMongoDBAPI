const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

const {ObjectID} = require('mongodb');

// var id = '5c6444bf027af267b07ca0ac';
// // var id = '5c6444bf027af267b07ca0ac11';  // invalid - too long
//
// if (!ObjectID.isValid(id))
// {
//   console.log('ID not valid');
// }

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

// Todo.findById(id).then((todo) =>     // by ID - just 1 todo
// {
//   if (!todo)
//   {
//     return console.log('ID not found');
//   }
//   console.log('Todos', todo);
// }).catch((error) => console.log(error));

// challenge 7-77 - by a user's id
// load User mongoose model
// User.findbyId (not found (1) / found (print) (2) / handle error (3))

var userId = '5c62f59cdf97f22620c3fabb';
// var userId = '6c62f59cdf97f22620c3fabb';    // check - incorrect id
// var userId = '5c62f59cdf97f22620c3fabb99';  // check - invalid id

User.findById(userId).then((user) =>
{
  if (!user)    // if no user found with this id (1)
  {
    return console.log('User not found with this ID');
  }
  console.log('User: ', user);    // if user found with this ID (2)
}).catch((error) => console.log(/*error*/error.message));    // handle error (3) (1-line arrow)
