var {mongoose} = require('./db/mongoose');  // E6 destructuring
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

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
