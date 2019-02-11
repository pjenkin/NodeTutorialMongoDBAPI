// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb'); // ES6 object destructuring

// var objID = new ObjectID();
// console.log(objID);
// return;   // temporary, for flow
// var user = {name: 'P N Jenkin', age:45};
// // ES6 object destructuring
// var {name} = user;

MongoClient.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser : true }, (error, client) => // error, db object
{
  if (error)
  {
    return console.log(`Unable to connect to MongoDb ${error}`);    // return only for flow purposes
  }

  console.log('Connected to MongoDb server');
  const db = client.db('TodoApp');

  // db.collection('Todos').insertOne(
  //   {   // key/value pair and
  //     text: 'Another note of some kind',
  //     completed: false
  //   }, (error, result) =>
  //   { // failure
  //     if (error)
  //     {
  //       return console.log('Unable to insert document', error);
  //     }
  //     // success
  //     console.log(JSON.stringify(result.ops, undefined,2));
  //   });   // end of insertOne


  // challenge - insert new doc into Users collection (properties - name, age, location)
  // db.collection('Users').insertOne(
  //   {
  //     name: 'P N Jenkin',
  //     age: 45,
  //     location: 'Redruth, Kernow'
  //   }, (error, result) =>
  //   {
  //     // failure
  //     if (error)
  //     {
  //       return console.log('Unable to insert document to Users', error)
  //     }
  //     //success
  //     // console.log(JSON.stringify(result.ops,undefined,2));
  //     console.log(JSON.stringify(result.ops[0]._id.getTimestamp(),undefined,2));
  //   });  // end of insertOne for Users


  client.close();
});
