const mongoose = require('mongoose');
const Module = require('module');

const CourseSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  categories: {
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

  totalCompletedStudents: {
    type: Number,
    "default": 0
  },

  currStudents: {
    type: Number,
    "default": 0
  },

  studentsEnrolled: [],

  urlImage: {
    type: String,
    required: false
  },

  modules: [],

  author: {
    type: String
  },

  isEnabled: {
    type: Boolean,
    default: false
  }

})


module.exports = mongoose.model('course', CourseSchema);