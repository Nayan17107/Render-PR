const express = require('express')
const { loginPage, login, logOut, profilePage, changepasswordpage, changepassword, sentopt, verifyotp, resetpasswword } = require('../controller/auth.controller')
const route = express.Router()
const passport = require('passport')
route.get('/login', loginPage)
route.post('/login', passport.authenticate('local', { failureRedirect: '/user/login' }), login)
route.get('/logout', logOut)
route.get('/profile', passport.checkAuthentication, profilePage)

route.get('/change-password', passport.checkAuthentication, changepasswordpage)
route.post('/change-password', passport.checkAuthentication, changepassword)

route.post('/forget-password', sentopt)
route.post('/verifyotp', verifyotp)
route.post('/resetpassword', resetpasswword)

module.exports = route;