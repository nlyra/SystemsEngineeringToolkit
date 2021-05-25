const mongoose = require('mongoose');

const CourseSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    // required: true
  },
  description: {
    type: String,
    required: true
  },
  author: {
    type: String,
    // required: true
  },
  totalStudent: {
    type: Number,
    "default": 0
  },
  
  urlImage: {
    type: String,
    required: true
  },
  modules: [
    {
      name: String,
      type: String
    }
  ]
})


module.exports = mongoose.model('course', CourseSchema);