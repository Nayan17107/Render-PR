const express = require('express')
const { dashboard } = require('../Controller/index.controller');
const passport = require('passport');
const routes = express.Router()

routes.get('/', passport.checkAuthentication, dashboard);

routes.use('/blog',passport.checkAuthentication,  require('./blog.routes'));

routes.use('/category',passport.checkAuthentication,  require('./category.routes'));

routes.use('/subcategory',passport.checkAuthentication,  require('./subcategory.routes'));

routes.use('/extracategory',passport.checkAuthentication,  require('./extracategory.routes'));

routes.use('/product',passport.checkAuthentication,  require('./product.routes'));

routes.use('/admin', passport.checkAuthentication, require('./admin.routes'))

routes.use('/user', require('./auth.routes'))

module.exports = routes;