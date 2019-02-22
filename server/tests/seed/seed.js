const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../models/todo');    // up and up then down to model
const {User} = require('./../../models/user');

const firstUserID = new ObjectID();
const secondUserID = new ObjectID();

const seedUsers = [
  {
    _id:  firstUserID,
    email: 'peter@example.com',
    password: 'passworda',
    tokens: [{
      access: 'auth',
      token: jwt.sign({_id: firstUserID, access: 'auth'}, 'abc123').toString()
    }]
  },
   {
     _id: secondUserID,
     email: 'stinky@example.com',
     password: 'passwordb'
   }
 ];

const seedTodos = [
  {
    _id: new ObjectID(),
    text: 'First text todo',
    _creator: firstUserID
  },
  {
    _id: new ObjectID(),
    text: 'Second text todo',
    completed: true,
    completedAt: 1000,
    creator: firstUserID
  }
];

// new function

const populateTodos = (done) =>
{
  // NB: delete all documents/records in Todo
  Todo.deleteMany({}).then(()=>
  {
      return Todo.insertMany(seedTodos);    // return response to enable chaining of callbacks
      // (NB - will not trigger middleware for password encryption)
  })
  .then(() => done());
  // only move on to test when done
};

const populateUsers = (done) =>
{
  User.deleteMany({}).then( () =>
  {
      var firstUser = new User(seedUsers[0]).save();
      var secondUser = new User(seedUsers[1]).save();   // promise from save()

      // wait for both/all these promises from save()
      return Promise.all([firstUser, secondUser])   // could've had a then here
  }).then( () => done() );
};

module.exports = {seedTodos, populateTodos, seedUsers, populateUsers};
