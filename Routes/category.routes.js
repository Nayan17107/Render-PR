const express = require('express')
const routes = express.Router();
const upload = require('../Middleware/ImageUpload');
const { addcategorypage, addcategory, viewcategory, detetecategory, editcategory, updatecategory } = require('../Controller/category.controller');

routes.get('/add-category', addcategorypage);
routes.post('/add-category', upload.single('categoryimage'), addcategory);
routes.get('/view-category', viewcategory);
routes.get('/edit-category/:id', editcategory);
routes.post('/update-category/:id', upload.single('categoryimage'), updatecategory);
routes.get('/delete-category/:id', detetecategory);

module.exports = routes;