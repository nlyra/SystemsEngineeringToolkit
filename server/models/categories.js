const mongoose = require('mongoose');

const CategorySchema = mongoose.Schema({
    label: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('categories', CategorySchema);