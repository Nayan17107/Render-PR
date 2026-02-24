const mongoose = require('mongoose')

const categorySchiema = mongoose.Schema({
    categoryname: {
        type: String
    },
    categoryimage: {
        type: String
    },
})

module.exports = mongoose.model('Category', categorySchiema);