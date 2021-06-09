const mongoose = require('mongoose');
const Module = require('module');

const CourseSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: [],
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

  modules: [],

})


module.exports = mongoose.model('course', CourseSchema);