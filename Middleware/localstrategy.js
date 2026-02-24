const passport = require('passport')
const localstrategy = require('passport-local').Strategy
const adminModel = require('../model/admin.model')
const bcrypt = require('bcrypt')

passport.use(new localstrategy(
    {
        usernameField: 'email'
    },
    async (email, password, cb) => {
        let admin = await adminModel.findOne({ email: email })
        if (!admin) {
            return cb(null, false)
        }

        let haspassword = await bcrypt.compare(password, admin.password)
        if (!haspassword) {
            return cb(null, false)
        }

        return cb(null, admin)
    }
))

passport.serializeUser((user, cb) => {
    return cb(null, user.id)
})

passport.deserializeUser(async (id, cb) => {
    let admin = await adminModel.findById(id)
    if (admin) {
        cb(null, admin)
    }
})

passport.checkAuthentication = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next()
    }

    return res.redirect('/user/login')
}

passport.isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        let user = res.locals.user = req.user
        // console.log(user)
    }
    return next()
}

module.exports = passport;