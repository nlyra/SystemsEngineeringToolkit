const mongoose = require('mongoose');

const ModuleSchema = mongoose.Schema({  

  name: {
    type: String,
    required: true
  },

  type: {
    type: String,
    // required: true
  },

  description: {
    type: String,
    required: true
  }
});


module.exports = mongoose.model('module', ModuleSchema);