const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },

    resetPassToken: {
        type: String,
        required: true
    },

    resetPassExpires: {
        type: Number,
        required: true
    },
    
    coursesQuizes: [],
    enrolledClasses: []
})


module.exports = mongoose.model('user', UserSchema);