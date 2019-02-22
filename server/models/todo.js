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
  },

// _creator for use in making routes private -
// is the user originating a todo
// start with underscore as this is an object ID
_creator: {
  type: mongoose.Schema.Types.ObjectId,
  required: true
}

});
// model cf schema https://mongoosejs.com/docs/guide.html#models

module.exports = {Todo};
