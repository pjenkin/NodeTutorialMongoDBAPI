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


  // deleteMany - delete all matching query
  // db.collection('Todos').deleteMany({text:'eat crowst'}).then((result) =>
  // { // only cover sucess/fulfilment for the moment
  //     console.log(result);
  // });

  // deleteOne - delete first document/record matching query
  // db.collection('Todos').deleteOne({text: 'eat crowst'}).then((result) =>
  // {
  //     console.log(result);    // JSON output including result: { n: 1, ok: 1 }
  // });

  //findOneAndDelete - deletes first matching query and returns data deleted (in case of use in Undo code)
  // db.collection('Todos').findOneAndDelete({text: 'A note of some kind'}).then((result) =>
  // {
  //   console.log(result);    //
  // });


// challenge -(1) deleteMany duplicates (2) deleteOne by _id

  // (1) deleteMany duplicates
  db.collection('Todos').deleteMany({text:'eat crowst'}).then((result) =>
    { // just code for success at mo
      console.log(result);
    }
  );

  // (2) deleteOne by _id
  db.collection('Todos').findOneAndDelete({_id: new ObjectID('5c62a0df76b184008c8e4973') }).then((result) =>
  {
    console.log(result);
  }
);

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


  // client.close();
});
