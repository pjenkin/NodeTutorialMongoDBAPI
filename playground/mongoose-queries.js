const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');

var id = '5c6444bf027af267b07ca0ac';

Todo.find(
  {
    _id: id         // NB mongoose doesn't require ObjectID object for ID
  })
  .then((todos) =>
{
  console.log('Todos', todos);
});

Todo.findOne(      // cf firstOrDefault??
{
  _id: id           // NB mongoose doesn't require ObjectID object for ID
})
.then((todo) =>     // just 1 todo
{
  console.log('Todos', todo);
});
