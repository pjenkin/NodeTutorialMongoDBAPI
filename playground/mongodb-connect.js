const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser : true }, (error, db) => // error, db object
{
  if (error)
  {
    return console.log(`Unable to connect to MongoDb ${error}`);    // return only for flow purposes
  }

  console.log('Connected to MongoDb server');

  db.close();
});
