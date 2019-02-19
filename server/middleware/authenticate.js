var {User} = require('./../models/user');

// bespoke middleware authentication (3 arguments - request, response, next : response() only run when next() called)
var authenticate = (request, response, next) =>
{
  var token = request.header('x-auth');       // get specific HTTP header to fetch

  User.findByToken(token).then((user) =>
  {
    if (!user)
    {
      // return Promise.reject();              // enclosing code, as written, will return status 401
      return Promise.reject('Error: User not found').catch(error => {console.log('caught user not found Promise reject error');console.log(error); if (error === 'Error: User not found') {response.status(401).send();}});
      // could have returned reject value; would have been error caught in enclosing code -
      // NB need to catch rejection error
      // enclosing code, as written, would have returned status 401 ...
      // ... however, had to (1) catch rejection error and call response here, ...
      // ... and (2) (deprecation) use response.sendStatus(401) instead of just response.send(401)
    }
    // response.send(user);
    request.user = user;    // add request properties for use in response
    request.token = token;
    next();
  })
  .catch((error) =>
  {
    response.status(401).send();
  });
};

module.exports = {authenticate};
