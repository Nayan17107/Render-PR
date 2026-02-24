const express = require('express');
const { product, productdetails } = require('../Controller/web.controller');
const routes = express.Router();

routes.get('/', product);
routes.get('/product', product);
routes.get('/product/:id', productdetails);

module.exports = routes;
