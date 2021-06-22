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

    roleID: {
        type: String,
        emun: ['admin', 'creator', 'student'],
        default: 'student'
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

    coursesData: [],

    roleID: {
        type: Number,
        required: true
    },
})


module.exports = mongoose.model('user', UserSchema);