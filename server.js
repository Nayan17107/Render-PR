const express = require('express');
require('dotenv').config();
const passport = require('passport')
const path = require('path')
require('./Middleware/localstrategy');  
const session = require('express-session');
const flash = require('connect-flash');
const flashMessage = require('./Middleware/flashMessage');

const app = express()
const port = process.env.PORT;

require('./Config/dbconnection')()
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'Public')))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use(session({
    name: 'login',
    secret: 'devlop',
    saveUninitialized: false,
    resave: false, 
    cookie: {
        maxAge: 1000 * 60 * 60
    }
}))

app.use(passport.initialize())
app.use(passport.session())
app.use(passport.isAuthenticated)
app.use(flash())
app.use(flashMessage)

app.use('/', require('./Routes/index.routes'))

app.use('/web', require('./Routes/web.routes'))

app.listen(port, () => {
    console.log(`server start at http://localhost:${port}`)
})
