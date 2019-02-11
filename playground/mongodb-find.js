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

  // db.collection('Todos').find().toArray().then((documents) =>
  db.collection('Todos').find({completed:false}).toArray().then((documents) =>
  {
    // then-resolve?
    console.log('Todos (see below)');
    console.log(JSON.stringify(documents, undefined, 2));
    // print documents
  },
  (error) =>   // then-reject?
  {
      console.log('Unable to fetch Todos documents',error);
  });
  // find with no arguments - all documents - returns cursor
  // use a promise (toArray) with then

  client.close();
});
