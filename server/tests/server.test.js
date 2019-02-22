const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {ObjectID} = require('mongodb');
const {seedTodos, populateTodos, seedUsers, populateUsers} = require('./seed/seed');
const {User} = require('./../models/user');

beforeEach(populateUsers);
// delete all collection's documents/records to facilitate document/record counting test
beforeEach(populateTodos);



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

        // Todo.find().then ((todos) =>
        Todo.find({text:text}).then ((todos) =>       // query only the todos matching (relies upon no duplicates)
        {
          describe('#todos find test',() =>
          {
            expect(todos.length).toBe(1);   // aha! only 1 in queried Todo collection (hopefully)
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
    // Todo.deleteMany({}).then(()=> done());
    Todo.deleteMany({}).then(()=>
    {
        return Todo.insertMany(seedTodos);    // return response to enable chaining of callbacks
    })
    .then(() => done());

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
        // expect(todos.length).toBe(0);   // after failed invalid document sent, should be zero documents in collection
        expect(todos.length).toBe(2);   // after failed invalid document sent, should be zero documents in collection
        done();   // now wrap-up
      }).catch((error) => done(error));
    });     // end of end

    // challenge 7-74
    // send an empty ObjectID
    // expect that a 400 received (1)
    // assume length of todos == 0 (as above) (2)
  }
);  // end of it('should not create a todo when sent invalid body data'

});   // end of describe POST /todos tests

describe('GET /todos', () =>
{
  it('should get all todos',(done) =>
  {
    request(app)    // express
    .get('/todos')
    .expect(200)    // should be ok
    .expect((response) =>
    {
      expect(response.body.todos.length).toBe(2);   // just the 2 added as seed
    })
    .end(done);     // nothing ansynchronous being done for end to handle
  });
});

describe('GET /todos/:id', () =>
{
it('should return todo document', (done) =>
{
// console.log(JSON.stringify(seedTodos[0]))  ;
// console.log(seedTodos[0]._id)  ;
  request(app)
  .get(`/todos/${seedTodos[0]._id.toHexString()}`)    // NB don't include ':id' (e.g.) in url
  .expect(200)
  .expect((response) =>
  {
    expect(response.body.todo.text).toBe(seedTodos[0].text);
  })
  .end(done);
});


  // challenge 7-79
  it('should return 404 if todo not found', (done) =>
  {
      // (1) new ObjectID with toHexString
      // ensure 404 received
      var hexId = new ObjectID().toHexString();

      request(app)
      // .get(`/todos/${   seedTodos[0]._id.toHexString()}`)
      //.get(`/todos/${ randomId}`)
      .get(`/todos/${hexId}`)
      .expect(404)        // should get 400?
      .end(done);
  });

  it('should return 404 for invalid object IDs', (done) =>
  {
    // (2) /todos/123
    request(app)
    .get('/todos/123')    // obviously invalid id 1234
    .expect(404)
    .end(done);
  });
});   // end of describe('GET /todos/:id'

describe('DELETE /todos/:id', ()=> {
  it('should remove a todo', (done) =>
  {
      var hexId = seedTodos[0]._id.toHexString();

      request(app)
      .delete(`/todos/${hexId}`)
      .expect(200)    // known to exist in seed data
      .expect( (response) =>
      {
        expect(response.body.todo._id).toBe(hexId);      // custom expect - that this will act on expected document/record
      }).end((error, response) =>
      {
        if (error)
        {
          return done(error);
        }

        // challenge 7-83
        // check that record has been deleted - i.e. no longer existing
        // findById(hexId) query - should fail - todo in then call does not exist (expect(todo).toNotExist) - (2) catch for error, pass to done

        Todo.findById(hexId).then((todo) =>
        // Todo.find({_id:hexId}).then((todo) =>
        {   // just success at the mo in this query for this assertion
          // expect(todo).toNotExist();
          expect(todo).toBeFalsy();       // https://github.com/mjackson/expect/issues/238#issuecomment-417936839
          done();                         // if it's got this far, this (it('should remove a todo') is fair 'nuff done
        }).catch((error) => done(error));
      });

      // end() is called with (error, response)

  });
/*
  it('should return 404 if todo document not found' ,() =>
  {

  });
*/
  // copy/paste from above and alter get to delete
  // i.e. same testing for invalid/non-existent documents/records for delete as for get
  it('should return 404 if todo not found', (done) =>
  {
      // (1) new ObjectID with toHexString
      // ensure 404 received
      var hexId = new ObjectID().toHexString();

      request(app)
      // .get(`/todos/${   seedTodos[0]._id.toHexString()}`)
      //.get(`/todos/${ randomId}`)
      .delete(`/todos/${hexId}`)
      .expect(404)        // should get 400?
      .end(done);
  });

/*
  // copy/paste from above and alter get to delete
  it('should return a 404 if the ObjectID is invalid', ()=>
  {

  });
*/

  it('should return 404 for invalid object IDs', (done) =>
  {
    // (2) /todos/123
    request(app)
    .delete('/todos/123')    // obviously invalid id 1234
    .expect(404)
    .end(done);
  });

});       // end of describe('DELETE /todos/:id'



