const mongoose = require('mongoose')

const extracategorySchiema = mongoose.Schema({
    categoryid: {
        type : mongoose.Schema.ObjectId,
        ref : 'Category'
    },
    subcategoryid: {
        type : mongoose.Schema.ObjectId,
        ref : 'SubCategory'
    },
    extracategoryname: {
        type: String
    }
})

module.exports = mongoose.model('ExtraCategory', extracategorySchiema);