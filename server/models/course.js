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
    required: true
  },
  totalStudents: {
    type: Number,
    "default": 0
  },

  studentsEnrolled: [],

  urlImage: {
    type: String,
    required: true
  },

  modules: [],

  creator: {
    type: String
  }

})


module.exports = mongoose.model('course', CourseSchema);