const mongoose = require('mongoose')

const blogSchiema = mongoose.Schema({
    name: {
        type: String
    },
    title: {
        type: String
    },
    category: {
        type: String
    },
    status: {
        type: String
    },
    description: {
        type: String
    },
    image: {
        type: String
    },
})

module.exports = mongoose.model('Blogs', blogSchiema)