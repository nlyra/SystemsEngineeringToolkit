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

    enrolledClasses: []
    // question1: {
    //     type: String,
    //     // required: true
    // },
    // question2: {
    //     type: String,
    //     // required: true
    // },
    // question3: {
    //     type: String,
    //     // required: true
    // },
    // answer1: {
    //     type: String,
    //     // required: true
    // },
    // answer2: {
    //     type: String,
    //     // required: true
    // },
    // answer3: {
    //     type: String,
    //     // required: true
    // },
    
})


module.exports = mongoose.model('user', UserSchema);