const {ObjectID} = require('mongodb');
const {Todo} = require('./../../models/todo');    // up and up then down to model

const seedTodos = [
  {
    _id: new ObjectID(),
    text: 'First text todo'
  },
  {
    _id: new ObjectID(),
    text: 'Second text todo',
    completed: true,
    completedAt: 1000
  }
];

// new function

const populateTodos = (done) =>
{
  // NB: delete all documents/records in Todo
  Todo.deleteMany({}).then(()=>
  {
      return Todo.insertMany(seedTodos);    // return response to enable chaining of callbacks
  })
  .then(() => done());
  // only move on to test when done
}

module.exports = {seedTodos, populateTodos};
