var mongoose = require('mongoose');

var Todo = mongoose.model('Todo', {
  text:
  {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  completed:
  {
    type: Boolean,
    default: false
  },
  completedAt:
  {
    type: Number,    // standard UNIX timestamp
    default: null
  }
});
// model cf schema https://mongoosejs.com/docs/guide.html#models

module.exports = {Todo};
