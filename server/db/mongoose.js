const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp', {useNewUrlParser: true});
// mongoose configured
module.exports = {
  mongoose    // mongoose: mongoose ES6
};
