const express = require('express');
const { addextracategorypage, addextracategory, getAllSubCategories, viewextracategory, deleteextracategory, editextracategory, updateectraCategory } = require('../Controller/extracategory.controller');
const routes = express.Router();

routes.get('/add-extracategory', addextracategorypage);
routes.post('/add-extracategory', addextracategory);
routes.get('/subcategory/:id', getAllSubCategories);
routes.get('/view-extracategory', viewextracategory);
routes.get('/delete-extracategory/:id', deleteextracategory);
routes.get('/edit-extracategory/:id', editextracategory);
routes.post('/update-extracategory/:id', updateectraCategory);

module.exports = routes;