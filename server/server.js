var {mongoose} = require('./db/mongoose');  // E6 destructuring
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {ObjectID} = require('mongodb');

var express = require('express');
var bodyParser = require('body-parser');

var app = express();    // all round express server

// middleware
app.use(bodyParser.json());   // sending JSON to express

app.post('/todos',(request, response) =>    // POST for todos
{
  // console.log(request.body);
  var todo = new Todo(
    {
      text: request.body.text
    });

    todo.save().then((document) =>
    { // success/resolve
      response.send(document);    // send the whole new mongodb document/record back
    },
    (error) =>
    {   // error/reject
      response.status(400).send(error);
    }
    );
});   // end of /todos POST route


app.get('/todos', (request, response) =>    // GET for todos
{
  Todo.find().then(
  (todos) =>
  {
    response.send({todos});     // object rather than array for flexibility in future
  },
  (error) =>
  {
    response.status(400).send(error);
  });
});   // end of /todos POST route


// challenge 7-78
// (1) validate todo id using isValid, if not return with a 404 and empty body i.e. send()
// findById using parameter passed-in, handle (2) success (a) if no record, status 404 & send empty, (b) if todo record found, send in body, and (3) error (send() & status 400)
// check in Postman with (1) 5c6444bf027af267b07ca0acXYZ (invalid) (2a) 6c6444bf027af267b07ca0ac (valid, absent) (2b) 5c6444bf027af267b07ca0ac (valid, present)
// NB at this time http://localhost:3000/todos/ responds with all documents/records

// GET /todos/1234    :id - url parameter (request params) e.g. http://localhost:3000/todos/987
app.get('/todos/:id', (request, response) =>
{
  //response.send(request.params.id);    // to test in Postman with http://localhost:3000/todos/987
  var id = request.params.id;

  // (1) validate todo id using isValid, if not return with a 404 and empty body i.e. send()
  if (!ObjectID.isValid(id))
  {
    console.log('Invalid Id');      // NB error nature not in response, for security
    return response.status(404).send();
  }


  Todo.findById(id).then((todo) =>
  {
    // (2)(a) if no record, status 404 & send empty
    if (!todo)
    {
      console.log('Id not found');
      // return response.status(400).send();
      return response.status(404).send();
    }

    // 2(b) if todo record found, send in body
    response.send({todo});
  }).catch((error) =>
  {
      // (3) error (send() & status 400)
      console.log(error.message);
      response.status(404).send();
  });
});   // end of GET /todos:id









app.listen(3000, () =>
{
  console.log('Started on port 3000');
}
);





module.exports = {
  app   // NB app not server exporteds
};

// var stinkyUser = new User({email: ''}).save().then((document) =>   // deliberately wrong
// var stinkvar mongoose = require('mongoose');


// var newTodo = new Todo({text: 'mash potatoes'});
//
// newTodo.save().then((document) =>
// {
//   console.log('Saved document/record: ', document);
// }, (error) =>
// {
//   console.log('Unable to save document/record', error);
// });

// challenge 7-70 - Create record with model's property values completed
// var serveTodo = new Todo({text: 'serve mashed potatoes', completed: false, completedAt: null});
//
// serveTodo.save().then((document) =>
// {
//   console.log('Saving \'serve mashed potatoes\'...');
//   console.log('Saved document/record: ', document);
// }, (error) =>
// {
//   console.log('Unable to save document/record: ', error);
// });
