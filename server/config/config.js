var env = process.env.NODE_ENV || 'development'    // heroku alone will have process.env.NODE_ENV?
console.log('env *****', env);

if (env === 'development' || env === 'test')
{
  // setup from JSON file
  var config = require('./config.json');     // JSON automatically parsed into js object
  // console.log(config);
  var envConfig = config[env];

  // console.log(Object.keys(envConfig));
  Object.keys(envConfig).forEach((key) => 
  {
      /* called with each item */
      process.env[key] = envConfig[key];
  });

}

// if (env === 'development')
// {
//   process.env.PORT = 3000;
//   process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
//   // PORT and MONGODB_URI provided by Heroku inter alia
// }
// else if (env === 'test')
// {
//   process.env.PORT = 3000;
//   process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
// }
