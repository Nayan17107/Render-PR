const express = require('express');
const { addsubcategorypage, viewsubcategory, addsubcategory, deletesubcategory, editsubcategory, updateSubCategory } = require('../Controller/subcategory.controller');
const routes = express.Router();

routes.get('/add-subcategory', addsubcategorypage);
routes.post('/add-subcategory', addsubcategory);
routes.get('/view-subcategory', viewsubcategory);
routes.get('/delete-subcategory/:id', deletesubcategory);
routes.get('/edit-subcategory/:id', editsubcategory);
routes.post('/update-subcategory/:id', updateSubCategory);

module.exports = routes;