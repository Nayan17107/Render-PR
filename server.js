const express = require('express');
const passport = require('passport')
require('./Middleware/localstrategy');  
const session = require('express-session');
const flash = require('connect-flash');
const flashMessage = require('./Middleware/flashMessage');

const app = express()
const port = 8080;

require('./Config/dbconnection')()
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use("/uploads", express.static('uploads'))

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