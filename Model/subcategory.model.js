const mongoose = require('mongoose')

const subcategorySchiema = mongoose.Schema({
    categoryid: {
        type : mongoose.Schema.ObjectId,
        ref : 'Category'
    },
    subcategoryname: {
        type: String
    }
})

module.exports = mongoose.model('SubCategory', subcategorySchiema);