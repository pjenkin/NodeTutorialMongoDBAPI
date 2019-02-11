const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser : true }, (error, client) => // error, db object
{
  if (error)
  {
    return console.log(`Unable to connect to MongoDb ${error}`);    // return only for flow purposes
  }

  console.log('Connected to MongoDb server');
  const db = client.db('TodoApp');

  db.collection('Todos').insertOne(
    {   // key/value pair and
      text: 'Another note of some kind',
      completed: false
    }, (error, result) =>
    { // failure
      if (error)
      {
        return console.log('Unable to insert document', error);
      }
      // success
      console.log(JSON.stringify(result.ops, undefined,2));
    });   // end of insertOne

  client.close();
});
