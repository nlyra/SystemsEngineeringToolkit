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
        required: false
    },
    
    resetPassExpires: {
        type: Number,
        required: false
    },
    
    enrolledClasses: [],

    createdCourses: [],
    
    coursesQuizes: [],

    roleID: {
        type: Number,
        required: true
    },
})


module.exports = mongoose.model('user', UserSchema);