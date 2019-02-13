const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

// delete all collection's documents/records to facilitate document/record counting test
beforeEach((done) =>
{
  // NB: delete all documents/records in Todo
  // Todo.remove({}).then(()=> done());
  Todo.deleteMany({}).then(()=> done());
  // only move on to test when done
});


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
            expect(todos.length).toBe(1);   // aha! only 1 in Todo collection
            expect(todos[0].text).toBe(text);
            done();
          });
        })            // fetch all todo documents/records
        .catch((error) => done(error));    // 1-line statement syntax not arrow function syntax i.e. return done(error)
      }
    );
  });   // end of it('should create a new todo'

  // re-empty Todos collection (necessary after previous test?)
  // delete all collection's documents/records to facilitate document/record counting test
  beforeEach((done) =>
  {
    // NB: delete all documents/records in Todo
    // Todo.remove({}).then(()=> done());
    Todo.deleteMany({}).then(()=> done());
    // only move on to test when done
  });


  it('should not create a todo when sent invalid body data', (done) =>
  {
    var emptyText = '';
    request(app)
    .post('/todos')
    .send(
      {
        text: emptyText   // send a blank string - this should be not accepted
      }
    )
    .expect(400)
    .end((error, response) =>
    {
      if (error)
      {
        return done(error);     // quit flow here if an error (in code?)
      }
      // still within end()

      Todo.find().then((todos) =>
      {
        expect(todos.length).toBe(0);   // after failed invalid document sent, should be zero documents in collection
        done();   // now wrap-up
      }).catch((error) => done(error));
    });     // end of end

    // challenge 7-74
    // send an empty ObjectID
    // expect that a 400 received (1)
    // assume length of todos == 0 (as above) (2)
  }
);  // end of it('should not create a todo when sent invalid body data'


}
);