// describe string: VERB/METHOD url
describe('PATCH /todos/:id', () =>
{
  it('should update the todo',(done) =>
  {
      var firstTestText = '1st PATCH test text';

      // get 1st item ID
      // update text to something, set completed using patch
      // assert: (1) 200 response
      // (2) text is changed correctly, (3) completed is true (4) completedAt is a number
      request(app)
      .patch(`/todos/${seedTodos[0]._id.toHexString()}`)    // NB don't include ':id' (e.g.) in url
      .send({
        "text": firstTestText,
        "completed": true
      })    // hard to find documention on superagent PATCH syntax
      .expect(200)
      .expect((response) =>
      {
        expect(response.body.todo.text).toBe(firstTestText);
        expect(response.body.todo.completed).toBeTruthy();        // NB expect changed from toBeTrue
        expect(typeof response.body.todo.completedAt).toBe('number');    // NB expect changed from toBeA(Number)
      })
      .end(done);

  });

  it('should clear completedAt if/when todo is not completed', (done) =>
  {
    var secondTestText = '(guess what) 2nd PATCH test text';

    // get 2nd item // IDEA: // update text set completed to false using patch
    // assert (1): text correctly changed
    // (2) completedAt is null (toNotExist/toBeFalsy)
    request(app)
    .patch(`/todos/${seedTodos[1]._id.toHexString()}`)    // NB don't include ':id' (e.g.) in url
    .send({
      "text": secondTestText,
      "completed": false
    })    // hard to find documention on superagent PATCH syntax
    .expect(200)
    .expect((response) =>
    {
      expect(response.body.todo.text).toBe(secondTestText);
      expect(response.body.todo.completed).toBeFalsy();
      expect(response.body.todo.completedAt).toBeNull();
    })
    .end(done);

  });

  it('should return 404 if todo not found', (done) =>
  {
      // (1) new ObjectID with toHexString
      // ensure 404 received
      var hexId = new ObjectID().toHexString();

      request(app)
      // .get(`/todos/${   seedTodos[0]._id.toHexString()}`)
      //.get(`/todos/${ randomId}`)
      .patch(`/todos/${hexId}`)
      .expect(404)        // should get 400?
      .end(done);
  });

  it('should return 404 if todo not found', (done) =>
  {
      // (1) new ObjectID with toHexString
      // ensure 404 received
      var hexId = new ObjectID().toHexString();

      request(app)
      // .get(`/todos/${   seedTodos[0]._id.toHexString()}`)
      //.get(`/todos/${ randomId}`)
      .delete(`/todos/${hexId}`)
      .expect(404)        // should get 400?
      .end(done);
  });

});   // end of describe('PATCH /todos/:id'

describe('GET /users/me', () =>
{
  it('should return user if authenticated', (done) =>
  {
      request(app)
      .get('/users/me')
      .set('x-auth', seedUsers[0].tokens[0].token)
      .expect(200)
      .expect((response) =>
      {
        expect(response.body._id).toBe(seedUsers[0]._id.toHexString());
        expect(response.body.email).toBe(seedUsers[0].email);
      })
      .end(done);
  });

  it('should return a 401 if not authenticated', (done) =>
  {
      // challenge 8-94 (1) body empty toEqual (2) 401 returned (not authenticated)
      request(app)
      .get('/users/me')
      .expect(401)
      .expect((response) =>
      {
        expect(response.body).toEqual({});
      })
      .end(done);
  });
});

describe('/POST /users', () =>
{
  it('should create a user', (done) =>
  {
    var email = 'examplepj@example.com';
    var password = 'abc321!';

    request(app)
    .post('/users')
    .send({email, password})
    .expect(200)
    .expect((response) =>
    {
      // non-dot notation ['x-auth'] as hyphen wouldn't work
      // expect(response.headers['x-auth']).toExist();
      expect(response.headers['x-auth']).toBeTruthy();
      // expect(response.body._id).toExist();
      expect(response.body._id).toBeTruthy();
      expect(response.body.email).toBe(email);
    })
    //.end(done);
    // custom
    .end((error) =>
    {
      if (error)
      {
        return done(error);
      }
      // further testing that new user data saved correctly
      User.findOne({email}).then((user) =>
      {
        // new user should now be added and password should now be hashed not plain text
        expect(user).toBeTruthy();
        // expect(user.password).toNotBe(password);   // https://stackoverflow.com/a/28857217
        expect(user.password).not.toBe(password);
        done();
      }).catch((error) => done(error));               // ensure that actual error (not timeout) is console-logged
    });
  });

  it('should return validation errors if request is invalid (eg email invalid)', (done) =>
  {
      // challenge 8-94 POST invalid email and invalid password - expect 400 response
      var email = '123456';
      var password = '';

      request(app)
      .post('/users')
      .send({email, password})
      .expect(400);
      done();

  });

  it('should not create user if email in use already', (done) =>
  {
    // challenge 8-94 use email address already in use - expect 400 response

    var email = 'examplepj@example.com';
    var password = 'different1';

    request(app)
    .post('/users')
    .send({email, password})
    .expect(400);
    done();

  });
});       // end of describe('/POST /users'

describe('POST /users/login', () =>
{
  it ('should login user and return auth token', (done) =>
  {
    request(app)
    .post('/users/login')
    .send(
      {
        email: seedUsers[1].email,
        password: seedUsers[1].password,
      }
    ).
    expect(200)
    .expect ((response) =>
    {
      expect(response.headers['x-auth']).toBeTruthy()
    })
    .end((error, response) =>
    {
        if (error)
        {
          return done(error);
        }

        User.findById(seedUsers[1]._id).then((user) =>
        {
          // expect(user.tokens[0]).toInclude({   // https://stackoverflow.com/a/51146788
          expect(user.tokens[0]).toMatchObject({
            access: 'auth',
            token: response.headers['x-auth']
          });
          done();
        }).catch((error) => done(error));
    })
  });

  it ('should reject invalid login', (done) =>
  {

  });
});  // end of describe('POST /users/login'
