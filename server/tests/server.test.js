const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

describe('POST /todos', () =>
{
  it('should create a new todo', (done) =>    // done - asynchronous (callback not promise)
  {
      var text = 'Hello - testing todo';

      request(app)
      .post('/todos')   // POST allowing data to be sent with the request (viz GET)
      .send(
        {               // object converted to JSON by supertest
          text
        }
      )
      .expect(200)              // should be valid - 200 OK status
      .expect((response) =>    // custom expect assertion (response passed to this)
      {
        expect(response.body.text).toBe(text);
      }
    ).end(
      (error, response) =>    // handle errors, if any
      {
        if (error)
        {
          return done(error);   // return on error is just for program flow; any error is wrapped up in done callback
        }

        Todo.find().then ((todos) =>
        {
          describe('#todos find test',() =>
          {
            expect(todos.length).toBe(1);   // only 1 in Todo, not in db
            expect(todos[0].text).toBe(text);
            done();
          });
        })            // fetch all todo documents/records
        .catch((error) => done(error));    // 1-line statement syntax not arrow function syntax i.e. return done(error)
      }
    );
  });
}
);
