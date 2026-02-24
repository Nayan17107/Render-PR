const mongoose = require('mongoose');

const dbconnection = () => {
    // mongoose.connect('mongodb://localhost:27017/Blog')
    mongoose.connect("mongodb+srv://Nayan:nayan%402006@cluster0.smklzxg.mongodb.net/Admin-Panel")
        .then(() => console.log('DB is connected!!!!'))
        .catch(err => console.log(err))
}

module.exports = dbconnection;