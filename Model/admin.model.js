const mongoose = require('mongoose')

const adminSchema = mongoose.Schema({
    firstname: {
        type: String
    },
    lastname: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    gender: {
        type: String
    },
    contactNo: {
        type: String
    },
    profileImage: {
        type: String
    },

})

module.exports = mongoose.model('admins', adminSchema)